import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  ArrowLeft,
  Upload,
  Sparkles,
  Send,
  Pencil,
  Trash2,
  GraduationCap,
  FileCheck2,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AuthModal from "../../components/AuthModal";
import Footer from "../../components/Footer";
import { useRole } from "../../hooks/useRole";
import { useLiveDocScan } from "../../hooks/useLiveDocScan";
import {
  evaluatePage,
  NotHomeworkError,
  CONFIDENCE_THRESHOLD,
  TYPE_META,
} from "../../lib/homeworkScanner";

const GRADIENT = "linear-gradient(135deg, #3B82F6 0%, #4F46E5 100%)";
const ACCENT = "#2563EB";
const PAINT_HEX = { azure: "#2563EB", mint: "#13B5A0", mauve: "#8E6FC4" };

/* Box colours by answer status: green = correct, red = wrong, yellow = review. */
const BOX_COLOR = { correct: "#1CA363", wrong: "#D6196F", review: "#DFA21F" };
const BOX_BG = {
  correct: "rgba(28,163,99,0.12)",
  wrong: "rgba(214,25,111,0.15)",
  review: "rgba(223,162,31,0.15)",
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

function LegendDot({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}

/** Full-screen page viewer with the colour-coded mistake boxes. */
function PageViewer({ page, index, onClose }) {
  const questions = page.result?.questions ?? [];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex flex-col bg-black/85"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 text-white">
        <span className="text-[15px] font-semibold">Page {index + 1}</span>
        <div className="hidden items-center gap-4 text-[12px] text-white/85 sm:flex">
          <LegendDot color={BOX_COLOR.wrong} label="Wrong" />
          <LegendDot color={BOX_COLOR.review} label="Review" />
          <LegendDot color={BOX_COLOR.correct} label="Correct" />
        </div>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium hover:bg-white/20"
        >
          <X size={15} /> Close
        </button>
      </div>
      <div className="flex-1 overflow-auto px-4 pb-8">
        <div className="relative mx-auto max-w-3xl">
          <img src={page.image} alt={`Page ${index + 1}`} className="block w-full rounded-lg" />
          <BoxOverlay questions={questions} />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Confidence + mistake card ───────────────────────────────────────── */

function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100);
  const ok = value >= CONFIDENCE_THRESHOLD;
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wide text-ink-4">
        <span>Confidence</span>
        <span className={ok ? "text-ink-2" : "text-paint-gold"}>{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: ok ? ACCENT : "#DFA21F" }}
        />
      </div>
    </div>
  );
}

