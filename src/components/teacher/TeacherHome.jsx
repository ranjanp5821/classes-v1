/**
 * TeacherHome.jsx — Teacher Homepage Content
 *
 * All marketing sections for the teacher role (per Teacher Homepage Content doc):
 *   1. Teacher Hero
 *   2. A Clearer Teaching Workflow
 *   3. Planning and Preparation
 *   4. Classroom Understanding
 *   5. Assessment and Feedback
 *   6. Student Insights and Intervention
 *   7. Teacher-Controlled AI
 *   8. Final Call to Action
 *   9. Frequently Asked Questions
 *
 * MEDIA SLOTS (drop delivered files into the matching slot):
 *   TEA-HOME-M01  Teacher workspace animation
 *   TEA-HOME-M02  Teaching-cycle animation
 *   TEA-HOME-M03  Lesson-planning demonstration
 *   TEA-HOME-M04  Live classroom insight animation
 *   TEA-HOME-M05  Assessment-to-feedback animation
 *   TEA-HOME-M06  Student-insight-to-intervention animation
 *   TEA-HOME-M07  Teacher approval workflow animation
 *   TEA-HOME-M08  Final CTA decorative visual
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ChevronRight, ArrowRight, Plus, Minus,
  Compass, CalendarDays, BookOpen, ListChecks, BarChart3, Brain,
  Sparkles, MessageCircle, PencilRuler,
} from "lucide-react";

/* ── Theming ─────────────────────────────────────────────────────────────── */
const ACCENT   = "#1CA363";
const GRADIENT = "linear-gradient(135deg, #22C55E 0%, #1CA363 100%)";

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

/* ── Slot artwork ─────────────────────────────────────────────────────
 * Delivered illustration per media slot (bundled in /public/assets/teacher).
 * Slots without an entry (e.g. TEA-HOME-M08) fall back to the dashed
 * placeholder below until artwork is supplied. */
const TEACHER_SLOT_IMAGE = {
  "TEA-HOME-M01": "/assets/teacher/teacher-01-updated.svg",
  "TEA-HOME-M02": "/assets/teacher/media-02-teaching-cycle.jpg",
  "TEA-HOME-M03": "/assets/teacher/media-03-lesson-planning.png",
  "TEA-HOME-M04": "/assets/teacher/media-04-classroom-insight.png",
  "TEA-HOME-M05": "/assets/teacher/teacher-05-updated.svg",
  "TEA-HOME-M06": "/assets/teacher/teacher-06-updated.svg",
  "TEA-HOME-M07": "/assets/teacher/media-07-approval-workflow.jpeg",
  "TEA-HOME-M08": "/assets/teacher/media-08-cta.svg",
};

