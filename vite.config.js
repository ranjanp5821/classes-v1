import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (including non-VITE_ prefixed) for server-side use.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      anamSessionToken(env),
      anamAvatarInfo(env),
      askGemini(env),
      geminiTts(env),
      detectPageAgent(env),
      markPageAgent(env),
      verifyPageAgent(env),
      quickMarkAgent(env),
      bookDetectAgent(env),
      inpaintPage(env),
      libraryUpload(env),
      libraryScan(env),
      libraryAsk(env),
      libraryGenerate(env),
    ],
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

/* ════════════════════════════════════════════════════════════════════════
   HOMEWORK SCANNER — three-agent pipeline (better accuracy than one prompt)

   Agent 1  POST /api/scan/detect    — locate ONLY the page boundary (crop+align)
   Agent 2  POST /api/scan/evaluate  — mark the clean cropped page (right/wrong/improve)
   Agent 3  POST /api/scan/verify    — re-check Agent 2 against the page and rectify

   The client orchestrates: detect → crop (client) → evaluate → verify → render.
   ──────────────────────────────────────────────────────────────────────── */

/** Pull the base64 image out of a request body's data URL. */
function readScanImage(body) {
  const m = /^data:(image\/\w+);base64,(.+)$/s.exec(String(body?.image || ''))
  if (!m) return null
  return { mimeType: m[1], data: m[2] }
}

/**
 * One Gemini vision call returning JSON, with exponential backoff and a model
 * fallback when the primary is overloaded (503). Throws Error with `.status`.
 */
async function runScanAgent(apiKey, models, systemText, parts, maxOutputTokens) {
  const payload = {
    systemInstruction: { parts: [{ text: systemText }] },
    contents: [{ role: 'user', parts }],
    generationConfig: {
      responseMimeType: 'application/json',
      maxOutputTokens,
      temperature: 0.2,
      thinkingConfig: { thinkingBudget: 0 },
    },
  }
  const TRANSIENT = new Set([429, 500, 502, 503])
  let r, data
  outer: for (const model of models) {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    for (let attempt = 0; attempt < 4; attempt++) {
      r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      data = await r.json().catch(() => ({}))
      if (r.status === 200) break outer
      if (!TRANSIENT.has(r.status)) break
      await new Promise((res) => setTimeout(res, 500 * 2 ** attempt))
    }
  }
  if (!r || r.status !== 200) {
    const overloaded = r?.status === 503 || r?.status === 429
    const e = new Error(
      overloaded
        ? 'The AI is busy right now — please try again in a moment.'
        : data?.error?.message || 'scan error',
    )
    e.status = r?.status || 502
    throw e
  }
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || ''
  try {
    return JSON.parse(text)
  } catch {
    const e = new Error('could not read the page — please try again')
    e.status = 502
    throw e
  }
}

/** Shared models for the agents (override via .env). */
function scanModels(env) {
  const vision = env.GEMINI_VISION_MODEL || 'gemini-2.5-flash'
  const fallback = env.GEMINI_VISION_FALLBACK || 'gemini-2.5-flash-lite'
  const detect = env.GEMINI_DETECT_MODEL || vision
  return {
    detect: [detect, fallback].filter((m, i, a) => m && a.indexOf(m) === i),
    vision: [vision, fallback].filter((m, i, a) => m && a.indexOf(m) === i),
  }
}

/** Wrap one agent middleware (validates image, runs the call, sends JSON). */
function scanAgent(name, path, handler) {
  return (env) => ({
    name,
    configureServer(server) {
      server.middlewares.use(path, async (req, res) => {
        const send = (code, obj) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }
        if (req.method !== 'POST') return send(405, { error: 'Method Not Allowed' })
        if (!env.GEMINI_API_KEY) return send(500, { error: 'GEMINI_API_KEY not set in .env' })
        const body = await readJsonBody(req)
        const img = readScanImage(body)
        if (!img) return send(400, { error: 'image must be a base64 data URL' })
        if (img.data.length > 8_000_000) return send(413, { error: 'image too large' })
        try {
          const out = await handler({ env, body, img, models: scanModels(env) })
          return send(200, out)
        } catch (err) {
          console.error(`[${name}]`, err?.status, String(err?.message || err).slice(0, 160))
          return send(err?.status || 502, { error: err?.message || 'scan error' })
        }
      })
    },
  })
}

