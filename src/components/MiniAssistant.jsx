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
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { askOurModel, synthSpeech } from "../lib/ourModel";
import { useRole } from "../hooks/useRole";

const IDLE_GIF = "/assets/vidya-idle.gif";
const TALKING_GIF = "/assets/vidya-talking.gif";
const LANG_STORAGE_KEY = "vidya-lang";

// Keep usage (and cost) bounded: a single visitor gets up to ~4 minutes of
// conversation with our model, then it winds down.
const SESSION_MS = 4 * 60 * 1000;

// ── Navigation: handle "take me to / show / open …" locally (no API call) ──
// Scrolls to the section on the current page if present, else routes to its page.
const NAV_TRIGGER =
  /\b(show|take me|go to|open|navigate|scroll|where is|jump to|i want to see|let'?s see|bring me)\b|दिखा|ले चल|ले जा|जाओ|खोल|कहाँ|कहां|देखना/i;

const NAV_TARGETS = [
  { label: "Learn",            labelHi: "लर्न",            kw: ["learn", "concept", "understand", "topic", "theory"], khi: ["सीख", "कॉन्सेप्ट", "समझ", "थ्योरी"], ids: ["concepts"], path: "/students/learn" },
  { label: "Practice",         labelHi: "प्रैक्टिस",        kw: ["practice", "exercise", "drill"],                      khi: ["अभ्यास", "प्रैक्टिस", "एक्सरसाइज"], ids: ["practice"], path: "/students/practice" },
  { label: "Exam Preparation", labelHi: "परीक्षा तैयारी",   kw: ["exam", "preparation", "test prep", "syllabus"],       khi: ["परीक्षा", "एग्जाम", "तैयारी", "सिलेबस"], ids: ["exam-prep"], path: "/students/exam-preparation" },
  { label: "Progress",         labelHi: "प्रगति",           kw: ["progress", "tracking", "improvement", "marks"],       khi: ["प्रगति", "प्रोग्रेस", "सुधार"], ids: ["progress"], path: "/students/progress" },
  { label: "AI Tutor",         labelHi: "एआई ट्यूटर",      kw: ["ai tutor", "tutor", "doubt"],                         khi: ["ट्यूटर", "एआई ट्यूटर", "डाउट"], ids: ["ai-tutor"], path: "/students/ai-tutor" },
  { label: "How It Helps",     labelHi: "यह कैसे मदद करता है", kw: ["how it helps", "transformation", "benefit"],       khi: ["कैसे मदद", "फायदे", "लाभ"], ids: ["how-it-helps", "teaching-workflow"] },
  { label: "Overview",         labelHi: "ओवरव्यू",          kw: ["overview", "all features", "features", "everything"], khi: ["ओवरव्यू", "सभी फ़ीचर", "फ़ीचर्स"], ids: ["student-overview", "teacher-overview", "institute-overview"] },
  { label: "FAQ",              labelHi: "सामान्य प्रश्न",    kw: ["faq", "frequently asked", "common question"],         khi: ["एफएक्यू", "सामान्य प्रश्न"], ids: ["faq"] },
  { label: "Lesson Planning",  labelHi: "लेसन प्लानिंग",     kw: ["lesson plan", "planning", "prepare lesson"],          khi: ["लेसन", "प्लानिंग", "पाठ योजना"], ids: ["planning"], path: "/teachers/plan-and-create" },
  { label: "Assessment",       labelHi: "मूल्यांकन",        kw: ["assessment", "grading", "feedback", "marking"],       khi: ["मूल्यांकन", "फीडबैक"], ids: ["assessment"], path: "/teachers/assess-and-support" },
  { label: "Student Insights", labelHi: "स्टूडेंट इनसाइट्स", kw: ["insight", "who needs help", "struggling"],            khi: ["इनसाइट"], ids: ["insights"] },
];

function matchNav(transcript) {
  const lower = transcript.toLowerCase();
  if (!NAV_TRIGGER.test(transcript)) return null;
  for (const tgt of NAV_TARGETS) {
    if (tgt.kw.some((k) => lower.includes(k)) || tgt.khi.some((k) => transcript.includes(k))) return tgt;
  }
  return null;
}

// ── Greeting / wake phrase: "hi", "hii Vidya", "hello", "namaste", etc. ──
// A bare greeting is answered warmly and instantly (no model call). We only
// match when the whole utterance is essentially just a greeting, so real
// questions like "hi, how does practice help me?" still go to the model.
const GREET_WORDS =
  /^(hi+|hii+|hey+|heyy+|hello+|helo+|hai+|haai+|haay+|yo|hola|namaste|namaskar|namaskaar|good (morning|afternoon|evening))$/i;
const GREET_HI = /^(नमस्ते|नमस्कार|हाय|हेलो|हाई|हैलो)$/;

function isGreeting(transcript) {
  // Drop the name "Vidya", punctuation and filler so "hii vidya!" → "hii".
  const cleaned = transcript
    .toLowerCase()
    .replace(/vidya|विद्या|वीडिया/gi, " ")
    .replace(/\b(there|please|ji|जी)\b/gi, " ")
    .replace(/[^a-zऀ-ॿ\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return true; // just "Vidya" on its own counts as a greeting
  return GREET_WORDS.test(cleaned) || GREET_HI.test(cleaned);
}

const STRINGS = {
  en: {
    tap: "Tap to talk", listening: "Listening…", thinking: "Thinking…", speaking: "Speaking…",
    greet: "Hi there! I'm Vidya. How can I help you today?",
    limit: "That's all the time I have for now. Thanks for chatting — explore the page and tap me anytime later!",
  },
  hi: {
    tap: "बात करने के लिए टैप करें", listening: "सुन रही हूँ…", thinking: "सोच रही हूँ…", speaking: "बोल रही हूँ…",
    greet: "नमस्ते! मैं विद्या हूँ। बताइए, मैं आपकी कैसे मदद कर सकती हूँ?",
    limit: "अभी के लिए मेरे पास इतना ही समय है। बात करने के लिए शुक्रिया — पेज देखिए और बाद में मुझे टैप कीजिए!",
  },
};

export default function MiniAssistant({ autoStart = false }) {
  const { activeRoleId } = useRole();
  const navigate = useNavigate();
  // idle | listening | thinking | talking
  const [state, setState] = useState("idle");
  const [lang] = useState(
    () => (typeof localStorage !== "undefined" && localStorage.getItem(LANG_STORAGE_KEY)) || "en"
  );

  const recRef    = useRef(null);
  const audioRef  = useRef(null);
  const speakerRef = useRef(null); // active streaming-speech controller (to cancel)
  const talkTimer = useRef(null);
  const autoTimer = useRef(null);
  const sessionStarted = useRef(false); // has the visitor started talking to our model
  const sessionExpired = useRef(false); // flipped true ~4 min after the first turn
  const voiceRef       = useRef(null);  // chosen female browser voice
  // Hands-free loop is enabled only if Vidya was used (autoStart). Otherwise the
  // user must tap to start; the first tap then enables the loop.
  const autoRef   = useRef(autoStart);
  const mountedRef = useRef(true);
  const stateRef  = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Pick a consistent female browser voice (closest free match to the avatar's
  // voice) for the chosen language. Voices can load asynchronously.
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const want = lang === "hi" ? "hi" : "en";
    const female = /female|woman|samantha|victoria|karen|moira|tessa|fiona|serena|aria|jenny|zira|hazel|susan|kalpana|swara|neerja|veena|raveena|aditi|priya|heera/i;
    const pick = () => {
      const voices = synth.getVoices?.() || [];
      if (!voices.length) return;
      const byLang = voices.filter((v) => v.lang?.toLowerCase().startsWith(want));
      const pool = byLang.length ? byLang : voices;
      voiceRef.current =
        pool.find((v) => female.test(v.name)) ||
        pool.find((v) => /google/i.test(v.name)) ||
        byLang[0] || voices[0] || null;
    };
    pick();
    synth.addEventListener?.("voiceschanged", pick);
    return () => synth.removeEventListener?.("voiceschanged", pick);
  }, [lang]);

  const t = STRINGS[lang] || STRINGS.en;

  /* ── Browser-voice fallback (only if neural TTS fails) ──
     Keeps Vidya from going silent if /api/tts hiccups. Resolves when done. */
  const fallbackSpeak = (text) => new Promise((resolve) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return resolve();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === "hi" ? "hi-IN" : "en-US";
      if (voiceRef.current) u.voice = voiceRef.current;
      u.rate = 1; u.pitch = 1.05;
      u.onend = u.onerror = () => resolve();
      synth.speak(u);
    } catch { resolve(); }
  });

  /* ── Play ONE clip of speech in the clear neural voice ──
     `audioP` lets the caller pre-start the TTS fetch (so the next sentence is
     already downloading while the current one plays). Falls back to the browser
     voice if neural audio isn't available. Resolves when the clip finishes. */
  const playClip = (text, audioP) => new Promise((resolve) => {
    const s = (text || "").trim();
    if (!s) return resolve();
    let done = false;
    const fin = () => { if (done) return; done = true; resolve(); };
    (audioP || synthSpeech(s, lang)).then((url) => {
      if (!url) return fallbackSpeak(s).then(fin);
      const a = new Audio(url);
      audioRef.current = a;
      a.onended = a.onerror = () => { URL.revokeObjectURL(url); fin(); };
      a.play().catch(() => { URL.revokeObjectURL(url); fallbackSpeak(s).then(fin); });
    }).catch(() => fallbackSpeak(s).then(fin));
  });

  /* ── Speak a one-shot line (nav replies, session limit) in the neural voice ── */
  const speak = (text) => {
    setState("talking");
    clearTimeout(talkTimer.current);
    talkTimer.current = setTimeout(() => { setState("idle"); autoListen(); }, 20000);
    playClip(text).then(() => {
      clearTimeout(talkTimer.current);
      setState("idle");
      autoListen();
    });
  };

  /* ── Speak the model's reply as it STREAMS in ──
     Each complete sentence is sent for neural TTS the moment it arrives (fetches
     run in parallel) and played strictly in order, so Vidya starts talking well
     before the full answer is generated yet always sounds like one voice. The
     TALKING GIF shows from the first clip until the last one ends; a generous
     timer is a failsafe only, in case audio playback never fires its 'end'. */
  const startStreamingSpeech = () => {
    let pending = "";        // streamed text not yet split into a full sentence
    let outstanding = 0;     // sentences queued but not finished playing
    let chain = Promise.resolve(); // serializes playback into the right order
    let streamDone = false;
    let started = false;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(talkTimer.current);
      setState("idle");
      autoListen(); // hands-free: listen again after the reply
    };
    const settle = () => { if (streamDone && outstanding === 0) finish(); };
    // Failsafe so the talking GIF can't get stuck if an 'end' event is missed.
    const armFailsafe = () => {
      clearTimeout(talkTimer.current);
      talkTimer.current = setTimeout(finish, 25000);
    };

    const enqueue = (raw) => {
      const s = raw.trim();
      if (!s) return;
      outstanding++;
      if (!started) { started = true; setState("talking"); }
      armFailsafe();
      const audioP = synthSpeech(s, lang); // start fetching now (parallel)
      chain = chain
        .then(() => (finished ? null : playClip(s, audioP)))
        .then(() => {
          outstanding -= 1;
          if (!finished && outstanding > 0) armFailsafe();
          settle();
        });
    };

    // Speak any complete sentences sitting in `pending`; keep the trailing
    // fragment until more text (or the stream's end) completes it.
    const flush = (force) => {
      const re = /[^.!?।\n…]*[.!?।\n…]+/g;
      let m, last = 0;
      while ((m = re.exec(pending)) !== null) { enqueue(m[0]); last = re.lastIndex; }
      pending = pending.slice(last);
      if (force && pending.trim()) { enqueue(pending); pending = ""; }
    };

    return {
      onDelta: (delta) => { pending += delta; flush(false); },
      onDone: () => { streamDone = true; flush(true); settle(); },
      fail: finish,
      cancel: () => { finished = true; clearTimeout(talkTimer.current); },
    };
  };

  // Scroll to a section on the current page, else route to its page.
  const goTo = (tgt) => {
    for (const id of tgt.ids || []) {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        return true;
      }
    }
    if (tgt.path) { navigate(tgt.path); window.scrollTo({ top: 0 }); return true; }
    return false;
  };

  /* ── Hand the transcript to our model ── */
  const handleTranscript = async (transcript) => {
    if (!transcript?.trim()) { setState("idle"); return; }

    // A bare greeting ("hi Vidya", "hello", "namaste") gets a warm, instant
    // reply — no model call — then the hands-free loop keeps listening.
    if (isGreeting(transcript)) { speak(t.greet); return; }

    // Navigation commands are handled instantly, locally — no model call.
    const nav = matchNav(transcript);
    if (nav && goTo(nav)) {
      const label = lang === "hi" ? nav.labelHi : nav.label;
      speak(lang === "hi" ? `ज़रूर, आपको ${label} पर ले जा रही हूँ।` : `Sure, taking you to ${label}.`);
      return;
    }

    // Per-visitor usage cap (~4 min) to keep model cost low.
    if (!sessionStarted.current) {
      sessionStarted.current = true;
      setTimeout(() => { sessionExpired.current = true; }, SESSION_MS);
    }
    if (sessionExpired.current) {
      autoRef.current = false;          // stop the hands-free loop
      speak(t.limit);                   // say goodbye, no model call
      return;
    }

    setState("thinking");
    const speaker = startStreamingSpeech();
    speakerRef.current = speaker;
    let gotDelta = false;
    try {
      const { text } = await askOurModel(transcript, {
        lang,
        roleId: activeRoleId || "",
        onDelta: (d, full) => { gotDelta = true; speaker.onDelta(d, full); },
      });
      // Streaming spoke the reply sentence-by-sentence; just close it out.
      // If nothing streamed (error/fallback), speak the returned text in one shot.
      if (gotDelta) speaker.onDone();
      else speak(text);
    } catch {
      speaker.fail();
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

  // Resume listening shortly after a reply (or on mount), unless the user
  // tapped to stop. This keeps the conversation hands-free — no click needed.
  const autoListen = () => {
    clearTimeout(autoTimer.current);
    if (!autoRef.current) return;
    autoTimer.current = setTimeout(() => {
      if (autoRef.current && mountedRef.current && stateRef.current === "idle") {
        startListening();
      }
    }, 500);
  };

  const stopAll = () => {
    clearTimeout(talkTimer.current);
    clearTimeout(autoTimer.current);
    try { speakerRef.current?.cancel?.(); } catch { /* noop */ }
    speakerRef.current = null;
    try { recRef.current?.stop(); } catch { /* noop */ }
    try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
    try { audioRef.current?.pause(); } catch { /* noop */ }
    recRef.current = null;
    setState("idle");
  };

  const handleTap = () => {
    if (state === "idle") {
      autoRef.current = true;     // re-enable hands-free
      startListening();
    } else {
      autoRef.current = false;    // user wants quiet — stop the loop
      stopAll();
    }
  };

  // Auto-start when the circle takes over from Anam — but ONLY if the visitor
  // actually used Vidya. Otherwise it stays idle until the user taps.
  useEffect(() => {
    mountedRef.current = true;
    let id;
    if (autoStart) {
      id = setTimeout(() => {
        if (mountedRef.current && autoRef.current) startListening();
      }, 700);
    }
    return () => {
      mountedRef.current = false;
      clearTimeout(id);
      stopAll();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
