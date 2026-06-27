/**
 * imageProcess.js — pure-JS (no OpenCV) document image processing.
 *
 * Everything runs on the canvas 2D API so there's no heavy WASM to load:
 *   - warpDocument(): perspective-crop a page to its 4 corners + remap boxes
 *   - applyFilter():  scan filters (Magic / Color / B&W / Grayscale / Original)
 *
 * The perspective warp uses a homography solved from the 4 corner
 * correspondences and inverse pixel sampling.
 */

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** Solve an 8×8 linear system (Gaussian elimination with partial pivoting). */
function solve8(A, b) {
  const n = 8;
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
    [A[col], A[piv]] = [A[piv], A[col]];
    [b[col], b[piv]] = [b[piv], b[col]];
    const d = A[col][col] || 1e-9;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = A[r][col] / d;
      for (let c = col; c < n; c++) A[r][c] -= f * A[col][c];
      b[r] -= f * b[col];
    }
  }
  return b.map((v, i) => v / (A[i][i] || 1e-9));
}

/** Homography (8 params) mapping src points → dst points. */
function homography(src, dst) {
  const A = [];
  const b = [];
  for (let i = 0; i < 4; i++) {
    const { x, y } = src[i];
    const { x: X, y: Y } = dst[i];
    A.push([x, y, 1, 0, 0, 0, -X * x, -X * y]);
    b.push(X);
    A.push([0, 0, 0, x, y, 1, -Y * x, -Y * y]);
    b.push(Y);
  }
  return solve8(A, b); // [a,b,c,d,e,f,g,h]
}

const applyH = (h, x, y) => {
  const w = h[6] * x + h[7] * y + 1;
  return [(h[0] * x + h[1] * y + h[2]) / w, (h[3] * x + h[4] * y + h[5]) / w];
};

/** Load a data URL into an <img>. */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}

/**
 * Perspective-crop an image to a page quad and re-map highlight boxes onto the
 * straightened page. quadNorm = [TL,TR,BR,BL] normalised 0-1; boxesNorm =
 * [{x,y,w,h}] normalised 0-1 on the source.
 * @returns {{dataUrl, width, height, boxes}}
 */
export async function warpDocument(
  imageOrUrl,
  quadNorm,
  boxesNorm = [],
  handPolys = [],
  maxDim = 1500,
) {
  const img = typeof imageOrUrl === "string" ? await loadImage(imageOrUrl) : imageOrUrl;
  const natW = img.naturalWidth || img.width;
  const natH = img.naturalHeight || img.height;
  const srcC = quadNorm.map((p) => ({ x: p.x * natW, y: p.y * natH }));
  const [tl, tr, br, bl] = srcC;

  const W0 = Math.max(dist(tl, tr), dist(bl, br));
  const H0 = Math.max(dist(tl, bl), dist(tr, br));
  const scale = Math.min(1, maxDim / Math.max(W0, H0, 1));
  const W = Math.max(40, Math.round(W0 * scale));
  const H = Math.max(40, Math.round(H0 * scale));
  const dstC = [
    { x: 0, y: 0 },
    { x: W, y: 0 },
    { x: W, y: H },
    { x: 0, y: H },
  ];

  // Source pixels.
  const sCanvas = document.createElement("canvas");
  sCanvas.width = natW;
  sCanvas.height = natH;
  const sCtx = sCanvas.getContext("2d", { willReadFrequently: true });
  sCtx.drawImage(img, 0, 0);
  const sData = sCtx.getImageData(0, 0, natW, natH).data;

  // Inverse map (dst → src) for sampling.
  const Hds = homography(dstC, srcC);
  const out = document.createElement("canvas");
  out.width = W;
  out.height = H;
  const oCtx = out.getContext("2d");
  const oImg = oCtx.createImageData(W, H);
  const oData = oImg.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const [sx, sy] = applyH(Hds, x, y);
      const xi = sx | 0;
      const yi = sy | 0;
      const o = (y * W + x) * 4;
      if (xi >= 0 && xi < natW && yi >= 0 && yi < natH) {
        const s = (yi * natW + xi) * 4;
        oData[o] = sData[s];
        oData[o + 1] = sData[s + 1];
        oData[o + 2] = sData[s + 2];
        oData[o + 3] = 255;
      } else {
        oData[o] = oData[o + 1] = oData[o + 2] = oData[o + 3] = 255;
      }
    }
  }
  oCtx.putImageData(oImg, 0, 0);

  // Forward map (src → dst) to move boxes onto the page.
  const Hsd = homography(srcC, dstC);
  const boxes = boxesNorm.map((b) => {
    const corners = [
      [b.x, b.y],
      [b.x + b.w, b.y],
      [b.x + b.w, b.y + b.h],
      [b.x, b.y + b.h],
    ].map(([nx, ny]) => applyH(Hsd, nx * natW, ny * natH));
    const xs = corners.map((c) => c[0]);
    const ys = corners.map((c) => c[1]);
    const x0 = Math.max(0, Math.min(...xs) / W);
    const y0 = Math.max(0, Math.min(...ys) / H);
    const x1 = Math.min(1, Math.max(...xs) / W);
    const y1 = Math.min(1, Math.max(...ys) / H);
    return { x: x0, y: y0, w: Math.max(0.02, x1 - x0), h: Math.max(0.02, y1 - y0) };
  });

  // Map any hand/finger polygons onto the straightened page (normalised 0-1).
  const hands = handPolys
    .map((poly) =>
      poly
        .map((pt) => applyH(Hsd, pt.x * natW, pt.y * natH))
        .map(([px, py]) => ({ x: px / W, y: py / H })),
    )
    .filter((poly) => poly.length >= 3);

  return { dataUrl: out.toDataURL("image/jpeg", 0.92), width: W, height: H, boxes, hands };
}

