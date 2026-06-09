/**
 * InstituteHome.jsx — Institution Homepage Content
 *
 * All marketing sections for the institution role (per Institution Homepage Content doc):
 *   1.  Institution Hero
 *   2.  Institution-Type Selector
 *   3.  Connected Academic System
 *   4.  Teacher Capacity and Academic Consistency
 *   5.  Student Learning and Intervention
 *   6.  Outcomes for Different Institution Types
 *   7.  Integration and Implementation
 *   8.  Trust, Privacy, and Governance
 *   9.  Final Call to Action
 *   10. Frequently Asked Questions
 *
 * MEDIA SLOTS:
 *   INSTITUTION-HOME-M01  Leadership dashboard animation
 *   INSTITUTION-HOME-M02  Dynamic organisation-type visual
 *   INSTITUTION-HOME-M03  Scroll-based academic journey animation
 *   INSTITUTION-HOME-M04  Teacher-support and approval workflow animation
 *   INSTITUTION-HOME-M05  Learning-gap-to-intervention animation
 *   INSTITUTION-HOME-M06  Dynamic leadership dashboard demonstration
 *   INSTITUTION-HOME-M07  Phased implementation and integration animation
 *   INSTITUTION-HOME-M08  Governance-layer animation
 *   INSTITUTION-HOME-M09  Subtle branded institutional animation (CTA background)
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ChevronRight, ArrowRight, Plus, Minus,
  Layers, PencilRuler, GraduationCap, BarChart3, RefreshCw,
  CheckCircle2, Sparkles, MessageCircle, Compass,
} from "lucide-react";

/* ── Theming ─────────────────────────────────────────────────────────────── */
const ACCENT   = "#6366f1";
const GRADIENT = "linear-gradient(135deg, #6366f1, #818cf8)";

/* ── Animation helper ────────────────────────────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Media placeholder (swapped out when real assets arrive) ─────────────── */
function MediaPlaceholder({ mediaId, description }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 p-10 min-h-[280px] h-full border-dashed border-2"
      style={{
        borderColor: `color-mix(in srgb, ${ACCENT} 25%, #fff)`,
        background: `color-mix(in srgb, ${ACCENT} 5%, #fff)`,
        borderRadius: "var(--r-lg)",
      }}
      aria-label={`Media placeholder – ${mediaId}`}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `color-mix(in srgb, ${ACCENT} 12%, #fff)` }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <p className="text-[13px] font-mono font-semibold uppercase tracking-[.04em]" style={{ color: ACCENT }}>{mediaId}</p>
      <p className="text-[12px] text-center max-w-[220px] leading-relaxed" style={{ color: "var(--ink-4)" }}>{description}</p>
    </div>
  );
}

/* ── Layout primitives ───────────────────────────────────────────────────── */
function Section({ id, alt = false, children }) {
  return (
    <section
      id={id}
      className="w-full py-20 sm:py-24"
      style={{ background: alt ? "var(--paper)" : "var(--page)" }}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8">{children}</div>
    </section>
  );
}

function Eyebrow({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-[11px] py-[5px] rounded-[999px] font-mono text-[11px] font-semibold uppercase tracking-[.04em] mb-4"
      style={{
        background: `color-mix(in srgb, ${ACCENT} 10%, #fff)`,
        color: ACCENT,
        border: `1px solid color-mix(in srgb, ${ACCENT} 20%, #fff)`,
      }}
    >
      {children}
    </span>
  );
}

function Heading({ children, className = "" }) {
  return (
    <h2
      className={`font-serif font-medium leading-[1.08] ${className}`}
      style={{ letterSpacing: "-0.025em", color: "var(--ink)" }}
    >
      {children}
    </h2>
  );
}

function Lead({ children, className = "" }) {
  return (
    <p className={`text-[15px] leading-relaxed ${className}`} style={{ color: "var(--ink-3)" }}>
      {children}
    </p>
  );
}

function HighlightLine({ children }) {
  return (
    <div
      className="px-5 py-4 border-l-4 text-[15px] font-medium leading-snug"
      style={{
        borderColor: ACCENT,
        background: `color-mix(in srgb, ${ACCENT} 7%, #fff)`,
        borderRadius: "0 var(--r-sm) var(--r-sm) 0",
        color: "var(--ink-2)",
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-6 py-[11px] rounded-[8px] text-[14px] font-medium text-white transition-all duration-150 hover:-translate-y-px hover:opacity-90 active:scale-95"
      style={{ background: GRADIENT, border: "1px solid transparent" }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-6 py-[11px] rounded-[8px] text-[14px] font-medium transition-all duration-150 active:scale-95"
      style={{ color: "var(--ink)", border: "1px solid var(--line-2)", background: "var(--page)" }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--mist)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--page)"; }}
    >
      {children}
    </button>
  );
}

function Card({ title, body, icon }) {
  return (
    <div
      className="p-6 flex flex-col gap-3"
      style={{
        background: "var(--page)",
        border: "1px solid var(--line)",
        borderRadius: "var(--r)",
      }}
    >
      {icon && (
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `color-mix(in srgb, ${ACCENT} 10%, #fff)` }}
        >
          {icon}
        </div>
      )}
      <h4
        className="text-[16px] font-serif font-medium"
        style={{ color: "var(--ink)" }}
      >
        {title}
      </h4>
      <p className="text-[14px] leading-relaxed" style={{ color: "var(--ink-3)" }}>
        {body}
      </p>
    </div>
  );
}