function FlagCard({ flag, onFix, onSubmit, decision }) {
  const type = TYPE_META[flag.type] ?? { label: flag.type, paint: "azure" };
  const isReview = flag.status === "review";
  const [draft, setDraft] = useState(flag.suggestedFix);
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-2xl border border-line bg-paper p-4">
      <div className="flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
          style={{ background: PAINT_HEX[type.paint] ?? ACCENT }}
        >
          {type.label}
        </span>
        {isReview ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FBF3DD] px-2.5 py-0.5 text-[11px] font-semibold text-paint-gold">
            <AlertTriangle size={12} /> Review only
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FBE3EC] px-2.5 py-0.5 text-[11px] font-semibold text-paint-magenta">
            <X size={12} /> Mistake
          </span>
        )}
      </div>

      <p className="mt-3 text-[14px] font-semibold text-ink">{flag.summary}</p>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-3">{flag.explanation}</p>
      <ConfidenceBar value={flag.confidence} />

      <div className="mt-3 flex items-start gap-1.5 text-[12px] text-ink-4">
        <ScanLine size={13} className="mt-0.5 shrink-0" />
        <span>
          <span className="font-medium text-ink-3">{flag.source.label}</span>
          {flag.source.detail ? ` — ${flag.source.detail}` : ""}
        </span>
      </div>

      {decision ? (
        <div className="mt-4 flex items-center gap-2 text-[13px] font-medium text-paint-grass">
          <CheckCircle2 size={15} />
          {decision === "fixed" ? "Fix applied to a draft" : "Kept as-is"}
        </div>
      ) : (
        <div className="mt-4">
          {editing ? (
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wide text-ink-4">
                Editable draft — your work is never overwritten
              </label>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                className="mt-1 w-full resize-none rounded-lg border border-line-2 bg-page px-3 py-2 text-[13.5px] text-ink outline-none focus:ring-2 focus:ring-[#2563EB22]"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onFix(draft)}
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
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold text-white"
                style={{ background: GRADIENT }}
              >
                <Sparkles size={14} /> Fix with AI
              </button>
              <button
                onClick={onSubmit}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line-2 bg-page px-3 py-1.5 text-[12.5px] font-medium text-ink-2"
              >
                <Send size={13} /> Keep as-is
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Page-tile in the results list ───────────────────────────────────── */
function PageResult({ page, index, mode, decisions, onFix, onSubmit, onOpen }) {
  const flags = page.result?.flags ?? [];
  const counts = page.result?.counts;
  const ready = page.status === "ready" && page.image;
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-page">
      <div className="flex gap-4 p-4">
        <button
          onClick={ready ? onOpen : undefined}
          className={`group relative w-24 shrink-0 overflow-hidden rounded-lg border border-line ${
            ready ? "cursor-zoom-in" : "cursor-default"
          }`}
        >
          {page.image ? (
            <>
              <img src={page.image} alt={`Page ${index + 1}`} className="block w-full" />
              {ready && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                  Tap to view
                </span>
              )}
            </>
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center bg-mist">
              <Loader2 size={18} className="animate-spin text-ink-4" />
            </div>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-semibold text-ink">Page {index + 1}</p>
            <span className="font-mono text-[11px] uppercase tracking-wide text-ink-4">
              {page.result?.subjectLabel || ""}
            </span>
          </div>
          {page.status === "ready" && counts ? (
            <div className="mt-2 flex flex-wrap gap-2 text-[12.5px]">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E4F5EE] px-2.5 py-0.5 font-medium text-paint-grass">
                <CheckCircle2 size={13} /> {counts.correct} correct
              </span>
              {counts.wrong > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FBE3EC] px-2.5 py-0.5 font-medium text-paint-magenta">
                  <X size={13} /> {counts.wrong} to fix
                </span>
              )}
              {counts.review > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FBF3DD] px-2.5 py-0.5 font-medium text-paint-gold">
                  <AlertTriangle size={13} /> {counts.review} to review
                </span>
              )}
            </div>
          ) : page.status === "error" ? (
            <p className="mt-2 text-[13px] text-paint-magenta">Couldn't read this page.</p>
          ) : (
            <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-ink-3">
              <Loader2 size={14} className="animate-spin" /> Evaluating…
            </p>
          )}

          {/* Review mode: brief mistake summaries */}
          {mode === "review" && page.status === "ready" && flags.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {flags.map((f) => (
                <li key={f.id} className="flex items-start gap-2 text-[13px] text-ink-2">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: f.status === "wrong" ? "#D6196F" : "#DFA21F" }}
                  />
                  {f.summary}
                </li>
              ))}
            </ul>
          )}
          {mode === "review" && page.status === "ready" && flags.length === 0 && (
            <p className="mt-3 text-[13px] font-medium text-paint-grass">No mistakes on this page ✓</p>
          )}
        </div>
      </div>

      {/* Rectify mode: full fixable cards */}
      {mode === "rectify" && page.status === "ready" && flags.length > 0 && (
        <div className="space-y-3 border-t border-line bg-paper p-4">
          {flags.map((flag) => {
            const key = `${page.id}:${flag.id}`;
            return (
              <FlagCard
                key={key}
                flag={flag}
                decision={decisions[key]}
                onFix={() => onFix(key)}
                onSubmit={() => onSubmit(key)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function HomeworkScannerPage() {
  const navigate = useNavigate();
  const { activeRoleId, selectRole } = useRole();
  const [authModal, setAuthModal] = useState(null);

  // phase: "intro" | "scanning" | "results"
  const [phase, setPhase] = useState("intro");
  const [cameraError, setCameraError] = useState(null);
  const [pages, setPages] = useState([]); // { id, raw, image, status, result }
  const [flash, setFlash] = useState(false); // brief "captured" pulse
  const [mode, setMode] = useState("review"); // results: "review" | "rectify"
  const [submitted, setSubmitted] = useState(false);
  const [decisions, setDecisions] = useState({}); // `${pageId}:${flagId}` -> "fixed" | "kept"
  const [viewerIndex, setViewerIndex] = useState(null); // open page in full viewer

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const resetCooldownRef = useRef(null);
  const flashTimer = useRef(null);

  useEffect(() => {
    if (activeRoleId !== "student") selectRole("student");
  }, [activeRoleId, selectRole]);

  useEffect(() => {
    const prev = document.title;
    document.title = "Homework Scanner — Classess";
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

  useEffect(() => {
    if (phase !== "scanning") return;
    const v = videoRef.current;
    if (v && streamRef.current && !v.srcObject) {
      v.srcObject = streamRef.current;
      v.play().catch(() => {});
    }
  }, [phase]);

  // Evaluate one captured page in the background (read → crop → enhance).
  const evaluateInBackground = useCallback(async (id, raw) => {
    try {
      const res = await evaluatePage(raw); // 3-agent pipeline: detect → crop → mark → verify
      setPages((ps) =>
        ps.map((p) => (p.id === id ? { ...p, image: res.image, result: res, status: "ready" } : p)),
      );
    } catch (err) {
      if (err instanceof NotHomeworkError) {
        setPages((ps) => ps.filter((p) => p.id !== id)); // not a page → drop it
      } else {
        setPages((ps) =>
          ps.map((p) => (p.id === id ? { ...p, status: "error", error: err?.message } : p)),
        );
      }
    }
  }, []);

  // A page was captured (steady hold or manual). Save it + evaluate in background.
  const handleCapture = useCallback(
    ({ dataUrl }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setPages((ps) => [...ps, { id, raw: dataUrl, image: dataUrl, status: "processing" }]);
      setFlash(true);
      clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlash(false), 900);
      evaluateInBackground(id, dataUrl);
    },
    [evaluateInBackground],
  );

  const { ready: scanReady, pagePresent, progress, captureNow, resetCooldown } = useLiveDocScan({
    videoRef,
    active: phase === "scanning",
    onCapture: handleCapture,
    minPageFrac: 0.45, // only snap when the page is shown reasonably full
  });
  useEffect(() => {
    resetCooldownRef.current = resetCooldown;
  }, [resetCooldown]);

  const startScanning = useCallback(
    async (reset = true) => {
      setCameraError(null);
      if (reset) {
        setPages([]);
        setDecisions({});
        setSubmitted(false);
        setMode("review");
      }
      setPhase("scanning");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        setCameraError(
          err?.name === "NotAllowedError"
            ? "Camera permission was blocked. You can upload photos instead."
            : "No camera available here. Upload photos of your homework instead.",
        );
      }
    },
    [],
  );

  const onUpload = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
          const url = String(reader.result);
          setPages((ps) => [...ps, { id, raw: url, image: url, status: "processing" }]);
          evaluateInBackground(id, url);
        };
        reader.readAsDataURL(file);
      });
      setPhase("scanning"); // show the strip; they can add more or Evaluate
      e.target.value = "";
    },
    [evaluateInBackground],
  );

  const removePage = useCallback((id) => setPages((ps) => ps.filter((p) => p.id !== id)), []);

  const goEvaluate = useCallback(() => {
    stopCamera();
    setMode("review");
    setSubmitted(false);
    setPhase("results");
  }, [stopCamera]);

  const cancelScanning = useCallback(() => {
    stopCamera();
    setPages([]);
    setPhase("intro");
  }, [stopCamera]);

  const setDecision = (key, val) => setDecisions((d) => ({ ...d, [key]: val }));

  const authOpen = authModal !== null;

  // Aggregate counts for the results header.
  const ready = pages.filter((p) => p.status === "ready");
  const pending = pages.filter((p) => p.status === "processing").length;
  const totals = ready.reduce(
    (a, p) => {
      const c = p.result?.counts;
      if (c) {
        a.correct += c.correct;
        a.wrong += c.wrong;
        a.review += c.review;
      }
      return a;
    },
    { correct: 0, wrong: 0, review: 0 },
  );
  const totalFlags = totals.wrong + totals.review;

  return (
    <div className="min-h-screen bg-page">
      <div
        className="transition-[filter] duration-200"
        style={authOpen ? { filter: "blur(4px)" } : undefined}
        aria-hidden={authOpen}
      >
        <Navbar onOpenAuth={(mode_, pos) => setAuthModal({ mode: mode_, pos })} />

        <main className="mx-auto max-w-6xl px-6 pb-24 pt-28 md:px-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-4 transition-colors hover:text-ink"
          >
            <ArrowLeft size={15} /> Student Home
          </button>

          <header className="mt-5 max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
              Homework Scanner
            </p>
            <h1 className="mt-2 text-3xl font-serif font-medium leading-tight tracking-tight text-ink md:text-4xl">
              Scan every page. Evaluate when you're ready.
            </h1>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-3">
              Show each page — it captures just the paper and saves it in order while quietly
              checking it in the background. Scan as many pages as you like, then tap{" "}
              <span className="font-medium text-ink-2">Evaluate</span> to see everything at once.
            </p>
          </header>

          {/* ── INTRO ─────────────────────────────────────────────────── */}
          {phase === "intro" && (
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="relative overflow-hidden rounded-3xl border border-line bg-panel">
                <div className="relative aspect-[4/3] w-full">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                      <Camera size={30} className="text-white/80" />
                    </div>
                    <p className="max-w-xs text-[14px] text-white/60">
                      Start the camera and show your pages one by one — or upload photos.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-line bg-paper p-6">
                <h2 className="text-[17px] font-semibold text-ink">Start scanning</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-3">
                  Hold each page steady — it snaps automatically and crops to just the page. Nothing
                  is graded until you press Evaluate.
                </p>
                <button
                  onClick={() => startScanning(true)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold text-white"
                  style={{ background: GRADIENT }}
                >
                  <Camera size={18} /> Start camera
                </button>
                <label className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line-2 bg-page px-5 py-3 text-[15px] font-semibold text-ink-2 transition-colors hover:bg-paper">
                  <Upload size={17} /> Upload photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onUpload}
                  />
                </label>
                {cameraError && <p className="mt-3 text-[13px] text-paint-magenta">{cameraError}</p>}
              </div>
            </div>
          )}

          {/* ── SCANNING ──────────────────────────────────────────────── */}
          {phase === "scanning" && (
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
              {/* Camera */}
              <div className="relative overflow-hidden rounded-3xl border border-line bg-black">
                <div className="relative w-full" style={{ minHeight: 300 }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={(e) => e.currentTarget.play().catch(() => {})}
                    className="block w-full"
                  />
                  <AnimatePresence>
                    {flash && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/30"
                      >
                        <span className="inline-flex items-center gap-2 rounded-full bg-paint-grass px-4 py-2 text-[14px] font-semibold text-white shadow-lg">
                          <CheckCircle2 size={17} /> Page {pages.length} saved
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10">
                    <ScanLine size={18} className="text-white/80" />
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white transition-[width] duration-150"
                        style={{ width: `${Math.round(progress * 100)}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-medium text-white/80">
                      {!scanReady
                        ? "Starting camera…"
                        : !pagePresent
                          ? "Show the full page"
                          : progress > 0
                            ? "Hold steady…"
                            : "Hold the page steady"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls + saved pages */}
              <div className="flex flex-col rounded-3xl border border-line bg-paper p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[17px] font-semibold text-ink">
                    {pages.length} page{pages.length === 1 ? "" : "s"} saved
                  </h2>
                  {pending > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-4">
                      <Loader2 size={13} className="animate-spin" /> checking {pending}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-3">
                  Move to the next page when you're done — each one is saved and checked quietly in
                  the background.
                </p>

                {/* Thumbnail strip */}
                <div className="mt-4 flex min-h-[5.5rem] flex-wrap gap-2">
                  {pages.length === 0 && (
                    <p className="text-[13px] text-ink-4">No pages yet — show your first page.</p>
                  )}
                  {pages.map((p, i) => (
                    <div key={p.id} className="relative">
                      <img
                        src={p.image}
                        alt={`Page ${i + 1}`}
                        className="h-20 w-16 rounded-md object-cover ring-1 ring-line"
                      />
                      <span className="absolute left-1 top-1 rounded bg-black/60 px-1 text-[10px] font-semibold text-white">
                        {i + 1}
                      </span>
                      {p.status === "processing" && (
                        <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40">
                          <Loader2 size={15} className="animate-spin text-white" />
                        </span>
                      )}
                      <button
                        onClick={() => removePage(p.id)}
                        aria-label={`Remove page ${i + 1}`}
                        className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-auto space-y-2 pt-5">
                  <button
                    onClick={captureNow}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line-2 bg-page px-5 py-2.5 text-[14px] font-semibold text-ink-2"
                  >
                    <Camera size={16} /> Capture this page now
                  </button>
                  <button
                    onClick={goEvaluate}
                    disabled={pages.length === 0}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold text-white disabled:opacity-50"
                    style={{ background: GRADIENT }}
                  >
                    <FileCheck2 size={18} /> Evaluate {pages.length || ""} page
                    {pages.length === 1 ? "" : "s"}
                  </button>
                  <button
                    onClick={cancelScanning}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-[13.5px] font-medium text-ink-4 hover:text-ink"
                  >
                    <X size={15} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── RESULTS ───────────────────────────────────────────────── */}
          {phase === "results" && (
            <div className="mt-8">
              {/* Summary */}
              <div className="rounded-2xl border border-line bg-paper p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wide text-ink-4">
                      {pages.length} page{pages.length === 1 ? "" : "s"}
                      {pending > 0 ? ` · evaluating ${pending}…` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[13px]">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F5EE] px-3 py-1 font-medium text-paint-grass">
                        <CheckCircle2 size={14} /> {totals.correct} correct
                      </span>
                      {totals.wrong > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBE3EC] px-3 py-1 font-medium text-paint-magenta">
                          <X size={14} /> {totals.wrong} to fix
                        </span>
                      )}
                      {totals.review > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF3DD] px-3 py-1 font-medium text-paint-gold">
                          <AlertTriangle size={14} /> {totals.review} to review
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => startScanning(false)}
                    className="inline-flex items-center gap-2 rounded-xl border border-line-2 bg-page px-4 py-2 text-[13.5px] font-semibold text-ink-2 hover:bg-paper"
                  >
                    <Camera size={15} /> Scan more
                  </button>
                </div>

                {/* Two exits */}
                {!submitted && (
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => setSubmitted(true)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-line-2 bg-page px-5 py-3 text-[14px] font-semibold text-ink-2 hover:bg-paper"
                    >
                      <Send size={16} /> Submit with mistakes
                    </button>
                    <button
                      onClick={() => setMode("rectify")}
                      className="inline-flex flex-[1.3] items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-white"
                      style={{ background: GRADIENT }}
                    >
                      <GraduationCap size={17} /> Learn &amp; rectify {totalFlags > 0 ? `(${totalFlags})` : ""}
                    </button>
                  </div>
                )}
                {submitted && (
                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#E4F5EE] px-4 py-3 text-[14px] font-medium text-paint-grass">
                    <CheckCircle2 size={18} /> Submitted with all {pages.length} page
                    {pages.length === 1 ? "" : "s"}. Your teacher can see what was flagged.
                  </div>
                )}
                {mode === "rectify" && !submitted && (
                  <p className="mt-3 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-ink-4">
                    <Pencil size={13} className="mt-0.5 shrink-0" />
                    Work through each mistake below — “Fix with AI” builds an editable draft; your
                    original work is never overwritten.
                  </p>
                )}
              </div>

              {/* Pages */}
              <div className="mt-5 space-y-4">
                {pages.map((page, i) => (
                  <PageResult
                    key={page.id}
                    page={page}
                    index={i}
                    mode={mode}
                    decisions={decisions}
                    onFix={(key) => setDecision(key, "fixed")}
                    onSubmit={(key) => setDecision(key, "kept")}
                    onOpen={() => setViewerIndex(i)}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {viewerIndex != null && pages[viewerIndex] && (
        <PageViewer
          page={pages[viewerIndex]}
          index={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

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






























































































































































































