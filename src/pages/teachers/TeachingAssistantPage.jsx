import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Camera,
  FileText,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Send,
  Quote,
  Sparkles,
  Library,
  MessageCircle,
  Wand2,
  ListChecks,
  ScrollText,
  Eye,
  X,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AuthModal from "../../components/AuthModal";
import Footer from "../../components/Footer";
import BookScanner from "../../components/teacher/BookScanner";
import { useRole } from "../../hooks/useRole";
import {
  uploadBook,
  askLibrary,
  generateFromLibrary,
  formatSize,
} from "../../lib/teachingAssistant";

const GRADIENT = "linear-gradient(135deg, #22C55E 0%, #1CA363 100%)";
const ACCENT = "#1CA363";
const ACCENT_LIGHT = "#E8F7F0";

/* ── Citation chip ───────────────────────────────────────────────────── */
function Citation({ cite }) {
  if (!cite) return null;
  return (
    <div className="rounded-lg border border-line bg-paper px-3 py-2">
      <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-2">
        <Quote size={12} style={{ color: ACCENT }} />
        {cite.book}
        {cite.page != null && (
          <span className="font-mono font-medium text-ink-4">· p.{cite.page}</span>
        )}
      </p>
      {cite.quote && (
        <p className="mt-1 text-[12.5px] italic leading-relaxed text-ink-3">“{cite.quote}”</p>
      )}
    </div>
  );
}

