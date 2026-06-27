import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AuthModal from "../../components/AuthModal";
import Footer from "../../components/Footer";
import { useRole } from "../../hooks/useRole";
import { useLiveDocScan } from "../../hooks/useLiveDocScan";
import { quickEvaluate, NotHomeworkError, TYPE_META } from "../../lib/homeworkScanner";

const GRADIENT = "linear-gradient(135deg, #3B82F6 0%, #4F46E5 100%)";
const ACCENT = "#2563EB";
const PAINT_HEX = { azure: "#2563EB", mint: "#13B5A0", mauve: "#8E6FC4" };

const BOX_COLOR = { correct: "#1CA363", wrong: "#D6196F", review: "#DFA21F" };
const BOX_BG = {
  correct: "rgba(28,163,99,0.12)",
  wrong: "rgba(214,25,111,0.16)",
  review: "rgba(223,162,31,0.16)",
};

/**
 * Colour-coded answer overlays. Correct → green box, review → yellow box.
 * Wrong → a subtle box on the answer + a highlight & red UNDERLINE on the exact
 * wrong part (errorBox) so the student sees precisely where the mistake is.
 */
function BoxOverlay({ questions }) {
  return questions.map((q) => {
    if (!q.box) return null;
    if (q.status === "wrong" && q.errorBox) {
      const eb = q.errorBox;
      return (
        <div key={q.id} className="pointer-events-none absolute inset-0">
          <div
            className="absolute rounded-[3px] border"
            style={{
              left: `${q.box.x * 100}%`,
              top: `${q.box.y * 100}%`,
              width: `${q.box.w * 100}%`,
              height: `${q.box.h * 100}%`,
              borderColor: "rgba(214,25,111,0.45)",
            }}
          />
          <div
            className="absolute rounded-[2px]"
            style={{
              left: `${eb.x * 100}%`,
              top: `${eb.y * 100}%`,
              width: `${eb.w * 100}%`,
              height: `${eb.h * 100}%`,
              background: "rgba(214,25,111,0.22)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              left: `${eb.x * 100}%`,
              top: `${(eb.y + eb.h) * 100}%`,
              width: `${eb.w * 100}%`,
              height: "3px",
              background: BOX_COLOR.wrong,
              boxShadow: "0 0 5px rgba(214,25,111,0.85)",
            }}
          />
        </div>
      );
    }
    return (
      <div
        key={q.id}
        className="pointer-events-none absolute rounded-[3px] border-2"
        style={{
          left: `${q.box.x * 100}%`,
          top: `${q.box.y * 100}%`,
          width: `${q.box.w * 100}%`,
          height: `${q.box.h * 100}%`,
          borderColor: BOX_COLOR[q.status] || BOX_COLOR.review,
          background: BOX_BG[q.status] || "transparent",
        }}
      />
    );
  });
}

