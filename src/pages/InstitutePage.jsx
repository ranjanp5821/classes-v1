/**
 * InstitutePage.jsx — Full Scrollable Institute Experience
 *
 * All Institute sections (Hero, Dashboard, Courses, Students, Reports, Settings)
 * are stacked vertically in a single scroll page. Navbar links smooth-scroll
 * to the respective section anchor.
 */

import { motion } from "framer-motion";
import { useRole } from "../hooks/useRole";
import DashboardSection from "../components/institute/DashboardSection";
import CoursesSection from "../components/institute/CoursesSection";
import StudentsSection from "../components/institute/StudentsSection";
import ReportsSection from "../components/institute/ReportsSection";
import SettingsSection from "../components/institute/SettingsSection";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
});

export default function InstitutePage({ hideHero = false }) {
  const { activeRoleConfig, clearRole } = useRole();

  if (!activeRoleConfig) return null;

  const { hero, accent, accentLight, accentGradient, label } = activeRoleConfig;

  return (
    <div className="w-full bg-white">
      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      {!hideHero && (
      <section
        id="home"
        className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{
          height: "calc(100vh - 64px)",
          paddingTop: "4rem",
          paddingBottom: "2rem",
        }}
        aria-labelledby="role-hero-headline"
      >
        {/* Radial tint */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-all duration-700"
          style={{
            backgroundImage: `radial-gradient(ellipse 70% 55% at 50% 0%, ${accentLight} 0%, transparent 70%)`,
          }}
        />

        {/* Role badge */}
        <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible" className="mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest"
            style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            {label}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="role-hero-headline"
          variants={fadeUp(0.2)}
          initial="hidden"
          animate="visible"
          className="font-display text-[clamp(2rem,5vw,3.4rem)] font-bold tracking-tight text-neutral-900 leading-[1.08] max-w-[720px] mx-auto"
        >
          {hero.headline}{" "}
          <span
            style={{
              background: accentGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {hero.headlineGradient}
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp(0.3)}
          initial="hidden"
          animate="visible"
          className="mt-5 text-[clamp(0.9rem,1.8vw,1.06rem)] text-neutral-500 max-w-[480px] mx-auto leading-relaxed"
        >
          {hero.subheadline}
        </motion.p>

        {/* CTA row */}
        <motion.div
          variants={fadeUp(0.4)}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-col items-center gap-3"
        >
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 rounded-xl font-semibold text-white text-[15.5px] shadow-md transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: accentGradient }}
          >
            {hero.ctaLabel}
          </a>

          {/* Change Role link */}
          <button
            onClick={clearRole}
            className="text-[12.5px] text-neutral-400 hover:text-neutral-600 transition-colors underline-offset-2 hover:underline"
            aria-label="Go back and change your role"
          >
            ← Change Role
          </button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          variants={fadeUp(0.7)}
          initial="hidden"
          animate="visible"
          className="absolute bottom-8 flex flex-col items-center gap-1.5 text-neutral-300"
        >
          <div className="text-[10.5px] font-semibold tracking-widest uppercase">Scroll to explore</div>
          <div
            className="w-5 h-8 rounded-full border-2 border-neutral-200 flex items-start justify-center pt-1.5"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              className="w-1 h-2 rounded-full"
              style={{ background: accent }}
            />
          </div>
        </motion.div>
      </section>
      )}

      {/* ─── Dashboard Section ─────────────────────────────────────────── */}
      <SectionWrapper id="dashboard" accent={accent} label="Overview" title="Institute Dashboard">
        <DashboardSection accent={accent} accentGradient={accentGradient} />
      </SectionWrapper>

      {/* ─── Courses Section ───────────────────────────────────────────── */}
      <SectionWrapper id="courses" accent={accent} label="Curriculum" title="Courses Catalog" alt>
        <CoursesSection accent={accent} accentGradient={accentGradient} />
      </SectionWrapper>

      {/* ─── Students Section ──────────────────────────────────────────── */}
      <SectionWrapper id="students" accent={accent} label="People" title="Student Directory">
        <StudentsSection accent={accent} accentGradient={accentGradient} />
      </SectionWrapper>

      {/* ─── Reports Section ───────────────────────────────────────────── */}
      <SectionWrapper id="reports" accent={accent} label="Analytics" title="Reports & Insights" alt>
        <ReportsSection accent={accent} accentGradient={accentGradient} />
      </SectionWrapper>

      {/* ─── Settings Section ──────────────────────────────────────────── */}
      <SectionWrapper id="settings" accent={accent} label="Configuration" title="Settings & Branding">
        <SettingsSection accent={accent} accentGradient={accentGradient} />
      </SectionWrapper>

      {/* ─── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-100 bg-neutral-50 py-10 text-center">
        <p className="text-[13px] text-neutral-400 font-medium">
          © 2026 Classess · EduSphere Platform · Built for Modern Institutes
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
    <section
      id={id}
      className={`w-full py-20 ${alt ? "bg-neutral-50/60" : "bg-white"}`}
    >
      <div className="max-w-5xl mx-auto px-8">
        {/* Section eyebrow */}
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
