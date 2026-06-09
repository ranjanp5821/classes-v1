/**
 * RoleHero.jsx — Role-Specific Hero View
 *
 * Rendered after a role is selected. Displays role-specific:
 *   - Headline (with gradient on the accent phrase from config)
 *   - Subheadline
 *   - Primary CTA button (role accent color)
 *   - "Change Role" link (calls clearRole())
 *
 * Section stubs (features, workflows, testimonials) are architecturally
 * ready but not rendered yet — add <FeaturesSection />, <WorkflowSection />
 * etc. below the hero when content is ready.
 */

import { motion } from "framer-motion";
import { useRole } from "../hooks/useRole";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
});

export default function RoleHero() {
  const { activeRoleConfig, clearRole } = useRole();

  // Should never render without a config, but guard defensively
  if (!activeRoleConfig) return null;

  const { hero, accent, accentLight, accentGradient, label } = activeRoleConfig;

  return (
    <section
      id="role-hero"
      className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{
        height: "calc(100vh - 64px)",
        maxHeight: "calc(100vh - 64px)",
        paddingTop: "4rem",
        paddingBottom: "2rem",
      }}
      aria-labelledby="role-hero-headline"
    >
      {/* Neutral mist tint with a faint accent blush — brand surface approach */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          backgroundImage: `radial-gradient(ellipse 70% 55% at 50% 0%, #F1F2F5 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 50% 0%, ${accentLight}60 0%, transparent 70%)`,
        }}
      />

      {/* Role badge — brand .kick / pill style: JetBrains Mono, 11px, tracked */}
      <motion.div
        variants={fadeUp(0.1)}
        initial="hidden"
        animate="visible"
        className="mb-5"
      >
        <span
          className="inline-flex items-center gap-1.5 px-[11px] py-[5px] rounded-[999px] font-mono text-[11px] font-semibold uppercase tracking-[.04em]"
          style={{
            background: `color-mix(in srgb, ${accent} 12%, #fff)`,
            color: accent,
            border: `1px solid color-mix(in srgb, ${accent} 25%, #fff)`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          {label}
        </span>
      </motion.div>

      {/* Headline — Fraunces display, weight 500, brand tracking */}
      <motion.h1
        id="role-hero-headline"
        variants={fadeUp(0.2)}
        initial="hidden"
        animate="visible"
        className="font-serif text-[clamp(1.9rem,4.8vw,3.4rem)] font-medium leading-[1.05] max-w-[700px] mx-auto"
        style={{ letterSpacing: "-0.03em", color: "var(--ink)" }}
      >
        {hero.headline}{" "}
        <em
          style={{
            fontStyle: "italic",
            background: accentGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {hero.headlineGradient}
        </em>
      </motion.h1>

      {/* Subheadline — Fraunces serif, ink-2 */}
      <motion.p
        variants={fadeUp(0.3)}
        initial="hidden"
        animate="visible"
        className="mt-5 font-serif text-[clamp(0.95rem,1.8vw,1.1rem)] max-w-[500px] mx-auto leading-[1.6]"
        style={{ color: "var(--ink-2)" }}
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
        {/* Primary CTA — brand .btn: 8px radius, weight 500 */}
        <button
          className="px-6 py-[11px] rounded-[8px] font-medium text-white text-[14px] transition-all duration-150 hover:-translate-y-px hover:opacity-90 active:scale-95"
          style={{ background: accentGradient, border: "1px solid transparent" }}
          aria-label={hero.ctaLabel}
        >
          {hero.ctaLabel}
        </button>

        {/* Change Role — brand mono label style */}
        <button
          onClick={clearRole}
          className="font-mono text-[11px] uppercase tracking-[.1em] transition-colors"
          style={{ color: "var(--ink-4)" }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--ink-3)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--ink-4)"; }}
          aria-label="Go back and change your role"
        >
          ← Change Role
        </button>
      </motion.div>


      {/*
       * ─── Section Stubs ────────────────────────────────────────────────────
       * Uncomment and replace with real section components when ready.
       * Config data (features, workflows, testimonials) is already available
       * via activeRoleConfig from useRole().
       *
       * <FeaturesSection features={activeRoleConfig.features} accent={accent} />
       * <WorkflowSection workflows={activeRoleConfig.workflows} accent={accent} />
       * <TestimonialsSection testimonials={activeRoleConfig.testimonials} />
       * ──────────────────────────────────────────────────────────────────────
       */}
    </section>
  );
}
