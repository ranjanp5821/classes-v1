/**
 * StudentHome.jsx — Independent Student Homepage
 *
 * Marketing/landing content shown below the shared Hero once the Student role
 * is selected. Copy and structure follow the "Classess.com® — Independent
 * Student Homepage" specification.
 *
 * Sections (in order):
 *   1. Student Hero            (#student-hero)
 *   2. Transformation          (#how-it-helps)
 *   3. Concept Understanding   (#concepts)
 *   4. Purposeful Practice     (#practice)
 *   5. Learning Gaps & Exam    (#exam-prep)
 *   6. Progress & Improvement  (#progress)
 *   7. Independent Learning    (#ai-tutor)
 *   8. Final Call to Action    (#start)
 *   9. Frequently Asked Q's    (#faq)
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Target,
  Lightbulb,
  PencilRuler,
  GraduationCap,
  Compass,
  SearchCheck,
  ListChecks,
  BookOpen,
  RefreshCw,
  Brain,
  Repeat,
  Layers,
  CalendarDays,
  CheckCircle2,
  BarChart3,
  Sparkles,
  MessageCircle,
  Plus,
  Minus,
} from "lucide-react";

/* ── Theming ──────────────────────────────────────────────────────── */
const ACCENT = "#0ea5e9";
const GRADIENT = "linear-gradient(135deg, #0ea5e9, #38bdf8)";

/* ── Animation helper ─────────────────────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

/* ── Layout primitives ────────────────────────────────────────────── */
function Section({ id, alt = false, children }) {
  return (
    <section id={id} className={`w-full py-20 sm:py-24 ${alt ? "bg-neutral-50/70" : "bg-white"}`}>
      <div className="max-w-5xl mx-auto px-6 sm:px-8">{children}</div>
    </section>
  );
}

