/**
 * ourModel.js — Our own AI model for the GIF voice circle (post-Anam phase).
 *
 * Calls the server-side /api/ask endpoint (Gemini), so the API key never
 * touches the browser. Cost is capped server-side (cheap flash model, thinking
 * disabled, small max output, trimmed input — see vite.config.js askGemini),
 * and per-session usage time is capped client-side in MiniAssistant.
 *
 * The server streams the reply back as Server-Sent Events (one text delta per
 * `data:` line) so the caller can start speaking the first sentence before the
 * full answer is generated.
 *
 * Contract:
 *   input : question (string), { lang, roleId, onDelta }
 *     - onDelta(delta, full): called for each streamed text chunk, with the new
 *                             piece and the accumulated text so far.
 *   output: { text, audioUrl? }
 *     - text     : the complete answer (same as the final `full`), or a fallback
 *                  string if the request failed / returned nothing.
 *     - audioUrl : reserved for a future TTS that returns spoken audio.
 */

export async function askOurModel(question, { lang = "en", roleId = "", onDelta } = {}) {
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, lang, role: roleId }),
    });
    // The happy path is an SSE stream; anything else (error JSON, no body) → fallback.
    const ctype = res.headers.get("content-type") || "";
    if (!res.ok || !res.body || !ctype.includes("text/event-stream")) {
      return { text: fallback(lang), audioUrl: null };
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let full = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let nl;
      while ((nl = buf.indexOf("\n\n")) !== -1) {
        const evt = buf.slice(0, nl);
        buf = buf.slice(nl + 2);
        const line = evt.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        let obj;
        try { obj = JSON.parse(line.slice(5).trim()); } catch { continue; }
        if (obj.t) { full += obj.t; onDelta?.(obj.t, full); }
      }
    }
    if (!full.trim()) return { text: fallback(lang), audioUrl: null };
    return { text: full, audioUrl: null };
  } catch {
    return { text: fallback(lang), audioUrl: null };
  }
}

/**
 * Synthesize one sentence into a clear, consistent neural voice via /api/tts.
 * Returns an object URL for the audio (caller plays it and should revoke it),
 * or null on failure so the caller can fall back to the browser voice.
 */
export async function synthSpeech(text, lang = "en") {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    if (!buf || buf.byteLength < 44) return null; // smaller than a WAV header → no audio
    return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
  } catch {
    return null;
  }
}

function fallback(lang) {
  return lang === "hi"
    ? "माफ़ कीजिए, मैं अभी जवाब नहीं दे पाई। थोड़ी देर बाद फिर कोशिश कीजिए।"
    : "Sorry, I couldn't get an answer just now. Please try again in a moment.";
}
