import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

/* ── Inline social SVGs ── */
const LinkedInIcon  = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const YouTubeIcon   = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>;
const FacebookIcon  = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>;

import AuthModal from "./AuthModal";
import { useRole } from "../hooks/useRole";

/* ── Role gradients ── */
const ROLE_GRADIENT = {
  student:   "linear-gradient(135deg, #3B82F6 0%, #4F46E5 100%)",
  teacher:   "linear-gradient(135deg, #22C55E 0%, #1CA363 100%)",
  institute: "linear-gradient(135deg, #6366f1, #818cf8)",
};

/* ── Role-specific CTA data ── */
const ROLE_CTA = {
  student: {
    heading:       "Ready to give your learning a clearer direction?",
    copy:          "Build a personalised learning path, practise with purpose, identify learning gaps, and prepare confidently for examinations.",
    primary:       "Start Learning Free",
    secondary:     "Explore Student Tutorials",
    secondaryHref: "/students/tutorials",
  },
  teacher: {
    heading:       "Ready to make teaching more focused and manageable?",
    copy:          "Plan with clarity, assess meaningfully, understand student needs, and spend less time on repetitive academic work.",
    primary:       "Start as a Teacher",
    secondary:     "Explore Teacher Tutorials",
    secondaryHref: "/teachers/tutorials",
  },
  institute: {
    heading:       "Ready to build a more connected academic system?",
    copy:          "Support teachers, understand student learning, strengthen academic decisions, and improve outcomes across your institution or network.",
    primary:       "Request a Demo",
    secondary:     "Speak with Our Academic Team",
    secondaryHref: "/contact",
  },
};

/* ── Column data ── */

const FOR_YOU = [
  { label: "Students",                      href: "/students" },
  { label: "Teachers",                      href: "/teachers" },
  { label: "Institutions",                  href: "/institutions" },
  { label: "Parents",                       href: "/parents" },
  { label: "Independent Tutors",            href: "/independent-tutors" },
  { label: "Education Groups",              href: "/education-groups" },
  { label: "Districts & Education Networks", href: "/districts" },
];

const PLATFORM = [
  { label: "Learning & Practice",            href: "/platform/learning-practice" },
  { label: "Planning & Content Creation",    href: "/platform/planning-content" },
  { label: "Assessment & Evaluation",        href: "/platform/assessment" },
  { label: "Student Insights",               href: "/platform/student-insights" },
  { label: "Academic Intelligence",          href: "/platform/academic-intelligence" },
  { label: "Implementation & Integrations",  href: "/platform/implementation" },
  { label: "Trust & Governance",             href: "/platform/trust-governance" },
];

const PRODUCTS = [
  { label: "Classess®",         href: "/products/classess" },
  { label: "Vidya",             href: "/products/vidya" },
  { label: "Edmission",         href: "/products/edmission" },
  { label: "Feenance",          href: "/products/feenance" },
  { label: "Kaho.chat",         href: "/products/kaho-chat" },
  { label: "PTM",               href: "/products/ptm" },
  { label: "View All Products", href: "/products" },
];

const SOLUTIONS = [
  { label: "Independent Institutions",       href: "/solutions/institutions" },
  { label: "Education Groups",               href: "/solutions/education-groups" },
  { label: "NGO & CSR Programmes",           href: "/solutions/ngo-csr" },
  { label: "Districts & Government",         href: "/solutions/districts-government" },
  { label: "Publishers & Content Providers", href: "/solutions/publishers" },
  { label: "Academic Consultants",           href: "/solutions/consultants" },
  { label: "Partners & Integrations",        href: "/solutions/partners" },
];

const COMPANY_LINKS = [
  { label: "About Classess®", href: "/about" },
  { label: "Our Vision",      href: "/vision" },
  { label: "Partners",        href: "/partners" },
  { label: "Careers",         href: "/careers" },
  { label: "Contact Us",      href: "/contact" },
];

