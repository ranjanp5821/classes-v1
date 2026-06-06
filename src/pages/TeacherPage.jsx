/**
 * TeacherPage.jsx — Scrollable Teacher/Tutor experience (downstream sections).
 *
 * Rendered below the shared Hero once the Teacher role is selected.
 * Sections (My Classes, Create Course, Students, Earnings, Analytics) are
 * stacked vertically; the Navbar links smooth-scroll to each section anchor.
 */

import { motion } from "framer-motion";
import { useRole } from "../hooks/useRole";
import MyClassesSection from "../components/teacher/MyClassesSection";
import CreateCourseSection from "../components/teacher/CreateCourseSection";
import StudentsSection from "../components/teacher/StudentsSection";
import EarningsSection from "../components/teacher/EarningsSection";
import AnalyticsSection from "../components/teacher/AnalyticsSection";

export default function TeacherPage() {
  const { activeRoleConfig, clearRole } = useRole();

  if (!activeRoleConfig) return null;

  const { accent, accentGradient } = activeRoleConfig;

  return (
    <div className="w-full bg-white">
      <SectionWrapper id="my-classes" accent={accent} label="Teaching" title="My Classes">
        <MyClassesSection accent={accent} accentGradient={accentGradient} />
      </SectionWrapper>

      <SectionWrapper id="create-course" accent={accent} label="Build" title="Create a Course" alt>
        <CreateCourseSection accent={accent} accentGradient={accentGradient} />
      </SectionWrapper>

      <SectionWrapper id="my-students" accent={accent} label="People" title="My Students">
        <StudentsSection accent={accent} accentGradient={accentGradient} />
      </SectionWrapper>

      <SectionWrapper id="earnings" accent={accent} label="Revenue" title="Earnings" alt>
        <EarningsSection accent={accent} accentGradient={accentGradient} />
      </SectionWrapper>

      <SectionWrapper id="analytics" accent={accent} label="Insights" title="Analytics">
        <AnalyticsSection accent={accent} accentGradient={accentGradient} />
      </SectionWrapper>

      {/* Footer */}
      <footer className="border-t border-neutral-100 bg-neutral-50 py-10 text-center">
        <p className="text-[13px] text-neutral-400 font-medium">
          © 2026 Classess · EduSphere Platform · Built for Modern Educators
        </p>
        <button
          onClick={clearRole}
          className="mt-3 text-[12px] text-neutral-400 hover:text-neutral-600 underline-offset-2 hover:underline transition-colors"
        >
          ← Switch Role
        </button>
      </footer>
    </div>
  );
}

/**
 * SectionWrapper — consistent full-width section container with a label + heading.
 */
function SectionWrapper({ id, accent, label, title, children, alt = false }) {
  return (
    <section id={id} className={`w-full py-20 ${alt ? "bg-neutral-50/60" : "bg-white"}`}>
      <div className="max-w-5xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10.5px] font-bold uppercase tracking-widest mb-3"
            style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}25` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            {label}
          </span>
          <h2 className="text-[1.85rem] font-bold text-neutral-900 font-display tracking-tight leading-tight">
            {title}
          </h2>
          <div className="mt-3 w-12 h-0.5 rounded-full" style={{ background: accent }} />
        </motion.div>

        {children}
      </div>
    </section>
  );
}
