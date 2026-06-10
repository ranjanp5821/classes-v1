/**
 * capture_mia_talking.mjs — One-time capture of the Anam avatar (Mia) speaking.
 *
 * Drives a headless Chrome page that loads the Anam UMD SDK, opens a session,
 * makes the avatar talk, and records her video track to /tmp/mia_talk.webm.
 * scripts/make_mia_gifs.sh then turns that into public/assets/vidya-talking.gif.
 *
 * Run:  node scripts/capture_mia_talking.mjs
 * (Uses the ANAM_* values in .env and the installed Google Chrome.)
 */
import { chromium } from "playwright-core";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RECORD_MS = 11000;
const SENTENCE =
  "Hi, I'm Vidya, your learning companion. I'm here to help you understand concepts, " +
  "practise what matters, and prepare for your exams with real confidence, every single step of the way.";

// ── tiny .env reader ──────────────────────────────────────────────────────
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, ".env"), "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const API_KEY = process.env.ANAM_API_KEY || env.ANAM_API_KEY; // allow one-off override

async function mintToken() {
  const res = await fetch("https://api.anam.ai/v1/auth/session-token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({
      personaConfig: {
        personaId: env.ANAM_PERSONA_ID,
        name: "Classess Capture",
        avatarId: env.ANAM_AVATAR_ID,
        voiceId: env.ANAM_VOICE_ID,
        languageCode: "en",
        ...(env.ANAM_LLM_ID ? { llmId: env.ANAM_LLM_ID } : {}),
        systemPrompt: "You are Vidya. Speak exactly the text you are told to say.",
      },
    }),
  });
  const data = await res.json();
  if (!data.sessionToken) throw new Error("no session token: " + JSON.stringify(data).slice(0, 300));
  return data.sessionToken;
}

const PAGE_HTML = `<!doctype html><html><head><meta charset="utf8"></head>
<body style="margin:0;background:#000">
<video id="v" autoplay playsinline muted style="width:720px;height:480px;object-fit:cover"></video>
<script src="/anam.js"></script>
<script>
window.__startCapture = (token, sentence, ms) => new Promise((resolve, reject) => {
  const { createClient } = window.anam;
  const v = document.getElementById('v');
  const client = createClient(token);
  let videoReady = false, sessionReady = false, started = false, chunks = [];
  const begin = () => {
    if (started || !videoReady || !sessionReady) return;
    started = true;
    const stream = v.srcObject || (v.captureStream && v.captureStream());
    if (!stream) { reject(new Error('no media stream')); return; }
    const rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = async () => {
      const buf = new Uint8Array(await new Blob(chunks).arrayBuffer());
      let s = ''; for (let i=0;i<buf.length;i++) s += String.fromCharCode(buf[i]);
      resolve(btoa(s));
    };
    rec.start();
    try { client.talk(sentence); } catch (e) {}
    setTimeout(() => { try { rec.stop(); } catch (e) {} }, ms);
  };
  client.addListener('VIDEO_PLAY_STARTED', () => { videoReady = true; begin(); });
  client.addListener('SESSION_READY', () => { sessionReady = true; begin(); });
  client.streamToVideoElement('v').catch(reject);
  setTimeout(() => reject(new Error('capture timeout')), ms + 25000);
});
</script>
</body></html>`;

async function main() {
  const token = await mintToken();
  console.log("minted session token");

  const anamJs = fs.readFileSync(
    path.join(ROOT, "node_modules/@anam-ai/js-sdk/dist/umd/anam.js")
  );
  const server = http.createServer((req, res) => {
    if (req.url.startsWith("/anam.js")) {
      res.setHeader("Content-Type", "application/javascript");
      res.end(anamJs);
    } else {
      res.setHeader("Content-Type", "text/html");
      res.end(PAGE_HTML);
    }
  });
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required", "--use-fake-ui-for-media-stream"],
  });
  const page = await browser.newPage();
  page.on("console", (m) => console.log("[page]", m.text()));
  await page.goto(`http://127.0.0.1:${port}/`);

  console.log("recording avatar speaking…");
  const b64 = await page.evaluate(
    ({ token, sentence, ms }) => window.__startCapture(token, sentence, ms),
    { token, sentence: SENTENCE, ms: RECORD_MS }
  );

  fs.writeFileSync("/tmp/mia_talk.webm", Buffer.from(b64, "base64"));
  console.log("wrote /tmp/mia_talk.webm", fs.statSync("/tmp/mia_talk.webm").size, "bytes");

  await browser.close();
  server.close();
}

main().catch((e) => { console.error("CAPTURE FAILED:", e.message); process.exit(1); });
