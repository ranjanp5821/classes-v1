import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Building2,
  User,
  Send,
} from "lucide-react";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import Footer from "../components/Footer";
import { useRole } from "../hooks/useRole";

const GRADIENT = "linear-gradient(135deg, #1e293b 0%, #334155 100%)";
const ACCENT   = "#1e293b";

const fadeUp = {
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const ROLES = [
  "Select your role",
  "School Administrator",
  "Teacher",
  "Student",
  "Parent",
  "Partner / Affiliate",
  "Press / Media",
  "Investor",
  "Other",
];

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@classess.com",
    href: "mailto:contact@classess.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Classess® HQ, Education Technology Park, Bengaluru, Karnataka 560001, India",
    href: null,
  },
];

/* ── Page ── */

export default function ContactPage() {
  const navigate = useNavigate();
  const { selectRole } = useRole();
  const [authModal, setAuthModal] = useState(null);
  const authOpen = authModal !== null;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institution: "",
    role: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "Contact Us — Classess";
    window.scrollTo({ top: 0 });
    return () => { document.title = prev; };
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-page">
      <div
        className="transition-[filter] duration-200"
        style={authOpen ? { filter: "blur(4px)" } : undefined}
        aria-hidden={authOpen}
      >
        <Navbar onOpenAuth={(mode, pos) => setAuthModal({ mode, pos })} />

        {/* ════════════════════════════════════════════════════════
            S1 — Hero
        ════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-40 right-[-8%] h-[480px] w-[480px] rounded-full opacity-[0.07] blur-3xl"
            style={{ background: GRADIENT }}
          />
          <div className="mx-auto max-w-5xl px-6 pt-28 pb-16 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
                Get in touch
              </p>
              <h1 className="mt-3 text-4xl font-serif font-medium leading-[1.08] tracking-tight text-ink md:text-[58px]">
                Contact Us
              </h1>
              <p className="mt-6 w-full text-[17px] leading-relaxed text-ink-3 md:text-[18px]">
                Got questions? We&apos;re here to help. Reach out to the Classess® team and
                we will get back to you as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S2 — Form + Contact Info
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">

              {/* ── Left: Contact Form ── */}
              <motion.div {...fadeUp}>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
                  Send a message
                </p>
                <h2 className="mt-2 text-2xl font-serif font-medium tracking-tight text-ink md:text-3xl">
                  We&apos;d love to hear from you.
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-3">
                  Fill in the form below and a member of the Classess® team will respond within one business day.
                </p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="mt-8 rounded-2xl border border-line bg-page p-8 text-center"
                  >
                    <div
                      className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                      style={{ background: GRADIENT }}
                    >
                      <Send size={22} className="text-white" />
                    </div>
                    <h3 className="text-[18px] font-semibold text-ink">Message sent!</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-ink-3">
                      Thank you for reaching out. We'll be in touch within one business day.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-5 text-[13.5px] font-medium transition-opacity hover:opacity-70"
                      style={{ color: ACCENT }}
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    {/* Name row */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-[13px] font-medium text-ink-2 mb-1.5">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={form.firstName}
                          onChange={handleChange}
                          placeholder="Ravi"
                          className="w-full rounded-xl border border-line-2 bg-page px-4 py-2.5 text-[14px] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink-3 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-ink-2 mb-1.5">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={form.lastName}
                          onChange={handleChange}
                          placeholder="Sharma"
                          className="w-full rounded-xl border border-line-2 bg-page px-4 py-2.5 text-[14px] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink-3 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-[13px] font-medium text-ink-2 mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="ravi@school.edu"
                          className="w-full rounded-xl border border-line-2 bg-page px-4 py-2.5 text-[14px] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink-3 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-ink-2 mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-line-2 bg-page px-4 py-2.5 text-[14px] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink-3 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Institution */}
                    <div>
                      <label className="block text-[13px] font-medium text-ink-2 mb-1.5">
                        Institution Name
                      </label>
                      <input
                        type="text"
                        name="institution"
                        value={form.institution}
                        onChange={handleChange}
                        placeholder="Greenwood Academy"
                        className="w-full rounded-xl border border-line-2 bg-page px-4 py-2.5 text-[14px] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink-3 transition-colors"
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-[13px] font-medium text-ink-2 mb-1.5">
                        Your Role
                      </label>
                      <select
                        name="role"
                        required
                        value={form.role}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-line-2 bg-page px-4 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink-3 transition-colors"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r === "Select your role" ? "" : r} disabled={r === "Select your role"}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[13px] font-medium text-ink-2 mb-1.5">
                        Message
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help…"
                        className="w-full resize-none rounded-xl border border-line-2 bg-page px-4 py-2.5 text-[14px] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink-3 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ background: GRADIENT }}
                    >
                      Submit <ArrowRight size={17} />
                    </button>
                  </form>
                )}
              </motion.div>

              {/* ── Right: Contact Info ── */}
              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="flex flex-col gap-6">
                <div className="rounded-2xl border border-line bg-page p-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
                    Other ways to reach us
                  </p>
                  <div className="mt-6 flex flex-col gap-5">
                    {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
                      <div key={label} className="flex items-start gap-4">
                        <span
                          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                          style={{ background: GRADIENT }}
                        >
                          <Icon size={17} />
                        </span>
                        <div>
                          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-4">{label}</p>
                          {href ? (
                            <a
                              href={href}
                              className="mt-0.5 block text-[14px] leading-snug text-ink transition-opacity hover:opacity-70"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className="mt-0.5 text-[14px] leading-snug text-ink-2">{value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="flex min-h-[200px] flex-1 items-center justify-center rounded-2xl border border-dashed border-line-2 bg-paper">
                  <div className="text-center px-4">
                    <MapPin size={28} className="mx-auto text-ink-4" />
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                      Map — Classess® HQ
                    </p>
                    <p className="mt-1 text-[12px] text-ink-4">Bengaluru, India</p>
                  </div>
                </div>

                {/* Quick note */}
                <div
                  className="rounded-2xl px-6 py-5"
                  style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}
                >
                  <p className="text-[13px] font-semibold text-ink">Response time</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">
                    We aim to respond to all enquiries within one business day. For urgent matters,
                    please call us directly.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S3 — Enquiry Types
        ════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
                What we can help with
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Common reasons people reach out.
              </h2>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Building2,
                  title: "Institution enquiries",
                  desc: "Questions about the platform, onboarding, or how Classess® fits your school or group.",
                },
                {
                  icon: User,
                  title: "Partner & affiliate",
                  desc: "Want to become a partner, affiliate, or referral agent? We'd love to hear about your network.",
                },
                {
                  icon: MessageSquare,
                  title: "General support",
                  desc: "Technical questions, account issues, or anything else — our support team is here to help.",
                },
                {
                  icon: Mail,
                  title: "Press & media",
                  desc: "Media enquiries, interview requests, or brand-related questions for the Classess® communications team.",
                },
                {
                  icon: Building2,
                  title: "Academic partnerships",
                  desc: "Publishers, content creators, and academic consultants interested in working with Classess®.",
                },
                {
                  icon: MessageSquare,
                  title: "Feedback",
                  desc: "Share your experience, suggest improvements, or let us know how we can serve you better.",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                    className="rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-line-2"
                  >
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white"
                      style={{ background: GRADIENT }}
                    >
                      <Icon size={18} />
                    </span>
                    <h3 className="mt-4 text-[15px] font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            Final CTA
        ════════════════════════════════════════════════════════ */}
        <section className="pb-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div
              {...fadeUp}
              className="relative overflow-hidden rounded-3xl px-8 py-16 text-center md:px-14"
              style={{ background: GRADIENT }}
            >
              <h2 className="mx-auto max-w-2xl text-3xl font-serif font-medium leading-tight tracking-tight text-white md:text-4xl">
                Ready to explore Classess®?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/80">
                Whether you are a student, teacher, institution, or partner — there is a clear
                starting point for you.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/about")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold transition-transform hover:scale-[1.02]"
                  style={{ color: ACCENT }}
                >
                  Learn About Us <ArrowRight size={17} />
                </button>
                <button
                  onClick={() => navigate("/partners")}
                  className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Become a Partner
                </button>
              </div>
            </motion.div>
          </div>
        </section>

      </div>

      <AuthModal
        open={authOpen}
        mode={authModal?.mode ?? "signin"}
        position={authModal?.pos ?? null}
        initialRoleId={null}
        onClose={() => setAuthModal(null)}
        onSelectRole={(roleId) => {
          selectRole(roleId);
          setAuthModal(null);
          navigate("/");
        }}
      />

      <Footer hideCta />
    </div>
  );
}