function Eyebrow({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10.5px] font-bold uppercase tracking-widest"
      style={{ background: `${ACCENT}12`, color: ACCENT, border: `1px solid ${ACCENT}25` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
      {children}
    </span>
  );
}

function Heading({ children, className = "" }) {
  return (
    <h2 className={`font-display font-bold text-neutral-900 tracking-tight leading-[1.12] text-[clamp(1.7rem,3.6vw,2.6rem)] ${className}`}>
      {children}
    </h2>
  );
}

function Lead({ children, className = "" }) {
  return <p className={`text-[15.5px] sm:text-[16px] text-neutral-500 leading-relaxed ${className}`}>{children}</p>;
}

function PrimaryButton({ children, icon: Icon = ArrowRight }) {
  return (
    <button
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-[14.5px] shadow-md transition-all duration-200 hover:opacity-90 active:scale-95"
      style={{ background: GRADIENT }}
    >
      {children}
      {Icon && <Icon size={16} />}
    </button>
  );
}

function SecondaryButton({ children, icon: Icon }) {
  return (
    <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-neutral-700 text-[14.5px] border border-neutral-200 bg-white transition-all duration-200 hover:bg-neutral-50 active:scale-95">
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function BenefitList({ items }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5 text-[14.5px] text-neutral-700 leading-snug">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Card({ icon: Icon, title, children, className = "" }) {
  return (
    <div className={`bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] ${className}`}>
      {Icon && (
        <div className="inline-flex p-2.5 rounded-xl mb-4" style={{ background: `${ACCENT}10`, color: ACCENT }}>
          <Icon size={20} />
        </div>
      )}
      <h3 className="text-[16px] font-bold text-neutral-900 font-display mb-1.5">{title}</h3>
      <p className="text-[14px] text-neutral-500 leading-relaxed">{children}</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   1. STUDENT HERO
   ════════════════════════════════════════════════════════════════════ */
function StudentHeroSection() {
  const preview = [
    { icon: Target, label: "Today's learning goal", value: "Quadratic Equations" },
    { icon: Lightbulb, label: "Recommended concept", value: "Completing the square" },
    { icon: PencilRuler, label: "Recommended practice", value: "Application Challenge" },
    { icon: GraduationCap, label: "Examination readiness", value: "68% syllabus covered" },
  ];

  return (
    <section
      id="student-hero"
      className="relative w-full overflow-hidden py-20 sm:py-24"
      style={{ backgroundImage: `radial-gradient(ellipse 70% 55% at 50% 0%, ${ACCENT}14 0%, transparent 70%)` }}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Copy */}
        <motion.div {...fadeUp}>
          <Eyebrow>For Students</Eyebrow>
          <Heading className="mt-5">Stop studying without direction.</Heading>
          <Lead className="mt-5 max-w-[520px]">
            Classess.com® creates a personalised learning path based on your subjects, academic
            level, goals, and progress—so you always know what to learn, where you need support, and
            what to do next.
          </Lead>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton>Start My Learning Path</PrimaryButton>
            <SecondaryButton icon={Play}>See How It Works</SecondaryButton>
          </div>
          <p className="mt-6 text-[14px] font-semibold text-neutral-600">
            Learning works best when it feels like it was built for you.
          </p>
        </motion.div>

        {/* Clean dashboard preview — only four items */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl border border-neutral-100 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <span className="text-[12px] font-bold uppercase tracking-widest text-neutral-400">Your Learning Today</span>
            <span className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-200" />
              <span className="w-2 h-2 rounded-full bg-neutral-200" />
              <span className="w-2 h-2 rounded-full" style={{ background: ACCENT }} />
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {preview.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-100">
                <div className="p-2.5 rounded-xl shrink-0" style={{ background: `${ACCENT}12`, color: ACCENT }}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-semibold uppercase tracking-wide text-neutral-400">{label}</div>
                  <div className="text-[14.5px] font-bold text-neutral-800 truncate">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   2. STUDENT TRANSFORMATION — "How It Helps"
   ════════════════════════════════════════════════════════════════════ */
function TransformationSection() {
  const journey = ["Understand", "Practise", "Improve", "Prepare", "Progress"];
  const cards = [
    {
      icon: Compass,
      title: "Know what to learn",
      copy: "Receive a structured learning path based on your course, academic level, selected subjects, and examination goals.",
    },
    {
      icon: SearchCheck,
      title: "Understand where you need help",
      copy: "See the topics you understand, the concepts that need attention, and the mistakes that are holding you back.",
    },
    {
      icon: ListChecks,
      title: "Know what to do next",
      copy: "Get a clear recommendation for the next concept, practice activity, revision task, or assessment.",
    },
  ];

  return (
    <Section id="how-it-helps" alt>
      <motion.div {...fadeUp} className="max-w-[680px]">
        <Eyebrow>How It Helps</Eyebrow>
        <Heading className="mt-5">From unstructured studying to a clear path forward.</Heading>
        <Lead className="mt-5">
          Studying independently should not mean figuring out everything alone. Classess.com®
          connects learning, practice, feedback, revision, and examination preparation into one
          guided journey.
        </Lead>
      </motion.div>

      {/* Visible journey */}
      <motion.div {...fadeUp} className="mt-9 flex flex-wrap items-center gap-2.5">
        {journey.map((step, i) => (
          <div key={step} className="flex items-center gap-2.5">
            <span
              className="px-4 py-2 rounded-full text-[13.5px] font-semibold bg-white border"
              style={{ borderColor: `${ACCENT}30`, color: ACCENT }}
            >
              {step}
            </span>
            {i < journey.length - 1 && <ArrowRight size={16} className="text-neutral-300" />}
          </div>
        ))}
      </motion.div>

      {/* Three cards */}
      <div className="mt-10 grid sm:grid-cols-3 gap-5">
        {cards.map((c, i) => (
          <motion.div key={c.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
            <Card icon={c.icon} title={c.title} className="h-full">
              {c.copy}
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   3. CONCEPT UNDERSTANDING
   ════════════════════════════════════════════════════════════════════ */
function ConceptSection() {
  const benefits = [
    "Understand concepts instead of only memorising answers",
    "Learn difficult topics in smaller, manageable steps",
    "Ask questions using text or voice",
    "Revisit explanations whenever required",
    "Build confidence before moving to the next topic",
  ];
  const ways = [
    { icon: BookOpen, title: "Simple explanation", copy: "A plain-language breakdown of the core idea." },
    { icon: Lightbulb, title: "Real-life example", copy: "See the concept applied to something familiar." },
    { icon: PencilRuler, title: "Worked or visual example", copy: "Follow it step by step until it clicks." },
  ];

  return (
    <Section id="concepts">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Copy */}
        <motion.div {...fadeUp}>
          <Eyebrow>Understand Concepts</Eyebrow>
          <Heading className="mt-5">Difficult concepts can become easier to understand.</Heading>
          <Lead className="mt-5">
            Classess.com® breaks large topics into smaller learning steps and helps you explore them
            through clear explanations, examples, videos, voice support, and read-aloud content.
          </Lead>
          <Lead className="mt-3">
            Ask questions, request a simpler explanation, or explore another example until the
            concept becomes clear.
          </Lead>
          <div className="mt-7">
            <BenefitList items={benefits} />
          </div>
          <div className="mt-8">
            <PrimaryButton icon={BookOpen}>Start Learning a Concept</PrimaryButton>
          </div>
        </motion.div>

        {/* One concept, three explanations */}
        <motion.div {...fadeUp} className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-neutral-400">
            <Sparkles size={14} style={{ color: ACCENT }} />
            One concept · three ways
          </div>
          {ways.map((w, i) => (
            <motion.div
              key={w.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-neutral-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
            >
              <div className="p-2.5 rounded-xl shrink-0" style={{ background: `${ACCENT}10`, color: ACCENT }}>
                <w.icon size={18} />
              </div>
              <div>
                <div className="text-[14.5px] font-bold text-neutral-900">{w.title}</div>
                <div className="text-[13.5px] text-neutral-500 mt-0.5 leading-relaxed">{w.copy}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   4. PURPOSEFUL PRACTICE
   ════════════════════════════════════════════════════════════════════ */
function PracticeSection() {
  const cards = [
    {
      icon: Brain,
      title: "Strengthen recall",
      copy: "Remember important concepts, terms, formulas, and relationships more effectively.",
    },
    {
      icon: Layers,
      title: "Apply what you learn",
      copy: "Move beyond recognition by answering application-based and reasoning questions.",
    },
    {
      icon: Repeat,
      title: "Build long-term retention",
      copy: "Revisit important topics at the right time instead of relying only on last-minute revision.",
    },
  ];

  return (
    <Section id="practice" alt>
      <motion.div {...fadeUp} className="max-w-[680px]">
        <Eyebrow>Purposeful Practice</Eyebrow>
        <Heading className="mt-5">Do not just practise more. Practise what matters.</Heading>
        <Lead className="mt-5">
          Classess.com® recommends practice based on what you are learning, how you have performed,
          and where you need improvement.
        </Lead>
        <Lead className="mt-3">
          Use quizzes, flashcards, reasoning exercises, concept matching, written responses,
          self-tests, and gamified challenges to strengthen understanding in different ways.
        </Lead>
      </motion.div>

      <div className="mt-10 grid sm:grid-cols-3 gap-5">
        {cards.map((c, i) => (
          <motion.div key={c.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
            <Card icon={c.icon} title={c.title} className="h-full">
              {c.copy}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recommendation card + highlight */}
      <div className="mt-10 grid lg:grid-cols-2 gap-5 items-center">
        <motion.div
          {...fadeUp}
          className="rounded-2xl p-6 border text-white"
          style={{ background: GRADIENT, borderColor: "transparent" }}
        >
          <div className="text-[12px] font-bold uppercase tracking-widest opacity-80 mb-2">Recommended for you</div>
          <p className="text-[17px] font-semibold leading-snug">
            "You understand the concept. Now strengthen application."
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-lg px-3.5 py-2 text-[13.5px] font-semibold backdrop-blur">
            <PencilRuler size={15} />
            Recommended activity: Application Challenge
          </div>
        </motion.div>
        <motion.p {...fadeUp} className="text-[18px] sm:text-[20px] font-bold text-neutral-900 font-display leading-snug">
          Every practice activity should move you closer to mastery.
        </motion.p>
      </div>

      <motion.div {...fadeUp} className="mt-8">
        <PrimaryButton icon={PencilRuler}>Explore Practice Activities</PrimaryButton>
      </motion.div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   5. LEARNING GAPS & EXAMINATION PREPARATION
   ════════════════════════════════════════════════════════════════════ */
function ExamPrepSection() {
  const insights = [
    "Concepts you have understood",
    "Questions you found difficult",
    "Mistakes that are repeating",
    "Topics requiring revision",
    "Skills that need more practice",
    "Recommended next actions",
  ];
  const planBenefits = [
    "Know what to study each day",
    "Complete the syllabus more systematically",
    "Give additional time to difficult topics",
    "Balance learning with practice",
    "Revise before the examination",
    "Reduce last-minute stress",
  ];
  const plan = [
    { day: "Mon", actions: ["Learn", "Practise", "Revise"] },
    { day: "Tue", actions: ["Learn", "Practise", "Revise"] },
    { day: "Wed", actions: ["Learn", "Practise", "Revise"] },
  ];

  return (
    <Section id="exam-prep">
      {/* Learning gaps */}
      <motion.div {...fadeUp} className="max-w-[680px]">
        <Eyebrow>Find Your Gaps</Eyebrow>
        <Heading className="mt-5">Find your learning gaps before the examination finds them.</Heading>
        <Lead className="mt-5">A score only shows how you performed. Classess.com® helps you understand why.</Lead>
        <Lead className="mt-3">
          After practice and assessments, you can see which concepts are clear, which mistakes are
          repeating, what you left unattempted, and what needs further revision.
        </Lead>
      </motion.div>

      <motion.div {...fadeUp} className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {insights.map((t) => (
          <div key={t} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <SearchCheck size={17} className="shrink-0" style={{ color: ACCENT }} />
            <span className="text-[14px] font-medium text-neutral-700">{t}</span>
          </div>
        ))}
      </motion.div>

      {/* Study plan subsection */}
      <div className="mt-16 grid lg:grid-cols-2 gap-12 items-start">
        <motion.div {...fadeUp}>
          <h3 className="font-display font-bold text-neutral-900 tracking-tight text-[clamp(1.4rem,2.6vw,1.9rem)] leading-snug">
            Turn your examination date into a practical study plan.
          </h3>
          <Lead className="mt-4">
            Add your examination date, subjects, syllabus, and available study time. Classess.com®
            creates a preparation plan that balances learning, practice, revision, self-testing, and
            weak-topic improvement.
          </Lead>
          <div className="mt-6">
            <BenefitList items={planBenefits} />
          </div>
          <div className="mt-8">
            <PrimaryButton icon={CalendarDays}>Create My Study Plan</PrimaryButton>
          </div>
        </motion.div>

        {/* Short weekly plan — Learn → Practise → Revise */}
        <motion.div {...fadeUp} className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-neutral-400 mb-5">
            <CalendarDays size={14} style={{ color: ACCENT }} />
            This week's plan
          </div>
          <div className="flex flex-col gap-3">
            {plan.map(({ day, actions }) => (
              <div key={day} className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-[13px] font-bold text-neutral-500">{day}</span>
                <div className="flex flex-wrap items-center gap-2">
                  {actions.map((a, i) => (
                    <div key={a} className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-lg text-[12.5px] font-semibold" style={{ background: `${ACCENT}10`, color: ACCENT }}>
                        {a}
                      </span>
                      {i < actions.length - 1 && <ArrowRight size={13} className="text-neutral-300" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   6. PROGRESS & IMPROVEMENT
   ════════════════════════════════════════════════════════════════════ */
function ProgressSection() {
  const cards = [
    { icon: CheckCircle2, title: "Concepts understood", copy: "See which topics you can now explain, apply, and answer independently." },
    { icon: RefreshCw, title: "Learning gaps corrected", copy: "Understand which weak areas have improved after revision and additional practice." },
    { icon: BarChart3, title: "Practice consistency", copy: "See how regularly you are learning and whether you are following your study plan." },
    { icon: GraduationCap, title: "Examination readiness", copy: "Understand how much of the syllabus you have completed and where further preparation is required." },
  ];

  return (
    <Section id="progress" alt>
      <motion.div {...fadeUp} className="max-w-[700px]">
        <Eyebrow>Your Progress</Eyebrow>
        <Heading className="mt-5">See more than your marks. See how your learning is improving.</Heading>
        <Lead className="mt-5">
          Classess.com® helps you understand your progress across learning, practice, revision, and
          examination preparation—not only through one final score.
        </Lead>
      </motion.div>

      <motion.h3 {...fadeUp} className="mt-12 mb-5 font-display font-bold text-neutral-900 text-[18px]">
        A clearer picture of your progress
      </motion.h3>
      <div className="grid sm:grid-cols-2 gap-5">
        {cards.map((c, i) => (
          <motion.div key={c.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }}>
            <Card icon={c.icon} title={c.title} className="h-full">
              {c.copy}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress you can act on */}
      <div className="mt-14 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeUp}>
          <h3 className="font-display font-bold text-neutral-900 text-[18px] mb-3">Progress you can act on</h3>
          <Lead>
            Instead of simply showing a percentage, Classess.com® helps you understand what has
            improved and what still needs attention.
          </Lead>
          <p className="mt-6 text-[17px] font-bold text-neutral-900 font-display leading-snug">
            When progress becomes visible, the next step becomes clearer.
          </p>
          <div className="mt-7">
            <SecondaryButton icon={BarChart3}>View Sample Progress Dashboard</SecondaryButton>
          </div>
        </motion.div>

        {/* Before → Now → Next comparison */}
        <motion.div {...fadeUp} className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 flex flex-col gap-4">
          {[
            { label: "Previously", value: "Needed support with application questions", tone: "muted" },
            { label: "Now", value: "Improving through targeted practice", tone: "accent" },
            { label: "Next step", value: "Complete one application challenge independently", tone: "solid" },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <span
                className="mt-0.5 shrink-0 w-[72px] text-[11px] font-bold uppercase tracking-wide"
                style={{ color: row.tone === "muted" ? "#a3a3a3" : ACCENT }}
              >
                {row.label}
              </span>
              <span
                className={`text-[14px] leading-snug ${
                  row.tone === "solid" ? "font-bold text-neutral-900" : "font-medium text-neutral-600"
                }`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   7. INDEPENDENT LEARNING — AI Tutor (Vidya)
   ════════════════════════════════════════════════════════════════════ */
function IndependentLearningSection() {
  const benefits = [
    "Ask academic questions at any time",
    "Receive explanations suited to your level",
    "Work through difficult questions step by step",
    "Review assignments and completed topics",
    "Receive guidance on the next learning action",
    "Build stronger self-study habits",
  ];

  return (
    <Section id="ai-tutor">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <motion.div {...fadeUp}>
          <Eyebrow>AI Learning Companion</Eyebrow>
          <Heading className="mt-5">Become more independent without being left unsupported.</Heading>
          <Lead className="mt-5">
            Classess.com® gives you academic support when a teacher, tutor, or classroom is not
            immediately available.
          </Lead>
          <Lead className="mt-3">
            The AI tutor can help you clarify a doubt, understand an explanation, work through a
            question, revise a topic, or decide what to study next.
          </Lead>

          <div
            className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14.5px] font-bold"
            style={{ background: `${ACCENT}12`, color: ACCENT }}
          >
            <Sparkles size={16} />
            AI that helps you think—not avoid thinking.
          </div>

          <Lead className="mt-5">
            The purpose is not to replace teachers. It is to ensure that your learning does not stop
            between classes.
          </Lead>

          <div className="mt-7">
            <BenefitList items={benefits} />
          </div>
          <div className="mt-8">
            <PrimaryButton icon={MessageCircle}>Meet Your AI Learning Companion</PrimaryButton>
          </div>
        </motion.div>

        {/* Vidya conversation — guides with a question, not the final answer */}
        <motion.div {...fadeUp} className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5 sm:p-6">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-neutral-100">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: GRADIENT }}>
              <Sparkles size={17} />
            </div>
            <div>
              <div className="text-[14px] font-bold text-neutral-900">Vidya</div>
              <div className="text-[11.5px] text-neutral-400 font-medium">AI Learning Companion</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Student */}
            <div className="self-end max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-[13.5px] text-white" style={{ background: ACCENT }}>
              I'm stuck on how to factor x² + 5x + 6.
            </div>
            {/* Vidya */}
            <div className="self-start max-w-[88%] rounded-2xl rounded-bl-md px-4 py-2.5 text-[13.5px] text-neutral-700 bg-neutral-100">
              Good question! Before I show you—which two numbers multiply to 6 and add up to 5?
            </div>
            <div className="self-end max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-[13.5px] text-white" style={{ background: ACCENT }}>
              2 and 3?
            </div>
            <div className="self-start max-w-[88%] rounded-2xl rounded-bl-md px-4 py-2.5 text-[13.5px] text-neutral-700 bg-neutral-100">
              Exactly. So how would you write the factors now?
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   8. FINAL CALL TO ACTION
   ════════════════════════════════════════════════════════════════════ */
function FinalCTASection() {
  return (
    <section id="start" className="w-full py-24 relative overflow-hidden" style={{ background: GRADIENT }}>
      <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center text-white">
        <motion.h2 {...fadeUp} className="font-display font-bold tracking-tight leading-[1.12] text-[clamp(1.8rem,4vw,2.8rem)]">
          Your next learning step should never be unclear.
        </motion.h2>
        <motion.p {...fadeUp} className="mt-5 text-[16px] text-white/90 leading-relaxed max-w-[640px] mx-auto">
          Know what to learn. Understand difficult concepts. Practise with purpose. Correct your
          learning gaps. Prepare confidently for examinations.
        </motion.p>
        <motion.div {...fadeUp} className="mt-9 flex flex-wrap justify-center gap-3">
          <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] bg-white shadow-lg transition-all duration-200 hover:opacity-95 active:scale-95" style={{ color: ACCENT }}>
            Start Learning Free
            <ArrowRight size={17} />
          </button>
          <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-white border border-white/40 transition-all duration-200 hover:bg-white/10 active:scale-95">
            <Play size={16} />
            Watch Student Tutorial
          </button>
        </motion.div>
        <motion.p {...fadeUp} className="mt-8 text-[15px] font-semibold text-white/95">
          Your learning. Your pace. A clearer path forward.
        </motion.p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   9. FREQUENTLY ASKED QUESTIONS
   ════════════════════════════════════════════════════════════════════ */
const FAQS = [
  {
    q: "Can I use Classess.com® without my school or college?",
    a: "Yes. You can create an independent student account and begin using Classess.com® even if your school, college, tutor, or coaching institution is not connected to the platform.",
  },
  {
    q: "How does Classess.com® personalise my learning?",
    a: "The platform considers your academic level, course, subjects, syllabus, learning progress, assessment performance, goals, and examination plans to recommend what you should learn, practise, or revise next.",
  },
  {
    q: "Can I add my own subject or syllabus?",
    a: "Yes. You can select an available subject or add information related to your course, syllabus, academic year, stream, or specialisation. You may also upload relevant learning material where supported.",
  },
  {
    q: "Can Classess.com® help me prepare for examinations?",
    a: "Yes. Add your examination date, subjects, syllabus, and available preparation time. The platform creates a personalised plan covering learning, practice, revision, weak-topic improvement, and self-testing.",
  },
  {
    q: "Will the AI tutor simply give me the answers?",
    a: "The AI tutor is designed to explain, guide, provide examples, ask questions, and support problem-solving. Its purpose is to strengthen understanding and independent thinking rather than encourage shortcuts.",
  },
  {
    q: "How is this different from watching videos or searching online?",
    a: "Videos and search results can provide information, but they do not always tell you what to learn next. Classess.com® connects content with practice, assessment, feedback, learning-gap identification, study planning, and progress tracking.",
  },
  // Hidden until "View More Questions"
  {
    q: "Does Classess.com® replace my teacher or tutor?",
    a: "No. It provides additional academic support between classes. Teachers and tutors remain important for instruction, guidance, feedback, and student development.",
  },
  {
    q: "Can I see how much progress I have made?",
    a: "Yes. You can review topic completion, concept understanding, practice consistency, assessment performance, corrected learning gaps, study-plan progress, and examination readiness.",
  },
  {
    q: "Can my parents view my progress?",
    a: "Parent visibility may be available depending on the student's age, account type, permissions, and platform settings.",
  },
  {
    q: "Is my academic information secure?",
    a: "Classess.com® is designed around responsible AI practices, secure data handling, role-based access, and appropriate privacy controls.",
  },
];

const VISIBLE_FAQ_COUNT = 6;

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-neutral-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-[15.5px] font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
          {item.q}
        </span>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{ background: isOpen ? ACCENT : `${ACCENT}12`, color: isOpen ? "#fff" : ACCENT }}
        >
          {isOpen ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-5 pr-10 text-[14.5px] text-neutral-500 leading-relaxed">{item.a}</p>
      </motion.div>
    </div>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? FAQS : FAQS.slice(0, VISIBLE_FAQ_COUNT);

  return (
    <Section id="faq">
      <motion.div {...fadeUp} className="text-center mb-10">
        <Eyebrow>FAQ</Eyebrow>
        <Heading className="mt-5">Frequently Asked Questions</Heading>
      </motion.div>

      <motion.div {...fadeUp} className="max-w-3xl mx-auto">
        {visible.map((item, i) => (
          <FaqItem
            key={item.q}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}

        {!showAll && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold border border-neutral-200 bg-white transition-all duration-200 hover:bg-neutral-50 active:scale-95"
              style={{ color: ACCENT }}
            >
              View More Questions
              <Plus size={15} />
            </button>
          </div>
        )}
      </motion.div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE ASSEMBLY
   ════════════════════════════════════════════════════════════════════ */
export default function StudentHome() {
  return (
    <div className="w-full bg-white">
      <StudentHeroSection />
      <TransformationSection />
      <ConceptSection />
      <PracticeSection />
      <ExamPrepSection />
      <ProgressSection />
      <IndependentLearningSection />
      <FinalCTASection />
      <FaqSection />
    </div>
  );
}