/* Agent 1: page detector — only the page boundary, nothing else. */
const detectPageAgent = scanAgent('scan-detect', '/api/scan/detect', ({ env, img, models }) => {
  const SYSTEM =
    "You locate the boundary of ONE sheet of paper / document in a photo and output only its four " +
    "corners. You do NOT read or describe the content. Be STRICT: exclude hands, fingers, thumbs, " +
    "desk, table, floor, devices, people and every bit of background — trace ONLY the paper itself."
  const INSTRUCTION =
    'Return ONLY JSON: { "detected": boolean, "pageQuad": [[x,y],[x,y],[x,y],[x,y]] | null, "message": string }.\n' +
    "detected = true if ANY page/document is visible (printed OR handwritten, even blank). Only false " +
    "if there is genuinely no page (a face, a screen, an empty desk).\n" +
    "pageQuad = the four outer corners of the page in 0-1000 image coordinates, ordered by the page's " +
    "UPRIGHT READING orientation: corner 1 = top-left as you READ the text, then top-right, bottom-right, " +
    "bottom-left. Place each corner PRECISELY where the two physical edges of the sheet actually meet — " +
    "look closely at the real paper edges, follow them even when the page is tilted or rotated, and put " +
    "the corner exactly on the paper's corner (not on the surrounding text). The quad MUST enclose the " +
    "ENTIRE page (all corners and all content) — NEVER cut off part of it; if unsure where an edge is, " +
    "make the quad slightly LARGER. Estimate corners just outside the frame (values may exceed 0-1000). " +
    "null only if no page is visible."
  return runScanAgent(
    env.GEMINI_API_KEY,
    models.detect,
    SYSTEM,
    [{ text: INSTRUCTION }, { inlineData: { mimeType: img.mimeType, data: img.data } }],
    512,
  )
})

/* Agent 2: marker — mark the clean cropped page right/wrong/improvement. */
const markPageAgent = scanAgent('scan-evaluate', '/api/scan/evaluate', ({ env, img, models }) => {
  const SYSTEM =
    "You are the marking engine for a homework scanner. The image is a clean, cropped, upright page. " +
    "Read it carefully and mark each answer. NEVER invent a mistake: only mark 'wrong' when you are " +
    "genuinely confident it is incorrect; solve maths yourself first. Use 'review' for things that are " +
    "unclear OR could be improved (an improvement suggestion), and 'correct' for right answers."
  const INSTRUCTION =
    "Mark this page. Return ONLY JSON:\n" +
    '{ "subject": string, "questions": [ {\n' +
    '  "prompt": string, "studentWork": string,\n' +
    '  "type": "math" | "science" | "language",\n' +
    '  "status": "correct" | "wrong" | "review",\n' +
    '  "confidence": number, "summary": string, "explanation": string, "suggestedFix": string,\n' +
    '  "sourceLabel": string, "sourceDetail": string, "box": [ymin, xmin, ymax, xmax],\n' +
    '  "errorBox": [ymin, xmin, ymax, xmax] | null\n' +
    "} ] }\n" +
    "review = improvement / unsure. Include correct answers too. BOX = integers 0-1000 on THIS cropped " +
    "page, tightly around ALL of that answer's writing (every line); double-check vertical position. " +
    "errorBox: for a 'wrong' answer, a TIGHT box around ONLY the exact part that is wrong — the specific " +
    "incorrect number, word, sign, term or single line — so the student sees precisely where the mistake " +
    "is (NOT the whole answer). null for correct/review answers. Keep explanations to 1-2 sentences. If " +
    "there are no gradeable answers, return an empty questions array."
  return runScanAgent(
    env.GEMINI_API_KEY,
    models.vision,
    SYSTEM,
    [{ text: INSTRUCTION }, { inlineData: { mimeType: img.mimeType, data: img.data } }],
    8192,
  )
})

/* Agent 3: verifier — re-check Agent 2 against the page and rectify. */
const verifyPageAgent = scanAgent('scan-verify', '/api/scan/verify', ({ env, body, img, models }) => {
  const draft = JSON.stringify(body?.draft || {}).slice(0, 20000)
  const SYSTEM =
    "You are a strict verifier. You are given a page image and a DRAFT marking of it. Check the draft " +
    "against the page and CORRECT it: remove any invented/incorrect mistakes (keep only genuine ones), " +
    "fix any wrong status, make sure EVERY answer on the page is covered, make sure each box tightly " +
    "covers the right writing, and make sure every 'review' item is a genuine improvement. Keep the exact " +
    "same JSON shape."
  const INSTRUCTION =
    "DRAFT MARKING:\n" + draft + "\n\n" +
    "Verify it against the page image and return the FINAL corrected JSON ONLY, same shape: " +
    '{ "subject": string, "questions": [ { "prompt","studentWork","type","status","confidence",' +
    '"summary","explanation","suggestedFix","sourceLabel","sourceDetail","box":[ymin,xmin,ymax,xmax],' +
    '"errorBox":[ymin,xmin,ymax,xmax]|null } ] }. ' +
    "status is one of correct|wrong|review. Boxes are 0-1000 on the page image. errorBox: for a 'wrong' " +
    "answer, a TIGHT box around ONLY the exact wrong part (the specific incorrect number/word/sign/line), " +
    "not the whole answer; null for correct/review. Make sure each errorBox sits on the actual wrong mark."
  return runScanAgent(
    env.GEMINI_API_KEY,
    models.vision,
    SYSTEM,
    [{ text: INSTRUCTION }, { inlineData: { mimeType: img.mimeType, data: img.data } }],
    8192,
  )
})

