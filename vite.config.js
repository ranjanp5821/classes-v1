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
                voiceId: env.ANAM_VOICE_ID,
                ...(env.ANAM_LLM_ID ? { llmId: env.ANAM_LLM_ID } : {}),
                systemPrompt:
                  "[STYLE] Reply in natural speech without formatting. Add pauses using '...' and very occasionally a disfluency. " +
                  '[PERSONALITY] You are the Classess voice assistant, a friendly guide for an education platform that serves students, tutors, and institutes. ' +
                  'Help visitors understand the platform and choose their role.',
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
