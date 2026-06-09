import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (including non-VITE_ prefixed) for server-side use.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), anamSessionToken(env), anamAvatarInfo(env)],
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
