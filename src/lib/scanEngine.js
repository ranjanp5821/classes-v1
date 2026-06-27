/**
 * scanEngine.js — Document scanning engine (browser / OpenCV.js).
 *
 * The web-grade equivalent of an iScanner/CamScanner/Adobe-Scan pipeline:
 *
 *   frame → grayscale → blur → Canny edges → dilate → findContours
 *         → approxPolyDP → 4-point + convex + area validation
 *         → corner ordering → (gating) → perspective warp → crop
 *         → filter (shadow removal / contrast / threshold) → page
 *
 * Native mapping (if you port later):
 *   - Detection (Canny/contours/approxPolyDP/warpPerspective)  → OpenCV (Android/iOS)
 *   - Camera frame stream                                       → CameraX (Android) / AVFoundation (iOS)
 *   - On-device quad hinting                                    → ML Kit / Vision framework
 *
 * Everything runs on a DOWNSCALED frame for detection (fast, ~real-time), then
 * the perspective warp is applied to the FULL-resolution capture for quality.
 * Every OpenCV Mat is released — leaks crash the WASM heap.
 */

const OPENCV_URL = "https://docs.opencv.org/4.9.0/opencv.js";

let cvPromise = null;

/**
 * Load OpenCV.js once (idempotent), resolving when it's actually usable.
 *
 * OpenCV.js init timing is notoriously flaky across builds (cv may be the
 * Module, a Promise, or set late), so we belt-and-braces it: pre-define the
 * Emscripten `Module.onRuntimeInitialized` hook, also poll for `cv.Mat`, and
 * time out instead of hanging forever (callers degrade gracefully).
 */
export function loadOpenCV() {
  if (cvPromise) return cvPromise;
  cvPromise = new Promise((resolve, reject) => {
    if (window.cv && window.cv.Mat) return resolve(window.cv);

    let settled = false;
    const finish = (c) => {
      if (settled) return;
      settled = true;
      window.cv = c;
      resolve(c);
    };
    // Poll for readiness — works regardless of how this build signals init.
    const poll = setInterval(() => {
      if (window.cv && window.cv.Mat) {
        clearInterval(poll);
        finish(window.cv);
      } else if (window.cv && typeof window.cv.then === "function") {
        clearInterval(poll);
        window.cv.then((c) => finish(c));
      }
    }, 50);

    // Emscripten calls Module.onRuntimeInitialized when the WASM is ready.
    window.Module = window.Module || {};
    const prevHook = window.Module.onRuntimeInitialized;
    window.Module.onRuntimeInitialized = () => {
      if (prevHook) prevHook();
      clearInterval(poll);
      finish(window.cv);
    };

    if (!window.__cvScriptLoading) {
      window.__cvScriptLoading = true;
      const s = document.createElement("script");
      s.src = OPENCV_URL;
      s.async = true;
      s.onerror = () => {
        clearInterval(poll);
        reject(new Error("Failed to load OpenCV.js"));
      };
      document.head.appendChild(s);
    }

    setTimeout(() => {
      if (!settled) {
        clearInterval(poll);
        reject(new Error("OpenCV.js init timed out"));
      }
    }, 45000);
  }).catch((err) => {
    cvPromise = null;
    throw err;
  });
  return cvPromise;
}

export const isReady = () => !!(window.cv && window.cv.Mat);

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** Order 4 points as [topLeft, topRight, bottomRight, bottomLeft]. */
function orderCorners(p) {
  const bySum = [...p].sort((a, b) => a.x + a.y - (b.x + b.y));
  const byDiff = [...p].sort((a, b) => a.y - a.x - (b.y - b.x));
  return [bySum[0], byDiff[0], bySum[3], byDiff[3]]; // TL, TR, BR, BL
}

/**
 * Analyse one (downscaled) frame: find the best document quad + a blur score.
 * @returns {{valid:boolean, quad?:Array<{x,y}>, coverage:number, blurVar:number}}
 *   quad is in the SOURCE canvas's pixel coordinates.
 */
export function analyzeFrame(srcCanvas, { minCoverage = 0.55 } = {}) {
  const cv = window.cv;
  const mats = [];
  const keep = (m) => (mats.push(m), m);
  let contours;
  try {
    const src = keep(cv.imread(srcCanvas));
    const gray = keep(new cv.Mat());
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    // Blur score = variance of the Laplacian (higher = sharper / in focus).
    const lap = keep(new cv.Mat());
    cv.Laplacian(gray, lap, cv.CV_64F);
    const mean = keep(new cv.Mat());
    const std = keep(new cv.Mat());
    cv.meanStdDev(lap, mean, std);
    const sd = std.doubleAt(0, 0);
    const blurVar = sd * sd;

    // Edges → close gaps → contours.
    const blur = keep(new cv.Mat());
    cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0);
    const edges = keep(new cv.Mat());
    cv.Canny(blur, edges, 75, 200);
    const kernel = keep(cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(7, 7)));
    const dil = keep(new cv.Mat());
    cv.dilate(edges, dil, kernel);

    contours = new cv.MatVector();
    const hier = keep(new cv.Mat());
    cv.findContours(dil, contours, hier, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    const imgArea = src.rows * src.cols;
    let best = null;
    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);
      // Only consider sizeable blobs (cheap reject).
      if (area >= imgArea * minCoverage * 0.55) {
        const peri = cv.arcLength(cnt, true);
        const approx = new cv.Mat();
        cv.approxPolyDP(cnt, approx, 0.02 * peri, true);
        if (approx.rows === 4 && cv.isContourConvex(approx) && (!best || area > best.area)) {
          const pts = [];
          for (let j = 0; j < 4; j++) {
            pts.push({ x: approx.data32S[j * 2], y: approx.data32S[j * 2 + 1] });
          }
          best = { pts, area };
        }
        approx.delete();
      }
      cnt.delete();
    }

    if (!best) return { valid: false, coverage: 0, blurVar };
    const coverage = best.area / imgArea;
    return { valid: coverage >= minCoverage, quad: orderCorners(best.pts), coverage, blurVar };
  } catch {
    return { valid: false, coverage: 0, blurVar: 0 };
  } finally {
    if (contours) contours.delete();
    for (const m of mats) m.delete();
  }
}