/**
 * POST /api/scan — the real Homework Scanner brain.
 *
 * Takes the captured page image and asks Gemini (multimodal) to ACTUALLY READ
 * it: transcribe each question + the student's working, identify the subject,
 * and flag mistakes. This is what makes the scanner respond to what the camera
 * is pointed at instead of showing canned samples.
 *
 * Enforces the two Slate-AI rules in the prompt + schema:
 *   - Every flagged mistake carries a confidence (0-1) AND a source.
 *   - The client treats confidence < 0.8 as "review only" (never auto-applied).
 *
 * Returns strict JSON (responseMimeType: application/json) so the client can
 * render it directly. Bounding boxes are Gemini's native [ymin,xmin,ymax,xmax]
 * on a 0-1000 grid; the client normalises them to draw highlights.
 *
 *   body : { image: "data:image/jpeg;base64,..." }
 *   200  : { detected, subject, questions:[...] }  |  non-200: { error }
 */
function scanHomework(env) {
  // Use the full flash model for vision (not the lite text model) — handwriting
  // OCR is much more reliable on it. Override with GEMINI_VISION_MODEL in .env.
  const MODEL = env.GEMINI_VISION_MODEL || 'gemini-2.5-flash'
  const SYSTEM =
    "You are the marking engine for a homework scanner. You are given a photo of a " +
    "student's handwritten or printed homework. Read the page carefully and analyse it. " +
    "NEVER invent a mistake: only flag an answer as wrong when you are genuinely confident " +
    "it is incorrect. If handwriting is unclear or you are unsure, give a LOW confidence so " +
    "it is treated as 'review only'. Solve maths yourself before judging it. " +
    "Set detected=true for ANY page or document in view — handwritten OR printed (worksheets, " +
    "textbook pages, typed notes, exam papers), even if there is nothing to grade on it. A printed " +
    "or blank page is STILL a valid page; never discard it. Only set detected=false when there is " +
    "genuinely no page/document at all (e.g. a face, a screen, a random object, an empty desk)."
  // Only ask for hand polygons when inpainting is actually configured — they
  // bloat the JSON (risking truncation) and are useless without the inpaint step.
  const wantHands = !!(env.REPLICATE_API_TOKEN && env.INPAINT_MODEL_VERSION)
  const INSTRUCTION =
    "Analyse this homework page. Return ONLY JSON matching this shape:\n" +
    "{\n" +
    '  "detected": boolean,                       // true if ANY page/document is visible (printed or handwritten)\n' +
    '  "subject": string,                          // e.g. "Algebra · Worksheet" or "" if unknown\n' +
    '  "message": string,                          // short note when detected=false, else ""\n' +
    '  "pageQuad": [[x,y],[x,y],[x,y],[x,y]] | null,  // the 4 corners of the paper sheet, see page rules\n' +
    (wantHands
      ? '  "hands": [ [[x,y],[x,y],...] ],              // polygons covering any fingers/hands ON the page, see hand rules\n'
      : "") +
    '  "questions": [\n' +
    "    {\n" +
    '      "prompt": string,                       // the question as written\n' +
    '      "studentWork": string,                  // what the student wrote (their answer/working)\n' +
    '      "type": "math" | "science" | "language",\n' +
    '      "status": "correct" | "wrong",          // your honest judgement\n' +
    '      "confidence": number,                   // 0-1, how sure you are of the status\n' +
    '      "summary": string,                      // short title of the mistake ("" if correct)\n' +
    '      "explanation": string,                  // why it is wrong + the right idea ("" if correct)\n' +
    '      "suggestedFix": string,                 // the corrected answer ("" if correct)\n' +
    '      "sourceLabel": string,                  // e.g. "Symbolic solver", "Curriculum match", "Grammar & style check"\n' +
    '      "sourceDetail": string,                 // short justification, e.g. "solve(2x+6-14)"\n' +
    '      "box": [ymin, xmin, ymax, xmax]         // see box rules below\n' +
    "    }\n" +
    "  ]\n" +
    "}\n" +
    "BOX RULES: coordinates are integers 0-1000 measured on the WHOLE image you were given " +
    "(0,0 = top-left, 1000,1000 = bottom-right). The box must tightly enclose ALL of the " +
    "student's handwritten working/answer for that question (every line of it), not just one " +
    "character. Be precise about the vertical position — double-check that ymin/ymax actually " +
    "line up with where that writing sits on the page. Ignore hands, faces and background.\n" +
    "PAGE RULES: pageQuad traces the outline of ONLY the actual sheet of paper / notebook page — " +
    "the page the homework is written on. Exclude everything else: hands, fingers, desk, table, " +
    "floor, keyboard, people and any background. Order the four corners by the page's UPRIGHT " +
    "READING orientation: corner 1 = the top-left as you READ the text, corner 2 = top-right, " +
    "corner 3 = bottom-right, corner 4 = bottom-left (so text runs left→right from corner 1 to 2 " +
    "and top→bottom from corner 1 to 4). This makes the cropped page come out straight and upright " +
    "even if the photo is tilted or rotated. The quad MUST enclose the ENTIRE page — all four outer " +
    "corners and every bit of its content; NEVER cut off or crop only part of the page. If you are " +
    "unsure where an edge is, make the quad slightly LARGER rather than smaller. If a corner is just " +
    "outside the frame, estimate it (values may be slightly beyond 0 or 1000). Use null only if no " +
    "page is visible.\n" +
    (wantHands
      ? 'HAND RULES: "hands" lists polygons (each an array of [x,y] points, 0-1000, same image ' +
        "coordinates) that tightly cover any fingers, thumbs or hands that are ON TOP of the paper " +
        "(overlapping the page content/edges). Use a SIMPLE outline: at most 8 points per polygon and " +
        "at most 2 polygons total. If no fingers overlap the page, use an empty array [].\n"
      : "") +
    'Include correct answers too (status="correct"). Keep explanations to 1-2 sentences.'
  return {
    name: 'scan-homework',
    configureServer(server) {
      server.middlewares.use('/api/scan', async (req, res) => {
        const send = (code, obj) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }
        if (req.method !== 'POST') return send(405, { error: 'Method Not Allowed' })
        if (!env.GEMINI_API_KEY) return send(500, { error: 'GEMINI_API_KEY not set in .env' })

        const body = await readJsonBody(req)
        const dataUrl = String(body?.image || '')
        const m = /^data:(image\/\w+);base64,(.+)$/s.exec(dataUrl)
        if (!m) return send(400, { error: 'image must be a base64 data URL' })
        const mimeType = m[1]
        const b64 = m[2]
        // Guard against absurdly large uploads (~8MB of base64).
        if (b64.length > 8_000_000) return send(413, { error: 'image too large' })

        const payload = {
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: [{
            role: 'user',
            parts: [
              { text: INSTRUCTION },
              { inlineData: { mimeType, data: b64 } },
            ],
          }],
          generationConfig: {
            responseMimeType: 'application/json',
            maxOutputTokens: 8192,
            temperature: 0.2,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }

        // Try the primary vision model with exponential backoff; if it stays
        // overloaded (503), fall back to a second model (less congested).
        const TRANSIENT = new Set([429, 500, 502, 503])
        const models = [MODEL, env.GEMINI_VISION_FALLBACK || 'gemini-2.5-flash-lite']
          .filter((m, i, a) => a.indexOf(m) === i)
        let r, data
        outer: for (const model of models) {
          const url =
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`
          for (let attempt = 0; attempt < 4; attempt++) {
            try {
              r = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              })
              data = await r.json().catch(() => ({}))
            } catch (err) {
              return send(502, { error: String(err) })
            }
            if (r.status === 200) break outer
            if (!TRANSIENT.has(r.status)) break // non-transient → don't retry/fallback
            await new Promise((res2) => setTimeout(res2, 500 * 2 ** attempt)) // 0.5,1,2,4s
          }
        }

        if (!r || r.status !== 200) {
          console.error('[scan] error', r?.status, JSON.stringify(data).slice(0, 200))
          const overloaded = r?.status === 503 || r?.status === 429
          return send(r?.status || 502, {
            error: overloaded
              ? 'The AI is busy right now — please try again in a moment.'
              : data?.error?.message || 'scan error',
          })
        }

        const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || ''
        let parsed
        try {
          parsed = JSON.parse(text)
        } catch {
          console.error('[scan] non-JSON model output', text.slice(0, 200))
          return send(502, { error: 'could not read the page — please try again' })
        }
        return send(200, parsed)
      })
    },
  }
}

/* Live-check agent: ONE fast call that marks the page on the raw frame (for the
   real-time overlay — boxes are relative to the frame the camera sees). */
const quickMarkAgent = scanAgent('scan-quick', '/api/scan/quick', ({ env, img, models }) => {
  const SYSTEM =
    "You are a fast homework marker for a LIVE camera check. You are given a photo of a student's " +
    "page (it may include some background). Read the answers and mark each one. NEVER invent a " +
    "mistake: only mark 'wrong' when it is clearly incorrect (solve maths yourself first); use " +
    "'review' for things that are unclear or could be improved; 'correct' for right answers. Be fast."
  const INSTRUCTION =
    "Return ONLY JSON:\n" +
    '{ "detected": boolean, "subject": string, "questions": [ {\n' +
    '  "type": "math" | "science" | "language",\n' +
    '  "status": "correct" | "wrong" | "review",\n' +
    '  "confidence": number, "summary": string, "explanation": string, "suggestedFix": string,\n' +
    '  "sourceLabel": string, "sourceDetail": string, "box": [ymin, xmin, ymax, xmax],\n' +
    '  "errorBox": [ymin, xmin, ymax, xmax] | null\n' +
    "} ] }\n" +
    "detected=false ONLY if no page/answers are visible. BOX = integers 0-1000 on the WHOLE image " +
    "(the camera frame), tightly around each answer's writing. errorBox: for a 'wrong' answer, a TIGHT box " +
    "around ONLY the exact wrong part (the specific incorrect number/word/sign/line) so the student sees " +
    "exactly where the mistake is; null for correct/review. Keep explanations to ONE short sentence."
  return runScanAgent(
    env.GEMINI_API_KEY,
    models.vision,
    SYSTEM,
    [{ text: INSTRUCTION }, { inlineData: { mimeType: img.mimeType, data: img.data } }],
    4096,
  )
})

/* Book scanner agent: validity + single/spread detection + page quads (fast). */
const bookDetectAgent = scanAgent('book-detect', '/api/book/detect', ({ env, img, models }) => {
  const SYSTEM =
    "You detect document/book page boundaries for a fast scanner. You output ONLY the page " +
    "region(s) — never the content. Be STRICT: exclude hands, fingers, desk, table, devices and all " +
    "background; trace ONLY the paper. Drop accidental shots (a hand, a blurry frame, an empty desk)."
  const INSTRUCTION =
    'Return ONLY JSON: { "valid": boolean, "spread": boolean, "pages": [ [[x,y],[x,y],[x,y],[x,y]] ] }.\n' +
    "valid = true ONLY if a real page/document is clearly and fully shown (not a hand, not blurry, not " +
    "an empty surface). If not, valid=false and pages=[].\n" +
    "spread = true if TWO facing book pages are visible side by side.\n" +
    "pages = the page quads. If a single page: ONE quad. If a spread: TWO quads, the LEFT page FIRST then " +
    "the RIGHT page (so they save in reading order); split them at the book's centre gutter, each quad " +
    "covering only its own page. Each quad = four corners in 0-1000 coords, ordered by upright reading " +
    "orientation (top-left as you read, then top-right, bottom-right, bottom-left), enclosing the ENTIRE " +
    "page and excluding the gutter, hands and background. Make quads slightly larger rather than cutting content."
  return runScanAgent(
    env.GEMINI_API_KEY,
    models.detect,
    SYSTEM,
    [{ text: INSTRUCTION }, { inlineData: { mimeType: img.mimeType, data: img.data } }],
    1024,
  )
})

/**
 * POST /api/inpaint — remove fingers/hands from a scanned page (LaMa inpainting).
 *
 * Body: { image, mask } — both base64 data URLs; the mask is white where the
 * hand is (the region to reconstruct), black elsewhere. Forwards to a hosted
 * inpainting model on Replicate and returns the reconstructed page.
 *
 * GATED: if REPLICATE_API_TOKEN / INPAINT_MODEL_VERSION aren't set, returns
 * { configured: false } and the client just keeps the original cropped page —
 * so the scanner is unchanged until inpainting is configured in .env.
 */
function inpaintPage(env) {
  const TOKEN = env.REPLICATE_API_TOKEN
  // A LaMa-style inpainting model version on Replicate that takes { image, mask }.
  const VERSION = env.INPAINT_MODEL_VERSION
  return {
    name: 'inpaint-page',
    configureServer(server) {
      server.middlewares.use('/api/inpaint', async (req, res) => {
        const send = (code, obj) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }
        if (req.method !== 'POST') return send(405, { error: 'Method Not Allowed' })
        if (!TOKEN || !VERSION) return send(200, { configured: false })

        const body = await readJsonBody(req)
        const image = String(body?.image || '')
        const mask = String(body?.mask || '')
        if (!image.startsWith('data:') || !mask.startsWith('data:')) {
          return send(400, { error: 'image and mask must be data URLs' })
        }

        try {
          // 1) Create the prediction.
          const create = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
              Authorization: `Token ${TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ version: VERSION, input: { image, mask } }),
          })
          let pred = await create.json().catch(() => ({}))
          if (!create.ok) {
            return send(create.status || 502, { error: pred?.detail || 'inpaint create failed' })
          }

          // 2) Poll until done (LaMa is quick; cap the wait).
          const getUrl = pred?.urls?.get
          for (let i = 0; i < 40 && pred.status && !['succeeded', 'failed', 'canceled'].includes(pred.status); i++) {
            await new Promise((r) => setTimeout(r, 1000))
            const poll = await fetch(getUrl, { headers: { Authorization: `Token ${TOKEN}` } })
            pred = await poll.json().catch(() => pred)
          }
          if (pred.status !== 'succeeded') {
            return send(502, { error: `inpaint ${pred.status || 'error'}` })
          }

          // 3) Output is a URL (or array of URLs) — fetch it and return base64.
          const outUrl = Array.isArray(pred.output) ? pred.output[0] : pred.output
          if (!outUrl) return send(502, { error: 'no inpaint output' })
          const imgRes = await fetch(outUrl)
          const buf = Buffer.from(await imgRes.arrayBuffer())
          const mime = imgRes.headers.get('content-type') || 'image/png'
          return send(200, { configured: true, image: `data:${mime};base64,${buf.toString('base64')}` })
        } catch (err) {
          return send(502, { error: String(err) })
        }
      })
    },
  }
}