/* ── Media placeholder (swapped out when real assets arrive) ─────────────── */
function MediaPlaceholder({ mediaId, description }) {
  const image = TEACHER_SLOT_IMAGE[mediaId];

  if (image) {
    return (
      <div
        className="overflow-hidden h-full"
        style={{
          border: "1px solid var(--line)",
          borderRadius: "var(--r-lg)",
          boxShadow: "0 12px 40px rgba(14,14,16,0.08)",
        }}
      >
        <img
          src={image}
          alt={description}
          className="w-full h-full object-cover"
          style={{ display: "block", minHeight: 280 }}
        />
      </div>
    );
  }

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

function ReadMoreLink({ href, label, ariaLabel }) {
  const navigate = useNavigate();
  const handleClick = () => {
    const [path, hash] = href.split("#");
    navigate(path + (hash ? `#${hash}` : ""), { replace: false });
  };
  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 text-[13.5px] font-medium transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ color: ACCENT }}
      aria-label={ariaLabel}
    >
      {label || "Read More"} <ArrowRight size={13} />
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

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 1 — Teacher Hero
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection({ onOpenAuth }) {
  const navigate = useNavigate();
  return (
    <section
      id="teacher-hero"
      className="relative w-full overflow-hidden pt-28 pb-20"
      style={{
        backgroundImage: `radial-gradient(ellipse 70% 55% at 50% 0%, #F1F2F5 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 50% 0%, #E8F7F060 0%, transparent 70%)`,
      }}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">

          <FadeIn>
            <h1
              className="font-serif text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.08] mb-5"
              style={{ letterSpacing: "-0.03em", color: "var(--ink)" }}
            >
              Spend less time managing work.{" "}
              <em
                style={{
                  fontStyle: "italic",
                  background: GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Spend more time improving learning.
              </em>
            </h1>
            <Lead className="mb-4 max-w-[520px]">
              Classess.com® helps teachers plan lessons, create academic resources, assess student work, provide meaningful feedback, and understand who needs support—all from one connected academic workspace.
            </Lead>
            <p className="text-[15px] mb-8" style={{ color: "var(--ink-4)" }}>
              Use it independently or through your institution.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <PrimaryButton onClick={() => onOpenAuth?.("signin")}>Start as a Teacher <ArrowRight size={16} /></PrimaryButton>
              <SecondaryButton onClick={() => navigate("/teachers/how-it-helps")} aria-label="Learn how Classess.com® helps teachers">See How It Works</SecondaryButton>
            </div>
            <p className="text-[13.5px] font-medium" style={{ color: "var(--ink-3)" }}>
              AI handles repetitive academic work while the teacher remains in control.
            </p>
          </FadeIn>

          <FadeIn delay={0.12} className="h-full">
            <MediaPlaceholder
              mediaId="TEA-HOME-M01"
              description="Short looping teacher-workspace animation — teacher's day simplified into 4 priorities: Today's class, Lesson preparation, Student work requiring review, Students needing support."
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 2 — A Clearer Teaching Workflow
   ════════════════════════════════════════════════════════════════════════════ */
const JOURNEY_STEPS = ["Plan", "Teach", "Assess", "Understand", "Support", "Improve"];

function WorkflowSection() {
  return (
    <Section id="teaching-workflow" alt>
      <FadeIn className="text-center mb-10">
        <Heading className="text-[2rem] lg:text-[2.4rem] mb-4">
          One connected journey—from planning to student progress.
        </Heading>
        <Lead className="max-w-[620px] mx-auto">
          Teaching should not require moving between disconnected documents, applications, spreadsheets, and reports.
        </Lead>
        <Lead className="max-w-[620px] mx-auto mt-2">
          Classess.com® connects the complete teaching cycle so that every activity contributes to a clearer understanding of student learning.
        </Lead>
      </FadeIn>

      <FadeIn delay={0.08} className="mb-12">
        <MediaPlaceholder
          mediaId="TEA-HOME-M02"
          description="Scroll-based teaching-cycle animation. Desktop: horizontal journey. Mobile: vertical journey. Activates on scroll."
        />
        <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
          {JOURNEY_STEPS.map((step, i) => (
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
              {i < JOURNEY_STEPS.length - 1 && (
                <ChevronRight size={14} style={{ color: "var(--line-2)" }} />
              )}
            </div>
          ))}
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Prepare with clarity", body: "Turn curriculum requirements and learning outcomes into structured lessons, activities, resources, and assessments.", icon: "📋" },
          { title: "Respond to learning", body: "Use student participation, practice, and assessment evidence to understand what is working and what needs attention.", icon: "📊" },
          { title: "Improve continuously", body: "Provide feedback, assign appropriate support, and review whether students have improved after intervention.", icon: "🔄" },
        ].map((card, i) => (
          <FadeIn key={card.title} delay={0.08 * i}>
            <Card title={card.title} body={card.body} icon={<span className="text-[18px]">{card.icon}</span>} />
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={0.1} className="mt-8 flex justify-center">
        <ReadMoreLink
          href="/teachers/how-it-helps#connected-teaching-journey"
          ariaLabel="Read more about the connected teaching journey"
        />
      </FadeIn>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 3 — Planning and Preparation
   ════════════════════════════════════════════════════════════════════════════ */
const PLANNING_TABS = ["Curriculum Input", "AI-Generated Draft", "Teacher Review", "Final Lesson"];

const PLANNING_TAB_CONTENT = {
  "Curriculum Input":    { label: "Step 1", desc: "Teacher selects grade, subject, topic, and learning outcome to begin.", visual: "📚  Grade 8 · Science · Photosynthesis · Learning Outcome: Explain the process and products of photosynthesis." },
  "AI-Generated Draft":  { label: "Step 2", desc: "Classess.com® creates a structured lesson draft ready for teacher review.", visual: "🤖  Draft generated: Lesson plan with 5 activities, 2 assessments, and differentiated resources. Awaiting teacher review." },
  "Teacher Review":      { label: "Step 3", desc: "Teacher reviews, edits, and refines the draft to fit their class context.", visual: "✏️  Teacher editing: Adjusted activity timing, added a discussion prompt, removed one resource. Changes saved." },
  "Final Lesson":        { label: "Step 4", desc: "Teacher approves the final version. The lesson is ready for classroom use.", visual: "✅  Lesson approved and ready. Students will not see content until the teacher publishes it." },
};

function PlanningSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(PLANNING_TABS[0]);

  return (
    <Section id="planning">
      <div className="grid lg:grid-cols-2 gap-14 items-start">

        <FadeIn>
          <Heading className="text-[2rem] lg:text-[2.3rem] mb-4">Begin every class with greater clarity.</Heading>
          <Lead className="mb-2">
            Classess.com® helps teachers move from curriculum requirements to classroom-ready learning experiences without starting from a blank page.
          </Lead>
          <Lead className="mb-6">
            Create, review, and adapt academic material according to the subject, grade, topic, learning outcome, student level, and institutional requirements.
          </Lead>
          <div className="mb-8">
            <BenefitList items={[
              "Prepare lessons and session plans faster",
              "Align teaching with curriculum and learning outcomes",
              "Create classroom activities and supporting resources",
              "Develop assignments, worksheets, and discussion prompts",
              "Adapt material for different student needs",
              "Reuse and improve previously created academic work",
            ]} />
          </div>
          <HighlightLine>
            The platform prepares the first draft. The teacher shapes the final learning experience.
          </HighlightLine>
          <div className="mt-8 flex flex-col gap-3">
            <PrimaryButton onClick={() => navigate("/teachers/plan-and-create")}>Explore Planning Tools <ArrowRight size={16} /></PrimaryButton>
            <ReadMoreLink
              href="/teachers/plan-and-create"
              ariaLabel="Read more about planning lessons and creating academic resources"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div
            className="flex flex-wrap gap-1 mb-4 p-1 rounded-[10px]"
            style={{ background: "var(--mist)" }}
          >
            {PLANNING_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 min-w-[120px] px-3 py-2 rounded-[8px] text-[13px] font-medium transition-all duration-150"
                style={
                  activeTab === tab
                    ? { background: "var(--page)", color: ACCENT, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }
                    : { background: "transparent", color: "var(--ink-3)" }
                }
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="p-6 min-h-[200px] flex flex-col gap-3"
              style={{
                background: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r)",
              }}
            >
              <span
                className="font-mono text-[11px] font-semibold uppercase tracking-[.04em]"
                style={{ color: ACCENT }}
              >
                {PLANNING_TAB_CONTENT[activeTab].label}
              </span>
              <p className="text-[14.5px] font-medium" style={{ color: "var(--ink)" }}>
                {PLANNING_TAB_CONTENT[activeTab].desc}
              </p>
              <div
                className="mt-2 p-4 text-[13px] leading-relaxed font-mono"
                style={{
                  background: `color-mix(in srgb, ${ACCENT} 6%, #fff)`,
                  borderRadius: "var(--r-sm)",
                  color: "var(--ink-2)",
                }}
              >
                {PLANNING_TAB_CONTENT[activeTab].visual}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6">
            <MediaPlaceholder
              mediaId="TEA-HOME-M03"
              description="Interactive lesson-planning demonstration or short product-interface video. Shown beside the website copy."
            />
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 4 — Classroom Understanding
   ════════════════════════════════════════════════════════════════════════════ */
function ClassroomSection() {
  return (
    <Section id="classroom" alt>
      <FadeIn className="mb-10">
        <Heading className="text-[2rem] lg:text-[2.3rem] mb-4 max-w-[640px]">
          Know whether students are learning—not just whether the lesson was completed.
        </Heading>
        <Lead className="max-w-[600px] mb-2">
          Classess.com® helps teachers collect useful learning evidence through classroom questions, short checks, polls, quizzes, activities, assignments, and student responses.
        </Lead>
        <Lead className="max-w-[600px]">
          Instead of waiting until the final examination, teachers can identify confusion while there is still time to act.
        </Lead>
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-10 items-stretch">
        <FadeIn delay={0.08} className="h-full">
          <MediaPlaceholder
            mediaId="TEA-HOME-M04"
            description="Live classroom insight animation. Shows: one concept being taught, student response indicators, students who understood, students who are uncertain, recommended teacher action."
          />
        </FadeIn>

        <div className="flex flex-col gap-5">
          {[
            { title: "See who is participating", body: "Understand which students are actively engaging and which students may require encouragement or follow-up.", icon: "👁" },
            { title: "Identify misunderstanding early", body: "Recognise concepts that need to be explained again before the class moves forward.", icon: "🎯" },
            { title: "Adjust the next lesson", body: "Use real learning evidence to decide whether to continue, revise, differentiate, or provide additional support.", icon: "🔧" },
          ].map((card, i) => (
            <FadeIn key={card.title} delay={0.08 * i}>
              <Card title={card.title} body={card.body} icon={<span className="text-[18px]">{card.icon}</span>} />
            </FadeIn>
          ))}
          <FadeIn delay={0.28}>
            <HighlightLine>
              Completion tells you what was taught. Evidence tells you what was learned.
            </HighlightLine>
          </FadeIn>
          <FadeIn delay={0.36} className="mt-4">
            <ReadMoreLink
              href="/teachers/assess-and-support#classroom-understanding"
              ariaLabel="Read more about understanding student learning during class"
            />
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 5 — Assessment and Feedback
   ════════════════════════════════════════════════════════════════════════════ */
function AssessmentSection() {
  const navigate = useNavigate();
  return (
    <Section id="assessment">
      <div className="grid lg:grid-cols-2 gap-10 items-stretch">

        <FadeIn>
          <Heading className="text-[2rem] lg:text-[2.3rem] mb-4">
            Move from marking answers to understanding learning.
          </Heading>
          <Lead className="mb-6">
            Classess.com® helps teachers create meaningful assessments, review student responses, provide structured feedback, and understand the concepts and skills behind the marks.
          </Lead>
          <div className="mb-10">
            <BenefitList items={[
              "Create curriculum-aligned assessments",
              "Use appropriate question types and difficulty levels",
              "Apply rubrics and marking schemes consistently",
              "Review attempted and unattempted questions",
              "Provide written, structured, or voice feedback",
              "Identify common mistakes across the class",
              "Recommend corrective practice and revision",
            ]} />
          </div>

          <div className="pt-8" style={{ borderTop: "1px solid var(--line)" }}>
            <h3
              className="text-[1.3rem] font-serif font-medium mb-3"
              style={{ color: "var(--ink)" }}
            >
              Give feedback students can act on.
            </h3>
            <Lead className="mb-5">
              A score tells students how they performed. Good feedback helps them understand what to improve and what to do next.
            </Lead>

            <div
              className="p-5 flex flex-col gap-2.5 mb-6"
              style={{
                background: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r)",
              }}
            >
              <p className="text-[14px] font-medium flex items-center gap-2" style={{ color: "var(--ink)" }}>
                <span className="text-green-500">✓</span> You understood the concept.
              </p>
              <p className="text-[14px] font-medium flex items-center gap-2" style={{ color: "var(--ink)" }}>
                <span style={{ color: ACCENT }}>◎</span> You need more support applying it to unfamiliar problems.
              </p>
              <p className="text-[14px] font-medium flex items-center gap-2" style={{ color: "var(--ink)" }}>
                <span style={{ color: "var(--ink-4)" }}>→</span> Next step: Complete the recommended application activity.
              </p>
            </div>

            <HighlightLine>Classess.com® helps teachers measure the skills behind the marks.</HighlightLine>
            <div className="mt-6 flex flex-col gap-3">
              <PrimaryButton onClick={() => navigate("/teachers/assess-and-support#assessment-and-feedback")}>Explore Assessment and Feedback <ArrowRight size={16} /></PrimaryButton>
              <ReadMoreLink
                href="/teachers/assess-and-support#assessment-and-feedback"
                ariaLabel="Read more about assessment, evaluation, and student feedback"
              />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="h-full">
          <MediaPlaceholder
            mediaId="TEA-HOME-M05"
            description="Assessment-to-feedback product animation. Demonstrates: teacher creates assessment → student responses reviewed → recurring misconception identified → teacher reviews & approves feedback → corrective activity assigned."
          />
        </FadeIn>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 6 — Student Insights and Intervention
   ════════════════════════════════════════════════════════════════════════════ */
function InsightsSection() {
  const navigate = useNavigate();
  return (
    <Section id="insights" alt>
      <FadeIn className="mb-10">
        <Heading className="text-[2rem] lg:text-[2.3rem] mb-4 max-w-[560px]">
          See who needs help—and understand why.
        </Heading>
        <Lead className="max-w-[600px]">
          Classess.com® brings together learning, practice, assessment, participation, and feedback evidence so teachers can recognise student needs earlier.
        </Lead>
      </FadeIn>

      <FadeIn delay={0.06} className="mb-14">
        <h3
          className="text-[1.15rem] font-serif font-medium mb-5"
          style={{ color: "var(--ink)" }}
        >
          A clearer view of every learner
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: "Students who did not attempt", body: "Identify students who may need encouragement, clarification, additional time, or personal follow-up.", icon: "📭" },
            { title: "Students who attempted but struggled", body: "Understand the concepts, question types, or skills causing difficulty.", icon: "🔍" },
            { title: "Students making repeated mistakes", body: "Recognise patterns that may require reteaching, targeted practice, or a different explanation.", icon: "⚠️" },
            { title: "Students ready to move ahead", body: "Provide extension work and appropriate challenges for students who have demonstrated mastery.", icon: "🚀" },
          ].map((card, i) => (
            <FadeIn key={card.title} delay={0.06 * i}>
              <Card title={card.title} body={card.body} icon={<span className="text-[18px]">{card.icon}</span>} />
            </FadeIn>
          ))}
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-10 items-stretch">
        <FadeIn>
          <h3
            className="text-[1.4rem] font-serif font-medium mb-4"
            style={{ color: "var(--ink)" }}
          >
            Turn insight into action
          </h3>
          <Lead className="mb-6">
            Teachers can assign revision, practice, remedial learning, extension activities, or personal feedback based on the student's actual need.
          </Lead>

          <div
            className="p-5 flex flex-col gap-3 mb-6"
            style={{
              background: "var(--page)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r)",
            }}
          >
            <p className="text-[13.5px]" style={{ color: "var(--ink)" }}>
              <span className="font-medium">Observed:</span> Student understands definitions but struggles with application.
            </p>
            <p className="text-[13.5px]" style={{ color: "var(--ink)" }}>
              <span className="font-medium">Recommended support:</span> Worked example followed by guided practice.
            </p>
            <p className="text-[13.5px]" style={{ color: "var(--ink)" }}>
              <span className="font-medium">Follow-up:</span> Reassess after completion.
            </p>
          </div>

          <HighlightLine>Every student should be seen, supported, and learning at their best.</HighlightLine>
          <div className="mt-6 flex flex-col gap-3">
            <PrimaryButton>View Sample Student Insights <ArrowRight size={16} /></PrimaryButton>
            <ReadMoreLink
              href="/teachers/assess-and-support#student-insights"
              ariaLabel="Read more about student insights and academic intervention"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="h-full">
          <MediaPlaceholder
            mediaId="TEA-HOME-M06"
            description="Student-insight-to-intervention animation. Shows: student need, reason for difficulty, recommended intervention, teacher-selected action, improvement check. Small number of dummy student profiles."
          />
        </FadeIn>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 7 — Teacher-Controlled AI
   ════════════════════════════════════════════════════════════════════════════ */
const AI_PRINCIPLES = [
  "Teacher approval before publishing",
  "Curriculum and learning-outcome alignment",
  "Institution-specific context",
  "Editable academic content",
  "Transparent recommendations",
  "Responsible use of student data",
  "Clear roles and permissions",
];

function AIControlSection() {
  const navigate = useNavigate();
  return (
    <Section id="ai-control">
      <div className="grid lg:grid-cols-2 gap-14 items-start">

        <FadeIn>
          <Heading className="text-[2rem] lg:text-[2.3rem] mb-4">
            AI supports the teacher. The teacher remains in control.
          </Heading>
          <Lead className="mb-2">
            Classess.com® uses academic context to help teachers plan, create, assess, analyse, and respond more efficiently.
          </Lead>
          <Lead className="mb-8">
            Every AI-supported output can be reviewed, edited, approved, or rejected by the teacher before it reaches students.
          </Lead>
          <div className="mb-8">
            <BenefitList items={AI_PRINCIPLES} />
          </div>
          <Lead className="mb-6">
            AI should reduce repetitive work without reducing teacher responsibility, judgement, creativity, or human connection.
          </Lead>
          <HighlightLine>
            Helping teachers do what they do best—while AI and technology do the rest.
          </HighlightLine>
          <div className="mt-8 flex flex-col gap-3">
            <PrimaryButton onClick={() => navigate("/teachers/how-it-helps#teacher-controlled-ai")}>See Responsible AI in Action <ArrowRight size={16} /></PrimaryButton>
            <ReadMoreLink
              href="/teachers/how-it-helps#teacher-controlled-ai"
              ariaLabel="Read more about teacher-controlled artificial intelligence"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="h-full">
          <MediaPlaceholder
            mediaId="TEA-HOME-M07"
            description="Teacher approval workflow animation. Shows: AI creates suggested academic output → teacher reviews → teacher edits a section → teacher approves → approved content becomes available to students. Approval step must be clearly visible."
          />
        </FadeIn>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 8 — Final Call to Action
   ════════════════════════════════════════════════════════════════════════════ */
function FinalCTASection({ onOpenAuth }) {
  const navigate = useNavigate();
  return (
    <section
      id="get-started"
      className="w-full py-28 relative overflow-hidden"
      style={{ background: GRADIENT }}
    >
      {/* TEA-HOME-M08 — decorative backdrop */}
      <img
        src={TEACHER_SLOT_IMAGE["TEA-HOME-M08"]}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.16] mix-blend-overlay pointer-events-none"
      />
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
            Better teaching begins with better academic support.
          </h2>
          <p className="text-[16px] text-white/90 leading-relaxed mb-10 max-w-[540px] mx-auto font-serif">
            Plan with clarity. Teach with better context. Assess meaningfully. Understand student needs. Provide support that leads to progress.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <button
              onClick={() => onOpenAuth?.("signin")}
              className="inline-flex items-center gap-2 px-7 py-[11px] rounded-[8px] font-medium text-[14px] transition-all duration-200 hover:opacity-95 active:scale-95"
              style={{ background: "var(--page)", color: ACCENT }}
            >
              Start as a Teacher <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/teachers/tutorials#getting-started")}
              className="inline-flex items-center gap-2 px-7 py-[11px] rounded-[8px] font-medium text-[14px] text-white transition-all duration-200 hover:bg-white/10 active:scale-95"
              style={{ border: "1px solid rgba(255,255,255,0.4)" }}
            >
              Watch Teacher Tutorial
            </button>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[.1em] text-white/70">
            Less repetitive work. More meaningful teaching.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 9 — Frequently Asked Questions
   ════════════════════════════════════════════════════════════════════════════ */
const FAQS_VISIBLE = [
  { q: "Can I use Classess.com® independently as a teacher?", a: "Yes. Teachers can create an independent account and use available planning, content, assessment, feedback, and student-support tools without waiting for an institution to adopt the platform." },
  { q: "Can I use Classess.com® if my institution already has an LMS or ERP?", a: "Yes. Classess.com® is designed to work as an academic intelligence layer and may connect with existing learning, academic, and institutional systems where appropriate integrations are available." },
  { q: "Will AI-generated content be published automatically?", a: "No. Teachers should be able to review, edit, approve, or reject AI-supported academic content before it is assigned or published to students." },
  { q: "Can the platform align content with my curriculum?", a: "Yes. Academic outputs can be structured according to curriculum, grade, subject, topic, learning outcome, assessment requirement, and institutional context." },
  { q: "Can Classess.com® help reduce assessment and grading work?", a: "Yes. It can support assessment creation, rubric use, response review, structured feedback, common-error identification, and performance analysis. Teacher oversight remains important, particularly for subjective and high-stakes evaluation." },
  { q: "How does Classess.com® help me support struggling students?", a: "The platform helps identify unattempted work, repeated mistakes, concept gaps, skill difficulties, inconsistent participation, and areas requiring revision. Teachers can then assign targeted learning, practice, feedback, or intervention." },
];

const FAQS_HIDDEN = [
  { q: "Does Classess.com® replace teachers?", a: "No. It is designed to support teachers by reducing repetitive work and improving academic visibility. Professional judgement, human relationships, classroom leadership, and teacher responsibility remain central." },
  { q: "Can I provide voice feedback?", a: "Where enabled, teachers may provide voice, written, structured, or rubric-based feedback according to the activity and institutional requirements." },
  { q: "Can I monitor whether an intervention helped?", a: "Yes. Teachers can review subsequent learning and assessment evidence to understand whether the student improved after revision, practice, reteaching, or other support." },
  { q: "Is student information protected?", a: "Classess.com® is designed around responsible AI, role-based permissions, secure data handling, approval workflows, and appropriate privacy controls." },
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
   SECTION 0 — Teaching Experience Overview (orbital feature map)
   Mirrors the student overview: feature "planets" orbit a glowing core; tapping
   one scrolls to that section. Clean list fallback on mobile.
   ════════════════════════════════════════════════════════════════════════════ */
const TEACHER_OVERVIEW_FEATURES = [
  { icon: Compass,       label: "Teaching Workflow",       anchor: "#teaching-workflow", desc: "One connected journey from planning to student progress." },
  { icon: CalendarDays,  label: "Lesson Planning",         anchor: "#planning",          desc: "Turn curriculum into structured, ready-to-teach lessons." },
  { icon: BookOpen,      label: "Classroom Understanding", anchor: "#classroom",         desc: "See what students grasp — live, as you teach." },
  { icon: ListChecks,    label: "Assessment & Feedback",   anchor: "#assessment",        desc: "Assess faster and give feedback that actually lands." },
  { icon: BarChart3,     label: "Student Insights",        anchor: "#insights",          desc: "Spot who needs help early and act with confidence." },
  { icon: Brain,         label: "Teacher-Controlled AI",   anchor: "#ai-control",        desc: "Powerful AI that stays fully under your control." },
  { icon: Sparkles,      label: "Get Started",             anchor: "#get-started",       desc: "Bring Classess into your classroom in minutes." },
  { icon: MessageCircle, label: "FAQs",                    anchor: "#faq",               desc: "Every question about teaching with Classess, answered." },
];

function scrollTo(anchor) {
  const el = document.querySelector(anchor);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

const VIDYA_TEACHER_OVERVIEW_MESSAGE =
  "Here's everything inside your teaching experience on Classess! " +
  "You can explore your teaching workflow, lesson planning, classroom understanding, " +
  "assessment and feedback, student insights, and teacher-controlled AI. " +
  "Just tell me any feature and I'll take you right there!";

function TeacherOverviewSection() {
  const [orbitPaused, setOrbitPaused] = useState(false);
  const resumeTimer = useRef(null);
  const pauseOrbit  = () => { clearTimeout(resumeTimer.current); setOrbitPaused(true); };
  const resumeOrbit = () => { clearTimeout(resumeTimer.current); resumeTimer.current = setTimeout(() => setOrbitPaused(false), 2600); };
  useEffect(() => () => clearTimeout(resumeTimer.current), []);

  useEffect(() => {
    const el = document.getElementById("teacher-overview");
    if (!el) return;
    let fired = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          window.dispatchEvent(
            new CustomEvent("vidya:section-entered", {
              detail: { message: VIDYA_TEACHER_OVERVIEW_MESSAGE },
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
      id="teacher-overview"
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
              teaching experience.
            </em>
          </h2>

          <p className="mt-4 text-[15px] max-w-[460px] mx-auto leading-relaxed" style={{ color: "var(--ink-4)" }}>
            Everything you need to plan, teach, and understand your{" "}
            <span className="font-medium" style={{ color: "var(--ink-3)" }}>students</span> — connected in one place.
            Tap any orbiting feature to jump straight to it, or hover to pause and explore.
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
              {TEACHER_OVERVIEW_FEATURES.map(({ icon: Icon, label, anchor }, i) => {
                const RADIUS = 44;
                const theta  = (i / TEACHER_OVERVIEW_FEATURES.length) * 2 * Math.PI - Math.PI / 2;
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

            {/* ── Center core: "Teacher" ──────────────────────────────── */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="relative w-[150px] h-[150px] [animation:coreFloat_5s_ease-in-out_infinite]">
                <span className="absolute inset-0 rounded-full [animation:corePulse_3.4s_ease-out_infinite]" style={{ background: `${ACCENT}30` }} />
                <span className="absolute inset-0 rounded-full [animation:corePulse_3.4s_ease-out_infinite_1.7s]" style={{ background: `${ACCENT}22` }} />
                <div
                  className="relative flex flex-col items-center justify-center w-full h-full rounded-full text-white"
                  style={{ background: GRADIENT, boxShadow: `0 18px 50px color-mix(in srgb, ${ACCENT} 45%, transparent)` }}
                >
                  <PencilRuler size={26} className="mb-1 opacity-90" />
                  <span className="font-serif font-medium text-[22px] leading-none" style={{ letterSpacing: "-0.02em" }}>
                    Teacher
                  </span>
                  <span className="mt-1.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    8 features
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Mobile: same orbital system, scaled for phones ──────────── */}
        <motion.div {...fadeUp} className="sm:hidden flex justify-center">
          <div
            className="relative select-none"
            style={{ width: "min(340px, 86vw)", aspectRatio: "1 / 1" }}
            onPointerDown={pauseOrbit}
            onPointerUp={resumeOrbit}
            onPointerCancel={resumeOrbit}
            onPointerLeave={resumeOrbit}
          >
            <div className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: `${ACCENT}33` }} />
            <div className="absolute rounded-full border" style={{ inset: "16%", borderColor: `${ACCENT}1f` }} />
            <div className="absolute rounded-full" style={{ inset: "30%", border: `1px solid ${ACCENT}14` }} />

            <div
              className="orbit-rotor absolute inset-0"
              style={{ animation: "orbitSpin 58s linear infinite", animationPlayState: orbitPaused ? "paused" : "running" }}
            >
              {TEACHER_OVERVIEW_FEATURES.map(({ icon: Icon, label, anchor }, i) => {
                const RADIUS = 41;
                const theta  = (i / TEACHER_OVERVIEW_FEATURES.length) * 2 * Math.PI - Math.PI / 2;
                const x = 50 + RADIUS * Math.cos(theta);
                const y = 50 + RADIUS * Math.sin(theta);
                return (
                  <div key={anchor} className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
                    <button
                      onClick={() => scrollTo(anchor)}
                      aria-label={label}
                      title={label}
                      className="block focus:outline-none active:scale-95 transition-transform"
                      style={{ animation: "orbitSpinRev 58s linear infinite", animationPlayState: orbitPaused ? "paused" : "running" }}
                    >
                      <div className="flex flex-col items-center gap-1 w-[76px]">
                        <span
                          className="relative flex items-center justify-center w-[48px] h-[48px] rounded-full"
                          style={{
                            background: "var(--page)",
                            border: "1px solid var(--line)",
                            boxShadow: `0 6px 18px color-mix(in srgb, ${ACCENT} 16%, transparent)`,
                            color: ACCENT,
                          }}
                        >
                          <Icon size={19} />
                        </span>
                        <span
                          className="font-mono text-[8.5px] font-semibold text-center leading-[1.15]"
                          style={{ color: "var(--ink-3)" }}
                        >
                          {label}
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="relative w-[112px] h-[112px] [animation:coreFloat_5s_ease-in-out_infinite]">
                <span className="absolute inset-0 rounded-full [animation:corePulse_3.4s_ease-out_infinite]" style={{ background: `${ACCENT}30` }} />
                <span className="absolute inset-0 rounded-full [animation:corePulse_3.4s_ease-out_infinite_1.7s]" style={{ background: `${ACCENT}22` }} />
                <div
                  className="relative flex flex-col items-center justify-center w-full h-full rounded-full text-white"
                  style={{ background: GRADIENT, boxShadow: `0 16px 40px color-mix(in srgb, ${ACCENT} 45%, transparent)` }}
                >
                  <PencilRuler size={22} className="mb-0.5 opacity-90" />
                  <span className="font-serif font-medium text-[18px] leading-none" style={{ letterSpacing: "-0.02em" }}>Teacher</span>
                  <span className="mt-1 font-mono text-[8.5px] font-semibold uppercase tracking-[0.2em] text-white/70">8 features</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="sm:hidden mt-5 text-center text-[12.5px]" style={{ color: "var(--ink-4)" }}>
          Tap a feature to jump to it · touch the orbit to pause
        </p>

        {/* ── Divider ───────────────────────────────────────────────── */}
        <div className="mt-12 flex items-center gap-4">
          <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
          <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[.2em]" style={{ color: "var(--ink-4)" }}>
            Scroll to explore each feature
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
        </div>
      </div>
    </section>
  );
}

export default function TeacherHome({ onOpenAuth }) {
  return (
    <div className="w-full" style={{ background: "var(--page)" }}>
      <HeroSection onOpenAuth={onOpenAuth} />
      <TeacherOverviewSection />
      <WorkflowSection />
      <PlanningSection />
      <ClassroomSection />
      <AssessmentSection />
      <InsightsSection />
      <AIControlSection />
      <FinalCTASection onOpenAuth={onOpenAuth} />
      <FAQSection />
    </div>
  );
}
