import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (including non-VITE_ prefixed) for server-side use.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), anamSessionToken(env), anamAvatarInfo(env), askGemini(env), geminiTts(env)],
    server: {
      // Allow access through Cloudflare quick tunnels (random *.trycloudflare.com)
      // and any LAN host, so the site is reachable from a phone for testing.
      allowedHosts: ['.trycloudflare.com'],
    },
  }
})

/** Reads and JSON-parses a Node request body; returns {} on empty/invalid input. */
function readJsonBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => { data += chunk })
    req.on('end', () => {
      if (!data) return resolve({})
      try { resolve(JSON.parse(data)) } catch { resolve({}) }
    })
    req.on('error', () => resolve({}))
  })
}

/**
 * POST /api/ask — our own AI model (Gemini), used by the GIF voice circle after
 * the Anam phase. The Gemini key stays server-side (never shipped to the browser).
 *
 * COST CAPS (kept deliberately cheap):
 *   - Cheap flash model (GEMINI_MODEL, default gemini-2.5-flash).
 *   - Thinking DISABLED (thinkingBudget: 0) — thinking tokens bill as output.
 *   - maxOutputTokens: 160  → short, 2–3 sentence replies.
 *   - Input trimmed (question ≤ 500 chars) + a short system prompt.
 *   - One transient retry on 503 ("high demand"); no other looping.
 * Per-session usage time is additionally capped client-side (see MiniAssistant).
 *
 * For production deploy the same logic as a serverless function at /api/ask.
 */
function askGemini(env) {
  const MODEL = env.GEMINI_MODEL || 'gemini-2.5-flash'
  const SYSTEM =
    "You are Vidya, a warm, friendly guide for Classess.com, an education platform. " +
    "Reply in 2-3 short, natural spoken sentences — no lists or formatting. " +
    "Detect the user's language (English or Hindi) and reply in that same language. " +
    "If you don't know something, say so briefly."
  return {
    name: 'ask-gemini',
    configureServer(server) {
      server.middlewares.use('/api/ask', async (req, res) => {
        const send = (code, obj) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }
        if (req.method !== 'POST') return send(405, { error: 'Method Not Allowed' })
        if (!env.GEMINI_API_KEY) return send(500, { error: 'GEMINI_API_KEY not set in .env' })

        const body = await readJsonBody(req)
        const question = String(body?.question || '').slice(0, 500).trim()
        if (!question) return send(400, { error: 'empty question' })
        const role = typeof body?.role === 'string' ? body.role.slice(0, 40) : ''

        const url =
          `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${env.GEMINI_API_KEY}`
        const payload = {
          systemInstruction: { parts: [{ text: SYSTEM + (role ? ` The user is ${role}.` : '') }] },
          contents: [{ role: 'user', parts: [{ text: question }] }],
          generationConfig: {
            maxOutputTokens: 160,
            temperature: 0.7,
            thinkingConfig: { thinkingBudget: 0 }, // keep cost low — no thinking tokens
          },
        }

        // Establish the upstream stream, retrying transient blips (429/5xx, incl.
        // 503 "high demand") a few times. We only retry the *connection* — once
        // tokens start flowing we pipe them straight through so the browser can
        // speak the first sentence long before the full reply is generated.
        const TRANSIENT = new Set([429, 500, 502, 503])
        let upstream
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            upstream = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
          } catch (err) {
            return send(502, { error: String(err) })
          }
          // Retry transient blips quickly; a 404 here means the model isn't
          // available on this key — no point retrying that.
          if (!TRANSIENT.has(upstream.status)) break
          await new Promise((r) => setTimeout(r, 300))
        }

        if (!upstream || upstream.status !== 200 || !upstream.body) {
          let data = {}
          try { data = await upstream.json() } catch { /* non-JSON error body */ }
          console.error('[gemini] error', upstream?.status, JSON.stringify(data).slice(0, 200))
          return send(upstream?.status || 502, { error: data?.error?.message || 'gemini error' })
        }

        // Stream Server-Sent Events to the browser: one `data: {"t":"…"}` line per
        // text delta, then a final `data: {"done":true}`. Google's upstream is
        // itself SSE (alt=sse), so we parse its events and re-emit just the text.
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        const reader = upstream.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        try {
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            buf += decoder.decode(value, { stream: true }).replace(/\r/g, '')
            let nl
            while ((nl = buf.indexOf('\n\n')) !== -1) {
              const evt = buf.slice(0, nl)
              buf = buf.slice(nl + 2)
              const line = evt.split('\n').find((l) => l.startsWith('data:'))
              if (!line) continue
              const jsonStr = line.slice(5).trim()
              if (!jsonStr || jsonStr === '[DONE]') continue
              let obj
              try { obj = JSON.parse(jsonStr) } catch { continue }
              const delta =
                obj?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || ''
              if (delta) res.write(`data: ${JSON.stringify({ t: delta })}\n\n`)
            }
          }
        } catch (err) {
          console.error('[gemini] stream error', String(err))
        }
        res.write('data: {"done":true}\n\n')
        res.end()
      })
    },
  }
}

