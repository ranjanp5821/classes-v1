import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, RotateCcw, Loader2, Crop } from "lucide-react";
import { detectCorners, extractDocument, defaultCorners } from "../lib/docScan";

const CORNER_KEYS = ["topLeftCorner", "topRightCorner", "bottomRightCorner", "bottomLeftCorner"];

const MODES = [
  { id: "original", label: "Original" },
  { id: "enhanced", label: "Enhanced" },
  { id: "bw", label: "B&W" },
];

/**
 * DocReview — iScanner-style review step.
 * Shows the captured frame with draggable corner handles (auto-detected),
 * an enhancement toggle, then perspective-corrects + enhances on confirm.
 *
 * Props:
 *   image       captured frame as a data URL
 *   accent      theme colour (hex)
 *   gradient    theme gradient (CSS)
 *   onConfirm({ dataUrl, width, height })
 *   onRetake()
 */
export default function DocReview({ image, accent = "#2563EB", gradient, onConfirm, onRetake }) {
  const grad = gradient || `linear-gradient(135deg, ${accent}, ${accent})`;
  const imgRef = useRef(null);
  const wrapRef = useRef(null);

  const [phase, setPhase] = useState("loading"); // loading | ready | processing
  const [nat, setNat] = useState({ w: 0, h: 0 });
  const [dispW, setDispW] = useState(0);
  const [corners, setCorners] = useState(null); // natural-pixel coords
  const [mode, setMode] = useState("enhanced");
  const dragRef = useRef(null);

  const scale = nat.w ? dispW / nat.w : 1;
  const dispH = nat.h * scale;

  // Detect the page once the image's natural size is known.
  const onImgLoad = useCallback(async () => {
    const el = imgRef.current;
    if (!el) return;
    const w = el.naturalWidth;
    const h = el.naturalHeight;
    setNat({ w, h });
    try {
      const found = await detectCorners(el);
      setCorners(found || defaultCorners(w, h));
    } catch {
      setCorners(defaultCorners(w, h));
    }
    setPhase("ready");
  }, []);

  // Track the rendered (CSS) width so handles map correctly.
  useLayoutEffect(() => {
    const measure = () => {
      if (wrapRef.current) setDispW(wrapRef.current.clientWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [phase]);

  // Pointer dragging of a corner handle.
  const startDrag = (key) => (e) => {
    e.preventDefault();
    dragRef.current = key;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    const key = dragRef.current;
    if (!key || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = Math.min(nat.w, Math.max(0, (e.clientX - rect.left) / scale));
    const y = Math.min(nat.h, Math.max(0, (e.clientY - rect.top) / scale));
    setCorners((c) => ({ ...c, [key]: { x, y } }));
  };
  const endDrag = () => {
    dragRef.current = null;
  };

  const handleUse = useCallback(async () => {
    if (!corners || !imgRef.current) return;
    setPhase("processing");
    try {
      const result = await extractDocument(imgRef.current, corners, { mode });
      onConfirm(result);
    } catch {
      // CV unavailable — fall back to the raw frame so the flow still works.
      onConfirm({ dataUrl: image, width: nat.w, height: nat.h });
    }
  }, [corners, mode, onConfirm, image, nat]);

  const polygon = corners
    ? CORNER_KEYS.map((k) => `${corners[k].x * scale},${corners[k].y * scale}`).join(" ")
    : "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex flex-col bg-black/90"
    >
      <div className="flex items-center gap-2 px-5 py-4 text-white">
        <Crop size={18} />
        <span className="text-[15px] font-semibold">Adjust the page, then confirm</span>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-auto px-5">
        <div
          ref={wrapRef}
          className="relative w-full max-w-2xl touch-none select-none"
          onPointerMove={onMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          <img
            ref={imgRef}
            src={image}
            alt="Captured page"
            onLoad={onImgLoad}
            className="block w-full rounded-xl"
            draggable={false}
          />

          {/* Crop outline + handles */}
          {phase !== "loading" && corners && dispW > 0 && (
            <svg
              className="pointer-events-none absolute left-0 top-0"
              width={dispW}
              height={dispH}
            >
              <polygon
                points={polygon}
                fill={`${accent}22`}
                stroke={accent}
                strokeWidth="2"
              />
            </svg>
          )}
          {phase === "ready" &&
            corners &&
            dispW > 0 &&
            CORNER_KEYS.map((k) => (
              <div
                key={k}
                onPointerDown={startDrag(k)}
                className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 border-white shadow-md active:cursor-grabbing"
                style={{
                  left: corners[k].x * scale,
                  top: corners[k].y * scale,
                  background: accent,
                }}
              />
            ))}

          {/* Loading overlay while OpenCV downloads / detects */}
          {phase === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/55 text-white">
              <Loader2 size={26} className="animate-spin" />
              <p className="text-[13px]">Preparing scanner…</p>
              <p className="text-[11px] text-white/60">first time loads the vision engine</p>
            </div>
          )}
          {phase === "processing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/55 text-white">
              <Loader2 size={26} className="animate-spin" />
              <p className="text-[13px]">Cleaning up the scan…</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {/* Enhancement modes */}
          <div className="flex justify-center gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                disabled={phase !== "ready"}
                className="rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors disabled:opacity-50"
                style={
                  mode === m.id
                    ? { background: "#fff", color: accent }
                    : { background: "rgba(255,255,255,0.12)", color: "#fff" }
                }
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onRetake}
              disabled={phase === "processing"}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-[14px] font-semibold text-white disabled:opacity-50"
            >
              <RotateCcw size={16} /> Retake
            </button>
            <button
              onClick={handleUse}
              disabled={phase !== "ready"}
              className="inline-flex flex-[1.5] items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-white disabled:opacity-50"
              style={{ background: grad }}
            >
              <Check size={16} /> Use scan
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