/**
 * Build an inpainting mask: white (fill) over the hand polygons, black
 * elsewhere, slightly dilated so finger edges are fully covered.
 * @returns {string} PNG data URL, or "" if there are no polygons.
 */
export function buildMask(width, height, polysNorm) {
  if (!polysNorm || !polysNorm.length) return "";
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(6, Math.round(Math.min(width, height) * 0.02)); // dilation
  for (const poly of polysNorm) {
    ctx.beginPath();
    poly.forEach((p, i) => {
      const x = p.x * width;
      const y = p.y * height;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  return canvas.toDataURL("image/png");
}

/* ── Page edge detection (pure JS) ───────────────────────────────────── */

/** Otsu threshold from a 256-bin luminance histogram. */
function otsuThreshold(hist, total) {
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0;
  let wB = 0;
  let maxVar = 0;
  let thr = 127;
  for (let i = 0; i < 256; i++) {
    wB += hist[i];
    if (!wB) continue;
    const wF = total - wB;
    if (!wF) break;
    sumB += i * hist[i];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const v = wB * wF * (mB - mF) * (mB - mF);
    if (v > maxVar) {
      maxVar = v;
      thr = i;
    }
  }
  return thr;
}

/**
 * Detect the page's four corners by finding the largest bright (paper) region
 * and taking its extreme points. Precise on the real paper edges when there's
 * contrast with the background. Returns geometric corners (NOT reading order)
 * + coverage, or null when no confident page region is found.
 *
 * @returns {Promise<{quad:Array<{x,y}>, coverage:number}|null>}
 */
export async function detectPageCorners(imageOrUrl, targetW = 380) {
  const img = typeof imageOrUrl === "string" ? await loadImage(imageOrUrl) : imageOrUrl;
  const natW = img.naturalWidth || img.width;
  const natH = img.naturalHeight || img.height;
  const W = targetW;
  const H = Math.max(1, Math.round((natH * W) / natW));
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, W, H);
  const data = ctx.getImageData(0, 0, W, H).data;
  const N = W * H;

  const lum = new Uint8Array(N);
  const hist = new Uint32Array(256);
  for (let i = 0; i < N; i++) {
    const v = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114) | 0;
    lum[i] = v;
    hist[v]++;
  }
  const thr = otsuThreshold(hist, N);

  // Largest connected bright component (4-neighbour flood fill).
  const visited = new Uint8Array(N);
  let best = null;
  let bestSize = 0;
  const stack = [];
  for (let s = 0; s < N; s++) {
    if (lum[s] <= thr || visited[s]) continue;
    stack.length = 0;
    stack.push(s);
    visited[s] = 1;
    let size = 0;
    let minSum = Infinity;
    let maxSum = -Infinity;
    let minDiff = Infinity;
    let maxDiff = -Infinity;
    let TL, TR, BR, BL;
    while (stack.length) {
      const idx = stack.pop();
      size++;
      const x = idx % W;
      const y = (idx / W) | 0;
      const sum = x + y;
      const diff = x - y;
      if (sum < minSum) { minSum = sum; TL = { x, y }; }
      if (sum > maxSum) { maxSum = sum; BR = { x, y }; }
      if (diff > maxDiff) { maxDiff = diff; TR = { x, y }; }
      if (diff < minDiff) { minDiff = diff; BL = { x, y }; }
      if (x > 0 && lum[idx - 1] > thr && !visited[idx - 1]) { visited[idx - 1] = 1; stack.push(idx - 1); }
      if (x < W - 1 && lum[idx + 1] > thr && !visited[idx + 1]) { visited[idx + 1] = 1; stack.push(idx + 1); }
      if (y > 0 && lum[idx - W] > thr && !visited[idx - W]) { visited[idx - W] = 1; stack.push(idx - W); }
      if (y < H - 1 && lum[idx + W] > thr && !visited[idx + W]) { visited[idx + W] = 1; stack.push(idx + W); }
    }
    if (size > bestSize) {
      bestSize = size;
      best = { TL, TR, BR, BL };
    }
  }

  if (!best) return null;
  const coverage = bestSize / N;
  const n = (p) => ({ x: p.x / W, y: p.y / H });
  return { quad: [n(best.TL), n(best.TR), n(best.BR), n(best.BL)], coverage };
}

/* ── Quad helpers + high-level crop ──────────────────────────────────── */

/** Parse a page quad ([[x,y]×4] 0-1000) → 4 normalised {x,y} (0-1), or null. */
export function parseQuad(quad) {
  if (!Array.isArray(quad) || quad.length !== 4) return null;
  const pts = quad.map((p) => {
    const x = Array.isArray(p) ? p[0] : p?.x;
    const y = Array.isArray(p) ? p[1] : p?.y;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return { x: Math.min(1, Math.max(0, x / 1000)), y: Math.min(1, Math.max(0, y / 1000)) };
  });
  return pts.every(Boolean) ? pts : null;
}

/** Bounding-box area of a normalised quad. */
export function quadArea(quad) {
  const xs = quad.map((p) => p.x);
  const ys = quad.map((p) => p.y);
  return (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
}

/** Expand a quad outward from its centre so page edges aren't clipped. */
export function padQuad(quad, f = 0.04) {
  const cx = quad.reduce((s, p) => s + p.x, 0) / quad.length;
  const cy = quad.reduce((s, p) => s + p.y, 0) / quad.length;
  const c01 = (v) => Math.min(1, Math.max(0, v));
  return quad.map((p) => ({ x: c01(p.x + (p.x - cx) * f), y: c01(p.y + (p.y - cy) * f) }));
}

/** Reorder geometric corners to match a reference quad's order (nearest match). */
function reorderToMatch(corners, reference) {
  const used = new Set();
  return reference.map((ref) => {
    let best = 0;
    let bestD = Infinity;
    corners.forEach((p, i) => {
      if (used.has(i)) return;
      const d = (p.x - ref.x) ** 2 + (p.y - ref.y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    used.add(best);
    return corners[best];
  });
}

/**
 * Refine a rough (AI) quad with precise edge-detected corners, keeping the
 * rough quad's reading orientation. Falls back to the rough quad when the edge
 * detector isn't confident or disagrees wildly.
 */
export async function refineQuad(rawDataUrl, roughQuad) {
  try {
    const detected = await detectPageCorners(rawDataUrl);
    if (!detected || detected.coverage < 0.2 || detected.coverage > 0.85) return roughQuad;
    const ordered = reorderToMatch(detected.quad, roughQuad);
    const sane = ordered.every((p, i) => Math.hypot(p.x - roughQuad[i].x, p.y - roughQuad[i].y) < 0.3);
    return sane ? ordered : roughQuad;
  } catch {
    return roughQuad;
  }
}

/**
 * Crop a raw frame to a page quad (refined + padded + perspective-warped).
 * @param {string} rawDataUrl
 * @param {Array<{x,y}>} normQuad  normalised page corners (reading order)
 * @returns {Promise<{dataUrl,width,height}>}
 */
export async function cropQuad(rawDataUrl, normQuad, { refine = true, pad = 0.03 } = {}) {
  const quad = refine ? await refineQuad(rawDataUrl, normQuad) : normQuad;
  return warpDocument(rawDataUrl, padQuad(quad, pad));
}

/* ── Filters (canvas pixel ops) ──────────────────────────────────────── */

export const FILTERS = [
  { id: "auto", label: "Auto" },
  { id: "color", label: "Color" },
  { id: "magic", label: "Magic Color" },
  { id: "bw", label: "B&W" },
  { id: "grayscale", label: "Grayscale" },
  { id: "original", label: "Original" },
];

const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

/**
 * Natural enhancement (the default). A gentle per-channel levels stretch:
 * neutralises the lighting/white-balance and lifts contrast WITHOUT blowing the
 * page to pure white — so paper colour, coloured text, highlights, stamps and
 * handwriting are preserved. Looks like a clean photo, not a processed scan.
 */
function autoEnhance(d) {
  const n = d.length / 4;
  for (let c = 0; c < 3; c++) {
    const hist = new Uint32Array(256);
    for (let i = c; i < d.length; i += 4) hist[d[i]]++;
    let cum = 0;
    let black = 0;
    let white = 255;
    const bT = n * 0.02; // 2nd percentile  → black point
    const wT = n * 0.985; // 98.5th percentile → white point
    for (let v = 0; v < 256; v++) {
      cum += hist[v];
      if (black === 0 && cum >= bT) black = v;
      if (cum >= wT) {
        white = v;
        break;
      }
    }
    const range = Math.max(24, white - black);
    const scale = 232 / range; // map [black..white] → ~[8..240], never pure white
    for (let i = c; i < d.length; i += 4) d[i] = clamp((d[i] - black) * scale + 8);
  }
}

/** Heavily blurred copy (background/illumination estimate) via downscale↔upscale. */
function backgroundData(canvas) {
  const small = document.createElement("canvas");
  small.width = Math.max(1, canvas.width >> 4);
  small.height = Math.max(1, canvas.height >> 4);
  const sc = small.getContext("2d");
  sc.drawImage(canvas, 0, 0, small.width, small.height);
  const up = document.createElement("canvas");
  up.width = canvas.width;
  up.height = canvas.height;
  const uc = up.getContext("2d");
  uc.imageSmoothingEnabled = true;
  uc.drawImage(small, 0, 0, canvas.width, canvas.height);
  return uc.getImageData(0, 0, canvas.width, canvas.height).data;
}

/** Apply a named filter to a data URL → filtered data URL. */
export async function applyFilter(dataUrl, filter) {
  if (filter === "original") return dataUrl;
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;

  if (filter === "auto") {
    autoEnhance(d);
  } else if (filter === "grayscale") {
    for (let i = 0; i < d.length; i += 4) {
      const g = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) | 0;
      d[i] = d[i + 1] = d[i + 2] = g;
    }
  } else if (filter === "color") {
    for (let i = 0; i < d.length; i += 4) {
      d[i] = clamp((d[i] - 128) * 1.2 + 128 + 6);
      d[i + 1] = clamp((d[i + 1] - 128) * 1.2 + 128 + 6);
      d[i + 2] = clamp((d[i + 2] - 128) * 1.2 + 128 + 6);
    }
  } else if (filter === "magic") {
    // Divide by the illumination estimate → flat white background, true colours.
    const bg = backgroundData(canvas);
    for (let i = 0; i < d.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        const b = bg[i + c] || 1;
        d[i + c] = clamp((d[i + c] / b) * 250);
      }
    }
  } else if (filter === "bw") {
    const bg = backgroundData(canvas);
    for (let i = 0; i < d.length; i += 4) {
      const g = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
      const b = bg[i] * 0.299 + bg[i + 1] * 0.587 + bg[i + 2] * 0.114 || 1;
      const norm = (g / b) * 255;
      const v = norm > 200 ? 255 : 0; // threshold against flattened background
      d[i] = d[i + 1] = d[i + 2] = v;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.92);
}
