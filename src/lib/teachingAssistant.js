/**
 * teachingAssistant.js — Client for the teacher's multi-publisher library.
 *
 * Books are uploaded once to the Gemini Files API (via /api/library/upload) and
 * referenced by their file URI on every ask/generate call. The Gemini key stays
 * server-side. Answers and generated material are grounded in the books and
 * carry citations (book + page) — the Slate AI "never answer without a
 * citation" rule, enforced server-side and surfaced here.
 */

/** Read a File into a base64 data payload (strips the data: URL prefix). */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload one book and return its file reference.
 * @returns {Promise<{uri,name,mimeType,displayName,sizeBytes,state}>}
 */
export async function uploadBook(file) {
  const data = await fileToBase64(file);
  const res = await fetch("/api/library/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      mimeType: file.type || "application/pdf",
      data,
    }),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(out?.error || "Upload failed. Please try again.");
  return out;
}

/**
 * Turn camera-scanned pages into a book (stitched to a PDF server-side).
 * @param {Array<{data:string,w:number,h:number}>} pages  base64 JPEG + dims
 * @returns {Promise<{uri,name,mimeType,displayName,sizeBytes,pageCount,state}>}
 */
export async function scanBook(pages, filename = "Scanned book.pdf") {
  const res = await fetch("/api/library/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, pages }),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(out?.error || "Couldn't build the book. Please try again.");
  return out;
}

/** Shape books for the API (only what the server needs). */
function toBookRefs(books) {
  return books.map((b) => ({ uri: b.uri, mimeType: b.mimeType, title: b.displayName }));
}

/**
 * Ask a question against the library.
 * @returns {Promise<{covered,answer,citations,message}>}
 */
export async function askLibrary(books, question) {
  const res = await fetch("/api/library/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ books: toBookRefs(books), question }),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(out?.error || "Couldn't get an answer. Please try again.");
  return {
    covered: out.covered !== false,
    answer: String(out.answer || ""),
    citations: Array.isArray(out.citations) ? out.citations : [],
    message: String(out.message || ""),
  };
}

/**
 * Generate teaching material (MCQs or a lesson plan) from the library.
 * @param {Array}  books
 * @param {"mcq"|"lesson"} kind
 * @param {object} opts  { topic, count }
 */
export async function generateFromLibrary(books, kind, { topic = "", count = 5 } = {}) {
  const res = await fetch("/api/library/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ books: toBookRefs(books), kind, topic, count }),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(out?.error || "Generation failed. Please try again.");
  return out;
}

/** Pretty-print a byte count. */
export function formatSize(bytes) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