/**
 * Perspective-correct + crop the page bounded by `quad` (pixels in srcEl) and
 * return the geometry-corrected page (original colours, no filter applied).
 * @returns {{dataUrl:string,width:number,height:number}}
 */
export function warpDocument(srcEl, quad) {
  const cv = window.cv;
  const [tl, tr, br, bl] = quad;
  const W = Math.max(40, Math.round(Math.max(dist(tl, tr), dist(bl, br))));
  const H = Math.max(40, Math.round(Math.max(dist(tl, bl), dist(tr, br))));
  const src = cv.imread(srcEl);
  const dst = new cv.Mat();
  const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);
  const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, W, 0, W, H, 0, H]);
  const M = cv.getPerspectiveTransform(srcTri, dstTri);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  try {
    cv.warpPerspective(src, dst, M, new cv.Size(W, H), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar(255, 255, 255, 255));
    cv.imshow(canvas, dst);
  } finally {
    src.delete();
    dst.delete();
    srcTri.delete();
    dstTri.delete();
    M.delete();
  }
  return { dataUrl: canvas.toDataURL("image/jpeg", 0.92), width: W, height: H };
}

/* ── Enhancement filters ─────────────────────────────────────────────── */

/** Even out illumination / kill shadows on a single-channel Mat (in place via dst). */
function flattenShadows(cv, gray, dst) {
  const dil = new cv.Mat();
  const k = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(9, 9));
  const bg = new cv.Mat();
  const diff = new cv.Mat();
  try {
    cv.dilate(gray, dil, k);
    cv.medianBlur(dil, bg, 21); // estimate of the page background / lighting
    cv.absdiff(gray, bg, diff);
    cv.bitwise_not(diff, dst); // 255 - diff  → page becomes white, ink dark
    cv.normalize(dst, dst, 0, 255, cv.NORM_MINMAX);
  } finally {
    dil.delete();
    k.delete();
    bg.delete();
    diff.delete();
  }
}

/** Apply a named filter to a canvas in place. */
function filterCanvas(canvas, filter) {
  const cv = window.cv;
  const src = cv.imread(canvas);
  const out = new cv.Mat();
  try {
    if (filter === "grayscale") {
      cv.cvtColor(src, out, cv.COLOR_RGBA2GRAY);
      cv.cvtColor(out, out, cv.COLOR_GRAY2RGBA);
    } else if (filter === "bw") {
      const g = new cv.Mat();
      cv.cvtColor(src, g, cv.COLOR_RGBA2GRAY);
      flattenShadows(cv, g, g);
      cv.adaptiveThreshold(g, g, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 21, 12);
      cv.cvtColor(g, out, cv.COLOR_GRAY2RGBA);
      g.delete();
    } else if (filter === "magic") {
      // Per-channel shadow flattening → clean white background, true colours.
      const rgb = new cv.Mat();
      cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
      const chans = new cv.MatVector();
      cv.split(rgb, chans);
      const res = new cv.MatVector();
      const tmps = [];
      for (let i = 0; i < 3; i++) {
        const ch = chans.get(i);
        const norm = new cv.Mat();
        flattenShadows(cv, ch, norm);
        res.push_back(norm);
        tmps.push(norm);
        ch.delete();
      }
      const merged = new cv.Mat();
      cv.merge(res, merged);
      cv.cvtColor(merged, out, cv.COLOR_RGB2RGBA);
      tmps.forEach((m) => m.delete());
      rgb.delete();
      chans.delete();
      res.delete();
      merged.delete();
    } else if (filter === "color") {
      src.convertTo(out, -1, 1.22, 8); // lift contrast + brightness
    } else {
      src.copyTo(out); // original
    }
    cv.imshow(canvas, out);
  } finally {
    src.delete();
    out.delete();
  }
}

/** The selectable filters (label + id), in display order. */
export const FILTERS = [
  { id: "magic", label: "Magic Color" },
  { id: "color", label: "Color" },
  { id: "bw", label: "B&W" },
  { id: "grayscale", label: "Grayscale" },
  { id: "original", label: "Original" },
];

/** Load a data URL into an <img> for OpenCV consumption. */
export function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = dataUrl;
  });
}

/** Apply a filter to a page data URL → filtered data URL. */
export async function applyFilterToDataUrl(dataUrl, filter) {
  await loadOpenCV();
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.getContext("2d").drawImage(img, 0, 0);
  try {
    filterCanvas(canvas, filter);
  } catch {
    /* fall back to the unfiltered page */
  }
  return canvas.toDataURL("image/jpeg", 0.92);
}

/**
 * One-shot: detect the page in a still image and return the cropped page, or
 * null if no confident document is found. Used for the upload path.
 */
export async function scanStillImage(dataUrl, { minCoverage = 0.35 } = {}) {
  await loadOpenCV();
  const img = await loadImage(dataUrl);
  const work = document.createElement("canvas");
  work.width = img.naturalWidth;
  work.height = img.naturalHeight;
  work.getContext("2d").drawImage(img, 0, 0);
  const res = analyzeFrame(work, { minCoverage });
  if (!res.quad) return null;
  return warpDocument(img, res.quad);
}