/* ── Library (left rail) ─────────────────────────────────────────────── */
function LibraryRail({ books, onUpload, onRemove, onScan, onView, uploading }) {
  return (
    <div className="rounded-3xl border border-line bg-paper p-5">
      <div className="flex items-center gap-2">
        <Library size={18} style={{ color: ACCENT }} />
        <h2 className="text-[16px] font-semibold text-ink">Your Library</h2>
      </div>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">
        Upload a book once. Ask and generate from it — every answer cites the page.
      </p>

      <label
        className={`mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 text-[14px] font-semibold transition-colors ${
          uploading ? "opacity-60" : "hover:bg-page"
        }`}
        style={{ borderColor: ACCENT, color: ACCENT }}
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {uploading ? "Uploading…" : "Upload a book (PDF)"}
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
            e.target.value = "";
          }}
        />
      </label>

      <button
        onClick={onScan}
        disabled={uploading}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-line-2 bg-page px-4 py-2.5 text-[13.5px] font-semibold text-ink-2 transition-colors hover:bg-paper disabled:opacity-60"
      >
        <Camera size={15} style={{ color: ACCENT }} /> Scan a book (flip pages)
      </button>

      <div className="mt-4 space-y-2">
        {books.length === 0 && !uploading && (
          <p className="rounded-xl bg-page px-3 py-4 text-center text-[13px] text-ink-4">
            No books yet. Upload one to begin.
          </p>
        )}
        {books.map((b) => (
          <div
            key={b.uri}
            className="flex items-center gap-3 rounded-xl border border-line bg-page px-3 py-2.5"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: ACCENT_LIGHT, color: ACCENT }}
            >
              <FileText size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-medium text-ink">{b.displayName}</p>
              <p className="flex items-center gap-1.5 text-[12px] text-ink-4">
                <CheckCircle2 size={12} className="text-paint-grass" /> Ready
                {b.pages?.length
                  ? ` · ${b.pages.length} pages`
                  : b.sizeBytes
                    ? ` · ${formatSize(b.sizeBytes)}`
                    : ""}
              </p>
            </div>
            {b.pages?.length > 0 && (
              <button
                onClick={() => onView(b)}
                aria-label="View pages"
                title="View scanned pages"
                className="text-ink-4 transition-colors hover:text-ink"
              >
                <Eye size={16} />
              </button>
            )}
            <button
              onClick={() => onRemove(b.uri)}
              aria-label="Remove book"
              className="text-ink-4 transition-colors hover:text-paint-magenta"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Scanned-pages viewer ────────────────────────────────────────────── */
function BookPagesViewer({ book, index, setIndex, onClose }) {
  const pages = book.pages || [];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex flex-col bg-black/90"
    >
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <span className="truncate text-[15px] font-semibold">
          {book.displayName} · page {index + 1} of {pages.length}
        </span>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium hover:bg-white/20"
        >
          <X size={15} /> Close
        </button>
      </div>
      <div className="flex-1 overflow-auto px-4 pb-4">
        <img
          src={pages[index]}
          alt={`Page ${index + 1}`}
          className="mx-auto max-w-3xl rounded-lg"
        />
      </div>
      {/* Thumbnails for sequential review */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-5">
        {pages.map((src, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`shrink-0 overflow-hidden rounded-md ring-2 ${
              i === index ? "ring-white" : "ring-transparent"
            }`}
          >
            <img src={src} alt={`Page ${i + 1}`} className="h-16 w-12 object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Ask mode ────────────────────────────────────────────────────────── */
function AskPanel({ books, thread, onAsk, busy }) {
  const [q, setQ] = useState("");
  const endRef = useRef(null);
  const ready = books.length > 0;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread, busy]);

  const submit = () => {
    const text = q.trim();
    if (!text || !ready || busy) return;
    onAsk(text);
    setQ("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {thread.length === 0 && (
          <div className="rounded-2xl border border-line bg-paper p-6 text-center">
            <MessageCircle size={26} className="mx-auto" style={{ color: ACCENT }} />
            <p className="mt-2 text-[15px] font-semibold text-ink">Ask your books anything</p>
            <p className="mt-1 text-[13.5px] text-ink-3">
              {ready
                ? "e.g. “Explain photosynthesis with an example from the book.”"
                : "Upload a book first, then ask a question."}
            </p>
          </div>
        )}

        {thread.map((turn, i) => (
          <div key={i} className="space-y-2">
            {/* Question */}
            <div className="flex justify-end">
              <div
                className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-[14px] text-white"
                style={{ background: ACCENT }}
              >
                {turn.question}
              </div>
            </div>
            {/* Answer */}
            <div className="max-w-[92%]">
              {turn.pending ? (
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-line bg-paper px-4 py-3 text-[13.5px] text-ink-3">
                  <Loader2 size={15} className="animate-spin" /> Searching your library…
                </div>
              ) : turn.error ? (
                <div className="rounded-2xl border border-line bg-paper px-4 py-3 text-[13.5px] text-paint-magenta">
                  {turn.error}
                </div>
              ) : !turn.covered ? (
                <div className="flex items-start gap-2 rounded-2xl border border-line bg-[#FBF3DD] px-4 py-3 text-[13.5px] leading-relaxed text-ink-3">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0 text-paint-gold" />
                  {turn.message || "No sources in your library cover this."}
                </div>
              ) : (
                <div className="rounded-2xl rounded-bl-md border border-line bg-paper px-4 py-3">
                  <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-ink-2">
                    {turn.answer}
                  </p>
                  {turn.citations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="font-mono text-[10.5px] uppercase tracking-wide text-ink-4">
                        Sources
                      </p>
                      {turn.citations.map((c, j) => (
                        <Citation key={j} cite={c} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="mt-4 flex items-end gap-2">
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder={ready ? "Ask from your library…" : "Upload a book to start"}
          disabled={!ready || busy}
          className="max-h-32 min-h-[46px] flex-1 resize-none rounded-xl border border-line-2 bg-page px-4 py-3 text-[14px] text-ink outline-none focus:ring-2 focus:ring-[#1CA36322] disabled:opacity-60"
        />
        <button
          onClick={submit}
          disabled={!ready || busy || !q.trim()}
          className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-semibold text-white disabled:opacity-50"
          style={{ background: GRADIENT }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

/* ── Generate mode ───────────────────────────────────────────────────── */
function GeneratePanel({ books, busy, onGenerate, result }) {
  const [kind, setKind] = useState("mcq");
  const [topic, setTopic] = useState("");
  const ready = books.length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="rounded-2xl border border-line bg-paper p-4">
        <div className="flex gap-2">
          {[
            { id: "mcq", label: "MCQ maker", icon: ListChecks },
            { id: "lesson", label: "Lesson plan", icon: ScrollText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setKind(id)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13.5px] font-semibold transition-colors"
              style={
                kind === id
                  ? { background: ACCENT, color: "#fff" }
                  : { background: "var(--page)", color: "var(--ink-3)", border: "1px solid var(--line-2)" }
              }
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic (optional) — e.g. “Newton's laws”"
          className="mt-3 w-full rounded-lg border border-line-2 bg-page px-3 py-2.5 text-[14px] text-ink outline-none focus:ring-2 focus:ring-[#1CA36322]"
        />
        <button
          onClick={() => onGenerate(kind, topic.trim())}
          disabled={!ready || busy}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-semibold text-white disabled:opacity-50"
          style={{ background: GRADIENT }}
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
          {busy ? "Generating…" : ready ? "Generate (cited)" : "Upload a book first"}
        </button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        {result?.error && (
          <p className="rounded-2xl border border-line bg-paper px-4 py-3 text-[13.5px] text-paint-magenta">
            {result.error}
          </p>
        )}
        {result && !result.error && result.covered === false && (
          <div className="flex items-start gap-2 rounded-2xl border border-line bg-[#FBF3DD] px-4 py-3 text-[13.5px] text-ink-3">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-paint-gold" />
            {result.message || "Your library doesn't cover this topic."}
          </div>
        )}
        {result && !result.error && result.covered !== false && (
          <GenerateResult result={result} />
        )}
      </div>
    </div>
  );
}

function GenerateResult({ result }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {result.title && (
        <h3 className="text-[17px] font-serif font-medium text-ink">{result.title}</h3>
      )}

      {/* MCQs */}
      {result.kind === "mcq" &&
        Array.isArray(result.items) &&
        result.items.map((it, i) => (
          <div key={i} className="rounded-2xl border border-line bg-paper p-4">
            <p className="text-[14px] font-semibold text-ink">
              {i + 1}. {it.question}
            </p>
            <ul className="mt-2.5 space-y-1.5">
              {(it.options || []).map((opt, j) => {
                const correct = j === it.answerIndex;
                return (
                  <li
                    key={j}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13.5px]"
                    style={
                      correct
                        ? { background: ACCENT_LIGHT, color: "#0c5b3e", fontWeight: 600 }
                        : { color: "var(--ink-2)" }
                    }
                  >
                    <span className="font-mono text-[12px] text-ink-4">
                      {String.fromCharCode(65 + j)}
                    </span>
                    {opt}
                    {correct && <CheckCircle2 size={14} className="ml-auto text-paint-grass" />}
                  </li>
                );
              })}
            </ul>
            {it.citation && (
              <div className="mt-3">
                <Citation cite={it.citation} />
              </div>
            )}
          </div>
        ))}

      {/* Lesson plan */}
      {result.kind === "lesson" &&
        Array.isArray(result.sections) &&
        result.sections.map((s, i) => (
          <div key={i} className="rounded-2xl border border-line bg-paper p-4">
            <p className="text-[14px] font-semibold text-ink">{s.heading}</p>
            <p className="mt-1.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink-3">
              {s.content}
            </p>
            {s.citation && (
              <div className="mt-3">
                <Citation cite={s.citation} />
              </div>
            )}
          </div>
        ))}
    </motion.div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */
export default function TeachingAssistantPage() {
  const navigate = useNavigate();
  const { activeRoleId, selectRole } = useRole();
  const [authModal, setAuthModal] = useState(null);

  const [books, setBooks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [viewing, setViewing] = useState(null); // { book, index } for the pages viewer
  const [mode, setMode] = useState("ask"); // "ask" | "generate"

  const [thread, setThread] = useState([]);
  const [asking, setAsking] = useState(false);

  const [genResult, setGenResult] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (activeRoleId !== "teacher") selectRole("teacher");
  }, [activeRoleId, selectRole]);

  useEffect(() => {
    const prev = document.title;
    document.title = "Teaching Assistant — Classess";
    window.scrollTo({ top: 0 });
    return () => {
      document.title = prev;
    };
  }, []);

  const handleUpload = useCallback(async (file) => {
    setUploadError(null);
    setUploading(true);
    try {
      const book = await uploadBook(file);
      setBooks((b) => [...b, book]);
    } catch (err) {
      setUploadError(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }, []);

  const removeBook = useCallback((uri) => {
    setBooks((b) => b.filter((x) => x.uri !== uri));
  }, []);

  const handleAsk = useCallback(
    async (question) => {
      const idx = thread.length;
      setThread((t) => [...t, { question, pending: true, citations: [] }]);
      setAsking(true);
      try {
        const res = await askLibrary(books, question);
        setThread((t) =>
          t.map((turn, i) => (i === idx ? { question, pending: false, ...res } : turn)),
        );
      } catch (err) {
        setThread((t) =>
          t.map((turn, i) =>
            i === idx ? { question, pending: false, error: err?.message || "Failed." } : turn,
          ),
        );
      } finally {
        setAsking(false);
      }
    },
    [books, thread.length],
  );

  const handleGenerate = useCallback(
    async (kind, topic) => {
      setGenResult(null);
      setGenerating(true);
      try {
        const res = await generateFromLibrary(books, kind, { topic });
        setGenResult(res);
      } catch (err) {
        setGenResult({ error: err?.message || "Generation failed." });
      } finally {
        setGenerating(false);
      }
    },
    [books],
  );

  const authOpen = authModal !== null;

  return (
    <div className="min-h-screen bg-page">
      <div
        className="transition-[filter] duration-200"
        style={authOpen ? { filter: "blur(4px)" } : undefined}
        aria-hidden={authOpen}
      >
        <Navbar onOpenAuth={(m, pos) => setAuthModal({ mode: m, pos })} />

        <main className="mx-auto max-w-6xl px-6 pb-24 pt-28 md:px-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-4 transition-colors hover:text-ink"
          >
            <ArrowLeft size={15} /> Teacher Home
          </button>

          <header className="mt-5 max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
              Teaching Assistant
            </p>
            <h1 className="mt-2 text-3xl font-serif font-medium leading-tight tracking-tight text-ink md:text-4xl">
              Ask your books. Generate from them. Always cited.
            </h1>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-3">
              Upload a publisher's book once, then ask questions or generate lessons and MCQs —
              every answer points back to the exact book and page, and the assistant says so
              when your library doesn't cover something.
            </p>
          </header>

          {uploadError && (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#FBE3EC] px-3 py-2 text-[13px] text-paint-magenta">
              <AlertTriangle size={14} /> {uploadError}
            </p>
          )}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
            {/* Left: library */}
            <LibraryRail
              books={books}
              uploading={uploading}
              onUpload={handleUpload}
              onRemove={removeBook}
              onScan={() => setScanning(true)}
              onView={(book) => setViewing({ book, index: 0 })}
            />

            {/* Right: workspace */}
            <div className="flex min-h-[520px] flex-col rounded-3xl border border-line bg-page p-5">
              {/* Mode tabs */}
              <div className="mb-4 flex gap-2">
                {[
                  { id: "ask", label: "Ask", icon: MessageCircle },
                  { id: "generate", label: "Generate", icon: Sparkles },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setMode(id)}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors"
                    style={
                      mode === id
                        ? { background: ACCENT_LIGHT, color: ACCENT }
                        : { color: "var(--ink-4)" }
                    }
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {mode === "ask" ? (
                    <motion.div
                      key="ask"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      <AskPanel books={books} thread={thread} onAsk={handleAsk} busy={asking} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="generate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      <GeneratePanel
                        books={books}
                        busy={generating}
                        onGenerate={handleGenerate}
                        result={genResult}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>

      {scanning && (
        <BookScanner
          onClose={() => setScanning(false)}
          onBook={(book) => setBooks((b) => [...b, book])}
        />
      )}

      <AnimatePresence>
        {viewing && (
          <BookPagesViewer
            book={viewing.book}
            index={viewing.index}
            setIndex={(i) => setViewing((v) => ({ ...v, index: i }))}
            onClose={() => setViewing(null)}
          />
        )}
      </AnimatePresence>

      <AuthModal
        open={authOpen}
        mode={authModal?.mode ?? "signin"}
        position={authModal?.pos ?? null}
        initialRoleId="teacher"
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





