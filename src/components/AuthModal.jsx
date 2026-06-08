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

  // Pin the dialog near the clicked button when a position is provided.
  const dialogStyle = position
    ? { transformOrigin: "top right", right: `${position.right}px`, top: `${position.top}px` }
    : {};

  const pickRole = (id) => {
    setRoleId(id);
    setStep("form");
    setFromPicker(true);
  };

  // With a role → enter that role's view; generic sign-in → just close.
  const proceed = () => {
    if (roleId) onSelectRole(roleId);
    else onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    proceed();
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
          className={`fixed inset-0 z-[100]${!position ? " flex items-center justify-center" : ""}`}
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

          {/* Dialog — anchored to button when position given, centered otherwise */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`${position ? "fixed" : "relative"} w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7`}
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

                  {/* Social auth */}
                  <div className="mt-5 flex flex-col gap-2.5">
                    <SocialButton onClick={proceed} icon={<GoogleIcon />}>
                      Continue with Google
                    </SocialButton>
                    <SocialButton onClick={proceed} icon={<AppleIcon />}>
                      Continue with Apple
                    </SocialButton>
                  </div>

                  {/* Divider */}
                  <div className="my-4 flex items-center gap-3">
                    <span className="h-px flex-1 bg-neutral-200" />
                    <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                      or
                    </span>
                    <span className="h-px flex-1 bg-neutral-200" />
                  </div>

                  <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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

/* ── Social auth button ──────────────────────────────────────────── */
function SocialButton({ icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-neutral-200 py-2.5 text-[14px] font-semibold text-neutral-800 transition-colors duration-150 hover:bg-neutral-50 active:scale-[0.99]"
    >
      {icon}
      {children}
    </button>
  );
}

/* Brand icons (inline SVG — lucide-react no longer ships brand logos) */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 4.5 29.5 2.5 24 2.5 12.1 2.5 2.5 12.1 2.5 24S12.1 45.5 24 45.5 45.5 35.9 45.5 24c0-1.2-.1-2.4-.3-3.5z" />
      <path fill="#FF3D00" d="M5.3 13.9l6.6 4.8C13.7 14.9 18.4 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6 29.5 4 24 4 16.3 4 9.7 8.3 5.3 13.9z" />
      <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2 13.9-5.3l-6.4-5.4C29.4 34.9 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.4 5.4C41.7 36.9 45.5 31 45.5 24c0-1.2-.1-2.4-.3-3.5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C73.3 141.6 23 184.5 23 270.3c0 25.3 4.6 51.4 13.8 78.2 12.3 35.1 56.6 121.3 102.9 119.9 24.2-.6 41.3-17.2 72.8-17.2 30.6 0 46.4 17.2 73.4 17.2 46.7-.7 86.8-79 98.5-114.2-62.7-29.6-59.7-86.7-59.7-88.5zm-56.5-176.4c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
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
