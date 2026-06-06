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
      {/* Role-specific radial background tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          backgroundImage: `radial-gradient(ellipse 70% 55% at 50% 0%, ${accentLight} 0%, transparent 70%)`,
        }}
      />

      {/* Role badge */}
      <motion.div
        variants={fadeUp(0.1)}
        initial="hidden"
        animate="visible"
        className="mb-4"
      >
        <span
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest"
          style={{
            background: `${accent}15`,
            color: accent,
            border: `1px solid ${accent}30`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: accent }}
          />
          {label}
        </span>
      </motion.div>

      {/* Role-specific headline */}
      <motion.h1
        id="role-hero-headline"
        variants={fadeUp(0.2)}
        initial="hidden"
        animate="visible"
        className="font-display text-[clamp(1.9rem,4.8vw,3.2rem)] font-bold tracking-tight text-neutral-900 leading-[1.1] max-w-[680px] mx-auto"
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

      {/* Role-specific subheadline */}
      <motion.p
        variants={fadeUp(0.3)}
        initial="hidden"
        animate="visible"
        className="mt-4 text-[clamp(0.9rem,1.8vw,1.05rem)] text-neutral-500 max-w-[460px] mx-auto leading-relaxed"
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
        {/* Primary CTA — role accent color */}
        <button
          className="px-7 py-3 rounded-xl font-semibold text-white text-[15px] shadow-md transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: accentGradient }}
          aria-label={hero.ctaLabel}
        >
          {hero.ctaLabel}
        </button>

        {/* Change Role link */}
        <button
          onClick={clearRole}
          className="text-[12.5px] text-neutral-400 hover:text-neutral-600 transition-colors underline-offset-2 hover:underline"
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
