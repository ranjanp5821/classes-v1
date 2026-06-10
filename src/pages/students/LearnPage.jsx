import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Brain,
  Repeat,
  Compass,
  Sparkles,
  Target,
  Layers,
  FileText,
  Play,
  Volume2,
  MessageCircle,
  Lightbulb,
  PencilRuler,
  SearchCheck,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AuthModal from "../../components/AuthModal";
import VoiceAssistant from "../../components/VoiceAssistant";
import { useRole } from "../../hooks/useRole";

const ACCENT    = "#2563EB";
const GRADIENT  = "linear-gradient(135deg, #3B82F6 0%, #4F46E5 100%)";
const ACCENT_LIGHT = "#EBF0FD";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

/* ── Page data ───────────────────────────────────────────────────── */
const OUTCOMES = [
  { icon: Brain,    title: "Understand instead of memorising", body: "Build a clearer understanding of concepts rather than depending only on repetition and recall." },
  { icon: Repeat,   title: "Learn at your own pace",           body: "Pause, repeat, simplify, revisit, or explore a concept in another way without feeling rushed." },
  { icon: Compass,  title: "Know what to learn next",          body: "Follow a learning path based on your academic level, course, syllabus, and progress." },
  { icon: Sparkles, title: "Build confidence in difficult subjects", body: "Approach difficult topics step by step and strengthen your confidence before moving forward." },
];

const PATH_STEPS = ["Subject", "Module", "Topic", "Subtopic", "Learning Nugget"];

const CAPABILITIES = [
  { icon: Target,        label: "Personalised learning paths" },
  { icon: Layers,        label: "Smaller learning nuggets" },
  { icon: FileText,      label: "Written explanations" },
  { icon: Play,          label: "Video support" },
  { icon: Volume2,       label: "Read-aloud" },
  { icon: MessageCircle, label: "Text and voice questions" },
  { icon: Lightbulb,     label: "Real-life examples" },
  { icon: PencilRuler,   label: "Visual and worked examples" },
  { icon: SearchCheck,   label: "Beyond-syllabus exploration where appropriate" },
];

