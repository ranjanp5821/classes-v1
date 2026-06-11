/**
 * Footer.jsx — Global Dynamic Footer
 *
 * Adapts Column 1 and the primary CTA to the active role (student / teacher /
 * institution). Contains its own AuthModal so it can be placed outside each
 * page's blur wrapper. Dark-panel themed, fully brand-kit-aligned.
 *
 * Structure:
 *   Intro band  →  6 link columns (accordion on mobile)
 *   →  Trust & governance band  →  Bottom legal bar
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";

/* ── Inline social SVGs (brand icons not in this lucide-react version) ── */
const LinkedInIcon  = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const YouTubeIcon   = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>;
const FacebookIcon  = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>;
const XIcon         = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
import AuthModal from "./AuthModal";
import { useRole } from "../hooks/useRole";

/* ── Role-specific data ─────────────────────────────────────────── */

const ROLE_GRADIENT = {
  student:   "linear-gradient(135deg, #3B82F6 0%, #4F46E5 100%)",
  teacher:   "linear-gradient(135deg, #22C55E 0%, #1CA363 100%)",
  institute: "linear-gradient(135deg, #6366f1, #818cf8)",
};

const ROLE_CTA = {
  student:   "Start Learning Free",
  teacher:   "Start as a Teacher",
  institute: "Request a Demo",
};

const COL1 = {
  student: {
    heading: "For Students",
    links: [
      { label: "Learn",                   href: "/students/learn" },
      { label: "Practice",                href: "/students/practice" },
      { label: "Examination Preparation", href: "/students/exam-preparation" },
      { label: "My Progress",             href: "/students/progress" },
      { label: "Vidya AI Companion",      href: "/students/ai-tutor" },
      { label: "Sign In",                 auth: "signin" },
      { label: "Create Student Account",  auth: "signup" },
    ],
  },
  teacher: {
    heading: "For Teachers",
    links: [
      { label: "How It Helps",           href: "/teachers/how-it-helps" },
      { label: "Plan & Create",          href: "/teachers/plan-and-create" },
      { label: "Assess & Support",       href: "/teachers/assess-and-support" },
      { label: "Tutorials",              href: "/teachers/tutorials" },
      { label: "Sign In",                auth: "signin" },
      { label: "Create Teacher Account", auth: "signup" },
    ],
  },
  institute: {
    heading: "For Institutions",
    links: [
      { label: "Platform",               href: "/institutions/platform" },
      { label: "Academic Intelligence",  href: "/institutions/academic-intelligence" },
      { label: "Implementation",         href: "/institutions/implementation" },
      { label: "Trust & Governance",     href: "/institutions/trust-governance" },
      { label: "Resources",              href: "/institutions/resources" },
      { label: "Request a Demo",         auth: "signup" },
      { label: "Institution Sign In",    auth: "signin" },
    ],
  },
};

/* ── Static column data ─────────────────────────────────────────── */

const PLATFORM = [
  "Academic Intelligence",
  "Personalised Learning",
  "Curriculum & Learning Outcomes",
  "Lesson Planning",
  "Teaching Resources",
  "Assessments",
  "Evaluation and Feedback",
  "Student Learning Gaps",
  "Learning Analytics",
  "Institutional Dashboards",
  "Responsible AI",
];

const SOLUTIONS = [
  "Independent Student Learning",
  "Vidya AI Companion",
  "Teacher Academic Workspace",
  "Assessment and Evaluation",
  "Voice Feedback and Grading",
  "Student Progress & Learning Gaps",
  "Examination Preparation",
  "Remedial and Revision Planning",
  "Multi-Campus Academic Intelligence",
];

const ECOSYSTEM = [
  {
    group: "Learning & Academic Support",
    items: ["Classess®", "Vidya", "LearnEng.app", "Independent Student Application"],
  },
  {
    group: "Institution Operations",
    items: ["Edmission", "Feenance", "Kaho.chat", "PTM"],
  },
  {
    group: "Emerging Solutions",
    items: ["Edsurance"],
  },
];

const RESOURCES = [
  "Tutorials", "Help Centre", "Product Guides",
  "Webinars", "Case Studies", "Academic Articles",
  "Responsible AI Guides", "FAQs",
];

const SUPPORT = [
  "Contact Support", "Report a Problem",
  "Product Feedback", "Accessibility Support", "Account Help",
];

const COMPANY = [
  "About Classess.com®", "Our Vision", "Leadership",
  "Careers", "News and Updates", "Contact Us",
];

const PARTNERSHIPS = [
  "Partner With Us", "Academic Partnerships",
  "Technology Partnerships", "NGO and CSR Partnerships",
  "Government & District Partnerships", "Careers and Internships",
];

