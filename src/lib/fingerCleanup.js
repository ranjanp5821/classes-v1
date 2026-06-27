/**
 * fingerCleanup.js — remove fingers/hands from a cropped page via the server
 * inpainting endpoint. Builds the mask from the (already page-mapped) hand
 * polygons and posts it with the page to /api/inpaint.
 *
 * Degrades gracefully: if there are no hands, or the inpainting provider isn't
 * configured, or the call fails, it returns the original page unchanged.
 */
import { buildMask } from "./imageProcess";

export async function inpaintFingers(croppedDataUrl, width, height, handsNorm) {
  const mask = buildMask(width, height, handsNorm);
  if (!mask) return croppedDataUrl; // nothing to remove
  try {
    const res = await fetch("/api/inpaint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: croppedDataUrl, mask }),
    });
    const out = await res.json().catch(() => ({}));
    if (out.configured && out.image) return out.image;
    return croppedDataUrl; // not configured / failed → keep the original
  } catch {
    return croppedDataUrl;
  }
}