/* ── Page ────────────────────────────────────────────────────────── */
export default function LearnPage() {
  const navigate = useNavigate();
  const { activeRoleId, selectRole } = useRole();
  const [authModal, setAuthModal] = useState(null);

  useEffect(() => {
    if (activeRoleId !== "student") selectRole("student");
  }, [activeRoleId, selectRole]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Learn — Classess";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content");
    meta?.setAttribute(
      "content",
      "Understand difficult concepts clearly with a structured learning path, explanations, examples, and AI-guided support."
    );
    window.scrollTo({ top: 0 });
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc != null) meta.setAttribute("content", prevDesc);
    };
  }, []);

  const goHome = () => navigate("/");
  const openSignup = () => setAuthModal({ mode: "signup", pos: null });
  const authOpen = authModal !== null;

  return (
    <div className="min-h-screen bg-page">
      <div
        className="transition-[filter] duration-200"
        style={authOpen ? { filter: "blur(4px)" } : undefined}
        aria-hidden={authOpen}
      >
        <Navbar onOpenAuth={(mode, pos) => setAuthModal({ mode, pos })} />

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* soft brand glow */}
          <div
            className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full opacity-20 blur-3xl"
            style={{ background: GRADIENT }}
          />
          <div className="mx-auto max-w-5xl px-6 pt-28 pb-16 md:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[13px] text-ink-4">
              <button onClick={goHome} className="transition-colors hover:text-ink-2">
                Student Home
              </button>
              <ChevronRight size={14} />
              <span className="font-medium text-ink-3">Learn</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-3xl"
            >
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[12px] font-medium uppercase tracking-[0.18em]"
                style={{ background: ACCENT_LIGHT, color: ACCENT }}
              >
                <Brain size={13} /> Learn
              </span>
              <h1 className="mt-5 text-4xl font-serif font-medium leading-[1.08] tracking-tight text-ink md:text-6xl">
                Understand difficult concepts in a way that works for you.
              </h1>
              <p className="mt-6 text-[17px] leading-relaxed text-ink-3 md:text-[18px]">
                Classess.com® organises your subject into a structured learning path and breaks
                difficult topics into smaller, manageable learning steps.
              </p>
              <p className="mt-4 text-[17px] leading-relaxed text-ink-3 md:text-[18px]">
                Learn through explanations, examples, videos, voice support, read-aloud content,
                and AI-guided assistance until the concept becomes clear.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={openSignup}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: GRADIENT }}
                >
                  Start Learning <ArrowRight size={17} />
                </button>
                <button
                  onClick={goHome}
                  className="inline-flex items-center justify-center rounded-xl border border-line-2 bg-page px-6 py-3 text-[15px] font-semibold text-ink-2 transition-colors hover:bg-paper"
                >
                  Try a Sample Concept
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Main Student Outcomes ────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-16 md:px-8">
          <motion.div {...fadeUp}>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
              What you gain
            </p>
            <h2 className="mt-2 text-2xl font-serif font-medium tracking-tight text-ink md:text-3xl">
              Main Student Outcomes
            </h2>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {OUTCOMES.map((o, i) => {
              const Icon = o.icon;
              return (
                <motion.div
                  key={o.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                  className="group rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-line-2 hover:bg-page"
                >
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white"
                    style={{ background: GRADIENT }}
                  >
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-ink">{o.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-3">{o.body}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── How It Works: structured path ────────────────────── */}
        <section className="bg-paper py-16">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <h2 className="text-2xl font-serif font-medium tracking-tight text-ink md:text-3xl">
                A structured path from subject to understanding
              </h2>
              <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-ink-3">
                Each subject is organised into a clear academic structure. The platform then
                recommends what to learn based on the student's course, selected subject, previous
                progress, and academic goals.
              </p>
            </motion.div>

            {/* Stepped flow */}
            <motion.ol
              {...fadeUp}
              className="mt-10 flex flex-col gap-3 md:flex-row md:items-stretch md:gap-2"
            >
              {PATH_STEPS.map((step, i) => (
                <li key={step} className="flex items-center gap-2 md:flex-1 md:flex-col md:items-stretch md:gap-3">
                  <div className="flex w-full items-center gap-3 rounded-2xl border border-line bg-page px-4 py-4">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                      style={{ background: GRADIENT }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[15px] font-semibold text-ink">{step}</span>
                  </div>
                  {i < PATH_STEPS.length - 1 && (
                    <ChevronRight
                      size={20}
                      className="mx-auto shrink-0 rotate-90 text-line-2 md:rotate-0"
                    />
                  )}
                </li>
              ))}
            </motion.ol>
          </div>
        </section>

        {/* ── Supporting Capabilities ──────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-16 md:px-8">
          <motion.div {...fadeUp}>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
              Supporting evidence
            </p>
            <h2 className="mt-2 text-2xl font-serif font-medium tracking-tight text-ink md:text-3xl">
              Supporting Capabilities
            </h2>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.label}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: (i % 3) * 0.04 }}
                  className="flex items-center gap-3 rounded-xl border border-line bg-page px-4 py-4 transition-colors hover:bg-paper"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: ACCENT_LIGHT, color: ACCENT }}
                  >
                    <Icon size={17} />
                  </span>
                  <span className="text-[14.5px] text-ink-2">{c.label}</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Final outcome ────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 pb-20 md:px-8">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-3xl px-8 py-14 text-center md:px-12"
            style={{ background: GRADIENT }}
          >
            <h2 className="mx-auto max-w-2xl text-3xl font-serif font-medium leading-tight tracking-tight text-white md:text-4xl">
              Move from confusion to clarity.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-white/85">
              Classess.com® helps students understand what they are learning, why it matters, and
              how it connects to the next concept.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={openSignup}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold transition-transform hover:scale-[1.02]"
                style={{ color: ACCENT }}
              >
                Start Learning <ArrowRight size={17} />
              </button>
              <button
                onClick={goHome}
                className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Try a Sample Concept
              </button>
            </div>
          </motion.div>

          {/* Back to Student Home */}
          <div className="mt-10">
            <button
              onClick={goHome}
              className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-4 transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} /> Back to Student Home
            </button>
          </div>
        </section>

        <footer className="border-t border-line bg-paper py-10 text-center">
          <p className="text-[13px] font-medium text-ink-4">
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

      <VoiceAssistant />
    </div>
  );
}
