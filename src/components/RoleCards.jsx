/**
 * RoleCards.jsx — Role Selection Cards
 *
 * Pure presentational component.
 * Role data now comes from centralized config (ROLES_LIST).
 * onSelect() calls context's selectRole() via the parent Hero.
 */

import { motion } from "framer-motion";
import { ROLES_LIST } from "../config/roles";

// Maps role.id → the section anchor id the voice assistant uses.
const ROLE_SECTION_ID = { student: "student", teacher: "tutor", institute: "college" };

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.35 + i * 0.1,
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function RoleCards({ selectedRole, onSelect }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full max-w-[920px] mx-auto"
      role="group"
      aria-label="Select your role to get started"
    >
      {ROLES_LIST.map((role, i) => {
        const isSelected = selectedRole === role.id;
        return (
          <motion.button
            key={role.id}
            id={ROLE_SECTION_ID[role.id] ?? `role-card-${role.id}`}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onClick={() => onSelect(role.id)}
            aria-pressed={isSelected}
            aria-label={`Select ${role.label} role`}
            tabIndex={0}
            whileHover={{ scale: 1.03, transition: { duration: 0.2, ease: "easeOut" } }}
            whileTap={{ scale: 0.97 }}
            className="relative flex flex-col items-start text-left px-6 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 overflow-hidden"
            style={{
              border: `1px solid ${isSelected ? role.accent : "rgba(0,0,0,0.08)"}`,
              background: isSelected ? role.accentLight : "#ffffff",
              boxShadow: isSelected
                ? `0 12px 36px -4px ${role.accent}44`
                : "0 2px 12px 0 rgba(0,0,0,0.08)",
              borderRadius: "12px",
              transition: "box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease",
            }}
          >
            <span
              className="text-[10.5px] uppercase tracking-widest font-semibold"
              style={{ color: role.accent }}
            >
              {role.card.eyebrow}
            </span>
            <span className="mt-2 font-display text-[1.05rem] font-bold tracking-tight text-neutral-900 leading-snug">
              {role.card.title}
            </span>
            <span className="mt-2 text-[0.8rem] text-neutral-500 leading-relaxed">
              {role.card.description}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
