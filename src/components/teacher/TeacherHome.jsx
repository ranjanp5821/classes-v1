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

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ArrowRight, Plus, Minus } from "lucide-react";

/* ── Theming ─────────────────────────────────────────────────────────────── */
const ACCENT   = "#10b981";
const GRADIENT = "linear-gradient(135deg, #10b981, #34d399)";

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
      <p className="text-[12px] text-neutral-400 text-center max-w-[220px] leading-relaxed">{description}</p>
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

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 1 — Teacher Hero
   ════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      id="teacher-hero"
      className="relative w-full overflow-hidden pt-28 pb-20"
      style={{ backgroundImage: `radial-gradient(ellipse 70% 55% at 50% 0%, ${ACCENT}14 0%, transparent 70%)` }}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">

          <FadeIn>
            <h1 className="text-[2.6rem] lg:text-[3rem] font-extrabold text-neutral-900 leading-[1.1] tracking-tight font-display mb-5">
              Spend less time managing work.{" "}
              <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Spend more time improving learning.
              </span>
            </h1>
            <Lead className="mb-4 max-w-[520px]">
              Classess.com® helps teachers plan lessons, create academic resources, assess student work, provide meaningful feedback, and understand who needs support—all from one connected academic workspace.
            </Lead>
            <p className="text-[15px] text-neutral-400 mb-8">
              Use it independently or through your institution.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <PrimaryButton>Start as a Teacher <ArrowRight size={16} /></PrimaryButton>
              <SecondaryButton>See How It Works</SecondaryButton>
            </div>
            <p className="text-[13.5px] font-semibold text-neutral-500">
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
                className="px-4 py-1.5 rounded-full text-[13px] font-bold border"
                style={{ color: ACCENT, borderColor: `${ACCENT}35`, background: `${ACCENT}08` }}
              >
                {step}
              </span>
              {i < JOURNEY_STEPS.length - 1 && (
                <ChevronRight size={14} className="text-neutral-300" />
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
          <div className="mt-8">
            <PrimaryButton>Explore Planning Tools <ArrowRight size={16} /></PrimaryButton>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-1 mb-4 bg-neutral-100 rounded-xl p-1">
            {PLANNING_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[120px] px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150 ${
                  activeTab === tab ? "bg-white shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                }`}
                style={activeTab === tab ? { color: ACCENT } : {}}
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
              className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6 min-h-[200px] flex flex-col gap-3"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                {PLANNING_TAB_CONTENT[activeTab].label}
              </span>
              <p className="text-[14.5px] font-semibold text-neutral-800">
                {PLANNING_TAB_CONTENT[activeTab].desc}
              </p>
              <div
                className="mt-2 rounded-xl p-4 text-[13px] text-neutral-600 leading-relaxed font-mono"
                style={{ background: `${ACCENT}08` }}
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
        </div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION 5 — Assessment and Feedback
   ════════════════════════════════════════════════════════════════════════════ */
function AssessmentSection() {
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

          <div className="border-t border-neutral-100 pt-8">
            <h3 className="text-[1.3rem] font-extrabold text-neutral-900 mb-3">
              Give feedback students can act on.
            </h3>
            <Lead className="mb-5">
              A score tells students how they performed. Good feedback helps them understand what to improve and what to do next.
            </Lead>

            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5 flex flex-col gap-2.5 mb-6">
              <p className="text-[14px] text-neutral-800 font-semibold flex items-center gap-2">
                <span className="text-green-500">✓</span> You understood the concept.
              </p>
              <p className="text-[14px] text-neutral-800 font-semibold flex items-center gap-2">
                <span style={{ color: ACCENT }}>◎</span> You need more support applying it to unfamiliar problems.
              </p>
              <p className="text-[14px] text-neutral-800 font-semibold flex items-center gap-2">
                <span className="text-neutral-400">→</span> Next step: Complete the recommended application activity.
              </p>
            </div>

            <HighlightLine>Classess.com® helps teachers measure the skills behind the marks.</HighlightLine>
            <div className="mt-6">
              <PrimaryButton>Explore Assessment and Feedback <ArrowRight size={16} /></PrimaryButton>
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
        <h3 className="text-[1.15rem] font-extrabold text-neutral-900 mb-5">A clearer view of every learner</h3>
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
          <h3 className="text-[1.4rem] font-extrabold text-neutral-900 mb-4">Turn insight into action</h3>
          <Lead className="mb-6">
            Teachers can assign revision, practice, remedial learning, extension activities, or personal feedback based on the student's actual need.
          </Lead>

          <div className="rounded-2xl border border-neutral-100 bg-white p-5 flex flex-col gap-3 mb-6 shadow-sm">
            <p className="text-[13.5px] text-neutral-800"><span className="font-bold">Observed:</span> Student understands definitions but struggles with application.</p>
            <p className="text-[13.5px] text-neutral-800"><span className="font-bold">Recommended support:</span> Worked example followed by guided practice.</p>
            <p className="text-[13.5px] text-neutral-800"><span className="font-bold">Follow-up:</span> Reassess after completion.</p>
          </div>

          <HighlightLine>Every student should be seen, supported, and learning at their best.</HighlightLine>
          <div className="mt-6">
            <PrimaryButton>View Sample Student Insights <ArrowRight size={16} /></PrimaryButton>
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
          <div className="mt-8">
            <PrimaryButton>See Responsible AI in Action <ArrowRight size={16} /></PrimaryButton>
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
function FinalCTASection() {
  return (
    <section id="get-started" className="w-full py-28 relative overflow-hidden" style={{ background: GRADIENT }}>
      <div
        className="absolute right-0 top-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: "#fff" }}
      />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10 text-white">
        <FadeIn>
          <h2 className="text-[2.2rem] lg:text-[2.8rem] font-extrabold tracking-tight leading-tight mb-5">
            Better teaching begins with better academic support.
          </h2>
          <p className="text-[16px] text-white/90 leading-relaxed mb-10 max-w-[540px] mx-auto">
            Plan with clarity. Teach with better context. Assess meaningfully. Understand student needs. Provide support that leads to progress.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] bg-white shadow-lg transition-all duration-200 hover:opacity-95 active:scale-95" style={{ color: ACCENT }}>
              Start as a Teacher <ArrowRight size={16} />
            </button>
            <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-white border border-white/40 transition-all duration-200 hover:bg-white/10 active:scale-95">
              Watch Teacher Tutorial
            </button>
          </div>
          <p className="text-[14px] font-semibold text-white/80">
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
export default function TeacherHome() {
  return (
    <div className="w-full bg-white">
      <HeroSection />
      <WorkflowSection />
      <PlanningSection />
      <ClassroomSection />
      <AssessmentSection />
      <InsightsSection />
      <AIControlSection />
      <FinalCTASection />
      <FAQSection />
    </div>
  );
}