/** Compact mistake card with a "Fix with AI" editable draft. */
function MistakeCard({ flag }) {
  const type = TYPE_META[flag.type] ?? { label: flag.type, paint: "azure" };
  const isReview = flag.status === "review";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(flag.suggestedFix);
  const [saved, setSaved] = useState(false);

  return (
    <div className="rounded-2xl border border-line bg-paper p-4">
      <div className="flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
          style={{ background: PAINT_HEX[type.paint] ?? ACCENT }}
        >
          {type.label}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            isReview ? "bg-[#FBF3DD] text-paint-gold" : "bg-[#FBE3EC] text-paint-magenta"
          }`}
        >
          {isReview ? <AlertTriangle size={12} /> : <X size={12} />}
          {isReview ? "Could improve" : "Mistake"}
        </span>
      </div>
      <p className="mt-3 text-[14px] font-semibold text-ink">{flag.summary}</p>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-3">{flag.explanation}</p>

      {saved ? (
        <p className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-paint-grass">
          <CheckCircle2 size={15} /> Saved to a draft — your work isn't overwritten
        </p>
      ) : editing ? (
        <div className="mt-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-line-2 bg-page px-3 py-2 text-[13.5px] text-ink outline-none focus:ring-2 focus:ring-[#2563EB22]"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setSaved(true)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold text-white"
              style={{ background: GRADIENT }}
            >
              <CheckCircle2 size={14} /> Save draft
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded-lg border border-line-2 px-3 py-1.5 text-[12.5px] font-medium text-ink-3"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold text-white"
          style={{ background: GRADIENT }}
        >
          <Sparkles size={14} /> Help me fix this
        </button>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function LiveCheckPage() {
  const navigate = useNavigate();
  const { activeRoleId, selectRole } = useRole();
  const [authModal, setAuthModal] = useState(null);

  // phase: "scan" | "checking" | "result" | "help"
  const [phase, setPhase] = useState("scan");
  const [frozen, setFrozen] = useState(null); // snapshot under the highlights
  const [result, setResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (activeRoleId !== "student") selectRole("student");
  }, [activeRoleId, selectRole]);

  useEffect(() => {
    const prev = document.title;
    document.title = "Live Check — Classess";
    window.scrollTo({ top: 0 });
    return () => {
      document.title = prev;
    };
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  // Re-attach the stream whenever the live view mounts.
  useEffect(() => {
    if (phase !== "scan") return;
    const v = videoRef.current;
    if (v && streamRef.current && !v.srcObject) {
      v.srcObject = streamRef.current;
      v.play().catch(() => {});
    }
  }, [phase]);

  // Auto-evaluate the moment a full page is held steady (no clicking).
  const handleCapture = useCallback(({ dataUrl }) => {
    setFrozen(dataUrl);
    setPhase("checking");
    quickEvaluate(dataUrl)
      .then((res) => {
        setResult(res);
        setPhase("result");
      })
      .catch((err) => {
        if (!(err instanceof NotHomeworkError)) setCameraError(err?.message || "Couldn't read it.");
        setFrozen(null);
        setPhase("scan");
      });
  }, []);

  const { ready, pagePresent, progress } = useLiveDocScan({
    videoRef,
    active: phase === "scan",
    onCapture: handleCapture,
    minPageFrac: 0.42,
    stableMs: 600,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        if (!cancelled) {
          setCameraError(
            err?.name === "NotAllowedError"
              ? "Camera permission was blocked."
              : "No camera available on this device.",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cont = useCallback(() => {
    setResult(null);
    setFrozen(null);
    setPhase("scan");
  }, []);

  const flags = result?.flags ?? [];
  const counts = result?.counts;
  const hasMistakes = flags.length > 0;
  const authOpen = authModal !== null;

  return (
    <div className="min-h-screen bg-page">
      <div
        className="transition-[filter] duration-200"
        style={authOpen ? { filter: "blur(4px)" } : undefined}
        aria-hidden={authOpen}
      >
        <Navbar onOpenAuth={(mode, pos) => setAuthModal({ mode, pos })} />

        <main className="mx-auto max-w-3xl px-6 pb-24 pt-28 md:px-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-4 transition-colors hover:text-ink"
          >
            <ArrowLeft size={15} /> Student Home
          </button>

          <header className="mt-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
              Live Check
            </p>
            <h1 className="mt-2 text-3xl font-serif font-medium leading-tight tracking-tight text-ink md:text-4xl">
              Show your page — it checks it live.
            </h1>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-3">
              Hold your homework up to the camera. It reads and marks it automatically — green for
              correct, red for mistakes, yellow to improve. No button to press.
            </p>
          </header>

          {/* Stage */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-black">
            <div className="relative w-full" style={{ minHeight: 320 }}>
              {/* Live camera */}
              {phase === "scan" && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={(e) => e.currentTarget.play().catch(() => {})}
                  className="block w-full"
                />
              )}

              {/* Frozen snapshot with highlights */}
              {phase !== "scan" && frozen && (
                <div className="relative w-full">
                  <img src={frozen} alt="Your page" className="block w-full" />
                  {phase === "result" && <BoxOverlay questions={result.questions} />}
                  {phase === "checking" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 backdrop-blur-[1px]">
                      <Loader2 size={26} className="animate-spin text-white" />
                      <p className="text-[14px] font-semibold text-white">Checking your work…</p>
                    </div>
                  )}
                </div>
              )}

              {/* Scan status bar */}
              {phase === "scan" && (
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white transition-[width] duration-150"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-medium text-white/80">
                    {cameraError
                      ? cameraError
                      : !ready
                        ? "Starting camera…"
                        : !pagePresent
                          ? "Show your page"
                          : progress > 0
                            ? "Hold steady…"
                            : "Hold the page up"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Result bar */}
          <AnimatePresence>
            {phase === "result" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl border border-line bg-paper p-4"
              >
                <div className="flex flex-wrap items-center gap-2 text-[13px]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F5EE] px-3 py-1 font-medium text-paint-grass">
                    <CheckCircle2 size={14} /> {counts.correct} correct
                  </span>
                  {counts.wrong > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBE3EC] px-3 py-1 font-medium text-paint-magenta">
                      <X size={14} /> {counts.wrong} to fix
                    </span>
                  )}
                  {counts.review > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF3DD] px-3 py-1 font-medium text-paint-gold">
                      <AlertTriangle size={14} /> {counts.review} to improve
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  {hasMistakes ? (
                    <>
                      <button
                        onClick={() => setPhase("help")}
                        className="inline-flex flex-[1.3] items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-white"
                        style={{ background: GRADIENT }}
                      >
                        <HelpCircle size={17} /> Can I help you?
                      </button>
                      <button
                        onClick={cont}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-line-2 bg-page px-5 py-3 text-[14px] font-semibold text-ink-2 hover:bg-paper"
                      >
                        Continue <ArrowRight size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={cont}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-white"
                      style={{ background: "linear-gradient(135deg, #22C55E 0%, #1CA363 100%)" }}
                    >
                      <CheckCircle2 size={17} /> All correct — Continue
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {phase === "help" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-semibold text-ink">Let's fix these together</h2>
                  <button
                    onClick={cont}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-line-2 bg-page px-4 py-2 text-[13px] font-semibold text-ink-2 hover:bg-paper"
                  >
                    Continue <ArrowRight size={15} />
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {flags.map((flag) => (
                    <MistakeCard key={flag.id} flag={flag} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AuthModal
        open={authOpen}
        mode={authModal?.mode ?? "signin"}
        position={authModal?.pos ?? null}
        initialRoleId="student"
        onClose={() => setAuthModal(null)}
        onSelectRole={(roleId) => {
          selectRole(roleId);
          setAuthModal(null);
          navigate("/");
        }}
      />

      <Footer />
    </div>
  );
}
