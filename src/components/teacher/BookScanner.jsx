import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ScanLine, CheckCircle2, Loader2, BookMarked, Trash2 } from "lucide-react";
import { scanBook } from "../../lib/teachingAssistant";
import { analyzeBookFrame } from "../../lib/bookScan";
import { useLiveDocScan } from "../../hooks/useLiveDocScan";

const GRADIENT = "linear-gradient(135deg, #22C55E 0%, #1CA363 100%)";

let pageSeq = 0;
const nextId = () => `pg-${Date.now()}-${pageSeq++}`;

export default function BookScanner({ onClose, onBook }) {
  // page: { id, image, data, w, h, status: "processing" | "ready" }
  const [pages, setPages] = useState([]);
  const [error, setError] = useState(null);
  const [building, setBuilding] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(null);
  const [flash, setFlash] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const flashTimer = useRef(null);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  // Process a captured frame in the background → 0 (dropped), 1, or 2 pages,
  // inserted in place of the placeholder so order is preserved.
  const processFrame = useCallback(async (placeholderId, raw) => {
    try {
      const got = await analyzeBookFrame(raw);
      setPages((ps) => {
        const i = ps.findIndex((p) => p.id === placeholderId);
        if (i === -1) return ps;
        if (!got.length) return ps.filter((p) => p.id !== placeholderId); // accidental → drop
        const made = got.map((g) => ({ id: nextId(), status: "ready", ...g }));
        return [...ps.slice(0, i), ...made, ...ps.slice(i + 1)];
      });
    } catch {
      setPages((ps) => ps.filter((p) => p.id !== placeholderId)); // failed → drop
    }
  }, []);

  const handleCapture = useCallback(
    ({ dataUrl }) => {
      const id = nextId();
      setPages((ps) => [...ps, { id, image: dataUrl, status: "processing" }]);
      setFlash(true);
      clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlash(false), 600);
      processFrame(id, dataUrl);
    },
    [processFrame],
  );

  // Fast cadence so flipping pages every ~second is caught seamlessly.
  const { ready, pagePresent, progress } = useLiveDocScan({
    videoRef,
    active: viewerIndex == null && !building,
    onCapture: handleCapture,
    cooldownMs: 550,
    stableMs: 350,
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
          await videoRef.current.play();
        }
      } catch (err) {
        setError(
          err?.name === "NotAllowedError"
            ? "Camera permission was blocked."
            : "No camera available on this device.",
        );
      }
    })();
    return () => {
      cancelled = true;
      stop();
    };
  }, [stop]);

  const removePage = (id) => setPages((ps) => ps.filter((p) => p.id !== id));

  const readyPages = pages.filter((p) => p.status === "ready");

  const finish = useCallback(async () => {
    if (!readyPages.length) return;
    setBuilding(true);
    setError(null);
    stop();
    try {
      const book = await scanBook(readyPages.map(({ data, w, h }) => ({ data, w, h })));
      // Keep the cropped page images with the book for in-library review.
      onBook({ ...book, pages: readyPages.map((p) => p.image) });
      onClose();
    } catch (err) {
      setError(err?.message || "Couldn't build the book.");
      setBuilding(false);
    }
  }, [readyPages, stop, onBook, onClose]);

  const cancel = useCallback(() => {
    stop();
    onClose();
  }, [stop, onClose]);

  const pending = pages.filter((p) => p.status === "processing").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col bg-black/90"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2 text-white">
          <BookMarked size={18} />
          <span className="text-[15px] font-semibold">Scan a book — flip the pages</span>
        </div>
        <button
          onClick={cancel}
          aria-label="Close scanner"
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-white/20"
        >
          <X size={15} /> Close
        </button>
      </div>

      {/* Camera */}
      <div className="relative mx-auto w-full max-w-3xl flex-1 px-5">
        <div className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ minHeight: 280 }}>
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-white/25"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-paint-grass px-4 py-2 text-[14px] font-semibold text-white shadow-lg">
                  <CheckCircle2 size={17} /> Captured
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10">
            <ScanLine size={18} className="text-white/80" />
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-100"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <span className="text-[12px] font-medium text-white/80">
              {!ready
                ? "Starting camera…"
                : !pagePresent
                  ? "Show a page"
                  : progress > 0
                    ? "Hold…"
                    : "Flip to the next page"}
            </span>
          </div>
        </div>
        <p className="mt-3 text-center text-[13px] text-white/60">
          Point at a page — it captures automatically. Two open book pages are split into two pages
          in order. Accidental shots are dropped.
        </p>
      </div>

      {/* Filmstrip + actions */}
      <div className="px-5 py-4">
        {error && <p className="mb-2 text-center text-[13px] text-paint-magenta">{error}</p>}
        {pages.length > 0 && (
          <div className="mx-auto mb-3 flex max-w-3xl gap-2 overflow-x-auto">
            {pages.map((p, i) => (
              <div key={p.id} className="relative shrink-0">
                <button
                  onClick={() => p.status === "ready" && setViewerIndex(readyPages.indexOf(p))}
                  className="block"
                  title="Tap to view"
                >
                  <img
                    src={p.image}
                    alt={`Page ${i + 1}`}
                    className="h-20 w-16 rounded-md object-cover ring-1 ring-white/20"
                  />
                </button>
                {p.status === "processing" && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/45">
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
        )}

        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[13px] text-white/70">
            {readyPages.length > 0 && <CheckCircle2 size={15} className="text-paint-grass" />}
            {readyPages.length === 0
              ? "No pages yet"
              : `${readyPages.length} page${readyPages.length > 1 ? "s" : ""}`}
            {pending > 0 ? ` · ${pending} processing` : ""}
          </span>
          <button
            onClick={finish}
            disabled={!readyPages.length || building}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[14px] font-semibold text-white disabled:opacity-50"
            style={{ background: GRADIENT }}
          >
            {building ? <Loader2 size={16} className="animate-spin" /> : <BookMarked size={16} />}
            {building ? "Building book…" : "Add to library"}
          </button>
        </div>
      </div>

      {/* Full-page viewer */}
      <AnimatePresence>
        {viewerIndex != null && readyPages[viewerIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-black/90"
          >
            <div className="flex items-center justify-between px-5 py-4 text-white">
              <span className="text-[15px] font-semibold">
                Page {viewerIndex + 1} of {readyPages.length}
              </span>
              <button
                onClick={() => setViewerIndex(null)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium hover:bg-white/20"
              >
                <X size={15} /> Close
              </button>
            </div>
            <div className="flex-1 overflow-auto px-4 pb-6">
              <img
                src={readyPages[viewerIndex].image}
                alt={`Page ${viewerIndex + 1}`}
                className="mx-auto max-w-3xl rounded-lg"
              />
            </div>
            <div className="flex items-center justify-center gap-3 pb-5">
              <button
                onClick={() => setViewerIndex((i) => Math.max(0, i - 1))}
                disabled={viewerIndex === 0}
                className="rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setViewerIndex((i) => Math.min(readyPages.length - 1, i + 1))}
                disabled={viewerIndex >= readyPages.length - 1}
                className="rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
