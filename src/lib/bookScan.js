/**
 * bookScan.js — fast book-page capture for the teacher scanner.
 *
 * analyzeBookFrame() sends a raw frame to the book-detect agent, which returns
 * whether it's a valid page (drops accidental shots), whether it's a two-page
 * spread, and the page quad(s). We then crop each page (page-only, edge-refined,
 * perspective-corrected, enhanced) and return them IN ORDER — so a spread
 * becomes [left, right] automatically.
 */
import { parseQuad, quadArea, cropQuad, applyFilter } from "./imageProcess";

async function postJSON(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Scan failed.");
  return data;
}

/**
 * @param {string} rawDataUrl  the captured frame
 * @returns {Promise<Array<{image,data,w,h}>>}  0 (dropped), 1, or 2 cropped pages
 */
export async function analyzeBookFrame(rawDataUrl) {
  const det = await postJSON("/api/book/detect", { image: rawDataUrl });
  if (!det.valid || !Array.isArray(det.pages) || det.pages.length === 0) return [];

  const quads = det.pages
    .map(parseQuad)
    .filter((q) => q && quadArea(q) >= 0.04);
  if (!quads.length) return [];

  const single = quads.length === 1;
  const out = [];
  for (const q of quads) {
    try {
      // Edge-refine only single pages — on a spread the refiner would grab the
      // whole sheet, so trust the agent's per-page quad there.
      const { dataUrl, width, height } = await cropQuad(rawDataUrl, q, { refine: single });
      const image = await applyFilter(dataUrl, "auto").catch(() => dataUrl);
      out.push({
        image,
        data: image.slice(image.indexOf(",") + 1),
        w: width,
        h: height,
      });
    } catch {
      /* skip a page that failed to crop */
    }
  }
  return out;
}
