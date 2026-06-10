/**
 * ResourcesPage.jsx — /institutions/resources
 *
 * Searchable institutional resource hub organised by category. Each resource
 * card shows title, description, type, and a Download / Read / Watch CTA.
 * Indigo-themed to match the institution role accent.
 */

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ChevronRight, Search, Download, FileText, Play } from "lucide-react";
import Navbar from "../../components/Navbar";
import AuthModal from "../../components/AuthModal";
import VoiceAssistant from "../../components/VoiceAssistant";
import { useRole } from "../../hooks/useRole";
import { RESOURCE_CATEGORIES } from "../../config/instituteModules";

const ACCENT      = "#6366f1";
const GRADIENT    = "linear-gradient(135deg, #6366f1, #818cf8)";
const ACCENT_LIGHT = "#eef2ff";

const TYPE_COLORS = {
  PDF:       { bg: "#eef2ff", text: "#4338CA" },
  Guide:     { bg: "#E8F7F0", text: "#1CA363" },
  Template:  { bg: "#FFF7ED", text: "#C2410C" },
  Checklist: { bg: "#FFF1F2", text: "#BE123C" },
  Article:   { bg: "#F0F9FF", text: "#0369A1" },
  Video:     { bg: "#FDF4FF", text: "#7E22CE" },
  Pack:      { bg: "#FFFBEB", text: "#B45309" },
};

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

function ActionIcon({ action }) {
  if (action === "Download") return <Download size={13} />;
  if (action === "Watch")    return <Play size={13} />;
  return <FileText size={13} />;
}

function ResourceCard({ resource }) {
  const tc = TYPE_COLORS[resource.type] ?? TYPE_COLORS.PDF;
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
          style={{ background: tc.bg, color: tc.text }}
        >
          {resource.type}
        </span>
      </div>
      <h4 className="text-[15px] font-semibold leading-snug text-neutral-900">
        {resource.title}
      </h4>
      <p className="text-[13.5px] leading-relaxed text-neutral-500 flex-1">
        {resource.desc}
      </p>
      <div className="pt-1">
        <button
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: GRADIENT }}
          aria-label={`${resource.action}: ${resource.title}`}
        >
          {resource.action}
          <ActionIcon action={resource.action} />
        </button>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRoleId, selectRole } = useRole();
  const [authModal, setAuthModal] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (activeRoleId !== "institute") selectRole("institute");
  }, [activeRoleId, selectRole]);

  useEffect(() => {
    document.title = "Resources — Classess.com® Institution";
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
    return () => { document.title = "Classess.com®"; };
  }, [location.hash]);

  const lq = query.toLowerCase().trim();
  const filteredCategories = RESOURCE_CATEGORIES.map((cat) => ({
    ...cat,
    resources: lq
      ? cat.resources.filter(
          (r) =>
            r.title.toLowerCase().includes(lq) ||
            r.desc.toLowerCase().includes(lq) ||
            r.type.toLowerCase().includes(lq) ||
            r.action.toLowerCase().includes(lq)
        )
      : cat.resources,
  })).filter((cat) => cat.resources.length > 0);

  const goHome = () => navigate("/");
  const authOpen = authModal !== null;

  return (
    <div className="min-h-screen bg-white">
      <div
        className="transition-[filter] duration-200"
        style={authOpen ? { filter: "blur(4px)" } : undefined}
        aria-hidden={authOpen}
      >
        <Navbar onOpenAuth={(mode, pos) => setAuthModal({ mode, pos })} />

        <main className="mx-auto max-w-5xl px-6 pb-24 pt-28 md:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] text-neutral-400">
            <button onClick={goHome} className="transition-colors hover:text-neutral-700">
              Institution Home
            </button>
            <ChevronRight size={14} />
            <span className="font-medium text-neutral-600">Resources</span>
          </nav>

          {/* Hero */}
          <motion.header {...fadeUp} className="mt-6 max-w-3xl">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-5xl">
              Everything you need to evaluate, adopt, and use Classess.com®.
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-neutral-600">
              Guides, templates, case studies, training materials, and platform resources — organised by audience and purpose.
            </p>
          </motion.header>

          {/* Search */}
          <motion.div {...fadeUp} className="mt-8 max-w-lg">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
              <input
                type="search"
                placeholder="Search institution resources"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-[15px] text-neutral-800 placeholder-neutral-400 outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f120]"
              />
            </div>
          </motion.div>

          {/* Resource categories */}
          {filteredCategories.length === 0 ? (
            <motion.p {...fadeUp} className="mt-16 text-neutral-500 text-[15px]">
              No resources found for "{query}". Try a different search term.
            </motion.p>
          ) : (
            filteredCategories.map((cat) => (
              <motion.section
                {...fadeUp}
                key={cat.id}
                id={cat.id}
                className="mt-16 scroll-mt-24"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl mb-6">
                  {cat.label}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.resources.map((resource) => (
                    <ResourceCard key={resource.title} resource={resource} />
                  ))}
                </div>
              </motion.section>
            ))
          )}

          {/* Final CTA */}
          <motion.section
            {...fadeUp}
            className="mt-20 overflow-hidden rounded-3xl border border-neutral-100 p-8 md:p-12"
            style={{ background: ACCENT_LIGHT }}
          >
            <h2 className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-3xl">
              Ready to explore Classess.com® for your institution?
            </h2>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setAuthModal({ mode: "signup", pos: null })}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: GRADIENT }}
              >
                Request a Demo
                <ArrowRight size={17} />
              </button>
              <button
                onClick={goHome}
                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-[15px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Back to Institution Home
              </button>
            </div>
          </motion.section>

          {/* Back link */}
          <div className="mt-12">
            <button
              onClick={goHome}
              className="inline-flex items-center gap-2 text-[14px] font-medium text-neutral-500 transition-colors hover:text-neutral-800"
            >
              <ArrowLeft size={16} />
              Back to Institution Home
            </button>
          </div>
        </main>

        <footer className="border-t border-neutral-100 bg-neutral-50 py-10 text-center">
          <p className="text-[13px] font-medium text-neutral-400">
            © 2026 Classess · Institution Platform · Academic Intelligence for Education
          </p>
        </footer>
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

      <VoiceAssistant />
    </div>
  );
}
