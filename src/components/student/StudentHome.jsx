/**
 * StudentHome.jsx — Independent Student Homepage
 *
 * Marketing/landing content shown below the shared Hero once the Student role
 * is selected. Copy follows the "Independent Student Homepage" spec; media
 * frames + interactions follow the "Media Placement Instructions" brief.
 *
 * MEDIA SLOTS (drop delivered files into the matching <MediaFrame slot="...">):
 *   MEDIA 01  Student hero dashboard      → media-01-student-hero.webm
 *   MEDIA 02  Learning-journey animation  → media-02-learning-journey.json
 *   MEDIA 03  Concept "explain another way"→ media-03-concept-explainer.webm
 *   MEDIA 04  Practice recommendation      → media-04-practice.webm
 *   MEDIA 05  Gap insight + study plan     → media-05-gap-plan.webm
 *   MEDIA 06  Progress transformation      → media-06-progress.webm
 *   MEDIA 07  Vidya conversation           → media-07-vidya-conversation.webm
 *   MEDIA 08  Final-CTA decorative visual   → media-08-cta.svg (optional)
 *
 * Every frame renders a static, in-interface fallback today and upgrades to the
 * delivered video automatically once `src` is supplied (and motion is allowed).
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRole } from "../../hooks/useRole";
import RoleCards from "../RoleCards";
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
  AlertCircle,
  BarChart3,
  Sparkles,
  MessageCircle,
  Volume2,
  RotateCcw,
  Shuffle,
  FileText,
  HelpCircle,
  Mic,
  Plus,
  Minus,
} from "lucide-react";

/* ── Theming ──────────────────────────────────────────────────────── */
const ACCENT = "#0ea5e9";
const GRADIENT = "linear-gradient(135deg, #0ea5e9, #38bdf8)";

/* ── DEMO media ───────────────────────────────────────────────────────
 * A single placeholder clip (bundled in /public/assets) shown in every media
 * slot the Media Placement Instructions define, so the frames can be previewed
 * before the real assets (media-0X-*.webm) are delivered. Swap a slot for its
 * production file by passing a `src` to the matching <MediaFrame>. */
const DEMO_VIDEO = "/assets/media-demo.mp4";

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

/**
 * MediaFrame — responsive, in-interface media slot (per the Media brief).
 *
 * Renders the delivered video (autoplay / muted / loop / no controls) when a
 * `src` is provided and the visitor has not requested reduced motion; otherwise
 * it renders the static fallback (`children`). Never a YouTube-style player.
 */