const RESOURCES_LINKS = [
  { label: "Resources",   href: "/resources" },
  { label: "Tutorials",   href: "/tutorials" },
  { label: "Help Centre", href: "/help" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy",  href: "/privacy" },
  { label: "Terms of Use",    href: "/terms" },
  { label: "Student Safety",  href: "/student-safety" },
  { label: "Responsible AI",  href: "/responsible-ai" },
  { label: "Data Protection", href: "/data-protection" },
  { label: "Accessibility",   href: "/accessibility" },
];

const SOCIALS = [
  { label: "LinkedIn",  Icon: LinkedInIcon,  href: "#" },
  { label: "YouTube",   Icon: YouTubeIcon,   href: "#" },
  { label: "Instagram", Icon: InstagramIcon, href: "#" },
  { label: "Facebook",  Icon: FacebookIcon,  href: "#" },
];

/* ── Sub-components ── */

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
      {/* Desktop heading */}
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

/* ── Footer (default export) ── */

export default function Footer() {
  const navigate = useNavigate();
  const { activeRoleId, selectRole } = useRole();
  const [authModal, setAuthModal]   = useState(null);
  const [openSection, setOpenSection] = useState(null);

  const role    = activeRoleId ?? "student";
  const cta     = ROLE_CTA[role];
  const gradient = ROLE_GRADIENT[role];
  const authOpen = authModal !== null;
  const year     = new Date().getFullYear();

  const toggleSection = (id) =>
    setOpenSection((prev) => (prev === id ? null : id));

  const openAuth = (mode) => setAuthModal({ mode, pos: null });

  return (
    <>
      <footer
        className="border-t border-line bg-mist transition-[filter] duration-200"
        style={authOpen ? { filter: "blur(4px)" } : undefined}
        aria-label="Site footer"
      >

        {/* ── Row 1: Role-specific CTA band ── */}
        <div className="border-b border-line px-6 py-12 md:px-12 md:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

              {/* Heading + copy */}
              <div className="max-w-xl">
                <h2 className="text-[22px] font-semibold leading-snug text-ink">
                  {cta.heading}
                </h2>
                <p className="mt-3 text-[14.5px] leading-[1.75] text-ink-3">
                  {cta.copy}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex shrink-0 flex-col gap-4 md:items-end">
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <button
                    onClick={() => openAuth("signup")}
                    className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: gradient }}
                  >
                    {cta.primary}
                  </button>
                  <button
                    onClick={() => navigate(cta.secondaryHref)}
                    className="inline-flex items-center justify-center rounded-xl border border-line-2 bg-paper px-5 py-2.5 text-[14px] font-medium text-ink-3 transition-colors hover:border-ink-4 hover:text-ink"
                  >
                    {cta.secondary}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Brand area + 5 link columns ── */}
        <div className="px-6 py-12 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[220px_1fr_1fr_1fr_1fr_1.1fr]">

              {/* Brand area */}
              <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1">
                <img
                  src="/assets/4 Star Logo- Classess.svg"
                  alt="Classess.com®"
                  className="h-auto w-[160px]"
                />
                <p className="mt-4 text-[13.5px] leading-[1.7] text-ink-3">
                  An AI-native Academic Intelligence Platform that puts the student
                  at the centre, empowers teachers with intelligent support, and
                  helps institutions make better academic decisions.
                </p>
                <p className="mt-3 text-[13px] font-medium text-ink-2">
                  Every student seen, supported, and learning at their best.
                </p>
                <div className="mt-5 flex gap-2">
                  {SOCIALS.map(({ label, Icon, href }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={`Classess.com® on ${label}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-4 transition-colors hover:border-ink-4 hover:text-ink-2"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>

              {/* Col 1: For You */}
              <ColumnBlock
                heading="For You"
                id="col1"
                openSection={openSection}
                onToggle={toggleSection}
              >
                {FOR_YOU.map((l) => (
                  <FooterLink key={l.label} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </ColumnBlock>

              {/* Col 2: Platform */}
              <ColumnBlock
                heading="Platform"
                id="col2"
                openSection={openSection}
                onToggle={toggleSection}
              >
                {PLATFORM.map((l) => (
                  <FooterLink key={l.label} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </ColumnBlock>

              {/* Col 3: Products */}
              <ColumnBlock
                heading="Products"
                id="col3"
                openSection={openSection}
                onToggle={toggleSection}
              >
                {PRODUCTS.map((l) => (
                  <FooterLink key={l.label} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </ColumnBlock>

              {/* Col 4: Solutions */}
              <ColumnBlock
                heading="Solutions"
                id="col4"
                openSection={openSection}
                onToggle={toggleSection}
              >
                {SOLUTIONS.map((l) => (
                  <FooterLink key={l.label} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </ColumnBlock>

              {/* Col 5: Company & Resources */}
              <ColumnBlock
                heading="Company & Resources"
                id="col5"
                openSection={openSection}
                onToggle={toggleSection}
              >
                {COMPANY_LINKS.map((l) => (
                  <FooterLink key={l.label} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
                <p className="mb-1 mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-4">
                  Resources
                </p>
                {RESOURCES_LINKS.map((l) => (
                  <FooterLink key={l.label} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </ColumnBlock>

            </div>
          </div>
        </div>

        {/* ── Row 3: Contact and Demo area ── */}
        <div className="border-t border-line px-6 py-8 md:px-12">
          <div className="mx-auto max-w-7xl flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-lg">
              <p className="text-[15px] font-semibold text-ink">
                Need help choosing the right solution?
              </p>
              <p className="mt-1.5 text-[13.5px] leading-[1.7] text-ink-3">
                Whether you are a student, teacher, institution, education group,
                NGO, CSR initiative, or district, our team can help you identify
                the right starting point.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <button
                onClick={() => navigate("/contact")}
                className="inline-flex items-center justify-center rounded-xl bg-ink px-5 py-2.5 text-[14px] font-semibold text-page transition-opacity hover:opacity-80"
              >
                Contact Classess®
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="text-[13.5px] font-medium text-ink-3 underline-offset-2 transition-colors hover:text-ink hover:underline"
              >
                Request a Demo
              </button>
            </div>
          </div>
        </div>

        {/* ── Row 4: Legal bar ── */}
        <div className="border-t border-line-2 bg-mist px-6 py-5 md:px-12">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-x-5 gap-y-2.5">
            {LEGAL_LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => navigate(l.href)}
                className="text-[12px] text-ink-4 transition-colors hover:text-ink-2"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Row 5: Copyright bar ── */}
        <div className="border-t border-line-2 bg-mist px-6 py-5 md:px-12">
          <div className="mx-auto max-w-7xl flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-0.5">
              <p className="text-[12px] text-ink-4">
                © {year} Classess®. All rights reserved.
              </p>
              <p className="text-[11.5px] text-ink-4">
                Classess® is a product of Dot eVentures Pvt. Ltd.
              </p>
            </div>
            <p className="text-[11.5px] text-ink-4 md:text-right">
              Built from first principles, not from copies.
            </p>
          </div>
        </div>

      </footer>

      {/* Auth modal — outside footer's own blur layer */}
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