/* ════════════════════════════════════════════════════════════════════════
   TEACHING ASSISTANT — multi-publisher library with cited answers
   ════════════════════════════════════════════════════════════════════════
   Teachers upload a book ONCE (Gemini Files API), then ask questions and
   generate lessons/MCQs from it. Every answer must cite the book + page, or
   say the library doesn't cover it — the Slate AI "never answer without a
   citation" rule. The Gemini key stays server-side.
   ──────────────────────────────────────────────────────────────────────── */

/** Model used to read the (PDF) books and answer/generate from them. */
function libraryModel(env) {
  return env.GEMINI_VISION_MODEL || 'gemini-2.5-flash'
}

/**
 * One JSON-returning Gemini generateContent call, with transient retries.
 * `parts` are the user-message parts (text + fileData). Throws an Error with a
 * `.status` on failure.
 */
async function callGeminiJSON({ apiKey, model, systemText, parts, maxOutputTokens = 2048 }) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const payload = {
    systemInstruction: { parts: [{ text: systemText }] },
    contents: [{ role: 'user', parts }],
    generationConfig: {
      responseMimeType: 'application/json',
      maxOutputTokens,
      temperature: 0.3,
      thinkingConfig: { thinkingBudget: 0 },
    },
  }
  const TRANSIENT = new Set([429, 500, 502, 503])
  let r, data
  for (let attempt = 0; attempt < 3; attempt++) {
    r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    data = await r.json().catch(() => ({}))
    if (!TRANSIENT.has(r.status)) break
    await new Promise((res) => setTimeout(res, 400))
  }
  if (!r || r.status !== 200) {
    const e = new Error(data?.error?.message || 'gemini error')
    e.status = r?.status || 502
    throw e
  }
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || ''
  try {
    return JSON.parse(text)
  } catch {
    const e = new Error('could not read the model output — please try again')
    e.status = 502
    throw e
  }
}