function BenefitList({ items }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((b) => (
        <li key={b} className="flex items-start gap-3 text-[14.5px]" style={{ color: "var(--ink-2)" }}>
          <Check size={16} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
          {b}
        </li>
      ))}
    </ul>
  );
}

function JourneyPills({ steps }) {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <span
            className="px-4 py-1.5 rounded-[999px] font-mono text-[11px] font-semibold uppercase tracking-[.04em]"
            style={{
              color: ACCENT,
              border: `1px solid color-mix(in srgb, ${ACCENT} 30%, #fff)`,
              background: `color-mix(in srgb, ${ACCENT} 8%, #fff)`,
            }}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <ChevronRight size={14} style={{ color: "var(--line-2)" }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   INSTITUTION TYPE DATA
   ════════════════════════════════════════════════════════════════════════════ */
const ORG_TYPES = [
  {
    id: "independent",
    label: "An Independent Institution",
    copy: "Strengthen planning, teaching, assessment, student support, and leadership visibility within one school, college, university, coaching centre, or training institution.",
    mediaDesc: "Single campus academic overview — curriculum, teaching activity, assessment results, and student support in one view.",
    outcomes: {
      title: "For an Independent Institution",
      points: [
        "Connect academic planning, teaching, assessment, and student support",
        "Give principals and academic leaders clearer daily visibility",
        "Help teachers reduce repetitive academic work",
        "Identify learning gaps earlier",
        "Improve parent communication with meaningful academic information",
        "Build a consistent academic system without replacing every existing tool",
      ],
      supporting: null,
    },
  },
  {
    id: "group",
    label: "An Education Group",
    copy: "Create academic consistency across campuses while allowing each institution to retain its curriculum, terminology, policies, and local requirements.",
    mediaDesc: "Multi-campus overview — group-level academic patterns, campus comparisons, and local curriculum visibility.",
    outcomes: {
      title: "For an Education Group",
      points: [
        "Compare academic progress across campuses without reducing everything to rankings",
        "Establish shared academic standards and quality expectations",
        "Allow campus-level adaptation and local autonomy",
        "Identify campuses requiring support",
        "Share effective practices across institutions",
        "View group-level and campus-level academic performance",
        "Expand institutional knowledge across the network",
      ],
      supporting: null,
    },
  },
  {
    id: "ngo",
    label: "An NGO or CSR Initiative",
    copy: "Plan, deliver, monitor, and report education programmes across schools, communities, cohorts, and implementation partners.",
    mediaDesc: "Programme and beneficiary overview — implementation status, participation rates, and learning progress across sites.",
    outcomes: {
      title: "For an NGO or CSR Education Initiative",
      points: [
        "Structure educational programmes around clear learning goals",
        "Monitor implementation across locations and partners",
        "Track student participation, progress, and learning gaps",
        "Identify programmes or locations requiring additional support",
        "Provide transparent outcome reporting to stakeholders",
        "Support field teams, facilitators, teachers, and programme managers",
        "Build evidence for programme improvement and responsible funding decisions",
      ],
      supporting: "Move from activity reporting to learning-impact visibility.",
    },
  },
  {
    id: "district",
    label: "A District or Education Network",
    copy: "Gain system-level visibility across institutions while supporting local leadership, teachers, and students with relevant academic interventions.",
    mediaDesc: "Multi-institution system overview — district-wide academic patterns, school-level visibility, and intervention tracking.",
    outcomes: {
      title: "For a District or Education Network",
      points: [
        "View academic patterns across schools, grades, subjects, and communities",
        "Identify institutions requiring targeted support",
        "Support curriculum implementation and assessment quality",
        "Monitor intervention progress across schools",
        "Provide relevant visibility to district, cluster, and school leaders",
        "Share resources and effective academic practices",
        "Make policy and resource decisions using stronger learning evidence",
      ],
      supporting: "System-level visibility with school-level relevance.",
    },
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 1 — Institution Hero
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      id="institution-hero"
      className="relative w-full overflow-hidden pt-28 pb-20"
      style={{
        backgroundImage: `radial-gradient(ellipse 70% 55% at 50% 0%, #F1F2F5 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 50% 0%, ${ACCENT}0D 0%, transparent 70%)`,
      }}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">

          <FadeIn>
            <h1
              className="font-serif text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.08] mb-5"
              style={{ letterSpacing: "-0.03em", color: "var(--ink)" }}
            >
              See what is happening academically—{" "}
              <em
                style={{
                  fontStyle: "italic",
                  background: GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                and know what to improve next.
              </em>
            </h1>
            <Lead className="mb-3">
              Classess.com® connects curriculum, teaching, assessment, student support, and leadership insights into one academic intelligence layer.
            </Lead>
            <Lead className="mb-8">
              Whether you manage one institution, multiple campuses, an education initiative, or an entire district, Classess.com® helps turn academic activity into clearer decisions and measurable progress.
            </Lead>
            <div className="flex flex-wrap gap-3 mb-8">
              <PrimaryButton>Request a Demo <ArrowRight size={16} /></PrimaryButton>
              <SecondaryButton>Explore the Platform</SecondaryButton>
            </div>
            <p className="text-[13.5px] font-medium" style={{ color: "var(--ink-3)" }}>
              From academic activity to academic intelligence.
            </p>
          </FadeIn>

          <FadeIn delay={0.12} className="h-full">
            <MediaPlaceholder
              mediaId="INSTITUTION-HOME-M01"
              description="Short looping institutional dashboard animation — leadership view with four areas: Teaching and curriculum progress, Student learning visibility, Assessments and learning gaps, Recommended institutional priorities."
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 2 — Institution-Type Selector
   ════════════════════════════════════════════════════════════════════════════ */
function InstitutionTypeSection({ selectedType, setSelectedType }) {
  const active = ORG_TYPES.find((t) => t.id === selectedType) ?? ORG_TYPES[0];

  return (
    <Section id="institution-type" alt>
      <FadeIn className="text-center mb-10">
        <Heading className="text-[2rem] lg:text-[2.4rem] mb-4">
          Built for different education systems. Connected by one academic purpose.
        </Heading>
        <Lead className="max-w-[620px] mx-auto">
          Select the type of organisation you represent to see how Classess.com® can support your academic goals.
        </Lead>
      </FadeIn>

      <FadeIn delay={0.06} className="mb-8">
        <p
          className="font-mono text-[10.5px] font-semibold uppercase tracking-[.1em] mb-3 text-center"
          style={{ color: "var(--ink-4)" }}
        >
          I represent:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {ORG_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className="px-4 py-2 rounded-[8px] text-[13.5px] font-medium border transition-all duration-150"
              style={
                selectedType === type.id
                  ? { background: GRADIENT, color: "#fff", borderColor: "transparent" }
                  : { background: "var(--page)", color: "var(--ink-2)", borderColor: "var(--line-2)" }
              }
              onMouseEnter={e => {
                if (selectedType !== type.id) e.currentTarget.style.borderColor = "var(--line)";
              }}
              onMouseLeave={e => {
                if (selectedType !== type.id) e.currentTarget.style.borderColor = "var(--line-2)";
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </FadeIn>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedType}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid lg:grid-cols-2 gap-10 items-stretch"
        >
          <div
            className="p-8 flex flex-col gap-4"
            style={{
              background: "var(--page)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r)",
            }}
          >
            <h3
              className="text-[1.2rem] font-serif font-medium"
              style={{ color: "var(--ink)" }}
            >
              {active.label}
            </h3>
            <Lead>{active.copy}</Lead>
          </div>
          <MediaPlaceholder
            mediaId="INSTITUTION-HOME-M02"
            description={active.mediaDesc}
          />
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 3 — Connected Academic System
   ════════════════════════════════════════════════════════════════════════════ */
const ACADEMIC_JOURNEY = ["Curriculum", "Learning Outcomes", "Planning", "Teaching", "Assessment", "Feedback", "Learning Gaps", "Intervention", "Progress"];

function ConnectedSystemSection() {
  return (
    <Section id="academic-system">
      <FadeIn className="text-center mb-10">
        <Heading className="text-[2rem] lg:text-[2.4rem] mb-4">
          Connect the complete academic journey.
        </Heading>
        <Lead className="max-w-[620px] mx-auto mb-2">
          Lesson plans, classroom activities, assignments, assessments, feedback, student performance, and interventions should not remain disconnected.
        </Lead>
        <Lead className="max-w-[620px] mx-auto">
          Classess.com® connects these academic relationships so institutions can understand not only what has been completed, but what students are learning and where improvement is required.
        </Lead>
      </FadeIn>

      <FadeIn delay={0.08} className="mb-12">
        <MediaPlaceholder
          mediaId="INSTITUTION-HOME-M03"
          description="Scroll-based academic journey animation. Desktop: horizontal connected pathway. Mobile: vertical pathway. Text must remain visible if animation does not load."
        />
        <div className="mt-6">
          <JourneyPills steps={ACADEMIC_JOURNEY} />
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Create academic alignment", body: "Connect curriculum expectations with classroom planning, activities, assessment, feedback, and student support.", icon: "📋" },
          { title: "Improve academic visibility", body: "Give leaders a clearer view of curriculum progress, learning evidence, student needs, and intervention status.", icon: "📊" },
          { title: "Support continuous improvement", body: "Use academic evidence to improve teaching practices, assessment quality, student support, and institutional decisions.", icon: "🔄" },
        ].map((card, i) => (
          <FadeIn key={card.title} delay={0.08 * i}>
            <Card title={card.title} body={card.body} icon={<span className="text-[18px]">{card.icon}</span>} />
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.2}>
        <HighlightLine>
          Most platforms store academic information. Classess.com® helps institutions understand how that information is connected.
        </HighlightLine>
      </FadeIn>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 4 — Teacher Capacity and Academic Consistency
   ════════════════════════════════════════════════════════════════════════════ */
function TeacherCapacitySection() {
  return (
    <Section id="teacher-capacity" alt>
      <div className="grid lg:grid-cols-2 gap-10 items-stretch">

        <FadeIn>
          <Heading className="text-[2rem] lg:text-[2.3rem] mb-4">
            Give every teacher better academic support.
          </Heading>
          <Lead className="mb-2">
            Institutional improvement depends on the quality and consistency of everyday teaching.
          </Lead>
          <Lead className="mb-6">
            Classess.com® helps teachers plan, create, assess, provide feedback, identify student needs, and take corrective action—while institutional leaders gain visibility without interfering in every classroom decision.
          </Lead>

          <div className="flex flex-col gap-4 mb-6">
            {[
              { title: "Reduce repetitive work", body: "Help teachers spend less time preparing routine academic material, organising assessments, and compiling reports.", icon: "⚡" },
              { title: "Strengthen teaching quality", body: "Support curriculum-aligned planning, meaningful classroom activities, appropriate assessments, and actionable feedback.", icon: "🎯" },
              { title: "Build consistency without rigidity", body: "Maintain shared academic expectations while allowing teachers and campuses to adapt according to student and local needs.", icon: "🔗" },
            ].map((card) => (
              <Card key={card.title} title={card.title} body={card.body} icon={<span className="text-[18px]">{card.icon}</span>} />
            ))}
          </div>

          <Lead className="mb-6">
            AI-supported content remains reviewable and editable. Teachers maintain professional judgement and approval before material reaches students.
          </Lead>
          <HighlightLine>Better systems should support teachers—not control them.</HighlightLine>
          <div className="mt-6">
            <PrimaryButton>Explore Teacher Enablement <ArrowRight size={16} /></PrimaryButton>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="h-full">
          <MediaPlaceholder
            mediaId="INSTITUTION-HOME-M04"
            description="Teacher-support and approval workflow animation — institutional academic framework → teacher receives aligned draft → teacher reviews and adapts → classroom activity → learning evidence returns to system."
          />
        </FadeIn>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 5 — Student Learning and Intervention
   ════════════════════════════════════════════════════════════════════════════ */
const INSIGHT_AREAS = [
  "Students who have not attempted assigned work",
  "Students who attempted but continue to struggle",
  "Repeated misconceptions",
  "Common subject or skill gaps",
  "Declining participation or consistency",
  "Students who improved after intervention",
  "Students ready for extension or advanced learning",
];

const INTERVENTION_JOURNEY = ["Identify", "Understand", "Assign Support", "Monitor", "Reassess", "Improve"];

function StudentLearningSection() {
  return (
    <Section id="student-learning">
      <FadeIn className="mb-10">
        <Heading className="text-[2rem] lg:text-[2.3rem] mb-4">
          Identify who needs support before they fall further behind.
        </Heading>
        <Lead className="mb-2">
          Classess.com® brings together learning, practice, assessment, participation, and feedback evidence to help institutions recognise where support is needed.
        </Lead>
        <Lead>
          Leaders and teachers can understand patterns across a student, class, subject, grade, campus, programme, or district.
        </Lead>
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-10 items-stretch mb-12">
        <FadeIn>
          <h3
            className="text-[1.15rem] font-serif font-medium mb-5"
            style={{ color: "var(--ink)" }}
          >
            A clearer view of every learner
          </h3>
          <BenefitList items={INSIGHT_AREAS} />
        </FadeIn>

        <FadeIn delay={0.1} className="h-full">
          <MediaPlaceholder
            mediaId="INSTITUTION-HOME-M05"
            description="Learning-gap-to-intervention animation — learning pattern identified, affected student group, likely academic cause, recommended support, assigned responsibility, follow-up status, improvement after reassessment."
          />
        </FadeIn>
      </div>

      <FadeIn delay={0.12}>
        <h3
          className="text-[1.4rem] font-serif font-medium mb-3"
          style={{ color: "var(--ink)" }}
        >
          Turn insight into coordinated action.
        </h3>
        <Lead className="mb-6">
          Classess.com® helps institutions move from identifying a problem to planning, assigning, and reviewing an appropriate intervention.
        </Lead>
        <div className="mb-6">
          <JourneyPills steps={INTERVENTION_JOURNEY} />
        </div>
        <HighlightLine>Leave no learner behind.</HighlightLine>
        <div className="mt-6">
          <PrimaryButton>Explore Student Support <ArrowRight size={16} /></PrimaryButton>
        </div>
      </FadeIn>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 6 — Outcomes for Different Institution Types
   ════════════════════════════════════════════════════════════════════════════ */
function OutcomesSection({ selectedType }) {
  const active = ORG_TYPES.find((t) => t.id === selectedType) ?? ORG_TYPES[0];
  const { outcomes } = active;

  return (
    <Section id="outcomes" alt>
      <FadeIn className="text-center mb-10">
        <Heading className="text-[2rem] lg:text-[2.4rem] mb-4">
          The right visibility for every level of leadership.
        </Heading>
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-10 items-stretch">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-5"
          >
            <div
              className="p-6"
              style={{
                background: "var(--page)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r)",
              }}
            >
              <h3
                className="text-[1.1rem] font-serif font-medium mb-5"
                style={{ color: "var(--ink)" }}
              >
                {outcomes.title}
              </h3>
              <BenefitList items={outcomes.points} />
            </div>
            {outcomes.supporting && (
              <HighlightLine>{outcomes.supporting}</HighlightLine>
            )}
          </motion.div>
        </AnimatePresence>

        <FadeIn delay={0.1} className="h-full">
          <MediaPlaceholder
            mediaId="INSTITUTION-HOME-M06"
            description="Dynamic leadership dashboard demonstration — changes according to selected organisation type: independent campus, education group, NGO/CSR programme, or district system overview."
          />
        </FadeIn>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 7 — Integration and Implementation
   ════════════════════════════════════════════════════════════════════════════ */
const INTEGRATION_AREAS = [
  "Student Information Systems",
  "ERP platforms",
  "Learning Management Systems",
  "Google Classroom",
  "Microsoft Teams",
  "Assessment platforms",
  "Timetable and attendance systems",
  "Content platforms",
  "Existing institutional databases",
];

const IMPLEMENTATION_JOURNEY = ["Discover", "Configure", "Integrate", "Train", "Launch", "Review", "Scale"];

function IntegrationSection() {
  return (
    <Section id="implementation">
      <FadeIn className="mb-10">
        <Heading className="text-[2rem] lg:text-[2.3rem] mb-4">
          Make what already exists smarter.
        </Heading>
        <Lead className="mb-2">
          Institutions should not need to replace every existing system before they can benefit from academic intelligence.
        </Lead>
        <Lead>
          Classess.com® can operate independently or connect with existing academic and institutional platforms where suitable integrations are available.
        </Lead>
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-10 items-start mb-10">
        <FadeIn>
          <h3
            className="text-[1.1rem] font-serif font-medium mb-4"
            style={{ color: "var(--ink)" }}
          >
            Compatible integration areas
          </h3>
          <ul className="grid sm:grid-cols-2 gap-2.5">
            {INTEGRATION_AREAS.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[14px]" style={{ color: "var(--ink-2)" }}>
                <Check size={14} className="shrink-0" style={{ color: ACCENT }} />
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h3
            className="text-[1.1rem] font-serif font-medium mb-3"
            style={{ color: "var(--ink)" }}
          >
            Begin with what matters most.
          </h3>
          <Lead className="mb-6">
            Implementation can begin with one institution, campus, grade, subject, department, programme, or district cluster and expand according to adoption, readiness, and outcomes.
          </Lead>
          <div className="mb-6">
            <JourneyPills steps={IMPLEMENTATION_JOURNEY} />
          </div>
          <HighlightLine>Built for real institutions—not perfect systems.</HighlightLine>
          <div className="mt-6">
            <PrimaryButton>Explore Implementation <ArrowRight size={16} /></PrimaryButton>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.1}>
        <MediaPlaceholder
          mediaId="INSTITUTION-HOME-M07"
          description="Phased implementation and integration animation — Classess.com® connecting with existing platforms and expanding in phases. No unsupported integration logos."
        />
      </FadeIn>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 8 — Trust, Privacy, and Governance
   ════════════════════════════════════════════════════════════════════════════ */
const GOVERNANCE_PRINCIPLES = [
  "Role-based access and permissions",
  "Teacher and institutional approval workflows",
  "Consent and age-appropriate controls",
  "Data minimisation",
  "Secure academic data handling",
  "Audit trails and activity visibility",
  "Anonymisation where appropriate",
  "Defined escalation and safeguarding processes",
  "Clear human responsibility for important decisions",
];

function TrustSection() {
  return (
    <Section id="trust" alt>
      <div className="grid lg:grid-cols-2 gap-10 items-stretch">

        <FadeIn>
          <Heading className="text-[2rem] lg:text-[2.3rem] mb-4">
            Academic intelligence should not come at the cost of student privacy.
          </Heading>
          <Lead className="mb-6">
            Responsible AI adoption requires more than advanced features. It requires clear governance, appropriate access, human oversight, data protection, and institutional accountability.
          </Lead>

          <div className="mb-6">
            <BenefitList items={GOVERNANCE_PRINCIPLES} />
          </div>

          <Lead className="mb-6">
            Raw student data should not reach an external AI model without appropriate protection, governance, and institutional control.
          </Lead>

          <HighlightLine>Trust is not a separate feature. It is part of the platform architecture.</HighlightLine>
          <div className="mt-6">
            <PrimaryButton>Explore Trust & Governance <ArrowRight size={16} /></PrimaryButton>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="h-full">
          <MediaPlaceholder
            mediaId="INSTITUTION-HOME-M08"
            description="Governance-layer animation — institutional data → privacy and anonymisation layer → controlled AI processing → teacher or leader review → approved academic action → audit record."
          />
        </FadeIn>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 9 — Final Call to Action
   ════════════════════════════════════════════════════════════════════════════ */
function FinalCTASection() {
  return (
    <section
      id="get-started"
      className="w-full py-28 relative overflow-hidden"
      style={{ background: GRADIENT }}
    >
      <div
        className="absolute right-0 top-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "#fff" }}
      />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10 text-white">
        <FadeIn>
          <h2
            className="font-serif font-medium text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.08] mb-5 text-white"
            style={{ letterSpacing: "-0.025em" }}
          >
            Build a clearer, more connected academic system.
          </h2>
          <p className="text-[16px] text-white/90 leading-relaxed mb-10 max-w-[560px] mx-auto font-serif">
            Support teachers. Understand student learning. Strengthen academic decisions. Improve coordination across institutions, programmes, campuses, or districts.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <button
              className="inline-flex items-center gap-2 px-7 py-[11px] rounded-[8px] font-medium text-[14px] transition-all duration-200 hover:opacity-95 active:scale-95"
              style={{ background: "var(--page)", color: ACCENT }}
            >
              Request a Demo <ArrowRight size={16} />
            </button>
            <button
              className="inline-flex items-center gap-2 px-7 py-[11px] rounded-[8px] font-medium text-[14px] text-white transition-all duration-200 hover:bg-white/10 active:scale-95"
              style={{ border: "1px solid rgba(255,255,255,0.4)" }}
            >
              Speak with Our Academic Team
            </button>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[.1em] text-white/70">
            Basic platforms help institutions run. Classess.com® helps institutions improve.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 10 — Frequently Asked Questions
   ════════════════════════════════════════════════════════════════════════════ */
const FAQS_VISIBLE = [
  { q: "Can Classess.com® be used by one independent institution?", a: "Yes. A school, college, university, coaching centre, or training institution can use Classess.com® independently to support planning, teaching, assessment, student learning, academic leadership, and institutional improvement." },
  { q: "Can an education group manage multiple campuses?", a: "Yes. Classess.com® can support group-level visibility while allowing each campus to maintain its own structure, curriculum, terminology, policies, and local academic requirements." },
  { q: "Can NGOs and CSR programmes use Classess.com®?", a: "Yes. NGOs and CSR-led initiatives can use the platform to structure education programmes, support implementation teams, monitor participation and learning progress, identify support needs, and prepare clearer programme-impact reports." },
  { q: "Can it support a district or education network?", a: "Yes. Districts and education networks can use Classess.com® to view academic patterns across institutions, support school leaders and teachers, monitor programme implementation, identify institutions requiring help, and review intervention progress." },
  { q: "Do we need to replace our existing ERP or LMS?", a: "Not necessarily. Classess.com® can operate independently or work as an academic intelligence layer alongside existing systems, subject to the availability and suitability of integrations." },
  { q: "Can the platform be configured according to our curriculum and policies?", a: "Yes. Classess.com® can be structured around the institution's curriculum, terminology, hierarchy, academic workflows, assessment practices, policies, and reporting requirements." },
];

const FAQS_HIDDEN = [
  { q: "Can we begin with a pilot?", a: "Yes. Implementation can begin with a selected campus, department, grade, subject, programme, or district cluster before expanding based on readiness, adoption, and results." },
  { q: "How does Classess.com® support teachers?", a: "It helps teachers plan, create academic resources, conduct assessments, review student work, provide feedback, identify learning gaps, and organise interventions while maintaining teacher approval and professional control." },
  { q: "Can leadership view data at different levels?", a: "Yes. Access can be structured according to role. Depending on permissions, leaders may view information at student, class, subject, grade, institution, campus, programme, group, or district level." },
  { q: "How is student information protected?", a: "Classess.com® is designed around role-based access, responsible AI practices, secure data handling, approval workflows, audit visibility, and appropriate privacy and governance controls." },
  { q: "Can Classess.com® provide reports for CSR or government programmes?", a: "Yes. The platform can support programme reporting through participation, progress, learning-gap, intervention, and implementation evidence. Final reporting structures should be configured according to programme objectives and approved measurement frameworks." },
];

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--line)" }} className="last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span
          className="text-[15px] font-medium transition-colors"
          style={{ color: open ? "var(--ink)" : "var(--ink-2)" }}
        >
          {question}
        </span>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: open ? ACCENT : `color-mix(in srgb, ${ACCENT} 12%, #fff)`,
            color: open ? "#fff" : ACCENT,
          }}
        >
          {open ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-5 pr-10 text-[14.5px] leading-relaxed" style={{ color: "var(--ink-3)" }}>{answer}</p>
      </motion.div>
    </div>
  );
}

function FAQSection() {
  const [showMore, setShowMore] = useState(false);

  return (
    <Section id="faq" alt>
      <FadeIn className="mb-10 text-center">
        <Heading className="text-[2rem]">Frequently Asked Questions</Heading>
      </FadeIn>

      <FadeIn delay={0.06} className="max-w-3xl mx-auto">
        <div
          className="px-6"
          style={{
            background: "var(--page)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-lg)",
          }}
        >
          {FAQS_VISIBLE.map((faq) => (
            <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
          ))}

          <AnimatePresence initial={false}>
            {showMore && (
              <motion.div
                key="hidden-faqs"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {FAQS_HIDDEN.map((faq) => (
                  <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 text-center">
          <SecondaryButton onClick={() => setShowMore((v) => !v)}>
            {showMore ? "View Fewer Questions" : "View More Questions"}
          </SecondaryButton>
        </div>
      </FadeIn>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE ASSEMBLY
   ════════════════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════════════════
   SECTION 0 — Institution Overview (orbital feature map)
   Mirrors the student overview: feature "planets" orbit a glowing core; tapping
   one scrolls to that section. Clean list fallback on mobile.
   ════════════════════════════════════════════════════════════════════════════ */
const INSTITUTE_OVERVIEW_FEATURES = [
  { icon: Layers,        label: "Academic System",     anchor: "#academic-system",  desc: "One connected system across every class and department." },
  { icon: PencilRuler,   label: "Teacher Capacity",    anchor: "#teacher-capacity", desc: "Lift teaching quality and consistency at scale." },
  { icon: GraduationCap, label: "Student Learning",    anchor: "#student-learning", desc: "Early intervention that keeps every student on track." },
  { icon: BarChart3,     label: "Measurable Outcomes", anchor: "#outcomes",         desc: "See real results, tailored to your institution type." },
  { icon: RefreshCw,     label: "Integration",         anchor: "#implementation",   desc: "Fits your existing systems with a smooth rollout." },
  { icon: CheckCircle2,  label: "Trust & Privacy",     anchor: "#trust",            desc: "Enterprise-grade governance, privacy, and control." },
  { icon: Sparkles,      label: "Get Started",         anchor: "#get-started",      desc: "Bring Classess to your institution with confidence." },
  { icon: MessageCircle, label: "FAQs",                anchor: "#faq",              desc: "Every question about adopting Classess, answered." },
];

function scrollTo(anchor) {
  const el = document.querySelector(anchor);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

const VIDYA_INSTITUTE_OVERVIEW_MESSAGE =
  "Here's everything inside the Classess experience for your institution! " +
  "You can explore your connected academic system, teacher capacity, student learning, " +
  "measurable outcomes, integration, and trust and privacy. " +
  "Just tell me any area and I'll take you right there!";

function InstituteOverviewSection() {
  useEffect(() => {
    const el = document.getElementById("institute-overview");
    if (!el) return;
    let fired = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          window.dispatchEvent(
            new CustomEvent("vidya:section-entered", {
              detail: { message: VIDYA_INSTITUTE_OVERVIEW_MESSAGE },
            })
          );
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="institute-overview"
      className="w-full py-16 sm:py-20 relative overflow-hidden"
      style={{
        background: "var(--page)",
        backgroundImage: `radial-gradient(ellipse 75% 50% at 50% -5%, #F1F2F5 0%, transparent 65%)`,
      }}
    >
      {/* Subtle brand dot-grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #0E0E10 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2
            className="font-serif font-medium leading-[1.05] text-[clamp(1.9rem,4.2vw,3rem)]"
            style={{ letterSpacing: "-0.03em", color: "var(--ink)" }}
          >
            Everything inside your{" "}
            <em
              style={{
                fontStyle: "italic",
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              institution.
            </em>
          </h2>

          <p className="mt-4 text-[15px] max-w-[460px] mx-auto leading-relaxed" style={{ color: "var(--ink-4)" }}>
            One connected platform for your whole{" "}
            <span className="font-medium" style={{ color: "var(--ink-3)" }}>institution</span> — teachers, students, and outcomes together.
            Tap any orbiting area to jump straight to it, or hover to pause and explore.
          </p>
        </motion.div>

        {/* Keyframes for the orbital system (defined once, scoped by name). */}
        <style>{`
          @keyframes orbitSpin    { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
          @keyframes orbitSpinRev { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
          @keyframes corePulse    { 0% { transform: scale(1); opacity: .45; } 80% { opacity: 0; } 100% { transform: scale(2.3); opacity: 0; } }
          @keyframes coreFloat    { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          @media (prefers-reduced-motion: reduce) {
            .orbit-rotor, .orbit-rotor * { animation: none !important; }
          }
        `}</style>

        {/* ── Orbital system (desktop / tablet) ──────────────────────── */}
        <motion.div {...fadeUp} className="hidden sm:flex justify-center">
          <div className="group relative" style={{ width: "min(560px, 82vw)", aspectRatio: "1 / 1" }}>
            {/* Decorative orbit rings */}
            <div className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: `${ACCENT}33` }} />
            <div className="absolute rounded-full border" style={{ inset: "16%", borderColor: `${ACCENT}1f` }} />
            <div className="absolute rounded-full" style={{ inset: "30%", border: `1px solid ${ACCENT}14` }} />

            {/* Rotating ring of feature "planets" — pauses on hover. */}
            <div className="orbit-rotor absolute inset-0 [animation:orbitSpin_50s_linear_infinite] group-hover:[animation-play-state:paused]">
              {INSTITUTE_OVERVIEW_FEATURES.map(({ icon: Icon, label, anchor }, i) => {
                const RADIUS = 44;
                const theta  = (i / INSTITUTE_OVERVIEW_FEATURES.length) * 2 * Math.PI - Math.PI / 2;
                const x = 50 + RADIUS * Math.cos(theta);
                const y = 50 + RADIUS * Math.sin(theta);
                return (
                  <div key={anchor} className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
                    <button
                      onClick={() => scrollTo(anchor)}
                      title={label}
                      className="orbit-node block [animation:orbitSpinRev_50s_linear_infinite] group-hover:[animation-play-state:paused] focus:outline-none"
                    >
                      <div className="group/node flex flex-col items-center gap-2 w-[108px]">
                        <span
                          className="relative flex items-center justify-center w-[58px] h-[58px] rounded-full transition-all duration-200 group-hover/node:scale-[1.16] group-hover/node:-translate-y-0.5"
                          style={{
                            background: "var(--page)",
                            border: "1px solid var(--line)",
                            boxShadow: `0 6px 20px color-mix(in srgb, ${ACCENT} 14%, transparent)`,
                            color: ACCENT,
                          }}
                        >
                          <span
                            className="absolute inset-0 rounded-full opacity-0 group-hover/node:opacity-100 transition-opacity duration-200"
                            style={{ background: `color-mix(in srgb, ${ACCENT} 10%, #fff)` }}
                          />
                          <Icon size={22} className="relative" />
                        </span>
                        <span
                          className="px-2 py-1 font-mono text-[10px] font-semibold text-center leading-tight transition-colors duration-200"
                          style={{ background: "transparent", color: "var(--ink-3)" }}
                        >
                          {label}
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ── Center core: "Institute" ────────────────────────────── */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="relative w-[150px] h-[150px] [animation:coreFloat_5s_ease-in-out_infinite]">
                <span className="absolute inset-0 rounded-full [animation:corePulse_3.4s_ease-out_infinite]" style={{ background: `${ACCENT}30` }} />
                <span className="absolute inset-0 rounded-full [animation:corePulse_3.4s_ease-out_infinite_1.7s]" style={{ background: `${ACCENT}22` }} />
                <div
                  className="relative flex flex-col items-center justify-center w-full h-full rounded-full text-white"
                  style={{ background: GRADIENT, boxShadow: `0 18px 50px color-mix(in srgb, ${ACCENT} 45%, transparent)` }}
                >
                  <Compass size={26} className="mb-1 opacity-90" />
                  <span className="font-serif font-medium text-[22px] leading-none" style={{ letterSpacing: "-0.02em" }}>
                    Institute
                  </span>
                  <span className="mt-1.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    8 areas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Mobile fallback: clean list (no orbit on small screens) ── */}
        <div className="sm:hidden grid grid-cols-1 gap-2.5">
          {INSTITUTE_OVERVIEW_FEATURES.map(({ icon: Icon, label, desc, anchor }, i) => (
            <motion.button
              key={anchor}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.38, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => scrollTo(anchor)}
              className="group flex items-center gap-3.5 p-3.5 text-left transition-all duration-200 active:scale-[0.98]"
              style={{
                borderRadius: "var(--r)",
                border: "1px solid var(--line)",
                background: "var(--page)",
                boxShadow: "0 2px 8px rgba(14,14,16,0.04)",
              }}
            >
              <span
                className="flex items-center justify-center w-11 h-11 rounded-[9px] shrink-0"
                style={{ background: `color-mix(in srgb, ${ACCENT} 12%, #fff)`, color: ACCENT }}
              >
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-medium leading-snug" style={{ color: "var(--ink)" }}>{label}</span>
                <span className="block text-[12px] leading-snug truncate" style={{ color: "var(--ink-4)" }}>{desc}</span>
              </span>
              <ArrowRight size={15} className="shrink-0" style={{ color: "var(--line-2)" }} />
            </motion.button>
          ))}
        </div>

        {/* ── Divider ───────────────────────────────────────────────── */}
        <div className="mt-12 flex items-center gap-4">
          <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
          <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[.2em]" style={{ color: "var(--ink-4)" }}>
            Scroll to explore each area
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
        </div>
      </div>
    </section>
  );
}

export default function InstituteHome() {
  const [selectedType, setSelectedType] = useState("independent");

  return (
    <div className="w-full" style={{ background: "var(--page)" }}>
      <HeroSection />
      <InstituteOverviewSection />
      <InstitutionTypeSection selectedType={selectedType} setSelectedType={setSelectedType} />
      <ConnectedSystemSection />
      <TeacherCapacitySection />
      <StudentLearningSection />
      <OutcomesSection selectedType={selectedType} />
      <IntegrationSection />
      <TrustSection />
      <FinalCTASection />
      <FAQSection />
    </div>
  );
}
