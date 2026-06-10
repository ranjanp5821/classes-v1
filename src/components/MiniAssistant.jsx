/**
 * MiniAssistant.jsx — Small Android-style voice circle (post role-selection).
 *
 * Once the user has chosen a role, we stop using the (costly) Anam avatar and
 * switch to this lightweight circle. It shows an IDLE GIF normally and a
 * TALKING GIF only while our AI model is responding (speaking). Tap to talk.
 *
 * Voice in : Web Speech API (SpeechRecognition).
 * Brain    : askOurModel() — our own model (see src/lib/ourModel.js).
 * Voice out: the model's audioUrl if provided, else browser speech synthesis;
 *            the talking GIF plays for exactly as long as audio plays.
 *
 * Swap the GIFs by replacing public/assets/vidya-idle.gif & vidya-talking.gif.
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { askOurModel } from "../lib/ourModel";

const IDLE_GIF = "/assets/vidya-idle.gif";
const TALKING_GIF = "/assets/vidya-talking.gif";
const LANG_STORAGE_KEY = "vidya-lang";

const STRINGS = {
  en: { tap: "Tap to talk", listening: "Listening…", thinking: "Thinking…", speaking: "Speaking…" },
  hi: { tap: "बात करने के लिए टैप करें", listening: "सुन रही हूँ…", thinking: "सोच रही हूँ…", speaking: "बोल रही हूँ…" },
};

export default function MiniAssistant() {
  // idle | listening | thinking | talking
  const [state, setState] = useState("idle");
  const [lang] = useState(
    () => (typeof localStorage !== "undefined" && localStorage.getItem(LANG_STORAGE_KEY)) || "en"
  );

  const recRef    = useRef(null);
  const audioRef  = useRef(null);
  const talkTimer = useRef(null);
  const stateRef  = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const t = STRINGS[lang] || STRINGS.en;

  /* ── Speak the model's reply; the TALKING GIF shows for the whole reply ──
     The talking state is held for an estimated speech duration so a flaky /
     instant TTS (or audio) 'end' event can't cut the talking GIF short. Real
     audio/TTS ending only finishes it early (after it has actually played). */
  const speak = (text, audioUrl) => {
    setState("talking");
    const startedAt = Date.now();
    // ~60ms/char, clamped to a sensible 1.8s–12s window.
    const estMs = Math.min(12000, Math.max(1800, (text?.length || 24) * 60));

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(talkTimer.current);
      setState("idle");
    };
    // Only let a real end event finish early once it has played a moment.
    const maybeFinish = () => { if (Date.now() - startedAt > 600) finish(); };

    clearTimeout(talkTimer.current);
    talkTimer.current = setTimeout(finish, estMs);

    if (audioUrl) {
      const a = new Audio(audioUrl);
      audioRef.current = a;
      a.onended = maybeFinish;
      // If audio fails, keep the talking GIF until the estimate, then idle.
      a.play().catch(() => {});
      return;
    }

    // Placeholder voice: browser speech synthesis (replace when the model
    // returns its own audioUrl). Talking GIF still shows even if TTS is silent.
    try {
      const synth = window.speechSynthesis;
      if (synth) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang === "hi" ? "hi-IN" : "en-US";
        u.onend = maybeFinish;
        synth.speak(u);
      }
    } catch { /* talking GIF shows for the estimate, then idle */ }
  };

  /* ── Hand the transcript to our model ── */
  const handleTranscript = async (transcript) => {
    if (!transcript?.trim()) { setState("idle"); return; }
    setState("thinking");
    try {
      const { text, audioUrl } = await askOurModel(transcript, { lang });
      speak(text, audioUrl);
    } catch {
      setState("idle");
    }
  };

  /* ── Listen (tap to talk) ── */
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return; // unsupported browser — stays idle
    const rec = new SR();
    rec.lang = lang === "hi" ? "hi-IN" : "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript || "";
      handleTranscript(transcript);
    };
    rec.onerror = () => setState("idle");
    rec.onend = () => {
      recRef.current = null;
      // If no result moved us on, return to idle.
      if (stateRef.current === "listening") setState("idle");
    };
    recRef.current = rec;
    setState("listening");
    try { rec.start(); } catch { setState("idle"); }
  };

  const stopAll = () => {
    clearTimeout(talkTimer.current);
    try { recRef.current?.stop(); } catch { /* noop */ }
    try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
    try { audioRef.current?.pause(); } catch { /* noop */ }
    recRef.current = null;
    setState("idle");
  };

  const handleTap = () => {
    if (state === "idle") startListening();
    else stopAll(); // tap again to cancel listening / interrupt speaking
  };

  // Cleanup on unmount.
  useEffect(() => () => stopAll(), []);

  const isTalking = state === "talking";
  const label =
    state === "listening" ? t.listening :
    state === "thinking"  ? t.thinking  :
    state === "talking"   ? t.speaking  :
    t.tap;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[90] flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* State label pill */}
      <motion.span
        key={label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
      >
        {label}
      </motion.span>

      <button
        type="button"
        onClick={handleTap}
        aria-label={label}
        className="relative flex h-20 w-20 items-center justify-center rounded-full"
      >
        {/* Listening pulse ring */}
        {state === "listening" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400/40" />
        )}
        {/* Thinking ring */}
        {state === "thinking" && (
          <span className="absolute h-full w-full animate-spin rounded-full border-[3px] border-transparent border-t-blue-500" />
        )}

        {/* The orb — idle GIF normally, talking GIF while responding */}
        <img
          src={isTalking ? TALKING_GIF : IDLE_GIF}
          alt="Vidya assistant"
          className="h-20 w-20 rounded-full object-cover shadow-lg"
          draggable={false}
        />

        {/* Mic affordance when idle */}
        {state === "idle" && (
          <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow ring-1 ring-black/5">
            <Mic size={13} className="text-blue-600" />
          </span>
        )}
      </button>
    </motion.div>
  );
}