const TRUST_LINKS = [
  "Trust Centre", "Responsible AI", "Student Safety", "AI Governance",
  "Data Protection", "Security", "Privacy Policy", "Cookie Policy",
  "Terms of Use", "Acceptable Use Policy", "Accessibility",
  "Child and Student Privacy", "Data Processing Agreement",
];

const LEGAL_BOTTOM = [
  "Privacy Policy", "Terms of Use", "Cookie Policy",
  "Accessibility", "Security", "Responsible AI",
];

const SOCIALS = [
  { label: "LinkedIn",  Icon: LinkedInIcon,  href: "#" },
  { label: "YouTube",   Icon: YouTubeIcon,   href: "#" },
  { label: "Instagram", Icon: InstagramIcon, href: "#" },
  { label: "Facebook",  Icon: FacebookIcon,  href: "#" },
  { label: "X",         Icon: XIcon,         href: "#" },
];

/* ── Sub-components ─────────────────────────────────────────────── */

function FooterLink({ href, auth, onAuth, children }) {
  const navigate = useNavigate();
  const cls =
    "text-[13.5px] leading-relaxed text-ink-3 transition-colors hover:text-ink text-left";

  if (auth && onAuth) {
    return (
      <button className={cls} onClick={() => onAuth(auth)}>
        {children}
      </button>
    );
  }
  if (href) {
    return (
      <button className={cls} onClick={() => navigate(href)}>
        {children}
      </button>
    );
  }
  return (
    <span className={`${cls} pointer-events-none opacity-50`}>{children}</span>
  );
}

