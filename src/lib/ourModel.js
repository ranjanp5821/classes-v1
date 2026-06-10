/**
 * ourModel.js — Integration point for OUR AI model.
 *
 * After a role is chosen, the small voice circle (<MiniAssistant />) hands the
 * user's spoken question to this function instead of Anam — Anam is only used
 * during the opening role-selection phase, to keep costs down.
 *
 * ──────────────────────────────────────────────────────────────────────────
 *  TODO: WIRE YOUR REAL MODEL HERE.
 *  Replace the placeholder below with a call to your own AI model/endpoint.
 *  Contract:
 *    input : question (string), { lang: "en" | "hi", roleId }
 *    output: { text: string, audioUrl?: string }
 *      - text     : the answer to show / speak
 *      - audioUrl : OPTIONAL. If your model returns spoken audio (TTS), pass a
 *                   playable URL and the circle will lip-sync the talking GIF to
 *                   it. If omitted, the browser's speech synthesis speaks `text`.
 *
 *  Example real implementation:
 *    const res = await fetch("/api/ask", {
 *      method: "POST",
 *      headers: { "Content-Type": "application/json" },
 *      body: JSON.stringify({ question, lang, roleId }),
 *    });
 *    return await res.json(); // { text, audioUrl }
 * ──────────────────────────────────────────────────────────────────────────
 */

const PLACEHOLDER = {
  en: (q) =>
    `Good question. Once our own AI model is connected, I'll answer "${q}" right here. ` +
    `For now this is a placeholder response from the local assistant.`,
  hi: (q) =>
    `अच्छा सवाल। जैसे ही हमारा अपना AI मॉडल जुड़ेगा, मैं "${q}" का जवाब यहीं दूँगी। ` +
    `अभी के लिए यह एक प्लेसहोल्डर जवाब है।`,
};

export async function askOurModel(question, { lang = "en" } = {}) {
  // Simulate a little "thinking" latency so the UI states are visible.
  await new Promise((r) => setTimeout(r, 500));
  const make = PLACEHOLDER[lang] || PLACEHOLDER.en;
  return { text: make(question), audioUrl: null };
}
