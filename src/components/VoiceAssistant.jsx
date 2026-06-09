import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@anam-ai/js-sdk";
import { Mic, MicOff, Phone, Loader2, X } from "lucide-react";

const VIDEO_ID = "anam-avatar-video";

const EVT_VIDEO_PLAY_STARTED = "VIDEO_PLAY_STARTED";
const EVT_CONNECTION_CLOSED  = "CONNECTION_CLOSED";
const EVT_SESSION_READY      = "SESSION_READY";
const EVT_MSG_HISTORY        = "MESSAGE_HISTORY_UPDATED";


// ─── Section navigation map ───────────────────────────────────────────────────
// Student sub-sections are listed first so they win over the generic "student" card entry.
// Keywords use multi-word phrases where possible to avoid false matches on common words.
const SECTION_MAP = [
  // ── Student sub-sections ─────────────────────────────────────────────────
  {
    id: "student-overview",
    label: "Features Overview",
    // Use full phrases only — bare "back" would match "take me back to concepts"
    keywords: [
      "go back", "back to main", "back to overview", "back to features",
      "all features", "show all features", "feature overview", "features overview",
      "main section", "show features", "start over",
    ],
  },
  {
    id: "student-hero",
    label: "Learning Path",
    keywords: [
      "learning path", "my path", "personalised", "personalized",
      "daily goal", "what to learn", "learning goal", "study plan",
      "student hero",
    ],
  },
  {
    id: "how-it-helps",
    label: "How It Helps",
    keywords: [
      "how it helps", "how it works", "transformation", "benefits",
      "why classess", "what does it do",
    ],
  },
  {
    id: "concepts",
    label: "Concept Understanding",
    keywords: [
      "concept", "concepts", "concept understanding",
      "understand concepts", "explain concepts", "theory",
    ],
  },
  {
    id: "practice",
    label: "Purposeful Practice",
    keywords: [
      "practice", "purposeful practice", "practice exercises",
      "exercises", "drill", "drills",
    ],
  },
  {
    id: "exam-prep",
    label: "Exam Preparation",
    keywords: [
      "exam", "exam prep", "exam preparation", "exams",
      "test prep", "study for exam", "learning gaps", "syllabus",
    ],
  },
  {
    id: "progress",
    label: "Progress Tracking",
    keywords: [
      "progress", "progress tracking", "my progress",
      "how am i doing", "improvement", "insights", "stats",
    ],
  },
  {
    id: "ai-tutor",
    label: "AI Tutor",
    keywords: [
      "ai tutor", "a.i. tutor", "artificial intelligence tutor",
      "independent learning", "smart tutor", "ai assistant",
    ],
  },
  {
    id: "faq",
    label: "FAQ",
    keywords: [
      "faq", "frequently asked", "common questions",
      "frequently asked questions",
    ],
  },
  // ── Landing-page sections ─────────────────────────────────────────────────
  {
    id: "products",
    label: "Products",
    keywords: ["products", "product", "what you offer"],
  },
  {
    id: "features",
    label: "Features",
    keywords: ["what can it do", "capabilities"],
  },
  {
    id: "about",
    label: "About",
    keywords: ["about", "who are you", "your team", "tell me about"],
  },
  {
    id: "contact",
    label: "Contact",
    keywords: ["contact", "reach you", "get in touch", "talk to someone"],
  },
  {
    id: "student",
    label: "Students",
    keywords: [
      "student", "students", "online course",
      "i am a student", "for students",
    ],
  },
  {
    id: "tutor",
    label: "Tutors",
    keywords: [
      "tutor", "teacher", "teach", "blended", "manage students",
      "i am a tutor", "for tutors",
    ],
  },
  {
    id: "college",
    label: "Colleges",
    keywords: [
      "college", "institute", "institution", "university",
      "admission", "curricula", "for colleges", "i am a college",
    ],
  },
];

// IDs that live inside StudentHome and only exist in the DOM when the student page is open.
const STUDENT_SUB_IDS = new Set([
  "student-overview", "student-hero", "how-it-helps",
  "concepts", "practice", "exam-prep", "progress", "ai-tutor", "faq",
]);

const NAV_TRIGGERS = [
  "show me", "take me", "go to", "navigate", "scroll to",
  "where is", "find the", "open", "visit", "check out",
  "i want to see", "i am a", "for students", "for tutors", "for colleges",
  "go back", "back to",
];

const ROLE_CARD_IDS  = new Set(["student", "tutor", "college"]);
const NAVBAR_HEIGHT  = 64;

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  return true;
}

