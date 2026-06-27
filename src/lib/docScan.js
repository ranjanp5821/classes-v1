/**
 * docScan.js — iScanner-style document processing in the browser.
 *
 * Lazy-loads OpenCV.js + jscanify (≈8MB WASM) on first use only — never in the
 * main bundle — and exposes three steps:
 *   detectCorners(img)              → the 4 page corners (or null)
 *   extractDocument(img, corners)   → a perspective-corrected, enhanced page
 *   (enhancement modes: "original" | "enhanced" | "bw")
 *
 * Corner objects use jscanify's shape:
 *   { topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner }
 * each { x, y } in the source image's natural pixels.
 */

const OPENCV_URL = "https://docs.opencv.org/4.9.0/opencv.js";
const JSCANIFY_URL = "https://cdn.jsdelivr.net/npm/jscanify@1.4.0/src/jscanify.min.js";

let scannerPromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

/** Load OpenCV.js + jscanify once; resolves to a jscanify instance. */
export function loadScanner() {
  if (scannerPromise) return scannerPromise;
  scannerPromise = (async () => {
    if (!window.cv || !window.cv.Mat) {
      await loadScript(OPENCV_URL);
      let cv = window.cv;
      if (cv instanceof Promise) {
        cv = await cv;
        window.cv = cv;
      }
      await new Promise((resolve) => {
        if (cv.Mat) return resolve();
        cv.onRuntimeInitialized = resolve;
      });
    }
    if (!window.jscanify) await loadScript(JSCANIFY_URL);
    return new window.jscanify();
  })().catch((err) => {
    scannerPromise = null; // allow a retry on next call
    throw err;
  });
  return scannerPromise;
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** Corners inset 6% from the edges — the fallback when detection fails. */
export function defaultCorners(w, h) {
  const ix = w * 0.06;
  const iy = h * 0.06;
  return {
    topLeftCorner: { x: ix, y: iy },
    topRightCorner: { x: w - ix, y: iy },
    bottomLeftCorner: { x: ix, y: h - iy },
    bottomRightCorner: { x: w - ix, y: h - iy },
  };
}

/**
 * Detect the page's four corners in an <img> or <canvas>.
 * @returns {Promise<object|null>} jscanify corner points, or null if not found.
 */
export async function detectCorners(imageEl) {
  const scanner = await loadScanner();
  const cv = window.cv;
  let mat;
  let contour;
  try {
    mat = cv.imread(imageEl);
    contour = scanner.findPaperContour(mat);
    if (!contour) return null;
    const pts = scanner.getCornerPoints(contour);
    // Reject nonsense (all-zero / collapsed) detections.
    if (!pts || dist(pts.topLeftCorner, pts.bottomRightCorner) < 20) return null;
    return pts;
  } catch {
    return null;
  } finally {
    mat?.delete?.();
    contour?.delete?.();
  }
}

/** Apply a document enhancement to a canvas in place. */
function enhanceCanvas(canvas, mode) {
  if (mode === "original") return;
  const cv = window.cv;
  const src = cv.imread(canvas);
  const dst = new cv.Mat();
  try {
    if (mode === "bw") {
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
      cv.adaptiveThreshold(
        src,
        dst,
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY,
        15,
        12,
      );
      cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
    } else {
      // "enhanced": lift contrast + a touch of brightness for crisper text.
      src.convertTo(dst, -1, 1.28, 6);
    }
    cv.imshow(canvas, dst);
  } finally {
    src.delete();
    dst.delete();
  }
}

/**
 * Perspective-correct the page bounded by `corners`, then enhance it.
 * @returns {Promise<{dataUrl, width, height}>}
 */
export async function extractDocument(imageEl, corners, { mode = "enhanced" } = {}) {
  const scanner = await loadScanner();
  const { topLeftCorner: tl, topRightCorner: tr, bottomLeftCorner: bl, bottomRightCorner: br } =
    corners;
  // Output size = average of opposite edge lengths, to keep proportions.
  const width = Math.max(40, Math.round((dist(tl, tr) + dist(bl, br)) / 2));
  const height = Math.max(40, Math.round((dist(tl, bl) + dist(tr, br)) / 2));

  const out = scanner.extractPaper(imageEl, width, height, corners);
  enhanceCanvas(out, mode);
  return { dataUrl: out.toDataURL("image/jpeg", 0.9), width, height };
}

/** jscanify corner object → quad array [TL, TR, BR, BL] in natural pixels. */
export function cornersToQuad(corners) {
  return [
    corners.topLeftCorner,
    corners.topRightCorner,
    corners.bottomRightCorner,
    corners.bottomLeftCorner,
  ];
}

/**
 * Perspective-crop an image to a page quad and re-map highlight boxes onto the
 * straightened result. Used by the homework scanner so mistakes land on the
 * clean page even though the model boxed them on the original (angled) photo.
 *
 * @param {HTMLImageElement|HTMLCanvasElement} imageEl
 * @param {Array<{x,y}>} quadNorm     4 page corners (TL,TR,BR,BL) normalised 0-1
 * @param {Array<{x,y,w,h}>} boxesNorm  boxes normalised 0-1 on the source image
 * @param {{mode?: string}} opts
 * @returns {Promise<{dataUrl, width, height, boxes: Array<{x,y,w,h}>}>}
 */
export async function cropToQuad(imageEl, quadNorm, boxesNorm = [], { mode = "enhanced" } = {}) {
  await loadScanner();
  const cv = window.cv;
  const natW = imageEl.naturalWidth || imageEl.width;
  const natH = imageEl.naturalHeight || imageEl.height;
  const q = quadNorm.map((p) => ({ x: p.x * natW, y: p.y * natH }));
  const [tl, tr, br, bl] = q;

  const width = Math.max(40, Math.round((dist(tl, tr) + dist(bl, br)) / 2));
  const height = Math.max(40, Math.round((dist(tl, bl) + dist(tr, br)) / 2));

  const src = cv.imread(imageEl);
  const dst = new cv.Mat();
  const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);
  const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, width, 0, width, height, 0, height]);
  const M = cv.getPerspectiveTransform(srcTri, dstTri);

  // Read the 3×3 homography so we can map box corners in JS.
  const m = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) m.push(M.doubleAt(r, c));
  const tx = (x, y) => {
    const w = m[6] * x + m[7] * y + m[8];
    return [(m[0] * x + m[1] * y + m[2]) / w, (m[3] * x + m[4] * y + m[5]) / w];
  };

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  try {
    cv.warpPerspective(src, dst, M, new cv.Size(width, height), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar(255, 255, 255, 255));
    cv.imshow(canvas, dst);
  } finally {
    src.delete();
    dst.delete();
    srcTri.delete();
    dstTri.delete();
    M.delete();
  }
  enhanceCanvas(canvas, mode);

  // Map each box's 4 corners through the homography → bounding box on the page.
  const boxes = boxesNorm.map((b) => {
    const corners = [
      [b.x * natW, b.y * natH],
      [(b.x + b.w) * natW, b.y * natH],
      [(b.x + b.w) * natW, (b.y + b.h) * natH],
      [b.x * natW, (b.y + b.h) * natH],
    ].map(([x, y]) => tx(x, y));
    const xs = corners.map((p) => p[0]);
    const ys = corners.map((p) => p[1]);
    const x0 = Math.max(0, Math.min(...xs) / width);
    const y0 = Math.max(0, Math.min(...ys) / height);
    const x1 = Math.min(1, Math.max(...xs) / width);
    const y1 = Math.min(1, Math.max(...ys) / height);
    return { x: x0, y: y0, w: Math.max(0.02, x1 - x0), h: Math.max(0.02, y1 - y0) };
  });

  return { dataUrl: canvas.toDataURL("image/jpeg", 0.9), width, height, boxes };
}