function ColumnBlock({ heading, id, openSection, onToggle, children }) {
  const isOpen = openSection === id;
  return (
    <div>
      {/* Desktop label */}
      <p className="hidden md:block font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-4 mb-4">
        {heading}
      </p>
      {/* Mobile accordion toggle */}
      <button
        className="md:hidden flex w-full items-center justify-between py-3.5 border-b border-line text-left"
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
      >
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-4">
          {heading}
        </span>
        <ChevronDown
          size={13}
          className={`text-ink-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {/* Content — always visible desktop, toggled on mobile */}
      <div className={`${isOpen ? "block" : "hidden"} md:block mt-3 md:mt-0`}>
        <div className="flex flex-col gap-2.5">{children}</div>
      </div>
    </div>
  );
}

/* ── Footer (default export) ────────────────────────────────────── */

export default function Footer() {
  const navigate = useNavigate();
  const { activeRoleId, selectRole } = useRole();
  const [authModal, setAuthModal] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  const role = activeRoleId ?? "student";
  const col1 = COL1[role];
  const gradient = ROLE_GRADIENT[role];
  const ctaLabel = ROLE_CTA[role];
  const authOpen = authModal !== null;
  const year = new Date().getFullYear();

  const toggleSection = (id) =>
    setOpenSection((prev) => (prev === id ? null : id));

  const openAuth = (mode) => setAuthModal({ mode, pos: null });

  return (
    <>
      {/* ── Footer shell (self-blurs when its own auth modal is open) ── */}
      <footer
        className="border-t border-line bg-mist transition-[filter] duration-200"
        style={authOpen ? { filter: "blur(4px)" } : undefined}
        aria-label="Site footer"
      >

        {/* ── Intro band ──────────────────────────────────────────── */}
        <div className="border-b border-line px-6 py-12 md:px-12 md:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">

              {/* Brand intro */}
              <div className="max-w-[340px]">
                <p className="font-display text-[22px] font-semibold text-ink">
                  Classess.com®
                </p>
                <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-4">
                  Academic intelligence for every learner, teacher, and institution
                </p>
                <p className="mt-5 text-[14px] leading-[1.75] text-ink-3">
                  Classess.com® connects learning, teaching, assessment, student
                  support, and institutional intelligence in one responsible
                  AI-powered education ecosystem.
                </p>
              </div>

              {/* CTAs + role switcher */}
              <div className="flex flex-col gap-5 md:items-end">
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <button
                    onClick={() => openAuth("signup")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: gradient }}
                  >
                    {ctaLabel} <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center justify-center rounded-xl border border-line-2 bg-paper px-5 py-2.5 text-[14px] font-medium text-ink-3 transition-colors hover:border-ink-4 hover:text-ink"
                  >
                    Contact Us
                  </button>
                </div>

                {/* Role switcher pill */}
                <div className="flex items-center gap-0.5 rounded-xl border border-line bg-paper p-1">
                  <span className="select-none px-2.5 text-[11.5px] text-ink-4">
                    Viewing as:
                  </span>
                  {["student", "teacher", "institute"].map((r) => (
                    <button
                      key={r}
                      onClick={() => selectRole(r)}
                      className={`rounded-[9px] px-3 py-1.5 text-[12.5px] font-medium transition-all ${
                        role === r
                          ? "bg-ink text-page shadow-sm"
                          : "text-ink-4 hover:text-ink-2"
                      }`}
                    >
                      {r === "institute"
                        ? "Institution"
                        : r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Link columns ────────────────────────────────────────── */}
        <div className="px-6 py-12 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-y-1 md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3 xl:grid-cols-6 xl:gap-x-6">

              {/* Col 1 — dynamic role column */}
              <ColumnBlock
                heading={col1.heading}
                id="col1"
                openSection={openSection}
                onToggle={toggleSection}
              >
                {col1.links.map((l) => (
                  <FooterLink key={l.label} href={l.href} auth={l.auth} onAuth={openAuth}>
                    {l.label}
                  </FooterLink>
                ))}
              </ColumnBlock>

              {/* Col 2 — Platform */}
              <ColumnBlock
                heading="Platform"
                id="col2"
                openSection={openSection}
                onToggle={toggleSection}
              >
                {PLATFORM.map((l) => (
                  <FooterLink key={l}>{l}</FooterLink>
                ))}
              </ColumnBlock>

              {/* Col 3 — Academic Solutions */}
              <ColumnBlock
                heading="Academic Solutions"
                id="col3"
                openSection={openSection}
                onToggle={toggleSection}
              >
                {SOLUTIONS.map((l) => (
                  <FooterLink key={l}>{l}</FooterLink>
                ))}
              </ColumnBlock>

              {/* Col 4 — Ecosystem */}
              <ColumnBlock
                heading="Classess® Ecosystem"
                id="col4"
                openSection={openSection}
                onToggle={toggleSection}
              >
                {ECOSYSTEM.map((group) => (
                  <div key={group.group}>
                    <p className="mb-2 mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-4">
                      {group.group}
                    </p>
                    {group.items.map((item) => (
                      <div key={item} className="mb-2.5">
                        <FooterLink>{item}</FooterLink>
                      </div>
                    ))}
                  </div>
                ))}
              </ColumnBlock>

              {/* Col 5 — Resources + Support */}
              <ColumnBlock
                heading="Resources"
                id="col5"
                openSection={openSection}
                onToggle={toggleSection}
              >
                {RESOURCES.map((l) => (
                  <FooterLink key={l}>{l}</FooterLink>
                ))}
                <p className="mb-1 mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-4">
                  Support
                </p>
                {SUPPORT.map((l) => (
                  <FooterLink key={l}>{l}</FooterLink>
                ))}
              </ColumnBlock>

              {/* Col 6 — Company + Partnerships */}
              <ColumnBlock
                heading="Company"
                id="col6"
                openSection={openSection}
                onToggle={toggleSection}
              >
                {COMPANY.map((l) => (
                  <FooterLink key={l}>{l}</FooterLink>
                ))}
                <p className="mb-1 mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-4">
                  Work With Us
                </p>
                {PARTNERSHIPS.map((l) => (
                  <FooterLink key={l}>{l}</FooterLink>
                ))}
              </ColumnBlock>

            </div>
          </div>
        </div>

        {/* ── Trust & Governance band ──────────────────────────────── */}
        <div className="border-t border-line bg-mist px-6 py-8 md:px-12">
          <div className="mx-auto max-w-7xl">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-4">
              Trust, Safety &amp; Governance
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              {TRUST_LINKS.map((l) => (
                <span
                  key={l}
                  className="text-[12.5px] text-ink-3 transition-colors hover:text-ink cursor-pointer"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div className="border-t border-line-2 bg-mist px-6 py-6 md:px-12">
          <div className="mx-auto max-w-7xl flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            {/* Copyright + trademark */}
            <div className="flex flex-col gap-1">
              <p className="text-[12px] text-ink-4">
                © {year} Dot eVentures Pvt. Ltd. All rights reserved.
              </p>
              <p className="text-[11.5px] text-ink-4">
                Classess® and Classess.com® are registered trademarks of Dot eVentures Pvt. Ltd.
              </p>
            </div>

            {/* Legal quick links */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {LEGAL_BOTTOM.map((l) => (
                <span
                  key={l}
                  className="text-[12px] text-ink-4 transition-colors hover:text-ink-2 cursor-pointer"
                >
                  {l}
                </span>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`Classess.com® on ${label}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-4 transition-colors hover:border-ink-4 hover:text-ink-2"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>

          </div>
        </div>

      </footer>

      {/* Auth modal — outside the footer's own blur layer */}
      <AuthModal
        open={authOpen}
        mode={authModal?.mode ?? "signin"}
        position={null}
        initialRoleId={role}
        onClose={() => setAuthModal(null)}
        onSelectRole={(roleId) => {
          selectRole(roleId);
          setAuthModal(null);
        }}
      />
    </>
  );
}