/** Pull the sample rate out of a mime like "audio/L16;codec=pcm;rate=24000". */
function pcmRate(mime) {
  const m = /rate=(\d+)/.exec(mime || '')
  return m ? parseInt(m[1], 10) : 24000
}

/** Wrap raw 16-bit mono PCM in a minimal WAV header so browsers can play it. */
function pcmToWav(pcm, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const blockAlign = (channels * bitsPerSample) / 8
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + pcm.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)              // fmt chunk size
  header.writeUInt16LE(1, 20)               // audio format: PCM
  header.writeUInt16LE(channels, 22)
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(sampleRate * blockAlign, 28) // byte rate
  header.writeUInt16LE(blockAlign, 32)
  header.writeUInt16LE(bitsPerSample, 34)
  header.write('data', 36)
  header.writeUInt32LE(pcm.length, 40)
  return Buffer.concat([header, pcm])
}

/**
 * POST /api/tts — neural text-to-speech for the GIF voice circle, so Vidya's
 * second-phase voice is clear and consistent (close to the Anam avatar) instead
 * of the robotic, device-dependent browser voice.
 *
 * Uses a Gemini TTS model (same GEMINI_API_KEY). The model auto-detects the
 * language from the text, so Hindi text → Hindi speech with the same voice.
 * Returns a WAV the browser plays directly. The client speaks one sentence at a
 * time and fetches them in parallel, so this stays fast despite being neural.
 *   body : { text } (one sentence, ≤ 400 chars)
 *   200  : audio/wav bytes  |  non-200: JSON { error }
 */
function geminiTts(env) {
  const MODEL = env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts'
  const VOICE = env.GEMINI_TTS_VOICE || 'Kore' // warm, clear female prebuilt voice
  return {
    name: 'gemini-tts',
    configureServer(server) {
      server.middlewares.use('/api/tts', async (req, res) => {
        const fail = (code, msg) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: msg }))
        }
        if (req.method !== 'POST') return fail(405, 'Method Not Allowed')
        if (!env.GEMINI_API_KEY) return fail(500, 'GEMINI_API_KEY not set in .env')

        const body = await readJsonBody(req)
        const text = String(body?.text || '').slice(0, 400).trim()
        if (!text) return fail(400, 'empty text')

        const url =
          `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${env.GEMINI_API_KEY}`
        const payload = {
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } },
          },
        }

        const TRANSIENT = new Set([429, 500, 502, 503])
        let r, data
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            r = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
            data = await r.json().catch(() => ({}))
          } catch (err) {
            return fail(502, String(err))
          }
          if (!TRANSIENT.has(r.status)) break
          await new Promise((res2) => setTimeout(res2, 300))
        }

        if (r.status !== 200) {
          console.error('[tts] error', r.status, JSON.stringify(data).slice(0, 200))
          return fail(r.status || 502, data?.error?.message || 'tts error')
        }
        const part = data?.candidates?.[0]?.content?.parts?.find((p) => p?.inlineData?.data)
        const b64 = part?.inlineData?.data
        if (!b64) return fail(502, 'no audio returned')

        const wav = pcmToWav(Buffer.from(b64, 'base64'), pcmRate(part.inlineData.mimeType))
        res.statusCode = 200
        res.setHeader('Content-Type', 'audio/wav')
        res.setHeader('Cache-Control', 'no-store')
        res.end(wav)
      })
    },
  }
}

/**
 * Dev-server middleware that exchanges the secret Anam API key for a
 * short-lived session token. The API key stays on the server and is never
 * shipped to the browser.
 *
 * For production (vite preview / static hosting) deploy the same logic as a
 * serverless function at the same path: POST /api/anam-session-token.
 */
/**
 * Returns the avatar's idling videoUrl + imageUrl from the Anam REST API.
 * The videoUrl is a signed URL (1-hour TTL) so we fetch it fresh each time.
 * GET /api/anam-avatar
 */
