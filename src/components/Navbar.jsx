import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRole } from "../hooks/useRole";

const DEFAULT_LINKS = [
  { label: "Products", href: "#products" },
  { label: "Features", href: "#features" },
  { label: "About",    href: "#about"    },
  { label: "Contact",  href: "#contact"  },
];

/**
 * Smooth-scroll to a section by anchor id (e.g. "#dashboard").
 * Falls back gracefully if element not found.
 */
function scrollToSection(href, offset = 64) {
  if (!href || href === "#") return;
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export default function Navbar({ onOpenAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const { activeRoleConfig, clearRole } = useRole();
  // Any selected role drives anchor-based section nav (links point to #ids).
  const hasRoleNav = !!activeRoleConfig;

  /* ── scroll shadow ─────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── scroll-spy: track which section is in view ────────────── */
  const links = activeRoleConfig?.navbar?.links ?? DEFAULT_LINKS;

  useEffect(() => {
    if (!hasRoleNav) { setActiveSection(null); return; }

    const sectionIds = links
      .map((l) => l.href)
      .filter((h) => h && h !== "#")
      .map((h) => h.replace("#", ""));
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [hasRoleNav, links]);

  const primaryCta = activeRoleConfig?.navbar?.primaryCta ?? "Sign Up";
  const secondaryCta = activeRoleConfig?.navbar?.secondaryCta ?? "Sign In";
  const accent = activeRoleConfig?.accent;
  const gradient = activeRoleConfig?.accentGradient;

  /* ── which label matches activeSection ─────────────────────── */
  const activeLinkLabel = hasRoleNav
    ? links.find((l) => l.href === `#${activeSection}`)?.label ?? null
    : null;

  /* ── link click handler ─────────────────────────────────────── */
  const handleLinkClick = (e, link) => {
    if (hasRoleNav && link.href && link.href !== "#") {
      e.preventDefault();
      scrollToSection(link.href);
      setMenuOpen(false);
    }
  };

  /* ── primary CTA click: jump to first section ──────────────── */
  const firstSectionHref = links.find((l) => l.href && l.href !== "#")?.href ?? "#";
  const handleCtaClick = (e) => {
    if (hasRoleNav && firstSectionHref !== "#") {
      e.preventDefault();
      scrollToSection(firstSectionHref);
      setMenuOpen(false);
      return;
    }
    // No role selected yet → open the sign-up role picker.
    openAuth("signup")(e);
  };

  /* ── auth modal: open + role pick ──────────────────────────── */
  const openAuth = (mode) => (e) => {
    e.preventDefault();
    // Align the popup's right edge to the clicked button's right edge.
    const rect = e.currentTarget.getBoundingClientRect();
    onOpenAuth?.(mode, {
      right: window.innerWidth - rect.right,
      top: rect.bottom + 8,
    });
    setMenuOpen(false);
  };

  /* ── logo click: reset to the default Navbar + Hero ────────── */
  const handleLogoClick = (e) => {
    if (hasRoleNav) {
      e.preventDefault();
      clearRole();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-sm" : ""}`}
      style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--line)" }}
    >
      <nav className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <a
          href="/"
          onClick={handleLogoClick}
          className="flex items-center shrink-0 group"
          aria-label="Classess Home"
        >
          <img
            src="/assets/4 Star Logo- Classess.svg"
            alt="Classess logo"
            className="h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-0.5">
          {links.map((link) => {
            const isActive = activeLinkLabel === link.label;
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className="relative px-4 py-2 text-[14.5px] font-medium rounded-[8px] transition-all duration-150 block"
                  style={{
                    color: isActive ? (accent ?? "var(--ink)") : "var(--ink-3)",
                    background: isActive ? "var(--mist)" : "transparent",
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.background = "var(--mist)"; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "var(--ink-3)"; e.currentTarget.style.background = "transparent"; }}}
                >
                  {link.label}
                  {/* Active underline — brand 2px paint line */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{ background: accent ?? "var(--ink)" }}
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {/* Ghost / secondary */}
          <a
            href="#"
            onClick={openAuth("signin")}
            className="px-4 py-2 text-[14px] font-medium rounded-[8px] transition-all duration-150"
            style={{ color: "var(--ink-2)", border: "1px solid var(--line-2)", background: "transparent" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--mist)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            {secondaryCta}
          </a>
          {/* Primary */}
          <a
            href={hasRoleNav ? firstSectionHref : "#"}
            onClick={handleCtaClick}
            className="px-4 py-2 text-[14px] font-medium rounded-[8px] transition-all duration-150 hover:opacity-90 active:scale-95"
            style={
              activeRoleConfig && gradient
                ? { background: gradient, color: "#fff", border: "1px solid transparent" }
                : { background: "var(--ink)", color: "#fff", border: "1px solid var(--ink)" }
            }
          >
            {primaryCta}
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-[8px] transition-colors"
          style={{ color: "var(--ink-3)" }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--mist)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="md:hidden px-8 pb-4 pt-3 flex flex-col gap-1"
            style={{ background: "var(--page)", borderTop: "1px solid var(--line)" }}
          >
            {links.map((link) => {
              const isActive = activeLinkLabel === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className="py-2.5 px-3 text-[15px] font-medium rounded-[8px] transition-colors"
                  style={{
                    color: isActive ? (accent ?? "var(--ink)") : "var(--ink-2)",
                    background: isActive ? "var(--mist)" : "transparent",
                  }}
                >
                  {link.label}
                </a>
              );
            })}

            <div className="mt-3 flex flex-col gap-2">
              <a
                href="#"
                onClick={openAuth("signin")}
                className="py-2.5 px-3 text-[15px] font-medium rounded-[8px] text-center transition-colors"
                style={{ color: "var(--ink-2)", border: "1px solid var(--line-2)", background: "transparent" }}
              >
                {secondaryCta}
              </a>
              <a
                href={hasRoleNav ? firstSectionHref : "#"}
                onClick={handleCtaClick}
                className="py-2.5 px-3 text-[15px] font-medium rounded-[8px] text-center transition-colors hover:opacity-90"
                style={
                  activeRoleConfig && gradient
                    ? { background: gradient, color: "#fff" }
                    : { background: "var(--ink)", color: "#fff" }
                }
              >
                {primaryCta}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
