/**
 * StudentModulePage.jsx — Shared layout for the five student module pages.
 *
 * Driven by a content object from config/studentModules.js. Renders the
 * student-specific header (Navbar), a breadcrumb, the page heading + intro,
 * a "Main Student Outcomes" grid, flexible content blocks, a final-outcome
 * call to action, and a "Back to Student Home" link — one consistent layout
 * across Learn / Practice / Exam Preparation / Progress / AI Tutor.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import Navbar from "../Navbar";
import AuthModal from "../AuthModal";
import Assistant from "../Assistant";
import { useRole } from "../../hooks/useRole";

const ACCENT = "#2563EB";
const GRADIENT = "linear-gradient(135deg, #3B82F6 0%, #4F46E5 100%)";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

/* ── Content blocks ──────────────────────────────────────────────── */

function FlowBlock({ block }) {
  return (
    <motion.div {...fadeUp} className="mt-16">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
        {block.heading}
      </h2>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {block.steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span
              className="rounded-full px-4 py-2 text-[14px] font-semibold text-white"
              style={{ background: GRADIENT }}
            >
              {step}
            </span>
            {i < block.steps.length - 1 && (
              <ChevronRight size={18} className="text-neutral-300" />
            )}
          </div>
        ))}
      </div>
      {block.copy && (
        <p className="mt-6 max-w-3xl text-[16px] leading-relaxed text-neutral-600">
          {block.copy}
        </p>
      )}
    </motion.div>
  );
}

function ListBlock({ block }) {
  return (
    <motion.div {...fadeUp} className="mt-16">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
        {block.heading}
      </h2>
      {block.intro && (
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-neutral-600">
          {block.intro}
        </p>
      )}
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {block.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: ACCENT }}
            />
            <span className="text-[15px] text-neutral-700">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function ExampleBlock({ block }) {
  return (
    <motion.div {...fadeUp} className="mt-16">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
        {block.heading}
      </h2>
      <div className="mt-6 max-w-2xl overflow-hidden rounded-2xl border border-neutral-200">
        {block.rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-4 ${
              i !== block.rows.length - 1 ? "border-b border-neutral-100" : ""
            }`}
          >
            <span className="w-28 shrink-0 text-[13px] font-semibold uppercase tracking-wide text-neutral-400">
              {row.label}
            </span>
            <span className="text-[15px] text-neutral-800">{row.value}</span>
          </div>
        ))}
      </div>
      {block.copy && (
        <p className="mt-6 max-w-3xl text-[16px] leading-relaxed text-neutral-600">
          {block.copy}
        </p>
      )}
    </motion.div>
  );
}

function HighlightBlock({ block }) {
  return (
    <motion.div {...fadeUp} className="mt-16">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
        {block.heading}
      </h2>
      <div
        className="mt-6 rounded-2xl border border-neutral-100 p-6 md:p-8"
        style={{ background: "#EBF0FD" }}
      >
        <p
          className="flex items-center gap-2 text-xl font-semibold"
          style={{ color: ACCENT }}
        >
          <Sparkles size={20} />
          {block.text}
        </p>
        {block.copy && (
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-neutral-600">
            {block.copy}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function Block({ block }) {
  switch (block.kind) {
    case "flow":      return <FlowBlock block={block} />;
    case "list":      return <ListBlock block={block} />;
    case "example":   return <ExampleBlock block={block} />;
    case "highlight": return <HighlightBlock block={block} />;
    default:          return null;
  }
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function StudentModulePage({ module }) {
  const navigate = useNavigate();
  const { activeRoleId, selectRole } = useRole();
  const [authModal, setAuthModal] = useState(null);

  // Keep the selected role as "Student" while browsing module pages, so the
  // header shows the student nav and returning to "/" lands on the student home.
  useEffect(() => {
    if (activeRoleId !== "student") selectRole("student");
  }, [activeRoleId, selectRole]);

  // Per-page title + meta description (own shareable, indexable page).
  useEffect(() => {
    const prevTitle = document.title;
    document.title = module.docTitle;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content");
    if (meta && module.metaDescription) meta.setAttribute("content", module.metaDescription);
    window.scrollTo({ top: 0 });
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc != null) meta.setAttribute("content", prevDesc);
    };
  }, [module]);

  const goHome = () => navigate("/");
  const authOpen = authModal !== null;

  return (
    <div className="min-h-screen bg-white">
      <div
        className="transition-[filter] duration-200"
        style={authOpen ? { filter: "blur(4px)" } : undefined}
        aria-hidden={authOpen}
      >
        <Navbar onOpenAuth={(mode, pos) => setAuthModal({ mode, pos })} />

        <main className="mx-auto max-w-5xl px-6 pb-24 pt-28 md:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] text-neutral-400">
            <button onClick={goHome} className="transition-colors hover:text-neutral-700">
              Student Home
            </button>
            <ChevronRight size={14} />
            <span className="font-medium text-neutral-600">{module.navLabel}</span>
          </nav>

          {/* Heading + intro */}
          <motion.header {...fadeUp} className="mt-6 max-w-3xl">
            {module.productName && (
              <p className="mb-3 text-[14px] font-semibold" style={{ color: ACCENT }}>
                {module.productName}
              </p>
            )}
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-5xl">
              {module.heading}
            </h1>
            {module.intro.map((p) => (
              <p key={p} className="mt-5 text-[17px] leading-relaxed text-neutral-600">
                {p}
              </p>
            ))}
          </motion.header>

          {/* Main Student Outcomes */}
          <motion.section {...fadeUp} className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
              Main Student Outcomes
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {module.outcomes.map((o) => (
                <div
                  key={o.title}
                  className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6"
                >
                  <h3 className="text-[17px] font-semibold text-neutral-900">{o.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{o.body}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Flexible content blocks */}
          {module.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}

          {/* Final outcome + CTAs */}
          <motion.section
            {...fadeUp}
            className="mt-20 overflow-hidden rounded-3xl border border-neutral-100 p-8 md:p-12"
            style={{ background: "#EBF0FD" }}
          >
            <h2 className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-3xl">
              {module.final.heading}
            </h2>
            {module.final.copy && (
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-neutral-600">
                {module.final.copy}
              </p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setAuthModal({ mode: "signup", pos: null })}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: GRADIENT }}
              >
                {module.final.primary}
                <ArrowRight size={17} />
              </button>
              <button
                onClick={goHome}
                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-[15px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                {module.final.secondary}
              </button>
            </div>
          </motion.section>

          {/* Back to Student Home */}
          <div className="mt-12">
            <button
              onClick={goHome}
              className="inline-flex items-center gap-2 text-[14px] font-medium text-neutral-500 transition-colors hover:text-neutral-800"
            >
              <ArrowLeft size={16} />
              Back to Student Home
            </button>
          </div>
        </main>

        <footer className="border-t border-neutral-100 bg-neutral-50 py-10 text-center">
          <p className="text-[13px] font-medium text-neutral-400">
            © 2026 Classess · Independent Student Homepage · Built for Lifelong Learners
          </p>
        </footer>
      </div>

      <AuthModal
        open={authOpen}
        mode={authModal?.mode ?? "signin"}
        position={authModal?.pos ?? null}
        initialRoleId="student"
        onClose={() => setAuthModal(null)}
        onSelectRole={(roleId) => {
          selectRole(roleId);
          setAuthModal(null);
          navigate("/");
        }}
      />

      <Assistant />
    </div>
  );
}
