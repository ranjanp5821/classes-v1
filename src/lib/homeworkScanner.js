/**
 * homeworkScanner.js — Client orchestrator for the 3-agent scan pipeline.
 *
 *   Agent 1  /api/scan/detect   → the page boundary (we crop + align here, client-side)
 *   Agent 2  /api/scan/evaluate → mark the clean cropped page (correct / wrong / review)
 *   Agent 3  /api/scan/verify   → re-check Agent 2 against the page and rectify
 *
 * evaluatePage() runs all three and returns the final, render-ready result with
 * the cropped page image and the answer boxes (already relative to that page).
 *
 * Confidence gate: a "wrong" with confidence below CONFIDENCE_THRESHOLD is
 * softened to "review" (an improvement, never an auto-applied mistake).
 */
import { warpDocument, applyFilter, parseQuad, quadArea, padQuad, refineQuad } from "./imageProcess";

export const CONFIDENCE_THRESHOLD = 0.8;

/** Thrown when there's no page/document in view. */
export class NotHomeworkError extends Error {}

/* ── result mapping ──────────────────────────────────────────────────── */

function normaliseType(t) {
  const v = String(t || "").toLowerCase();
  if (v === "science" || v === "language" || v === "math") return v;
  return "math";
}

/** Box [ymin,xmin,ymax,xmax] 0-1000 → normalised {x,y,w,h}, slightly padded. */
function normaliseBox(box, index) {
  if (Array.isArray(box) && box.length === 4 && box.every((n) => Number.isFinite(n))) {
    let [ymin, xmin, ymax, xmax] = box.map((n) => Math.min(1000, Math.max(0, n)) / 1000);
    xmin = Math.max(0, xmin - 0.012);
    xmax = Math.min(1, xmax + 0.012);
    ymin = Math.max(0, ymin - 0.02);
    ymax = Math.min(1, ymax + 0.02);
    const w = Math.max(0.04, xmax - xmin);
    const h = Math.max(0.04, ymax - ymin);
    if (w <= 1 && h <= 1) return { x: xmin, y: ymin, w, h };
  }
  return { x: 0.06, y: 0.12 + index * 0.16, w: 0.88, h: 0.12 };
}

/** Tight box for the exact wrong part — minimal padding, null if invalid. */
function tightBox(box) {
  if (!Array.isArray(box) || box.length !== 4 || !box.every((n) => Number.isFinite(n))) return null;
  const [ymin, xmin, ymax, xmax] = box.map((n) => Math.min(1000, Math.max(0, n)) / 1000);
  const w = Math.max(0.02, xmax - xmin);
  const h = Math.max(0.012, ymax - ymin);
  if (w > 1 || h > 1) return null;
  return { x: Math.min(xmin, 1 - w), y: Math.min(ymin, 1 - h), w, h };
}

/** Build the render-ready result from a page image + marked questions. */
function buildResult(image, subject, rawQuestions) {
  const questions = (Array.isArray(rawQuestions) ? rawQuestions : []).map((q, i) => {
    const base = {
      id: `q${i}`,
      prompt: String(q.prompt || "").trim(),
      studentWork: String(q.studentWork || "").trim(),
      type: normaliseType(q.type),
      box: normaliseBox(q.box, i),
    };
    if (q.status === "correct") return { ...base, status: "correct" };

    const confidence = Number.isFinite(q.confidence) ? Math.min(1, Math.max(0, q.confidence)) : 0.6;
    // A "wrong" only stays wrong when confident; otherwise it's an improvement.
    const status = q.status === "wrong" && confidence >= CONFIDENCE_THRESHOLD ? "wrong" : "review";
    return {
      ...base,
      status,
      confidence,
      errorBox: tightBox(q.errorBox), // exact wrong part, for the underline
      summary: String(q.summary || (status === "wrong" ? "Mistake" : "Could be improved")).trim(),
      explanation: String(q.explanation || "").trim(),
      suggestedFix: String(q.suggestedFix || "").trim(),
      source: {
        label: String(q.sourceLabel || "AI check").trim(),
        detail: String(q.sourceDetail || "").trim(),
      },
    };
  });

  const flags = questions.filter((q) => q.status === "wrong" || q.status === "review");
  return {
    pageId: `page-${Date.now()}`,
    image,
    subjectLabel: String(subject || "Homework").trim() || "Homework",
    questions,
    counts: {
      total: questions.length,
      correct: questions.filter((q) => q.status === "correct").length,
      wrong: questions.filter((q) => q.status === "wrong").length,
      review: questions.filter((q) => q.status === "review").length,
    },
    flags,
  };
}

/* ── orchestration ───────────────────────────────────────────────────── */

async function postJSON(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "The scanner couldn't read this page. Please try again.");
  return data;
}

/**
 * Scan + evaluate one captured page through the 3-agent pipeline.
 * @param {string} rawDataUrl  the raw captured frame
 * @returns {Promise<object>}  { image (cropped), questions, flags, counts, ... }
 * @throws  {NotHomeworkError} when no page is detected
 */
export async function evaluatePage(rawDataUrl) {
  // Agent 1 — detect ONLY the page boundary.
  const det = await postJSON("/api/scan/detect", { image: rawDataUrl });
  if (det.detected === false) {
    throw new NotHomeworkError(
      det.message || "No page detected. Point the camera at a worksheet or document.",
    );
  }

  // Crop + align (client). Refine Gemini's rough corners with edge detection
  // for a precise crop; only crop when the quad plausibly covers the whole page.
  const rough = parseQuad(det.pageQuad);
  let cropped = rawDataUrl;
  if (rough && quadArea(rough) >= 0.2) {
    const quad = await refineQuad(rawDataUrl, rough);
    try {
      const { dataUrl } = await warpDocument(rawDataUrl, padQuad(quad, 0.03));
      cropped = dataUrl;
    } catch {
      cropped = rawDataUrl;
    }
  }
  cropped = await applyFilter(cropped, "auto").catch(() => cropped);

  // Agent 2 — mark the clean cropped page.
  const marked = await postJSON("/api/scan/evaluate", { image: cropped });

  // Agent 3 — verify & rectify (fall back to Agent 2's marking on failure).
  let subject = marked.subject;
  let questions = marked.questions;
  try {
    const verified = await postJSON("/api/scan/verify", { image: cropped, draft: marked });
    if (Array.isArray(verified.questions)) {
      questions = verified.questions;
      subject = verified.subject || subject;
    }
  } catch {
    /* keep Agent 2's result */
  }

  return buildResult(cropped, subject, questions);
}

/**
 * Fast single-call evaluation for the real-time Live Check. Marks the page on
 * the RAW frame (boxes relative to what the camera sees), so the highlights can
 * be overlaid live. No cropping/verify — speed over precision.
 * @param {string} rawDataUrl
 * @returns {Promise<object>}  { image, questions, flags, counts, ... }
 * @throws  {NotHomeworkError} when no page is detected
 */
export async function quickEvaluate(rawDataUrl) {
  const data = await postJSON("/api/scan/quick", { image: rawDataUrl });
  if (data.detected === false) {
    throw new NotHomeworkError(data.message || "Show your homework page to the camera.");
  }
  return buildResult(rawDataUrl, data.subject, data.questions);
}

/** Human-readable label + colour token for each question type. */
export const TYPE_META = {
  math: { label: "Math", paint: "azure" },
  science: { label: "Science", paint: "mint" },
  language: { label: "Language", paint: "mauve" },
};
