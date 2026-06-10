import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import Navbar from "../Navbar";
import AuthModal from "../AuthModal";
import Footer from "../Footer";
import VoiceAssistant from "../VoiceAssistant";
import { useRole } from "../../hooks/useRole";

const ACCENT       = "#6366f1";
const GRADIENT     = "linear-gradient(135deg, #6366f1, #818cf8)";
const ACCENT_LIGHT = "#eef2ff";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

/* ── Content section renderers ───────────────────────────────────── */

function FlowSection({ section }) {
  return (
    <motion.div {...fadeUp} id={section.id} className="mt-16 scroll-mt-24">
      <h2 className="text-2xl md:text-3xl font-serif font-medium tracking-tight text-ink">
        {section.heading}
      </h2>
      {section.intro && (
        <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-ink-3">
          {section.intro}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {section.steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span
              className="rounded-full px-4 py-2 text-[14px] font-semibold text-white"
              style={{ background: GRADIENT }}
            >
              {step}
            </span>
            {i < section.steps.length - 1 && (
              <ChevronRight size={18} className="text-line-2" />
            )}
          </div>
        ))}
      </div>
      {section.copy && (
        <p className="mt-6 max-w-3xl text-[16px] leading-relaxed text-ink-3">
          {section.copy}
        </p>
      )}
    </motion.div>
  );
}

function ListSection({ section }) {
  return (
    <motion.div {...fadeUp} id={section.id} className="mt-16 scroll-mt-24">
      <h2 className="text-2xl md:text-3xl font-serif font-medium tracking-tight text-ink">
        {section.heading}
      </h2>
      {section.intro && (
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-ink-3">
          {section.intro}
        </p>
      )}
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-xl border border-line bg-paper px-4 py-3"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: ACCENT }}
            />
            <span className="text-[15px] text-ink-2">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function HighlightSection({ section }) {
  return (
    <motion.div {...fadeUp} id={section.id} className="mt-16 scroll-mt-24">
      <h2 className="text-2xl md:text-3xl font-serif font-medium tracking-tight text-ink">
        {section.heading}
      </h2>
      <div
        className="mt-6 rounded-2xl border border-line p-6 md:p-8"
        style={{ background: ACCENT_LIGHT }}
      >
        <p
          className="flex items-center gap-2 text-xl font-semibold"
          style={{ color: ACCENT }}
        >
          <Sparkles size={20} />
          {section.text}
        </p>
        {section.copy && (
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-ink-3">
            {section.copy}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function ContentSection({ section }) {
  switch (section.kind) {
    case "flow":      return <FlowSection section={section} />;
    case "list":      return <ListSection section={section} />;
    case "highlight": return <HighlightSection section={section} />;
    default:          return null;
  }
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function InstitutionModulePage({ module }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRoleId, selectRole } = useRole();
  const [authModal, setAuthModal] = useState(null);

  useEffect(() => {
    if (activeRoleId !== "institute") selectRole("institute");
  }, [activeRoleId, selectRole]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = module.docTitle;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content");
    if (meta && module.metaDescription) meta.setAttribute("content", module.metaDescription);

    const hash = location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
      }, 120);
    } else {
      window.scrollTo({ top: 0 });
    }

    return () => {
      document.title = prevTitle;
      if (meta && prevDesc != null) meta.setAttribute("content", prevDesc);
    };
  }, [module, location.hash]);

  const goHome = () => navigate("/");
  const authOpen = authModal !== null;

  return (
    <div className="min-h-screen bg-page">
      <div
        className="transition-[filter] duration-200"
        style={authOpen ? { filter: "blur(4px)" } : undefined}
        aria-hidden={authOpen}
      >
        <Navbar onOpenAuth={(mode, pos) => setAuthModal({ mode, pos })} />

        <main className="mx-auto max-w-5xl px-6 pb-24 pt-28 md:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] text-ink-4">
            <button onClick={goHome} className="transition-colors hover:text-ink-2">
              Institution Home
            </button>
            <ChevronRight size={14} />
            <span className="font-medium text-ink-3">{module.navLabel}</span>
          </nav>

          {/* Heading + intro */}
          <motion.header {...fadeUp} className="mt-6 max-w-3xl">
            <h1 className="text-3xl font-serif font-medium leading-tight tracking-tight text-ink md:text-5xl">
              {module.heading}
            </h1>
            {module.intro.map((p) => (
              <p key={p} className="mt-5 text-[17px] leading-relaxed text-ink-3">
                {p}
              </p>
            ))}
          </motion.header>

          {/* Institutional outcomes grid */}
          <motion.section {...fadeUp} className="mt-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-4">
              What you can expect
            </p>
            <h2 className="mt-2 text-2xl font-serif font-medium tracking-tight text-ink md:text-3xl">
              What institutions can expect
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {module.outcomes.map((o) => (
                <div
                  key={o.title}
                  className="rounded-2xl border border-line bg-paper p-6"
                >
                  <h3 className="text-[17px] font-semibold text-ink">{o.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-3">{o.body}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Flexible content sections */}
          {module.sections.map((section, i) => (
            <ContentSection key={i} section={section} />
          ))}

          {/* Final CTA */}
          <motion.section
            {...fadeUp}
            className="mt-20 overflow-hidden rounded-3xl border border-line p-8 md:p-12"
            style={{ background: ACCENT_LIGHT }}
          >
            <h2 className="max-w-2xl text-2xl font-serif font-medium leading-tight tracking-tight text-ink md:text-3xl">
              {module.final.heading}
            </h2>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setAuthModal({ mode: "signup", pos: null })}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: GRADIENT }}
              >
                {module.final.primary}
                <ArrowRight size={17} />
              </button>
              <button
                onClick={goHome}
                className="inline-flex items-center justify-center rounded-xl border border-line-2 bg-page px-6 py-3 text-[15px] font-semibold text-ink-2 transition-colors hover:bg-paper"
              >
                {module.final.secondary}
              </button>
            </div>
          </motion.section>

          {/* Back link */}
          <div className="mt-12">
            <button
              onClick={goHome}
              className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-4 transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} />
              Back to Institution Home
            </button>
          </div>
        </main>

      </div>

      <AuthModal
        open={authOpen}
        mode={authModal?.mode ?? "signin"}
        position={authModal?.pos ?? null}
        initialRoleId="institute"
        onClose={() => setAuthModal(null)}
        onSelectRole={(roleId) => {
          selectRole(roleId);
          setAuthModal(null);
          navigate("/");
        }}
      />

      <Footer />
      <VoiceAssistant />
    </div>
  );
}
