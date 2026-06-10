import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ChevronRight, Search, Play, FileText, Clock } from "lucide-react";
import Navbar from "../../components/Navbar";
import AuthModal from "../../components/AuthModal";
import Footer from "../../components/Footer";
import VoiceAssistant from "../../components/VoiceAssistant";
import { useRole } from "../../hooks/useRole";
import { TUTORIAL_CATEGORIES } from "../../config/teacherModules";

const ACCENT      = "#1CA363";
const GRADIENT    = "linear-gradient(135deg, #22C55E 0%, #1CA363 100%)";
const ACCENT_LIGHT = "#E8F7F0";

const LEVEL_COLORS = {
  Beginner:     { bg: "#E8F7F0", text: "#1CA363" },
  Intermediate: { bg: "#FFF7ED", text: "#C2410C" },
  Advanced:     { bg: "#EEF2FF", text: "#4338CA" },
};

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

function TutorialCard({ tutorial }) {
  const level = LEVEL_COLORS[tutorial.level] ?? LEVEL_COLORS.Beginner;
  const isVideo = tutorial.type === "Video";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-page p-5 transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide"
          style={{ background: level.bg, color: level.text }}
        >
          {tutorial.level}
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide text-ink-4">
          {isVideo ? <Play size={10} /> : <FileText size={10} />}
          {tutorial.type}
        </span>
      </div>

      <h4 className="text-[15px] font-semibold leading-snug text-ink">
        {tutorial.title}
      </h4>
      <p className="flex-1 text-[13.5px] leading-relaxed text-ink-3">
        {tutorial.desc}
      </p>

      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="flex items-center gap-1 font-mono text-[12px] text-ink-4">
          <Clock size={12} />
          {tutorial.duration}
        </span>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: GRADIENT }}
          aria-label={`${isVideo ? "Watch" : "Read"}: ${tutorial.title}`}
        >
          {isVideo ? "Watch" : "Read"}
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

export default function TutorialsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRoleId, selectRole } = useRole();
  const [authModal, setAuthModal] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (activeRoleId !== "teacher") selectRole("teacher");
  }, [activeRoleId, selectRole]);

  useEffect(() => {
    document.title = "Tutorials — Classess.com® Teacher";

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

  const filteredCategories = TUTORIAL_CATEGORIES.map((cat) => ({
    ...cat,
    tutorials: lq
      ? cat.tutorials.filter(
          (t) =>
            t.title.toLowerCase().includes(lq) ||
            t.desc.toLowerCase().includes(lq) ||
            t.level.toLowerCase().includes(lq) ||
            t.type.toLowerCase().includes(lq)
        )
      : cat.tutorials,
  })).filter((cat) => cat.tutorials.length > 0);

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
              Teacher Home
            </button>
            <ChevronRight size={14} />
            <span className="font-medium text-ink-3">Tutorials</span>
          </nav>

          {/* Hero */}
          <motion.header {...fadeUp} className="mt-6 max-w-3xl">
            <h1 className="text-3xl font-serif font-medium leading-tight tracking-tight text-ink md:text-5xl">
              Learn Classess.com® one teaching task at a time.
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-3">
              Follow short, practical tutorials for planning lessons, creating resources, assessing students, providing feedback, reviewing insights, and supporting improvement.
            </p>
          </motion.header>

          {/* Search */}
          <motion.div {...fadeUp} className="mt-8 max-w-lg">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-4"
              />
              <input
                type="search"
                placeholder="Search teacher tutorials"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-line bg-paper py-3 pl-10 pr-4 text-[15px] text-ink outline-none transition placeholder:text-ink-4 focus:border-[#1CA363] focus:ring-2 focus:ring-[#1CA36320]"
              />
            </div>
          </motion.div>

          {/* Tutorial categories */}
          {filteredCategories.length === 0 ? (
            <motion.p {...fadeUp} className="mt-16 text-[15px] text-ink-3">
              No tutorials found for "{query}". Try a different search term.
            </motion.p>
          ) : (
            filteredCategories.map((cat) => (
              <motion.section
                {...fadeUp}
                key={cat.id}
                id={cat.id}
                className="mt-16 scroll-mt-24"
              >
                <h2 className="mb-6 text-2xl font-serif font-medium tracking-tight text-ink md:text-3xl">
                  {cat.label}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.tutorials.map((tutorial) => (
                    <TutorialCard key={tutorial.title} tutorial={tutorial} />
                  ))}
                </div>
              </motion.section>
            ))
          )}

          {/* Final CTA */}
          <motion.section
            {...fadeUp}
            className="mt-20 overflow-hidden rounded-3xl border border-line p-8 md:p-12"
            style={{ background: ACCENT_LIGHT }}
          >
            <h2 className="max-w-2xl text-2xl font-serif font-medium leading-tight tracking-tight text-ink md:text-3xl">
              Ready to put it into practice?
            </h2>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setAuthModal({ mode: "signup", pos: null })}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: GRADIENT }}
              >
                Start as a Teacher
                <ArrowRight size={17} />
              </button>
              <button
                onClick={goHome}
                className="inline-flex items-center justify-center rounded-xl border border-line-2 bg-page px-6 py-3 text-[15px] font-semibold text-ink-2 transition-colors hover:bg-paper"
              >
                Back to Teacher Home
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
              Back to Teacher Home
            </button>
          </div>
        </main>

      </div>

      <AuthModal
        open={authOpen}
        mode={authModal?.mode ?? "signin"}
        position={authModal?.pos ?? null}
        initialRoleId="teacher"
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
