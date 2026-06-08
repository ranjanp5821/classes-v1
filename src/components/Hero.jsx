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
      {/* Subtle radial tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% 0%, #eef2ff 0%, transparent 70%)",
        }}
      />

      {/* Headline */}
      <motion.h1
        id="hero-headline"
        variants={fadeUp(0.2)}
        initial="hidden"
        animate="visible"
        className="mt-auto font-display text-[clamp(2.4rem,6vw,4.2rem)] font-bold tracking-tight text-neutral-900 leading-[1.05] max-w-[860px] mx-auto"
      >
        One Platform. Multiple Curricula.{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Boundless Learning.
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={fadeUp(0.3)}
        initial="hidden"
        animate="visible"
        className="mt-5 text-[clamp(1.05rem,2.2vw,1.35rem)] text-neutral-500 max-w-[560px] mx-auto leading-relaxed"
      >
        One unified platform for institutes, students, and teachers — built to
        simplify education and amplify outcomes.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        variants={fadeUp(0.38)}
        initial="hidden"
        animate="visible"
        className="mt-6 mb-6 flex flex-wrap items-center justify-center gap-3"
      >
        <button
          onClick={() => onOpenAuth?.("signup", null)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-[14.5px] text-white bg-neutral-900 shadow-md transition-all duration-200 hover:bg-neutral-800 active:scale-95"
        >
          Get Started — Free
        </button>
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-[14.5px] text-neutral-700 bg-white border border-neutral-200 shadow-sm transition-all duration-200 hover:bg-neutral-50 active:scale-95">
          See It In Action
          <span className="text-neutral-400">→</span>
        </button>
      </motion.div>

      {/* Role selection label */}
      <motion.div
        variants={fadeUp(0.4)}
        initial="hidden"
        animate="visible"
        className="mt-auto mb-2 flex flex-col items-center gap-1.5"
      >
        <p className="text-[10.5px] uppercase tracking-widest text-neutral-400 font-semibold">
          Choose your role to begin
        </p>
        <div className="w-8 h-px bg-neutral-200" />
      </motion.div>

      {/* Role Cards — onSelect dispatches to global context */}
      <RoleCards selectedRole={activeRoleId} onSelect={selectRole} />
    </section>
  );
}
