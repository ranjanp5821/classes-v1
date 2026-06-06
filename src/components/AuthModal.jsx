/**
 * AuthModal.jsx — Sign In / Sign Up flow
 *
 * Step 1: pick a role (Student, Tutor, Institute).
 * Step 2: show the sign in / sign up form for the chosen role.
 *
 * onSelectRole(roleId) is fired once the form is submitted, taking the
 * user into that role's view.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { ROLES_LIST, ROLES_CONFIG } from "../config/roles";

// Neutral brand theme used by the role-less sign-in form.
const DEFAULT_ACCENT = "#6366f1";
const DEFAULT_GRADIENT = "linear-gradient(135deg, #6366f1, #0ea5e9)";

export default function AuthModal({ open, mode = "signin", position = null, initialRoleId = null, onClose, onSelectRole }) {
  const [step, setStep] = useState("role");     // "role" | "form"
  const [roleId, setRoleId] = useState(null);
  const [authMode, setAuthMode] = useState(mode); // "signin" | "signup"
  const [fromPicker, setFromPicker] = useState(false); // reached form via role picker?
  const [prevOpen, setPrevOpen] = useState(open);

  // Reset each time the popup (re)opens, syncing the mode.
  //  - role already active → straight to that role's form
  //  - Sign In → straight to a generic login form (no role step)
  //  - Sign Up → role picker first
  // Adjusting state during render is React's recommended pattern here.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setAuthMode(mode);
      setFromPicker(false);
      if (initialRoleId) {
        setRoleId(initialRoleId);
        setStep("form");
      } else if (mode === "signin") {
        setRoleId(null);
        setStep("form");
      } else {
        setRoleId(null);
        setStep("role");
      }
    }
  }

  const role = roleId ? ROLES_CONFIG[roleId] : null;
  const isSignup = authMode === "signup";
  const accent = role?.accent ?? DEFAULT_ACCENT;
  const gradient = role?.accentGradient ?? DEFAULT_GRADIENT;

  // Pin the dialog's right edge to the clicked button's right edge.
  const dialogStyle = {
    transformOrigin: "top right",
    right: position ? `${position.right}px` : "2rem",
    top: position ? `${position.top}px` : "60px",
  };

  const pickRole = (id) => {
    setRoleId(id);
    setStep("form");
    setFromPicker(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // With a role → enter that role's view; generic sign-in → just close.
    if (roleId) onSelectRole(roleId);
    else onClose();
  };

  // Bottom toggle between sign in / sign up.
  const toggleMode = () => {
    if (isSignup) {
      setAuthMode("signin");
    } else if (roleId) {
      setAuthMode("signup");
    } else {
      // Generic sign-in → sign up keeps its role-picker flow.
      setAuthMode("signup");
      setStep("role");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="auth-overlay"
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-neutral-900/20"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog — right edge aligns to the clicked button, grows out of it */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7"
            style={dialogStyle}
            initial={{ opacity: 0, scale: 0.4, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.4, y: -20 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X size={18} />
            </button>

            <AnimatePresence mode="wait" initial={false}>
              {step === "role" ? (
                /* ── Step 1: role picker ─────────────────────────── */
                <motion.div
                  key="role-step"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                >
                  <h2 className="font-display text-xl font-bold tracking-tight text-neutral-900">
                    {isSignup ? "Create your account" : "Sign in to Classess"}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Choose your role to continue
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    {ROLES_LIST.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => pickRole(r.id)}
                        className="group flex items-center justify-between w-full px-5 py-4 rounded-xl border text-left transition-all duration-150 hover:shadow-md active:scale-[0.98]"
                        style={{ borderColor: "rgba(0,0,0,0.08)", background: "#ffffff" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = r.accent;
                          e.currentTarget.style.background = r.accentLight;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
                          e.currentTarget.style.background = "#ffffff";
                        }}
                      >
                        <span>
                          <span
                            className="block text-[10.5px] uppercase tracking-widest font-semibold"
                            style={{ color: r.accent }}
                          >
                            {r.card.eyebrow}
                          </span>
                          <span className="block mt-0.5 font-display text-[1rem] font-bold text-neutral-900">
                            {r.shortLabel}
                          </span>
                        </span>
                        <span
                          className="text-lg font-bold transition-transform duration-150 group-hover:translate-x-1"
                          style={{ color: r.accent }}
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* ── Step 2: sign in / sign up form ──────────────── */
                <motion.div
                  key="form-step"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.18 }}
                >
                  {fromPicker && (
                    <button
                      onClick={() => setStep("role")}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
                    >
                      <ArrowLeft size={15} /> Back
                    </button>
                  )}

                  {role && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <span
                        className="text-[10.5px] uppercase tracking-widest font-semibold"
                        style={{ color: accent }}
                      >
                        {role.card.eyebrow}
                      </span>
                    </div>
                  )}
                  <h2 className="mt-0.5 font-display text-xl font-bold tracking-tight text-neutral-900">
                    {isSignup ? "Create your account" : "Welcome back"}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    {role
                      ? `${isSignup ? "Sign up" : "Sign in"} as a ${role.shortLabel.toLowerCase()}`
                      : "Sign in to your Classess account"}
                  </p>

                  <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
                    {isSignup && (
                      <Field
                        label="Full name"
                        type="text"
                        placeholder="Jane Doe"
                        accent={accent}
                      />
                    )}
                    <Field
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      accent={accent}
                    />
                    <Field
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      accent={accent}
                    />

                    <button
                      type="submit"
                      className="mt-2 w-full py-2.5 rounded-lg text-[14.5px] font-semibold text-white shadow-sm transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
                      style={{ background: gradient }}
                    >
                      {isSignup ? "Create account" : "Sign in"}
                    </button>
                  </form>

                  <p className="mt-4 text-center text-[13px] text-neutral-500">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                      onClick={toggleMode}
                      className="font-semibold hover:underline"
                      style={{ color: accent }}
                    >
                      {isSignup ? "Sign in" : "Sign up"}
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Themed input field ──────────────────────────────────────────── */
function Field({ label, type, placeholder, accent }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-semibold text-neutral-700">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        required
        className="px-3.5 py-2.5 text-[14px] rounded-lg border border-neutral-200 outline-none transition-all duration-150 focus:ring-2"
        style={{ "--tw-ring-color": accent }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = accent;
          e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}33`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgb(229,229,229)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </label>
  );
}