/** Validate the books array the client sends with ask/generate requests. */
function readBooks(body) {
  if (!Array.isArray(body?.books)) return []
  return body.books
    .filter((b) => b && typeof b.uri === 'string' && typeof b.mimeType === 'string')
    .slice(0, 5)
    .map((b) => ({
      uri: b.uri,
      mimeType: b.mimeType,
      title: String(b.title || 'Untitled book').slice(0, 160),
    }))
}

/** Build the user-message parts: each book labelled, then the instruction. */
function booksParts(books, instruction) {
  const parts = []
  books.forEach((b, i) => {
    parts.push({ text: `BOOK ${i + 1} TITLE: "${b.title}"` })
    parts.push({ fileData: { mimeType: b.mimeType, fileUri: b.uri } })
  })
  parts.push({ text: instruction })
  return parts
}

/**
 * Upload raw bytes to the Gemini Files API (resumable: start → upload+finalize →
 * poll until ACTIVE) and return the processed file object. Throws on failure.
 */
async function filesApiUpload(apiKey, bytes, mimeType, displayName) {
  // 1) Start a resumable upload — Gemini replies with an upload URL.
  const startRes = await fetch(
    `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
        'X-Goog-Upload-Header-Content-Length': String(bytes.length),
        'X-Goog-Upload-Header-Content-Type': mimeType,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file: { display_name: displayName } }),
    },
  )
  const uploadUrl = startRes.headers.get('x-goog-upload-url')
  if (!startRes.ok || !uploadUrl) {
    const d = await startRes.json().catch(() => ({}))
    const e = new Error(d?.error?.message || 'upload start failed')
    e.status = startRes.status || 502
    throw e
  }

  // 2) Upload the bytes and finalize in one request.
  const upRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Length': String(bytes.length),
      'X-Goog-Upload-Offset': '0',
      'X-Goog-Upload-Command': 'upload, finalize',
    },
    body: bytes,
  })
  const upData = await upRes.json().catch(() => ({}))
  if (!upRes.ok || !upData?.file) {
    const e = new Error(upData?.error?.message || 'upload failed')
    e.status = upRes.status || 502
    throw e
  }
  let file = upData.file

  // 3) Poll until the file is ACTIVE (PDFs/images process quickly).
  for (let i = 0; i < 20 && file.state && file.state !== 'ACTIVE'; i++) {
    if (file.state === 'FAILED') {
      const e = new Error('the book could not be processed')
      e.status = 502
      throw e
    }
    await new Promise((r) => setTimeout(r, 1000))
    const pollRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${file.name}?key=${apiKey}`,
    )
    file = await pollRes.json().catch(() => file)
  }
  return file
}