function MediaFrame({ slot, src, poster, frameLabel, className = "", children }) {
  const reduce = useReducedMotion();
  const resolvedSrc = src ?? DEMO_VIDEO; // DEMO fallback until real assets land
  const showVideo = resolvedSrc && !reduce;

  return (
    <div
      data-media-slot={slot}
      className={`relative flex flex-col rounded-3xl border border-neutral-100 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden ${className}`}
    >
      {showVideo ? (
        /* Clip framed as an in-product window — interface chrome + the site's
           rounding/border so it reads as part of the UI, not an external video. */
        <div className="flex flex-col flex-1 rounded-2xl overflow-hidden border border-neutral-200/70 bg-white">
          <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-neutral-100 bg-neutral-50/80 shrink-0">
            <span className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: ACCENT }} />
            </span>
            <span className="ml-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-[11px] font-semibold text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
              {frameLabel ?? "classess.com"}
            </span>
          </div>
          <div className="flex-1 min-h-0 w-full bg-neutral-900">
            <video
              src={resolvedSrc}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 01 — STUDENT HERO  ·  MEDIA 01
   ════════════════════════════════════════════════════════════════════ */
export function StudentHero() {
  const preview = [
    { icon: Target, label: "Today's learning goal", value: "Quadratic Equations" },
    { icon: Lightbulb, label: "Recommended concept", value: "Completing the square" },
    { icon: PencilRuler, label: "Recommended practice", value: "Application Challenge" },
    { icon: GraduationCap, label: "Examination readiness", value: "68% syllabus covered" },
  ];

  const { activeRoleId, selectRole } = useRole();

  return (
    <section
      id="student-hero"
      className="relative w-full overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-12"
      style={{ backgroundImage: `radial-gradient(ellipse 70% 55% at 50% 0%, ${ACCENT}14 0%, transparent 70%)` }}
    >
      <div className="max-w-5xl mx-auto w-full px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
        {/* Copy */}
        <motion.div {...fadeUp} className="flex flex-col">
          <Heading className="mt-5">Stop studying without direction.</Heading>
          <Lead className="mt-5 max-w-[520px]">
            Classess.com® creates a personalised learning path based on your subjects, academic
            level, goals, and progress—so you always know what to learn, where you need support, and
            what to do next.
          </Lead>
          <div className="mt-7 flex flex-wrap gap-3">
            <PrimaryButton>Start My Learning Path</PrimaryButton>
            <SecondaryButton icon={Play}>See How It Works</SecondaryButton>
          </div>
          <p className="mt-5 text-[14px] font-semibold text-neutral-600">
            Learning works best when it feels like it was built for you.
          </p>
        </motion.div>

        {/* MEDIA 01 — clean student dashboard (static fallback shown until
            media-01-student-hero.webm is delivered) */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col"
        >
          <MediaFrame slot="MEDIA 01" frameLabel="Your Learning Today" className="p-5 sm:p-6 h-full">
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
            {/* Continue Learning button (per MEDIA 01 content summary) */}
            <button
              className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-white text-[14px] transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
              style={{ background: GRADIENT }}
            >
              Continue Learning
              <ArrowRight size={16} />
            </button>
          </MediaFrame>
        </motion.div>
        </div>

        {/* Role switcher — keep role selection available on the hero */}
        <div className="mt-8 sm:mt-10">
          <div className="flex flex-col items-center gap-1.5 mb-4">
            <p className="text-[10.5px] uppercase tracking-widest text-neutral-400 font-semibold">
              Switch your role anytime
            </p>
            <div className="w-8 h-px bg-neutral-200" />
          </div>
          <RoleCards selectedRole={activeRoleId} onSelect={selectRole} />
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 02 — STUDENT TRANSFORMATION  ·  MEDIA 02 (learning journey)
   ════════════════════════════════════════════════════════════════════ */
const JOURNEY = [
  { label: "Understand", msg: "Learn the concept" },
  { label: "Practise", msg: "Strengthen understanding" },
  { label: "Improve", msg: "Correct learning gaps" },
  { label: "Prepare", msg: "Follow a study plan" },
  { label: "Progress", msg: "See what has changed" },
];

function LearningJourney() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % JOURNEY.length), 1900);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <MediaFrame slot="MEDIA 02" frameLabel="Your Learning Journey" className="!shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 sm:p-8 bg-white">
      {/* Horizontal on desktop, vertical on mobile */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-2">
        {JOURNEY.map((stage, i) => {
          const isActive = reduce || i === active;
          const isDone = !reduce && i < active;
          return (
            <div key={stage.label} className="flex md:flex-col md:flex-1 items-center md:items-start gap-3 md:gap-0">
              <div className="flex md:w-full items-center gap-3">
                {/* Node */}
                <motion.div
                  animate={{ scale: isActive ? 1.08 : 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 transition-colors duration-300"
                  style={{
                    background: isActive ? ACCENT : isDone ? `${ACCENT}1a` : "#f5f5f5",
                    color: isActive ? "#fff" : isDone ? ACCENT : "#a3a3a3",
                  }}
                >
                  {isDone ? <CheckCircle2 size={17} /> : i + 1}
                </motion.div>
                {/* Connector (desktop) */}
                {i < JOURNEY.length - 1 && (
                  <div className="hidden md:block flex-1 h-0.5 rounded-full overflow-hidden bg-neutral-100">
                    <motion.div
                      className="h-full"
                      style={{ background: ACCENT }}
                      animate={{ width: reduce || i < active ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                )}
                {/* Label + message (mobile inline) */}
                <div className="md:hidden">
                  <div className="text-[14px] font-bold" style={{ color: isActive ? ACCENT : "#525252" }}>
                    {stage.label}
                  </div>
                  <div className="text-[12.5px] text-neutral-400">{stage.msg}</div>
                </div>
              </div>
              {/* Label + message (desktop, under node) */}
              <div className="hidden md:block md:mt-3 md:pr-4">
                <div className="text-[14px] font-bold transition-colors duration-300" style={{ color: isActive ? ACCENT : "#525252" }}>
                  {stage.label}
                </div>
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0.45 }}
                  className="text-[12.5px] text-neutral-400 mt-0.5"
                >
                  {stage.msg}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </MediaFrame>
  );
}

function TransformationSection() {
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
      <motion.div {...fadeUp} className="max-w-[680px] mx-auto text-center">
        <Heading className="mt-5">From unstructured studying to a clear path forward.</Heading>
        <Lead className="mt-5">
          Studying independently should not mean figuring out everything alone. Classess.com®
          connects learning, practice, feedback, revision, and examination preparation into one
          guided journey.
        </Lead>
      </motion.div>

      {/* MEDIA 02 — animated learning journey (below intro, above the cards) */}
      <motion.div {...fadeUp} className="mt-9">
        <LearningJourney />
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
   SECTION 03 — CONCEPT UNDERSTANDING  ·  MEDIA 03 ("explain another way")
   ════════════════════════════════════════════════════════════════════ */
const CONCEPT_MODES = [
  {
    key: "simple",
    label: "Simple explanation",
    icon: BookOpen,
    body: "In a right-angled triangle, the square of the longest side (the hypotenuse) equals the sum of the squares of the other two sides.",
  },
  {
    key: "real",
    label: "Real-life example",
    icon: Lightbulb,
    body: "Builders check for a perfect 90° corner using a 3–4–5 triangle: if the sides measure 3, 4 and 5, the corner is exactly square.",
  },
  {
    key: "worked",
    label: "Worked or visual example",
    icon: PencilRuler,
    body: "a² + b² = c²  →  3² + 4² = 9 + 16 = 25  →  c = √25 = 5",
  },
  {
    key: "audio",
    label: "Read-aloud option",
    icon: Volume2,
    body: "Listen to a spoken walkthrough of the Pythagorean theorem at a pace that suits you.",
  },
];

function ConceptExplainer() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState(0);
  const current = CONCEPT_MODES[mode];
  const isAudio = current.key === "audio";

  return (
    <MediaFrame slot="MEDIA 03" frameLabel="Concept · Pythagorean theorem" className="p-5 sm:p-6 h-full">
      {/* Concept header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-neutral-400">
          <Sparkles size={14} style={{ color: ACCENT }} />
          Concept · Pythagorean theorem
        </div>
        <span className="text-[12px] font-mono font-semibold text-neutral-500">a² + b² = c²</span>
      </div>

      {/* Mode tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CONCEPT_MODES.map((m, i) => {
          const on = i === mode;
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              onClick={() => setMode(i)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition-all duration-150"
              style={{
                background: on ? ACCENT : `${ACCENT}10`,
                color: on ? "#fff" : ACCENT,
              }}
            >
              <Icon size={13} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Transitioning explanation */}
      <div className="min-h-[132px] rounded-2xl bg-neutral-50/80 border border-neutral-100 p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-2 text-[13px] font-bold text-neutral-800">
              <current.icon size={16} style={{ color: ACCENT }} />
              {current.label}
            </div>
            <p className="text-[14px] text-neutral-600 leading-relaxed">{current.body}</p>

            {/* Read-aloud player UI */}
            {isAudio && (
              <div className="mt-3 flex items-center gap-3">
                <button
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ background: ACCENT }}
                  aria-label="Play read-aloud"
                >
                  <Play size={15} />
                </button>
                <div className="flex items-end gap-[3px] h-6" aria-hidden="true">
                  {[10, 18, 8, 22, 14, 24, 12, 20, 9, 16, 22, 11].map((h, i) => (
                    <motion.span
                      key={i}
                      className="w-[3px] rounded-full"
                      style={{ background: `${ACCENT}99`, height: h }}
                      animate={reduce ? {} : { scaleY: [1, 0.4, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.08 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Explain another way */}
      <button
        onClick={() => setMode((m) => (m + 1) % CONCEPT_MODES.length)}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13.5px] font-semibold border border-neutral-200 transition-all duration-150 hover:bg-neutral-50 active:scale-[0.99]"
        style={{ color: ACCENT }}
      >
        <RotateCcw size={15} />
        Explain this another way
      </button>
    </MediaFrame>
  );
}

function ConceptSection() {
  const benefits = [
    "Understand concepts instead of only memorising answers",
    "Learn difficult topics in smaller, manageable steps",
    "Ask questions using text or voice",
    "Revisit explanations whenever required",
    "Build confidence before moving to the next topic",
  ];

  return (
    <Section id="concepts">
      <div className="grid lg:grid-cols-2 gap-12 items-stretch">
        {/* Copy */}
        <motion.div {...fadeUp} className="flex flex-col">

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

        {/* MEDIA 03 — interactive "explain another way" frame */}
        <motion.div {...fadeUp} className="flex flex-col">
          <ConceptExplainer />
        </motion.div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 04 — PURPOSEFUL PRACTICE  ·  MEDIA 04 (practice recommendation)
   ════════════════════════════════════════════════════════════════════ */
const PRACTICE_FORMATS = [
  {
    key: "quiz",
    label: "Quiz",
    icon: HelpCircle,
    render: () => (
      <div>
        <p className="text-[13.5px] font-semibold text-neutral-800 mb-2.5">Which side is the hypotenuse?</p>
        <div className="flex flex-col gap-2">
          {["The side opposite the right angle", "The shortest side"].map((o, i) => (
            <div
              key={o}
              className="px-3 py-2 rounded-lg text-[13px] border"
              style={i === 0 ? { borderColor: ACCENT, background: `${ACCENT}0d`, color: "#0c4a6e" } : { borderColor: "#e5e5e5", color: "#525252" }}
            >
              {o}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "flashcard",
    label: "Flashcard",
    icon: Layers,
    render: () => (
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 px-4 py-5 rounded-xl text-center bg-white border border-neutral-200">
          <div className="text-[11px] uppercase tracking-wide text-neutral-400 mb-1">Front</div>
          <div className="text-[15px] font-mono font-bold text-neutral-800">a² + b² = ?</div>
        </div>
        <ArrowRight size={16} className="text-neutral-300 shrink-0" />
        <div className="flex-1 px-4 py-5 rounded-xl text-center text-white" style={{ background: ACCENT }}>
          <div className="text-[11px] uppercase tracking-wide opacity-80 mb-1">Back</div>
          <div className="text-[15px] font-mono font-bold">c²</div>
        </div>
      </div>
    ),
  },
  {
    key: "match",
    label: "Concept matching",
    icon: Shuffle,
    render: () => (
      <div className="flex flex-col gap-2">
        {[
          ["Hypotenuse", "Longest side"],
          ["Right angle", "90°"],
        ].map(([a, b]) => (
          <div key={a} className="flex items-center gap-2 text-[13px]">
            <span className="flex-1 px-3 py-2 rounded-lg bg-white border border-neutral-200 font-semibold text-neutral-700">{a}</span>
            <span className="w-5 h-px bg-neutral-300" />
            <span className="flex-1 px-3 py-2 rounded-lg border font-semibold" style={{ borderColor: ACCENT, color: ACCENT, background: `${ACCENT}0d` }}>{b}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: "reasoning",
    label: "Reasoning question",
    icon: Brain,
    render: () => (
      <div>
        <p className="text-[13.5px] font-semibold text-neutral-800 mb-1.5">Reason it through</p>
        <p className="text-[13px] text-neutral-600 leading-relaxed">
          Why does the theorem only hold for right-angled triangles? Explain what changes when the
          angle is no longer 90°.
        </p>
      </div>
    ),
  },
  {
    key: "written",
    label: "Written response",
    icon: FileText,
    render: () => (
      <div>
        <p className="text-[13.5px] font-semibold text-neutral-800 mb-2">In your own words…</p>
        <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-400 italic">
          Describe one real situation where you would use this formula.
        </div>
      </div>
    ),
  },
];

function PracticeRecommendation() {
  const [fmt, setFmt] = useState(0);
  const current = PRACTICE_FORMATS[fmt];

  return (
    <MediaFrame slot="MEDIA 04" frameLabel="Recommended Practice" className="p-5 sm:p-6 h-full">
      {/* Recommendation header — progresses to "strengthen application" */}
      <div className="rounded-2xl p-5 text-white mb-5" style={{ background: GRADIENT }}>
        <div className="flex items-center gap-1.5 text-[12px] font-semibold opacity-90 mb-2">
          <CheckCircle2 size={14} /> You understand the concept.
        </div>
        <p className="text-[17px] font-bold leading-snug">Now strengthen application.</p>
        <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5 text-[13px] font-semibold backdrop-blur">
          <PencilRuler size={14} />
          Recommended activity: Application Challenge
        </div>
      </div>

      {/* Clickable practice formats — one shown at a time */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRACTICE_FORMATS.map((f, i) => {
          const on = i === fmt;
          const Icon = f.icon;
          return (
            <button
              key={f.key}
              onClick={() => setFmt(i)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150"
              style={{ background: on ? ACCENT : "#f5f5f5", color: on ? "#fff" : "#737373" }}
            >
              <Icon size={12} />
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[130px] rounded-2xl bg-neutral-50/80 border border-neutral-100 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {current.render()}
          </motion.div>
        </AnimatePresence>
      </div>
    </MediaFrame>
  );
}

function PracticeSection() {
  const cards = [
    { icon: Brain, title: "Strengthen recall", copy: "Remember important concepts, terms, formulas, and relationships more effectively." },
    { icon: Layers, title: "Apply what you learn", copy: "Move beyond recognition by answering application-based and reasoning questions." },
    { icon: Repeat, title: "Build long-term retention", copy: "Revisit important topics at the right time instead of relying only on last-minute revision." },
  ];

  return (
    <Section id="practice" alt>
      {/* Two-column: media LEFT, copy RIGHT */}
      <div className="grid lg:grid-cols-2 gap-12 items-stretch">
        {/* Left — MEDIA 04 interactive recommendation */}
        <motion.div {...fadeUp} className="flex flex-col">
          <PracticeRecommendation />
        </motion.div>

        {/* Right — copy */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="text-right">

          <Heading className="mt-5">Do not just practise more. Practise what matters.</Heading>
          <Lead className="mt-5">
            Classess.com® recommends practice based on what you are learning, how you have performed,
            and where you need improvement.
          </Lead>
          <Lead className="mt-3">
            Use quizzes, flashcards, reasoning exercises, concept matching, written responses,
            self-tests, and gamified challenges to strengthen understanding in different ways.
          </Lead>
          <div className="mt-8 flex justify-end">
            <PrimaryButton icon={PencilRuler}>Explore Practice Activities</PrimaryButton>
          </div>
        </motion.div>
      </div>

      <div className="mt-10 grid sm:grid-cols-3 gap-5">
        {cards.map((c, i) => (
          <motion.div key={c.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
            <Card icon={c.icon} title={c.title} className="h-full">
              {c.copy}
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div {...fadeUp} className="mt-8 text-center">
        <p className="text-[18px] sm:text-[20px] font-bold text-neutral-900 font-display leading-snug">
          Every practice activity should move you closer to mastery.
        </p>
      </motion.div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 05 — LEARNING GAPS & EXAM PREP  ·  MEDIA 05 (gap insight + plan)
   ════════════════════════════════════════════════════════════════════ */
function GapInsightCard() {
  const insights = [
    { icon: CheckCircle2, label: "Concept understanding", value: "Strong", tone: "good" },
    { icon: AlertCircle, label: "Application", value: "Needs attention", tone: "warn" },
    { icon: HelpCircle, label: "Unattempted", value: "Two questions", tone: "neutral" },
    { icon: RefreshCw, label: "Recommended action", value: "Revise Topic 3", tone: "accent" },
    { icon: PencilRuler, label: "Next activity", value: "Application Practice", tone: "accent" },
  ];
  const toneColor = { good: "#16a34a", warn: "#f59e0b", neutral: "#737373", accent: ACCENT };

  return (
    <MediaFrame slot="MEDIA 05" frameLabel="Learning Insights" className="p-5 sm:p-6 h-full">
      {/* Part 1 — a score, then the insight behind it */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
        <div>
          <div className="text-[11.5px] font-bold uppercase tracking-widest text-neutral-400">Assessment result</div>
          <div className="text-[34px] font-bold text-neutral-900 font-display leading-none mt-1">68%</div>
        </div>
        <BarChart3 size={30} style={{ color: `${ACCENT}99` }} />
      </div>
      <div className="flex flex-col gap-2.5">
        {insights.map(({ icon: Icon, label, value, tone }) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-[13px] text-neutral-500">
              <Icon size={15} style={{ color: toneColor[tone] }} />
              {label}
            </span>
            <span className="text-[13px] font-bold" style={{ color: toneColor[tone] }}>{value}</span>
          </div>
        ))}
      </div>
      {/* Highlight message */}
      <div className="mt-4 rounded-xl px-4 py-3 text-[13px] font-semibold" style={{ background: `${ACCENT}10`, color: "#0c4a6e" }}>
        A score tells you what happened. Classess.com® helps you understand what to do next.
      </div>
    </MediaFrame>
  );
}

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
  // Part 2 — weekly plan
  const plan = [
    { day: "Mon", actions: ["Learn", "Practise", "Revise"] },
    { day: "Tue", actions: ["Practise", "Self-test", "Revise"] },
    { day: "Wed", actions: ["Learn", "Practise", "Self-test"] },
    { day: "Thu", actions: ["Revise", "Practise", "Self-test"] },
    { day: "Fri", actions: ["Learn", "Revise", "Practise"] },
    { day: "Sat", actions: ["Self-test", "Weak Topics", "Revise"] },
    { day: "Sun", actions: ["Revise", "Self-test"] },
  ];

  return (
    <Section id="exam-prep">
      {/* Two-column: copy + chips LEFT, MEDIA 05 RIGHT */}
      <div className="grid lg:grid-cols-2 gap-12 items-stretch">
        {/* Left — copy + insight chips */}
        <motion.div {...fadeUp} className="flex flex-col">

          <Heading className="mt-5">Find your learning gaps before the examination finds them.</Heading>
          <Lead className="mt-5">A score only shows how you performed. Classess.com® helps you understand why.</Lead>
          <Lead className="mt-3">
            After practice and assessments, you can see which concepts are clear, which mistakes are
            repeating, what you left unattempted, and what needs further revision.
          </Lead>
          <ul className="mt-8 flex flex-col gap-2">
            {insights.map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-[14.5px] text-neutral-700 leading-snug">
                <SearchCheck size={17} className="shrink-0" style={{ color: ACCENT }} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right — MEDIA 05 gap insight card */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="flex flex-col">
          <GapInsightCard />
        </motion.div>
      </div>

      {/* Study plan subsection */}
      <div className="mt-16 grid lg:grid-cols-2 gap-12 items-stretch">
        <motion.div {...fadeUp} className="flex flex-col">
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

        {/* Short weekly plan — Learn → Practise → Revise → Self-test */}
        <motion.div {...fadeUp} className="flex flex-col bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-neutral-400 mb-5">
            <CalendarDays size={14} style={{ color: ACCENT }} />
            This week's plan
          </div>
          <div className="flex flex-col flex-1 justify-around gap-3">
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
   SECTION 06 — PROGRESS & IMPROVEMENT  ·  MEDIA 06 (progress transformation)
   ════════════════════════════════════════════════════════════════════ */
const PROGRESS_STAGES = [
  { label: "Previously", value: "Needed support with application questions" },
  { label: "Now", value: "Improving through targeted practice" },
  { label: "Next step", value: "Complete one application challenge independently" },
];

function ProgressTransformation() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? 2 : 0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStep((s) => (s + 1) % PROGRESS_STAGES.length), 1700);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <MediaFrame slot="MEDIA 06" frameLabel="Your Progress" className="p-6 flex flex-col gap-4 h-full">
      {/* Previous → Current → Recommended next action */}
      <div className="flex items-center gap-1.5 mb-1">
        {PROGRESS_STAGES.map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-neutral-100">
            <motion.div className="h-full" style={{ background: ACCENT }} animate={{ width: reduce || i <= step ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
          </div>
        ))}
      </div>
      {PROGRESS_STAGES.map((row, i) => {
        const isActive = reduce || i === step;
        const isLast = i === PROGRESS_STAGES.length - 1;
        return (
          <motion.div
            key={row.label}
            animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.99 }}
            transition={{ duration: 0.35 }}
            className="flex items-start gap-3 rounded-xl p-3"
            style={{ background: isActive ? `${ACCENT}0a` : "transparent" }}
          >
            <span className="mt-0.5 shrink-0 w-[72px] text-[11px] font-bold uppercase tracking-wide" style={{ color: isLast ? ACCENT : "#a3a3a3" }}>
              {row.label}
            </span>
            <span className={`text-[14px] leading-snug ${isLast ? "font-bold text-neutral-900" : "font-medium text-neutral-600"}`}>
              {row.value}
            </span>
          </motion.div>
        );
      })}
    </MediaFrame>
  );
}

function ProgressSection() {
  const cards = [
    { icon: CheckCircle2, title: "Concepts understood", copy: "See which topics you can now explain, apply, and answer independently." },
    { icon: RefreshCw, title: "Learning gaps corrected", copy: "Understand which weak areas have improved after revision and additional practice." },
    { icon: BarChart3, title: "Practice consistency", copy: "See how regularly you are learning and whether you are following your study plan." },
    { icon: GraduationCap, title: "Examination readiness", copy: "Understand how much of the syllabus you have completed and where further preparation is required." },
  ];

  return (
    <Section id="progress" alt>
      <div className="grid lg:grid-cols-2 gap-12 items-stretch">
        <motion.div {...fadeUp} className="flex flex-col max-w-[560px]">

          <Heading className="mt-5">See more than your marks. See how your learning is improving.</Heading>
          <Lead className="mt-5">
            Classess.com® helps you understand your progress across learning, practice, revision, and
            examination preparation—not only through one final score.
          </Lead>
          <p className="mt-6 text-[17px] font-bold text-neutral-900 font-display leading-snug">
            When progress becomes visible, the next step becomes clearer.
          </p>
        </motion.div>

        {/* MEDIA 06 — progress transformation (beside the heading) */}
        <motion.div {...fadeUp} className="flex flex-col">
          <ProgressTransformation />
        </motion.div>
      </div>

      <motion.h3 {...fadeUp} className="mt-14 mb-5 font-display font-bold text-neutral-900 text-[18px]">
        A clearer picture of your progress
      </motion.h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <motion.div key={c.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }}>
            <Card icon={c.icon} title={c.title} className="h-full">
              {c.copy}
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div {...fadeUp} className="mt-10">
        <SecondaryButton icon={BarChart3}>View Sample Progress Dashboard</SecondaryButton>
      </motion.div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 07 — INDEPENDENT LEARNING & AI  ·  MEDIA 07 (Vidya conversation)
   ════════════════════════════════════════════════════════════════════ */
const VIDYA_THREAD = [
  { from: "student", text: "I understand the formula, but I do not know when to use it." },
  {
    from: "vidya",
    text: "Let us look at a situation where the formula applies. What information has been given in the question?",
  },
];

function VidyaConversation() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? VIDYA_THREAD.length : 0);

  useEffect(() => {
    if (reduce) return;
    if (shown >= VIDYA_THREAD.length) return;
    const id = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 500 : 1400);
    return () => clearTimeout(id);
  }, [shown, reduce]);

  return (
    <MediaFrame slot="MEDIA 07" frameLabel="Vidya · AI Companion" className="p-5 sm:p-6 h-full">
      {/* Product-style header (Vidya, not a generic chatbot) */}
      <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-neutral-100">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: GRADIENT }}>
          <Sparkles size={17} />
        </div>
        <div>
          <div className="text-[14px] font-bold text-neutral-900">Vidya</div>
          <div className="text-[11.5px] text-neutral-400 font-medium">AI Learning Companion</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 min-h-[150px]">
        <AnimatePresence>
          {VIDYA_THREAD.slice(0, shown).map((m, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={
                m.from === "student"
                  ? "self-end max-w-[88%] rounded-2xl rounded-br-md px-4 py-2.5 text-[13.5px] text-white"
                  : "self-start max-w-[90%] rounded-2xl rounded-bl-md px-4 py-2.5 text-[13.5px] text-neutral-700 bg-neutral-100"
              }
              style={m.from === "student" ? { background: ACCENT } : undefined}
            >
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Typing indicator before Vidya replies */}
        {!reduce && shown === 1 && (
          <div className="self-start flex items-center gap-1 bg-neutral-100 rounded-2xl rounded-bl-md px-4 py-3">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-neutral-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Voice support — waveform near the input (per MEDIA 07 voice option) */}
      <div className="mt-4 flex items-center gap-3 pt-4 border-t border-neutral-100">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${ACCENT}12`, color: ACCENT }}>
          <Mic size={15} />
        </div>
        <div className="flex items-end gap-[3px] h-5 flex-1" aria-hidden="true">
          {[8, 14, 6, 16, 10, 18, 9, 13, 7, 15, 11, 17, 8, 12].map((h, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full"
              style={{ background: `${ACCENT}80`, height: h }}
              animate={reduce ? {} : { scaleY: [1, 0.35, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.07 }}
            />
          ))}
        </div>
        <span className="text-[11px] font-semibold text-neutral-400">Voice support</span>
      </div>
    </MediaFrame>
  );
}

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
      {/* Top two-column: copy LEFT, media RIGHT — unchanged */}
      <div className="grid lg:grid-cols-2 gap-12 items-stretch">
        <motion.div {...fadeUp} className="flex flex-col">

          <Heading className="mt-5">Become more independent without being left unsupported.</Heading>
          <Lead className="mt-5">
            Classess.com® gives you academic support when a teacher, tutor, or classroom is not
            immediately available.
          </Lead>
          <Lead className="mt-3">
            The AI tutor can help you clarify a doubt, understand an explanation, work through a
            question, revise a topic, or decide what to study next.
          </Lead>
        </motion.div>

        {/* MEDIA 07 — Vidya conversation */}
        <motion.div {...fadeUp} className="flex flex-col">
          <VidyaConversation />
        </motion.div>
      </div>

      {/* Center-aligned block: tag + purpose text */}
      <motion.div {...fadeUp} className="mt-14 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14.5px] font-bold"
          style={{ background: `${ACCENT}12`, color: ACCENT }}
        >
          <Sparkles size={16} />
          AI that helps you think—not avoid thinking.
        </div>
        <p className="mt-5 text-[16px] text-neutral-500 leading-relaxed max-w-xl mx-auto">
          The purpose is not to replace teachers. It is to ensure that your learning does not stop
          between classes.
        </p>
      </motion.div>

      {/* 6 benefit cards — 3 × 2 grid */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((item, i) => (
          <motion.div
            key={item}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.07 }}
            className="group flex items-start gap-3 bg-white border border-neutral-100 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(14,165,233,0.12)] hover:border-sky-200 hover:-translate-y-1 transition-all duration-200 cursor-default"
          >
            <span
              className="mt-0.5 shrink-0 flex items-center justify-center w-7 h-7 rounded-full"
              style={{ background: `${ACCENT}15`, color: ACCENT }}
            >
              <CheckCircle2 size={15} />
            </span>
            <span className="text-[14px] font-medium text-neutral-700 leading-snug group-hover:text-neutral-900 transition-colors duration-200">
              {item}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CTA — centered */}
      <motion.div {...fadeUp} className="mt-10 flex justify-center">
        <PrimaryButton icon={MessageCircle}>Meet Your AI Learning Companion</PrimaryButton>
      </motion.div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 08 — FINAL CALL TO ACTION  ·  MEDIA 08 (decorative, optional)
   ════════════════════════════════════════════════════════════════════ */
function CtaBackdrop() {
  // MEDIA 08 — subtle decorative backdrop. DEMO clip sits faint behind the
  // gradient; the journey stages stay overlaid so text remains readable.
  const reduce = useReducedMotion();
  const stages = ["Learning", "Practice", "Improvement", "Exam Prep", "Progress"];
  return (
    <div data-media-slot="MEDIA 08" aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {!reduce && (
        <video
          src={DEMO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-[0.18] mix-blend-overlay"
        />
      )}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center justify-between px-[8%] opacity-[0.13]">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-[6vw]">
            <div className="flex flex-col items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white" />
              <span className="text-[11px] font-semibold text-white whitespace-nowrap">{s}</span>
            </div>
            {i < stages.length - 1 && <span className="hidden sm:block w-[6vw] h-px bg-white" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function FinalCTASection() {
  return (
    <section id="start" className="w-full py-24 relative overflow-hidden" style={{ background: GRADIENT }}>
      <CtaBackdrop />
      <div className="relative max-w-3xl mx-auto px-6 sm:px-8 text-center text-white">
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
   SECTION 09 — FREQUENTLY ASKED QUESTIONS  (no media)
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
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 py-5 text-left group" aria-expanded={isOpen}>
        <span className="text-[15.5px] font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">{item.q}</span>
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

        <Heading className="mt-5">Frequently Asked Questions</Heading>
      </motion.div>

      <motion.div {...fadeUp} className="max-w-3xl mx-auto">
        {visible.map((item, i) => (
          <FaqItem key={item.q} item={item} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
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
