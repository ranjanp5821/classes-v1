import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  BookOpen,
  Building2,
  Target,
  Lightbulb,
  ShieldCheck,
  Layers,
  TrendingUp,
  Brain,
  GraduationCap,
  Network,
  FlaskConical,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import Footer from "../components/Footer";
import { useRole } from "../hooks/useRole";

const GRADIENT = "linear-gradient(135deg, #1e293b 0%, #334155 100%)";
const ACCENT   = "#1e293b";
const ACCENT_LIGHT = "#f1f5f9";

const fadeUp = {
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

/* ── Section data ── */

const PRINCIPLES = [
  {
    icon: Users,
    title: "Student-centred",
    body:  "Every product, workflow, and decision starts with what is best for the student's learning and academic progress.",
  },
  {
    icon: GraduationCap,
    title: "Teacher-empowered",
    body:  "Teachers are supported with better information and reduced administrative work, not replaced by automation.",
  },
  {
    icon: Building2,
    title: "Institution-aware",
    body:  "Institutions receive the academic intelligence they need to make better decisions at the right level.",
  },
  {
    icon: Target,
    title: "Outcome-oriented",
    body:  "Every feature and capability is designed to improve a real, measurable academic outcome.",
  },
];

const ECOSYSTEM_ROLES = [
  {
    role:    "Student",
    icon:    Users,
    desc:    "At the centre of every decision",
    ring:    0,
    color:   "#1e293b",
    bg:      "#f8fafc",
  },
  {
    role:    "Teacher",
    icon:    GraduationCap,
    desc:    "Closest to the student's learning",
    ring:    1,
    color:   "#1d4ed8",
    bg:      "#eff6ff",
  },
  {
    role:    "Institution",
    icon:    Building2,
    desc:    "Surrounding the learning system",
    ring:    2,
    color:   "#0f766e",
    bg:      "#f0fdfa",
  },
  {
    role:    "Parent / Supporter",
    icon:    ShieldCheck,
    desc:    "Connected appropriately",
    ring:    2,
    color:   "#7c3aed",
    bg:      "#f5f3ff",
  },
  {
    role:    "Classess® Intelligence",
    icon:    Brain,
    desc:    "Linking information and action",
    ring:    3,
    color:   "#c2410c",
    bg:      "#fff7ed",
  },
];

const INTEL_LAYERS = [
  { n: 1, label: "Software",               desc: "Tools that capture and organise academic activity" },
  { n: 2, label: "Data",                   desc: "Structured learning evidence across subjects and students" },
  { n: 3, label: "Intelligence",           desc: "Patterns, gaps, and insights derived from academic data" },
  { n: 4, label: "Workflow Support",       desc: "Guided next actions for teachers, students, and institutions" },
  { n: 5, label: "Institutional Knowledge", desc: "Accumulated understanding that improves decisions over time" },
  { n: 6, label: "Better Outcomes",        desc: "Visible improvement in learning, teaching, and academic results" },
];

const AI_STEPS = [
  { n: 1, label: "Academic context",              icon: BookOpen },
  { n: 2, label: "Permission and privacy check",  icon: ShieldCheck },
  { n: 3, label: "Protected AI processing",       icon: FlaskConical },
  { n: 4, label: "Suggested output",              icon: Lightbulb },
  { n: 5, label: "Teacher or authorised review",  icon: GraduationCap },
  { n: 6, label: "Approved action",               icon: Target },
];

const ECOSYSTEM_GROUPS = [
  {
    title:    "Learning and Academic Intelligence",
    color:    "#1d4ed8",
    bg:       "#eff6ff",
    products: ["Classess®", "Vidya", "Independent Student Application", "Independent Teacher Application", "Institution Academic Intelligence Platform"],
  },
  {
    title:    "Institution Operations and Engagement",
    color:    "#0f766e",
    bg:       "#f0fdfa",
    products: ["Edmission", "Feenance", "Kaho.chat", "PTM", "SIS Vault"],
  },
  {
    title:    "Content and Partnerships",
    color:    "#7c3aed",
    bg:       "#f5f3ff",
    products: ["Publisher Platform", "E-Content Platform", "Academic Consultant Platform", "School Blueprint", "Curriculum and Assessment Solutions"],
  },
];

/* ── Page ── */

export default function AboutPage() {
  const navigate  = useNavigate();
  const { selectRole } = useRole();
  const [authModal, setAuthModal] = useState(null);
  const authOpen = authModal !== null;

  useEffect(() => {
    const prev = document.title;
    document.title = "About — Classess";
    window.scrollTo({ top: 0 });
    return () => { document.title = prev; };
  }, []);

  const openSignup = () => setAuthModal({ mode: "signup", pos: null });

  return (
    <div className="min-h-screen bg-page">
      <div
        className="transition-[filter] duration-200"
        style={authOpen ? { filter: "blur(4px)" } : undefined}
        aria-hidden={authOpen}
      >
        <Navbar onOpenAuth={(mode, pos) => setAuthModal({ mode, pos })} />

        {/* ════════════════════════════════════════════════════════
            S1 — About Hero
        ════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-40 right-[-8%] h-[480px] w-[480px] rounded-full opacity-[0.07] blur-3xl"
            style={{ background: GRADIENT }}
          />
          <div className="mx-auto max-w-5xl px-6 pt-28 pb-20 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <h1 className="text-4xl font-serif font-medium leading-[1.08] tracking-tight text-ink md:text-[58px]">
                Every student seen, supported, and learning at their best.
              </h1>
              <p className="mt-6 w-full text-[17px] leading-relaxed text-ink-3 md:text-[18px]">
                Classess.com® is an AI-native Academic Intelligence Platform that puts the student
                at the centre, empowers teachers with intelligent support, and helps institutions
                make better academic decisions.
              </p>
              <p className="mt-4 w-full text-[17px] leading-relaxed text-ink-3 md:text-[18px]">
                We connect learning, teaching, assessment, student support, and institutional
                intelligence in one responsible, education-first ecosystem.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={openSignup}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: GRADIENT }}
                >
                  Get Started <ArrowRight size={17} />
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center justify-center rounded-xl border border-line-2 bg-page px-6 py-3 text-[15px] font-semibold text-ink-2 transition-colors hover:bg-paper"
                >
                  Explore the Platform
                </button>
              </div>
            </motion.div>

            {/* Media placeholder — ABOUT-M01 */}
            <motion.div
              {...fadeUp}
              className="mt-14 flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper md:min-h-[340px]"
            >
              <div className="text-center">
                <Network size={36} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media ABOUT-M01
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Brand-purpose animation — student-centred ecosystem
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S2 — Why Classess® Exists
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
                Why we exist
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                From disconnected tools to one connected academic journey.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                Lesson plans, assessments, feedback, reports, and student activity often exist in
                separate systems with no shared thread. Teachers cannot see the full picture.
                Institutions cannot act on what they do not know. Students receive support that is
                too late or too general.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-3">
                Classess.com® brings this information together into one connected academic
                intelligence layer — making the right action visible at the right time.
              </p>
            </motion.div>

            {/* Flow diagram */}
            <motion.div
              {...fadeUp}
              className="mt-12 flex flex-col items-stretch gap-3 md:flex-row md:items-center"
            >
              {[
                "Disconnected information",
                "Connected learning profile",
                "Clear insight",
                "Recommended action",
              ].map((step, i, arr) => (
                <div key={step} className="flex flex-1 flex-col items-center gap-3 md:flex-row">
                  <div className="w-full rounded-2xl border border-line bg-page px-5 py-5 text-center md:text-left">
                    <span
                      className="inline-block h-6 w-6 rounded-full text-center text-[12px] font-bold leading-6 text-white"
                      style={{ background: GRADIENT }}
                    >
                      {i + 1}
                    </span>
                    <p className="mt-3 text-[14.5px] font-semibold text-ink">{step}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <ChevronRight
                      size={20}
                      className="shrink-0 rotate-90 text-ink-4 md:rotate-0"
                    />
                  )}
                </div>
              ))}
            </motion.div>

            {/* Media placeholder — ABOUT-M02 */}
            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[200px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-page"
            >
              <div className="text-center">
                <Layers size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media ABOUT-M02
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Academic information-flow animation — disconnected to connected
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S3 — Built from First Principles
        ════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
                Our foundation
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Built from first principles, not from copies.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                Every product, workflow, and capability at Classess.com® is designed around four
                core principles. These are not aspirational statements — they are the filter through
                which every decision is made.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              {PRINCIPLES.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.title}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.07 }}
                    className="rounded-2xl border border-line bg-paper p-7 transition-colors hover:border-line-2"
                  >
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white"
                      style={{ background: GRADIENT }}
                    >
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-5 text-[18px] font-semibold text-ink">{p.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-3">{p.body}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Media placeholder — ABOUT-M03 */}
            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper"
            >
              <div className="text-center">
                <FlaskConical size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media ABOUT-M03
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Four-principle animation
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S4 — Student at the Centre
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
                Our model
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                The student at the centre of every decision.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                The Classess.com® model places the student at the centre of the academic system.
                Teachers work closest to the student's learning. Institutions provide the surrounding
                structure and resources. Parents and authorised supporters are connected
                appropriately. Academic intelligence links information and action across every layer.
              </p>
            </motion.div>

            {/* Ecosystem cards */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ECOSYSTEM_ROLES.map((r, i) => {
                const Icon = r.icon;
                return (
                  <motion.div
                    key={r.role}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                    className="flex items-start gap-4 rounded-2xl border border-line bg-page p-6 transition-colors hover:border-line-2"
                  >
                    <span
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: r.bg, color: r.color }}
                    >
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-ink">{r.role}</p>
                      <p className="mt-1 text-[13.5px] text-ink-3">{r.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Media placeholder — ABOUT-M04 */}
            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[200px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper"
            >
              <div className="text-center">
                <Network size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media ABOUT-M04
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Circular relationship animation — student-centred ecosystem
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S5 — From Software to Academic Intelligence
        ════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
                Our technology
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                From software to Academic Intelligence.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                Classess.com® is not simply a school management system or a set of teaching tools.
                Value increases as academic information becomes connected and actionable — moving
                from software through data, intelligence, and workflow support toward institutional
                knowledge and better outcomes.
              </p>
            </motion.div>

            {/* Layer progression */}
            <div className="mt-10 flex flex-col gap-3">
              {INTEL_LAYERS.map((layer, i) => (
                <motion.div
                  key={layer.label}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                  className="flex items-center gap-5 rounded-2xl border border-line bg-paper px-6 py-5 transition-colors hover:border-line-2"
                  style={{
                    paddingLeft: `${1.5 + i * 0.35}rem`,
                  }}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold text-white"
                    style={{ background: GRADIENT, opacity: 0.65 + i * 0.07 }}
                  >
                    {layer.n}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink">{layer.label}</p>
                    <p className="mt-0.5 text-[13.5px] text-ink-3">{layer.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Media placeholder — ABOUT-M05 */}
            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper"
            >
              <div className="text-center">
                <TrendingUp size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media ABOUT-M05
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Layer-building animation — software to academic intelligence
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S6 — Responsible AI
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
                Our commitment
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Responsible AI, designed for education.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                AI in Classess.com® is always controlled by humans. Every AI-generated suggestion
                or action passes through academic context, privacy checks, and authorised review
                before it reaches a student, teacher, or institution. AI supports educators — it
                does not replace them.
              </p>
            </motion.div>

            {/* Workflow steps */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {AI_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.label}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                    className="flex items-start gap-4 rounded-2xl border border-line bg-page p-6 transition-colors hover:border-line-2"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold text-white"
                      style={{ background: GRADIENT }}
                    >
                      {step.n}
                    </span>
                    <div className="mt-0.5">
                      <Icon size={17} className="mb-2 text-ink-4" />
                      <p className="text-[14.5px] font-semibold text-ink">{step.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Media placeholder — ABOUT-M06 */}
            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper"
            >
              <div className="text-center">
                <ShieldCheck size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media ABOUT-M06
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Human-controlled AI workflow animation
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S7 — The Classess® Ecosystem
        ════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
                Our products
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                The Classess® Ecosystem.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                Classess.com® is a family of products built around three interconnected areas —
                learning and academic intelligence, institution operations and engagement, and
                content and partnerships.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {ECOSYSTEM_GROUPS.map((group, i) => (
                <motion.div
                  key={group.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                  className="rounded-2xl border border-line bg-paper p-7"
                >
                  <p
                    className="text-[13px] font-semibold uppercase tracking-[0.12em]"
                    style={{ color: group.color }}
                  >
                    {group.title}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {group.products.map((prod) => (
                      <li key={prod} className="flex items-center gap-2.5 text-[14.5px] text-ink-2">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: group.color }}
                        />
                        {prod}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Media placeholder — ABOUT-M07 */}
            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper"
            >
              <div className="text-center">
                <Network size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media ABOUT-M07
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Connected product-ecosystem animation
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S8 — Our Vision
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
                Our vision
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                A future where every student has clearer academic direction.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                We believe students learn better when they can see what they understand, what they
                need to work on, and what to do next. Teachers are more effective when they have the
                right information at the right time. Institutions improve when they can act on
                academic knowledge rather than administrative reports alone.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-3">
                Classess.com® is working toward a realistic future where responsible intelligence
                makes this possible — for every student, teacher, and institution, regardless of
                location, language, or resource level.
              </p>
            </motion.div>

            {/* Media placeholder — ABOUT-M08 */}
            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[240px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-page"
            >
              <div className="text-center">
                <Lightbulb size={36} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media ABOUT-M08
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Short brand film — future of learning
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            Final CTA
        ════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div
              {...fadeUp}
              className="relative overflow-hidden rounded-3xl px-8 py-16 text-center md:px-14"
              style={{ background: GRADIENT }}
            >
              <h2 className="mx-auto max-w-2xl text-3xl font-serif font-medium leading-tight tracking-tight text-white md:text-4xl">
                Ready to see Classess.com® in action?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/80">
                Whether you are a student, teacher, or institution — there is a clear starting
                point for you.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={openSignup}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold transition-transform hover:scale-[1.02]"
                  style={{ color: ACCENT }}
                >
                  Get Started <ArrowRight size={17} />
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Contact Us
                </button>
              </div>
            </motion.div>
          </div>
        </section>

      </div>

      <AuthModal
        open={authOpen}
        mode={authModal?.mode ?? "signin"}
        position={authModal?.pos ?? null}
        initialRoleId={null}
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