/**
 * Build a minimal, valid PDF that embeds one JPEG per page (no dependencies).
 * JPEGs are stored with the DCTDecode filter, so the bytes pass through as-is.
 * @param {Array<{jpeg: Buffer, w: number, h: number}>} pages
 */
function buildPdfFromJpegs(pages) {
  const chunks = []
  let len = 0
  const push = (buf) => {
    const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf, 'latin1')
    chunks.push(b)
    len += b.length
  }
  const offsets = []
  const at = (n) => {
    offsets[n] = len
  }

  push('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n')
  const N = pages.length
  // Object map: 1=Catalog, 2=Pages, then per page i: page=3+i*3, image=4+i*3, content=5+i*3
  const kids = []
  for (let i = 0; i < N; i++) kids.push(`${3 + i * 3} 0 R`)

  at(1)
  push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')
  at(2)
  push(`2 0 obj\n<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${N} >>\nendobj\n`)

  for (let i = 0; i < N; i++) {
    const { jpeg, w, h } = pages[i]
    const pageNo = 3 + i * 3
    const imgNo = 4 + i * 3
    const contNo = 5 + i * 3

    at(pageNo)
    push(
      `${pageNo} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] ` +
        `/Resources << /XObject << /Im0 ${imgNo} 0 R >> >> /Contents ${contNo} 0 R >>\nendobj\n`,
    )

    at(imgNo)
    push(
      `${imgNo} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
    )
    push(jpeg)
    push('\nendstream\nendobj\n')

    const content = `q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q`
    at(contNo)
    push(`${contNo} 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`)
  }

  const xrefStart = len
  const total = 2 + N * 3
  let xref = `xref\n0 ${total + 1}\n0000000000 65535 f \n`
  for (let n = 1; n <= total; n++) {
    xref += String(offsets[n] || 0).padStart(10, '0') + ' 00000 n \n'
  }
  push(xref)
  push(`trailer\n<< /Size ${total + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`)

  return Buffer.concat(chunks)
}

/**
 * POST /api/library/upload — upload one book to the Gemini Files API.
 * Body: { filename, mimeType, data (base64) }. Returns the file reference the
 * client keeps and sends back with every ask/generate call.
 */
function libraryUpload(env) {
  return {
    name: 'library-upload',
    configureServer(server) {
      server.middlewares.use('/api/library/upload', async (req, res) => {
        const send = (code, obj) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }
        if (req.method !== 'POST') return send(405, { error: 'Method Not Allowed' })
        if (!env.GEMINI_API_KEY) return send(500, { error: 'GEMINI_API_KEY not set in .env' })

        const body = await readJsonBody(req)
        const filename = String(body?.filename || 'book.pdf').slice(0, 160)
        const mimeType = String(body?.mimeType || 'application/pdf')
        const b64 = String(body?.data || '')
        if (!b64) return send(400, { error: 'no file data' })
        const bytes = Buffer.from(b64, 'base64')
        if (bytes.length < 100) return send(400, { error: 'file is empty or unreadable' })
        if (bytes.length > 50_000_000) return send(413, { error: 'book too large (max 50MB)' })

        try {
          const file = await filesApiUpload(env.GEMINI_API_KEY, bytes, mimeType, filename)
          return send(200, {
            uri: file.uri,
            name: file.name,
            mimeType: file.mimeType || mimeType,
            displayName: filename,
            sizeBytes: Number(file.sizeBytes) || bytes.length,
            state: file.state || 'ACTIVE',
          })
        } catch (err) {
          return send(err.status || 502, { error: err.message || String(err) })
        }
      })
    },
  }
}

/**
 * POST /api/library/scan — turn camera-scanned pages into a book.
 * Body: { filename, pages: [{ data (base64 JPEG), w, h }] }. The pages are
 * stitched into a PDF and uploaded to the Files API, so a scanned book is then
 * identical to an uploaded one (same ask/generate/citation path).
 */
function libraryScan(env) {
  return {
    name: 'library-scan',
    configureServer(server) {
      server.middlewares.use('/api/library/scan', async (req, res) => {
        const send = (code, obj) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }
        if (req.method !== 'POST') return send(405, { error: 'Method Not Allowed' })
        if (!env.GEMINI_API_KEY) return send(500, { error: 'GEMINI_API_KEY not set in .env' })

        const body = await readJsonBody(req)
        const filename = String(body?.filename || 'Scanned book.pdf').slice(0, 160)
        const rawPages = Array.isArray(body?.pages) ? body.pages.slice(0, 60) : []
        const pages = rawPages
          .map((p) => ({
            jpeg: Buffer.from(String(p?.data || ''), 'base64'),
            w: Math.round(Number(p?.w) || 0),
            h: Math.round(Number(p?.h) || 0),
          }))
          .filter((p) => p.jpeg.length > 100 && p.w > 0 && p.h > 0)
        if (!pages.length) return send(400, { error: 'no scanned pages' })

        try {
          const pdf = buildPdfFromJpegs(pages)
          if (pdf.length > 50_000_000) return send(413, { error: 'scanned book too large' })
          const file = await filesApiUpload(env.GEMINI_API_KEY, pdf, 'application/pdf', filename)
          return send(200, {
            uri: file.uri,
            name: file.name,
            mimeType: file.mimeType || 'application/pdf',
            displayName: filename,
            sizeBytes: Number(file.sizeBytes) || pdf.length,
            pageCount: pages.length,
            state: file.state || 'ACTIVE',
          })
        } catch (err) {
          return send(err.status || 502, { error: err.message || String(err) })
        }
      })
    },
  }
}

/**
 * POST /api/library/ask — answer a teacher's question from the uploaded books,
 * with citations, or say the library doesn't cover it.
 * Body: { books: [{uri, mimeType, title}], question }
 */
function libraryAsk(env) {
  const SYSTEM =
    "You are a teaching assistant that answers ONLY from the provided book(s). " +
    "Every claim must be grounded in a real passage you can point to, with its page number. " +
    "If the books do not contain the answer, set covered=false and do NOT guess — say the " +
    "library doesn't cover it. Never use outside knowledge. Cite the book title and page for " +
    "each part of your answer."
  return {
    name: 'library-ask',
    configureServer(server) {
      server.middlewares.use('/api/library/ask', async (req, res) => {
        const send = (code, obj) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }
        if (req.method !== 'POST') return send(405, { error: 'Method Not Allowed' })
        if (!env.GEMINI_API_KEY) return send(500, { error: 'GEMINI_API_KEY not set in .env' })

        const body = await readJsonBody(req)
        const books = readBooks(body)
        const question = String(body?.question || '').slice(0, 1000).trim()
        if (!books.length) return send(400, { error: 'no books in the library' })
        if (!question) return send(400, { error: 'empty question' })

        const instruction =
          `TEACHER QUESTION: ${question}\n\n` +
          'Return ONLY JSON: {\n' +
          '  "covered": boolean,                       // false if the books do not answer this\n' +
          '  "answer": string,                          // the answer in 2-5 sentences, or "" if not covered\n' +
          '  "citations": [ { "book": string, "page": number, "quote": string } ],  // passages you used\n' +
          '  "message": string                          // when covered=false, a short note; else ""\n' +
          '}\n' +
          'Quotes must be short (max ~20 words) and copied from the book. Pages are the printed page numbers.'

        try {
          const out = await callGeminiJSON({
            apiKey: env.GEMINI_API_KEY,
            model: libraryModel(env),
            systemText: SYSTEM,
            parts: booksParts(books, instruction),
          })
          return send(200, out)
        } catch (err) {
          return send(err.status || 502, { error: err.message || 'ask failed' })
        }
      })
    },
  }
}

/**
 * POST /api/library/generate — generate teaching material from the books, cited.
 * Body: { books, kind: "mcq" | "lesson", topic?, count? }
 */
function libraryGenerate(env) {
  const SYSTEM =
    "You generate teaching material grounded ONLY in the provided book(s). Everything you " +
    "produce must trace to a real passage with its page number. If the books don't cover the " +
    "requested topic, set covered=false and don't invent content. Never use outside knowledge."
  return {
    name: 'library-generate',
    configureServer(server) {
      server.middlewares.use('/api/library/generate', async (req, res) => {
        const send = (code, obj) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }
        if (req.method !== 'POST') return send(405, { error: 'Method Not Allowed' })
        if (!env.GEMINI_API_KEY) return send(500, { error: 'GEMINI_API_KEY not set in .env' })

        const body = await readJsonBody(req)
        const books = readBooks(body)
        const kind = body?.kind === 'lesson' ? 'lesson' : 'mcq'
        const topic = String(body?.topic || '').slice(0, 200).trim()
        const count = Math.min(10, Math.max(1, Number(body?.count) || 5))
        if (!books.length) return send(400, { error: 'no books in the library' })

        const topicLine = topic ? `Focus on this topic: "${topic}".` : 'Choose a clear, important topic from the book.'

        const instruction =
          kind === 'mcq'
            ? `Create ${count} multiple-choice questions from the book(s). ${topicLine}\n` +
              'Return ONLY JSON: {\n' +
              '  "covered": boolean,\n' +
              '  "title": string,\n' +
              '  "items": [ { "question": string, "options": [string,string,string,string], "answerIndex": number, "citation": { "book": string, "page": number } } ],\n' +
              '  "message": string\n' +
              '}\nEach question needs exactly 4 options and a citation to the page it comes from.'
            : `Create a concise lesson plan from the book(s). ${topicLine}\n` +
              'Return ONLY JSON: {\n' +
              '  "covered": boolean,\n' +
              '  "title": string,\n' +
              '  "sections": [ { "heading": string, "content": string, "citation": { "book": string, "page": number } } ],\n' +
              '  "message": string\n' +
              '}\nInclude sections like Objectives, Key Concepts, Worked Example, and Practice — each cited.'

        try {
          const out = await callGeminiJSON({
            apiKey: env.GEMINI_API_KEY,
            model: libraryModel(env),
            systemText: SYSTEM,
            parts: booksParts(books, instruction),
            maxOutputTokens: 3072,
          })
          return send(200, { kind, ...out })
        } catch (err) {
          return send(err.status || 502, { error: err.message || 'generation failed' })
        }
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