function anamAvatarInfo(env) {
  return {
    name: 'anam-avatar-info',
    configureServer(server) {
      server.middlewares.use('/api/anam-avatar', async (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        try {
          const upstream = await fetch(
            `https://api.anam.ai/v1/avatars/${env.ANAM_AVATAR_ID}`,
            { headers: { Authorization: `Bearer ${env.ANAM_API_KEY}` } }
          )
          const data = await upstream.json()
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ imageUrl: data.imageUrl, videoUrl: data.videoUrl }))
        } catch (err) {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}

function anamSessionToken(env) {
  return {
    name: 'anam-session-token',
    configureServer(server) {
      server.middlewares.use('/api/anam-session-token', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        if (!env.ANAM_API_KEY || !env.ANAM_PERSONA_ID) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'ANAM_API_KEY and ANAM_PERSONA_ID must be set in .env' }))
          return
        }
        try {
          // Read the requested language ("en" | "hi") from the POST body.
          const body = await readJsonBody(req)
          const language = body?.language === 'hi' ? 'hi' : 'en'

          // The voice is fixed for the whole session, so the starting language
          // (from the toggle) picks it: a Hindi-capable voice for Hindi sessions
          // (falls back to the default voice if ANAM_VOICE_ID_HI is unset). For
          // the best auto-detect experience use a multilingual voice as the default.
          const voiceId =
            language === 'hi' ? (env.ANAM_VOICE_ID_HI || env.ANAM_VOICE_ID) : env.ANAM_VOICE_ID
          // Transcription (speech-to-text) language is fixed for the session. This
          // is what makes Anam actually *hear* Hindi — without it, Hindi speech is
          // transcribed as broken English. Override the exact code via .env if needed.
          const languageCode =
            language === 'hi' ? (env.ANAM_LANGUAGE_CODE_HI || 'hi') : (env.ANAM_LANGUAGE_CODE_EN || 'en')
          // Auto-detect: always reply in whatever language the user is speaking.
          const languageInstruction =
            ' [LANGUAGE] Detect the language the user is speaking and always reply in that same language. ' +
            'If they speak Hindi, reply in natural conversational Hindi using Devanagari script; if English, reply in English; ' +
            'otherwise mirror their language. Note the user often speaks Hindi written in Latin letters (Hinglish), ' +
            'e.g. "mai ek student hu" or "mujhe practice dikhao" — treat that as Hindi and reply in Hindi. ' +
            'Keep proper nouns like "Classess" and "Vidya" unchanged.'

          const upstream = await fetch('https://api.anam.ai/v1/auth/session-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${env.ANAM_API_KEY}`,
            },
            body: JSON.stringify({
              personaConfig: {
                personaId: env.ANAM_PERSONA_ID,
                name: 'Classess Assistant',
                avatarId: env.ANAM_AVATAR_ID,
                voiceId,
                languageCode,
                ...(env.ANAM_LLM_ID ? { llmId: env.ANAM_LLM_ID } : {}),
                systemPrompt:
                  "[IDENTITY] You are Vidya, a warm, friendly, genuinely caring human-like guide for Classess.com, an education platform for students, teachers, and institutions. You talk like a real person having a natural, relaxed conversation — encouraging, patient, and personable — never robotic, never listy, never scripted. " +
                  "[STYLE] Speak in natural spoken language with no formatting or bullet points. Keep greetings, small talk, and navigation to one short, warm sentence. When the user asks you to explain something, or asks how Classess or a feature helps them, answer clearly in two to four short sentences. Vary your wording so you never sound repetitive; use warm, natural phrases like 'Great question', 'I'd love to help with that', or 'Let me show you'; add a gentle '...' pause occasionally. Be concise — never ramble. " +
                  "[PERSONALISATION] Make every reply feel personal to THIS user. The app tells you who they are (a student, a teacher, or an institution) and what they are looking at — always tailor your answer to their role and goals, speak directly to them using 'you' and 'your', and frame everything around what matters to them. If you do not yet know who they are, warmly ask. " +
                  "[HELPING] When the user asks how the website, Classess, or any feature helps them (for example 'how does this help me?', 'how will this feature help me?', or 'what can you do for me?'), never give a generic description. Answer personally and benefit-first: say what it does for them, why it matters for their goals, and give one quick concrete example — then warmly offer to show them. " +
                  "[CONTEXT] The application injects live context about who the user is and what they have selected or are pointing at on the page. Whenever the user refers to 'this', 'it', 'this part', or 'this section', use that injected context to understand exactly what they mean and respond about that specific content. " +
                  "[FLOW] The application opens pages and speaks the main greeting and section introductions itself. When the user tells you whether they are a student, a teacher, or an institution, acknowledge warmly in one short sentence. For navigation requests, acknowledge briefly — the app performs the actual navigation." +
                  languageInstruction,
              },
            }),
          })
          const data = await upstream.json()
          if (!upstream.ok) {
            console.error('[anam] session-token error', upstream.status, JSON.stringify(data))
          }
          res.statusCode = upstream.status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        } catch (err) {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}
