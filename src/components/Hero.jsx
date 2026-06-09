/**
 * Hero.jsx — Role Selection View (Default Landing Screen)
 *
 * Shown when no role has been selected yet.
 * Connects to RoleContext: calls selectRole() on card click,
 * which triggers the global state change and page re-render.
 */

import { motion } from "framer-motion";
import RoleCards from "./RoleCards";
import { useRole } from "../hooks/useRole";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
});

export default function Hero({ onOpenAuth }) {
  // Commit the role globally so the Navbar and downstream sections update,
  // while this same Hero stays pinned at the top of the page.
  const { activeRoleId, selectRole } = useRole();

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center text-center px-6 pt-24 pb-10 gap-6 md:gap-0 md:min-h-[calc(100vh-64px)] md:pt-[4.8rem] md:pb-8"
      aria-labelledby="hero-headline"
    >
      {/* Neutral paper radial — brand surface tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% 0%, #F1F2F5 0%, transparent 70%)",
        }}
      />

      {/* Headline — Fraunces display, brand weight + tracking */}
      <motion.h1
        id="hero-headline"
        variants={fadeUp(0.2)}
        initial="hidden"
        animate="visible"
        className="mt-auto font-serif text-[clamp(2.4rem,6vw,4.2rem)] font-medium leading-[1.02] max-w-[860px] mx-auto"
        style={{ letterSpacing: "-0.03em", color: "var(--ink)" }}
      >
        One Platform. Multiple Curricula.{" "}
        <em
          style={{
            fontStyle: "italic",
            background: "var(--g-magenta)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Boundless Learning.
        </em>
      </motion.h1>

      {/* Subheadline — Fraunces serif body, ink-2 */}
      <motion.p
        variants={fadeUp(0.3)}
        initial="hidden"
        animate="visible"
        className="mt-5 font-serif text-[clamp(1.05rem,2.2vw,1.2rem)] max-w-[560px] mx-auto leading-relaxed"
        style={{ color: "var(--ink-2)" }}
      >
        One unified platform for institutes, students, and teachers — built to
        simplify education and amplify outcomes.
      </motion.p>

      {/* CTA Buttons — brand .btn pattern: 8px radius, weight 500 */}
      <motion.div
        variants={fadeUp(0.38)}
        initial="hidden"
        animate="visible"
        className="mt-6 mb-6 flex flex-wrap items-center justify-center gap-3"
      >
        <button
          onClick={() => onOpenAuth?.("signup", null)}
          className="inline-flex items-center gap-2 px-5 py-[11px] rounded-[8px] font-medium text-[14px] text-white transition-all duration-150 hover:-translate-y-px active:scale-95"
          style={{ background: "var(--ink)", border: "1px solid var(--ink)" }}
        >
          Get Started — Free
        </button>
        <button
          className="inline-flex items-center gap-2 px-5 py-[11px] rounded-[8px] font-medium text-[14px] transition-all duration-150 hover:bg-[#FAFAFB] active:scale-95"
          style={{ color: "var(--ink)", border: "1px solid var(--line-2)", background: "var(--page)" }}
        >
          See It In Action
          <span style={{ color: "var(--ink-4)" }}>→</span>
        </button>
      </motion.div>

      {/* Role selection label — JetBrains Mono, ink-4 */}
      <motion.div
        variants={fadeUp(0.4)}
        initial="hidden"
        animate="visible"
        className="mt-auto mb-2 flex flex-col items-center gap-1.5"
      >
        <p
          className="font-mono text-[10.5px] uppercase tracking-[.22em] font-semibold"
          style={{ color: "var(--ink-4)" }}
        >
          Choose your role to begin
        </p>
        <div className="w-8 h-px" style={{ background: "var(--line)" }} />
      </motion.div>

      {/* Role Cards — onSelect dispatches to global context */}
      <RoleCards selectedRole={activeRoleId} onSelect={selectRole} />

    </section>
  );
}