function navigateToSection(transcript, client) {
  const lower = transcript.toLowerCase().trim();

  for (const section of SECTION_MAP) {
    if (section.keywords.some((kw) => lower.includes(kw))) {
      // Role-card sections: click the card to open the page first.
      if (ROLE_CARD_IDS.has(section.id)) {
        document.getElementById(section.id)?.click();
      }

      const scrolled = scrollToId(section.id);

      if (scrolled) {
        // Element found — scroll happened.
        if (section.id === "student-overview") {
          client.talk("Sure! Taking you back to the features overview.");
        } else {
          client.talk(`Sure! I've taken you to the ${section.label} section.`);
        }
        return;
      }

      // Element not in DOM yet — for student sub-sections, open the student page
      // first, then scroll to the target after it has rendered.
      if (STUDENT_SUB_IDS.has(section.id)) {
        const studentCard = document.getElementById("student");
        if (studentCard) {
          studentCard.click(); // opens StudentPage
          const targetId = section.id;
          const label    = section.label;
          client.talk(`Sure! Opening the student section and taking you to ${label}.`);
          // Wait for the student page to mount before scrolling.
          setTimeout(() => scrollToId(targetId), 1400);
          return;
        }
      }

      // Element genuinely missing — tell the user.
      client.talk(
        `I couldn't find the ${section.label} section right now. ` +
        "Please make sure the student page is open and try again."
      );
      return;
    }
  }

  const hasNavIntent = NAV_TRIGGERS.some((t) => lower.includes(t));
  if (hasNavIntent) {
    client.talk(
      "I can take you to Products, Features, About, or Contact. " +
      "If you're in the student section I can also open Learning Path, Concept Understanding, " +
      "Practice, Exam Preparation, Progress Tracking, or the AI Tutor. Which one would you like?"
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default function VoiceAssistant() {
  const [status,    setStatus]    = useState("idle"); // idle | connecting | live | error
  const [muted,     setMuted]     = useState(false);
  const [error,     setError]     = useState(null);
  const [idleMedia, setIdleMedia] = useState(null);  // { videoUrl, imageUrl }

  const clientRef         = useRef(null);
  const lastUserMsgRef    = useRef(null);
  const pendingMessageRef = useRef(null); // spoken by Vidya once session is live
  const statusRef         = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);

  // Listen for section-entered events fired by page sections.
  // If live → speak immediately. If idle → queue the message and auto-start.
  useEffect(() => {
    const handler = (e) => {
      const { message } = e.detail ?? {};
      if (!message) return;
      if (statusRef.current === "live" && clientRef.current) {
        clientRef.current.talk(message);
      } else if (statusRef.current === "idle") {
        pendingMessageRef.current = message;
        start();
      }
    };
    window.addEventListener("vidya:section-entered", handler);
    return () => window.removeEventListener("vidya:section-entered", handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch the avatar's idling video URL on mount (signed URL, fresh each load).
  useEffect(() => {
    fetch("/api/anam-avatar")
      .then((r) => r.json())
      .then((d) => { if (d.videoUrl || d.imageUrl) setIdleMedia(d); })
      .catch(() => {});
  }, []);

  // Wake-word listener: auto-starts the session when "vidya" is heard while idle.
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || status !== "idle") return;

    const recognition = new SR();
    recognition.continuous     = true;
    recognition.interimResults = true;
    recognition.lang           = "en-US";

    let triggered = false;

    recognition.onresult = (e) => {
      if (triggered) return;
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ")
        .toLowerCase();
      if (transcript.includes("vidya")) {
        triggered = true;
        recognition.stop();
        start();
      }
    };

    recognition.onerror = () => {};

    // Restart on silence so the listener stays alive.
    recognition.onend = () => {
      if (!triggered) {
        try { recognition.start(); } catch { /* already started */ }
      }
    };

    try { recognition.start(); } catch { /* mic not available yet */ }

    return () => {
      triggered = true;          // prevents restart in onend
      recognition.onend = null;
      try { recognition.stop(); } catch {}
    };
  }, [status]); // stops when status leaves "idle", restarts when it returns

  const stop = async () => {
    try { await clientRef.current?.stopStreaming(); } catch { /* already stopped */ }
    clientRef.current      = null;
    lastUserMsgRef.current = null;
    setStatus("idle");
    setMuted(false);
    // Refresh the idle video URL — the signed URL expires after 1 hour.
    fetch("/api/anam-avatar")
      .then((r) => r.json())
      .then((d) => { if (d.videoUrl || d.imageUrl) setIdleMedia(d); })
      .catch(() => {});
  };

  useEffect(() => {
    return () => { clientRef.current?.stopStreaming().catch(() => {}); };
  }, []);

  const start = async () => {
    if (status === "connecting" || status === "live") return;
    setStatus("connecting");
    setError(null);
    try {
      const res = await fetch("/api/anam-session-token", { method: "POST" });
      if (!res.ok) throw new Error(`Token request failed (${res.status})`);
      const { sessionToken } = await res.json();
      if (!sessionToken) throw new Error("No session token returned");

      const client = createClient(sessionToken);
      clientRef.current = client;

      client.addListener(EVT_VIDEO_PLAY_STARTED, () => {
        setStatus("live");
        if (pendingMessageRef.current) {
          const msg = pendingMessageRef.current;
          pendingMessageRef.current = null;
          // Small delay so the avatar settles before speaking.
          setTimeout(() => clientRef.current?.talk(msg), 800);
        }
      });
      client.addListener(EVT_CONNECTION_CLOSED,  () => stop());

      client.addListener(EVT_SESSION_READY, () => {
        client.addListener(EVT_MSG_HISTORY, (messages) => {
          const userMsgs = messages.filter((m) => m.role === "user");
          const latest   = userMsgs[userMsgs.length - 1];
          if (latest && latest.id !== lastUserMsgRef.current) {
            lastUserMsgRef.current = latest.id;
            navigateToSection(latest.content, clientRef.current);
          }
        });
      });

      await client.streamToVideoElement(VIDEO_ID);
    } catch (err) {
      setError(err.message || "Could not start the assistant");
      setStatus("error");
      clientRef.current = null;
    }
  };

  const toggleMute = () => {
    const client = clientRef.current;
    if (!client) return;
    if (muted) { client.unmuteInputAudio(); setMuted(false); }
    else        { client.muteInputAudio();  setMuted(true);  }
  };

  const isIdle = status === "idle";

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-[90] w-[220px] overflow-hidden rounded-2xl ${
        isIdle ? "cursor-pointer" : ""
      }`}
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={isIdle ? start : undefined}
    >
      {/* ── Avatar video area (no card, no background) ─────────────── */}
      <div className="relative aspect-[3/4]">

        {/* Real Anam stream — always in DOM so SDK can attach */}
        <video
          id={VIDEO_ID}
          autoPlay
          playsInline
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            status === "live" ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
        />

        {/* ── Idle: looping avatar video ── */}
        {isIdle && (
          <div className="absolute inset-0">
            {idleMedia?.videoUrl ? (
              <video
                src={idleMedia.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            ) : idleMedia?.imageUrl ? (
              <img
                src={idleMedia.imageUrl}
                alt="Vidya"
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #0f172a 100%)",
                }}
              />
            )}

            {/* "Talk to Vidya" overlay at the bottom */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 bg-gradient-to-t from-black/65 via-black/5 to-transparent">
              <motion.div
                className="flex flex-col items-center gap-2"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/30">
                  <Mic size={18} className="text-white" />
                </div>
                <span className="text-[12px] font-semibold text-white/90 tracking-wide">
                  Talk to Vidya
                </span>
              </motion.div>
            </div>
          </div>
        )}

        {/* ── Connecting ── */}
        {status === "connecting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-900">
            <Loader2 size={26} className="animate-spin text-white" />
            <p className="text-[12px] text-neutral-300">Connecting…</p>
          </div>
        )}

        {/* ── Error ── */}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-900">
            <X size={26} className="text-red-400" />
            <p className="px-5 text-center text-[12px] text-neutral-300">{error}</p>
            <button
              onClick={(e) => { e.stopPropagation(); start(); }}
              className="mt-1 rounded-lg bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-white/20"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Live badge (top-left) ── */}
        {status === "live" && (
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[10px] font-semibold text-white">Live</span>
          </div>
        )}

        {/* ── Active controls overlay (bottom) ── */}
        {(status === "live" || status === "connecting") && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 px-3 pb-3 pt-8 bg-gradient-to-t from-black/60 to-transparent">
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              disabled={status !== "live"}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-colors hover:bg-white/30 disabled:opacity-40"
            >
              {muted ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); stop(); }}
              aria-label="End conversation"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
            >
              <Phone size={15} className="rotate-[135deg]" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
