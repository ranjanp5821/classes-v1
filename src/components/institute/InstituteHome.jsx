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

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ArrowRight, Plus, Minus } from "lucide-react";

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

/* ── Media placeholder ───────────────────────────────────────────────────── */
function MediaPlaceholder({ mediaId, description }) {
  return (
    <div
      className="rounded-2xl flex flex-col items-center justify-center gap-3 p-10 min-h-[280px] h-full border-2 border-dashed"
      style={{ borderColor: `${ACCENT}35`, background: `${ACCENT}06` }}
      aria-label={`Media placeholder – ${mediaId}`}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `${ACCENT}18` }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <p className="text-[13px] font-bold tracking-wide" style={{ color: ACCENT }}>{mediaId}</p>
      <p className="text-[12px] text-neutral-400 text-center max-w-[240px] leading-relaxed">{description}</p>
    </div>
  );
}

/* ── Layout primitives ───────────────────────────────────────────────────── */
function Section({ id, alt = false, children }) {
  return (
    <section id={id} className={`w-full py-20 sm:py-24 ${alt ? "bg-neutral-50/70" : "bg-white"}`}>
      <div className="max-w-5xl mx-auto px-6 sm:px-8">{children}</div>
    </section>
  );
}

function Heading({ children, className = "" }) {
  return (
    <h2 className={`font-display font-extrabold text-neutral-900 tracking-tight leading-tight ${className}`}>
      {children}
    </h2>
  );
}

function Lead({ children, className = "" }) {
  return (
    <p className={`text-[15px] text-neutral-500 leading-relaxed ${className}`}>{children}</p>
  );
}

function HighlightLine({ children }) {
  return (
    <div
      className="rounded-xl px-5 py-4 border-l-4 text-[15px] font-semibold text-neutral-800 leading-snug"
      style={{ borderColor: ACCENT, background: `${ACCENT}08` }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all duration-150"
      style={{ background: GRADIENT }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-semibold border transition-all duration-150 hover:bg-neutral-50 active:scale-95"
      style={{ color: ACCENT, borderColor: `${ACCENT}40` }}
    >
      {children}
    </button>
  );
}

function Card({ title, body, icon }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col gap-3">
      {icon && (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${ACCENT}12` }}>
          {icon}
        </div>
      )}
      <h4 className="text-[16px] font-bold text-neutral-900">{title}</h4>
      <p className="text-[14px] text-neutral-500 leading-relaxed">{body}</p>
    </div>
  );
}

function BenefitList({ items }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((b) => (
        <li key={b} className="flex items-start gap-3 text-[14.5px] text-neutral-700">
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
            className="px-4 py-1.5 rounded-full text-[13px] font-bold border"
            style={{ color: ACCENT, borderColor: `${ACCENT}35`, background: `${ACCENT}08` }}
          >
            {step}
          </span>
          {i < steps.length - 1 && <ChevronRight size={14} className="text-neutral-300" />}
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
    <section id="institution-hero" className="w-full pt-28 pb-20 bg-white">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">

          <FadeIn>
            <h1 className="text-[2.6rem] lg:text-[3rem] font-extrabold text-neutral-900 leading-[1.1] tracking-tight font-display mb-5">
              See what is happening academically—
              <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                and know what to improve next.
              </span>
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
            <p className="text-[13.5px] font-semibold text-neutral-500">
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
        <p className="text-[13px] font-semibold text-neutral-400 uppercase tracking-widest mb-3 text-center">I represent:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {ORG_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2.5 rounded-xl text-[13.5px] font-semibold border transition-all duration-150 ${
                selectedType === type.id
                  ? "text-white shadow-sm"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
              }`}
              style={selectedType === type.id ? { background: GRADIENT, borderColor: "transparent" } : {}}
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
          <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm flex flex-col gap-4">
            <h3 className="text-[1.2rem] font-extrabold text-neutral-900">{active.label}</h3>
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
          <h3 className="text-[1.15rem] font-extrabold text-neutral-900 mb-5">A clearer view of every learner</h3>
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
        <h3 className="text-[1.4rem] font-extrabold text-neutral-900 mb-3">Turn insight into coordinated action.</h3>
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
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
              <h3 className="text-[1.1rem] font-extrabold text-neutral-900 mb-5">{outcomes.title}</h3>
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
          <h3 className="text-[1.1rem] font-extrabold text-neutral-900 mb-4">Compatible integration areas</h3>
          <ul className="grid sm:grid-cols-2 gap-2.5">
            {INTEGRATION_AREAS.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[14px] text-neutral-700">
                <Check size={14} className="shrink-0" style={{ color: ACCENT }} />
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h3 className="text-[1.1rem] font-extrabold text-neutral-900 mb-3">Begin with what matters most.</h3>
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
    <section id="get-started" className="w-full py-28 relative overflow-hidden" style={{ background: GRADIENT }}>
      <div
        className="absolute right-0 top-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: "#fff" }}
      />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center relative z-10 text-white">
        <FadeIn>
          <h2 className="text-[2.2rem] lg:text-[2.8rem] font-extrabold tracking-tight leading-tight mb-5">
            Build a clearer, more connected academic system.
          </h2>
          <p className="text-[16px] text-white/90 leading-relaxed mb-10 max-w-[560px] mx-auto">
            Support teachers. Understand student learning. Strengthen academic decisions. Improve coordination across institutions, programmes, campuses, or districts.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] bg-white shadow-lg transition-all duration-200 hover:opacity-95 active:scale-95" style={{ color: ACCENT }}>
              Request a Demo <ArrowRight size={16} />
            </button>
            <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-white border border-white/40 transition-all duration-200 hover:bg-white/10 active:scale-95">
              Speak with Our Academic Team
            </button>
          </div>
          <p className="text-[14px] font-semibold text-white/80">
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
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-neutral-800 group-hover:text-neutral-600 transition-colors">{question}</span>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{ background: open ? ACCENT : `${ACCENT}12`, color: open ? "#fff" : ACCENT }}
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
        <p className="pb-5 pr-10 text-[14.5px] text-neutral-500 leading-relaxed">{answer}</p>
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
        <div className="bg-white rounded-2xl border border-neutral-100 px-6 shadow-sm">
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
export default function InstituteHome() {
  const [selectedType, setSelectedType] = useState("independent");

  return (
    <div className="w-full bg-white">
      <HeroSection />
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
