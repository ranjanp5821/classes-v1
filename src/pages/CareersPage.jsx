import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Code2,
  Palette,
  BookOpen,
  TrendingUp,
  Settings,
  ChevronRight,
  MapPin,
  Clock,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Lightbulb,
  Target,
  Brain,
  Network,
  FlaskConical,
  FileText,
  Upload,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import Footer from "../components/Footer";
import { useRole } from "../hooks/useRole";

const GRADIENT = "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)";
const ACCENT   = "#1e3a5f";

const fadeUp = {
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

/* ── Section data ── */

const WORK_CARDS = [
  {
    icon: Code2,
    title: "Real products",
    body:  "Work on live products, actual user needs, and practical education challenges rather than only internal exercises.",
  },
  {
    icon: Users,
    title: "Cross-functional learning",
    body:  "Collaborate across product, technology, academic, design, sales, operations, and implementation teams.",
  },
  {
    icon: TrendingUp,
    title: "Early responsibility",
    body:  "People who demonstrate ability, consistency, and ownership can receive meaningful responsibility early.",
  },
  {
    icon: Target,
    title: "Visible contribution",
    body:  "Understand how your work contributes to the product, user experience, adoption, or academic outcome.",
  },
];

const PRINCIPLES = [
  {
    n: 1,
    title: "Think from first principles",
    body:  "Understand the problem before reaching for an existing solution.",
  },
  {
    n: 2,
    title: "Take ownership",
    body:  "Follow work through from understanding the requirement to completing, reviewing, and improving it.",
  },
  {
    n: 3,
    title: "Communicate early",
    body:  "Share progress, risks, mistakes, and support needs before they become larger problems.",
  },
  {
    n: 4,
    title: "Learn continuously",
    body:  "Be open to feedback, new tools, changing responsibilities, and unfamiliar challenges.",
  },
  {
    n: 5,
    title: "Work with discipline",
    body:  "Consistency, reliability, documentation, and follow-through matter.",
  },
  {
    n: 6,
    title: "Respect the mission",
    body:  "Student safety, academic accuracy, privacy, and responsible AI are part of everyone's work.",
  },
];

const CAREER_AREAS = [
  {
    icon: Code2,
    color: "#1d4ed8",
    bg:    "#eff6ff",
    title: "Technology & Engineering",
    body:  "Build scalable, secure, intelligent products across web, mobile, backend, cloud, data, AI, machine learning, quality assurance, and platform infrastructure.",
    roles: ["Software Engineering", "AI & Machine Learning", "Data", "DevOps", "Quality Assurance", "Security"],
  },
  {
    icon: Palette,
    color: "#7c3aed",
    bg:    "#f5f3ff",
    title: "Product, Design & Research",
    body:  "Understand user needs, shape product direction, simplify complex workflows, and create clear experiences for students, teachers, and institutions.",
    roles: ["Product Management", "UI/UX Design", "Product Research", "Business Analysis", "Product Operations"],
  },
  {
    icon: BookOpen,
    color: "#0f766e",
    bg:    "#f0fdfa",
    title: "Academic & Learning Solutions",
    body:  "Help ensure that products, learning experiences, assessments, content, and academic workflows remain meaningful and educationally sound.",
    roles: ["Academic Specialists", "Curriculum Experts", "Assessment Designers", "Content Reviewers", "Teacher Enablement"],
  },
  {
    icon: TrendingUp,
    color: "#b45309",
    bg:    "#fffbeb",
    title: "Business, Growth & Partnerships",
    body:  "Build institutional relationships, communicate product value, support market development, create partnerships, and help Classess® reach more education organisations.",
    roles: ["Business Development", "Institutional Sales", "Digital Marketing", "Partnerships", "Product Evangelism"],
  },
  {
    icon: Settings,
    color: "#be185d",
    bg:    "#fdf2f8",
    title: "People, Finance & Operations",
    body:  "Support the systems, teams, processes, financial discipline, and operational execution required to build and scale the organisation.",
    roles: ["Human Resources", "Finance", "Administration", "Operations", "Customer and Implementation Support"],
  },
];

const HIRING_STEPS = [
  {
    n: 1,
    title: "Application review",
    body:  "The team reviews the candidate's profile, experience, skills, portfolio, and relevance to the role.",
  },
  {
    n: 2,
    title: "Initial conversation",
    body:  "A short discussion helps us understand the candidate's interests, communication, availability, expectations, and role alignment.",
  },
  {
    n: 3,
    title: "Skills or practical evaluation",
    body:  "Depending on the role, candidates may complete a technical discussion, portfolio review, case exercise, presentation, assignment, or practical task.",
  },
  {
    n: 4,
    title: "Role and culture discussion",
    body:  "The candidate meets relevant team members or leadership to discuss responsibilities, working style, learning ability, ownership, and long-term alignment.",
  },
  {
    n: 5,
    title: "Final decision",
    body:  "Selected candidates receive written details covering the role, compensation, location, working arrangement, joining date, and applicable terms.",
  },
];

const WORK_INFO = [
  {
    icon: MapPin,
    title: "Work location",
    body:  "Many roles are based in Hyderabad and may require working from the office. The exact location and work arrangement will be mentioned in each job description.",
  },
  {
    icon: Clock,
    title: "Working schedule",
    body:  "Working days and timings depend on the role, team, and employment terms. Candidates should review the specific role description before applying.",
  },
  {
    icon: Brain,
    title: "Learning environment",
    body:  "Team members may work across functions, tools, and responsibilities as products and priorities evolve.",
  },
  {
    icon: TrendingUp,
    title: "Performance and growth",
    body:  "Growth is based on contribution, consistency, role readiness, business requirements, and the ability to take greater responsibility.",
  },
  {
    icon: ShieldCheck,
    title: "Professional expectations",
    body:  "Confidentiality, responsible data handling, documentation, timely communication, and proper handover are important parts of the working relationship.",
  },
];

const FAQS_VISIBLE = [
  {
    q: "Can I apply if there is no suitable opening?",
    a: "Yes. You can submit your profile under \"Future Opportunity.\" The recruitment team may review it when a relevant role becomes available.",
  },
  {
    q: "Are internships full-time?",
    a: "Most Classess® internships are designed as full-time, hands-on programmes. The exact working days, timings, duration, and location will be mentioned in the internship description or offer communication.",
  },
  {
    q: "Does an internship guarantee a full-time role?",
    a: "No. A full-time opportunity depends on performance, professional conduct, role availability, business requirements, and successful completion of the evaluation process.",
  },
  {
    q: "Can students from different academic backgrounds apply?",
    a: "Yes. Eligibility depends on the role. Opportunities may be available across technology, product, academic, business, marketing, sales, HR, finance, operations, and related fields.",
  },
  {
    q: "Is remote work available?",
    a: "The working arrangement depends on the role. Many positions may require working from the office in Hyderabad. Candidates should refer to the specific job description.",
  },
  {
    q: "What should I include with my application?",
    a: "Include an updated resume and, where relevant, a portfolio, GitHub profile, project link, presentation, writing sample, case study, or other evidence of your work.",
  },
];

const FAQS_HIDDEN = [
  {
    q: "How long does the hiring process take?",
    a: "The timeline depends on the role, number of applicants, evaluation requirements, and team availability. Selected candidates will receive updates as the process progresses.",
  },
  {
    q: "Will I receive feedback if I am not selected?",
    a: "Where possible, the team may provide feedback, particularly after a detailed assessment or internship review. Feedback cannot be guaranteed for every application.",
  },
  {
    q: "Can I apply for more than one role?",
    a: "Yes, but candidates should apply only for roles that genuinely match their skills, interests, and experience.",
  },
  {
    q: "Does Classess® charge candidates any recruitment fee?",
    a: "No. Classess® does not charge candidates a fee to apply, attend an interview, or receive an employment offer.",
  },
];

/* ── FAQ item ── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line last:border-0">
      <button
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-[15px] font-semibold text-ink">{q}</span>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[18px] font-light leading-none select-none transition-colors duration-200"
          style={
            open
              ? { background: ACCENT, color: "#fff" }
              : { background: "#dbeafe", color: ACCENT }
          }
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p className="pb-5 text-[15px] leading-relaxed text-ink-3">{a}</p>
      )}
    </div>
  );
}

/* ── Page ── */
export default function CareersPage() {
  const navigate  = useNavigate();
  const { selectRole } = useRole();
  const [authModal, setAuthModal] = useState(null);
  const authOpen = authModal !== null;
  const [showMoreFaqs, setShowMoreFaqs] = useState(false);

  const openingsRef = useRef(null);
  const internshipRef = useRef(null);
  const applyRef = useRef(null);

  useEffect(() => {
    const prev = document.title;
    document.title = "Careers — Classess";
    window.scrollTo({ top: 0 });
    return () => { document.title = prev; };
  }, []);

  const scrollTo = (ref) => {
    if (!ref.current) return;
    const top = ref.current.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const openSignup = () => setAuthModal({ mode: "signup", pos: null });

  return (
    <div className="min-h-screen bg-page">
      <div
        className="transition-[filter] duration-200"
        style={authOpen ? { filter: "blur(4px)" } : undefined}
        aria-hidden={authOpen}
      >
        <Navbar onOpenAuth={(mode, pos) => setAuthModal({ mode, pos })} />

        {/* ════════════════════════════════════════════════════════
            S1 — Careers Hero
        ════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-40 right-[-8%] h-[480px] w-[480px] rounded-full opacity-[0.07] blur-3xl"
            style={{ background: GRADIENT }}
          />
          <div className="mx-auto max-w-5xl px-6 pt-28 pb-20 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <h1 className="text-4xl font-serif font-medium leading-[1.08] tracking-tight text-ink md:text-[58px]">
                Build technology that helps education work better.
              </h1>
              <p className="mt-6 w-full text-[17px] leading-relaxed text-ink-3 md:text-[18px]">
                Classess® brings together education, academic intelligence, responsible AI, product
                thinking, and real-world implementation.
              </p>
              <p className="mt-4 w-full text-[17px] leading-relaxed text-ink-3 md:text-[18px]">
                We are looking for people who want to solve meaningful problems, learn quickly, take
                ownership, and help build products that support students, teachers, and institutions.
              </p>
              <p className="mt-5 text-[15px] text-ink-4 italic">
                Build from first principles. Learn through real responsibility. Create meaningful impact.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => scrollTo(openingsRef)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: GRADIENT }}
                >
                  View Open Positions <ArrowRight size={17} />
                </button>
                <button
                  onClick={() => scrollTo(internshipRef)}
                  className="inline-flex items-center justify-center rounded-xl border border-line-2 bg-page px-6 py-3 text-[15px] font-semibold text-ink-2 transition-colors hover:bg-paper"
                >
                  Explore Internships
                </button>
              </div>
            </motion.div>

            {/* Media placeholder — CAREERS-M01 */}
            <motion.div
              {...fadeUp}
              className="mt-14 flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper md:min-h-[340px]"
            >
              <div className="text-center">
                <Users size={36} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media CAREERS-M01
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Short team-and-product brand video
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S2 — Why Work at Classess®
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#2563eb" }}>
                Why we work here
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Work on problems that matter.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                Education has many disconnected systems, repetitive workflows, incomplete insights, and
                learning needs that remain unidentified.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-3">
                At Classess®, teams work on products that help:
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {[
                  "Students learn with greater clarity",
                  "Teachers reduce repetitive academic work",
                  "Institutions understand learning more deeply",
                  "Education systems use AI responsibly",
                  "Academic information become more useful and actionable",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-ink-2">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: ACCENT }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[16px] font-semibold text-ink">
                What makes the work different
              </p>
            </motion.div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {WORK_CARDS.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.07 }}
                    className="rounded-2xl border border-line bg-page p-7 transition-colors hover:border-line-2"
                  >
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white"
                      style={{ background: GRADIENT }}
                    >
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-5 text-[18px] font-semibold text-ink">{card.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-3">{card.body}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              {...fadeUp}
              className="mt-8 rounded-2xl border border-line-2 bg-page px-7 py-5"
              style={{ borderLeft: `3px solid ${ACCENT}` }}
            >
              <p className="text-[15px] leading-relaxed text-ink-2">
                Your role is not limited to completing tasks. It is about helping the product move forward.
              </p>
            </motion.div>

            {/* Media placeholder — CAREERS-M02 */}
            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-page"
            >
              <div className="text-center">
                <TrendingUp size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media CAREERS-M02
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Contribution-to-impact animation
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S3 — How We Work
        ════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#2563eb" }}>
                How we work
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Ownership matters more than job titles.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                Classess® is a growing product company. Priorities can move quickly, responsibilities
                can expand, and teams may work across functions to solve an important problem.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-3">
                We value people who communicate clearly, ask useful questions, learn independently,
                and take responsibility for outcomes.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PRINCIPLES.map((p, i) => (
                <motion.div
                  key={p.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                  className="rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-line-2"
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-bold text-white"
                    style={{ background: GRADIENT }}
                  >
                    {p.n}
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-3">{p.body}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              {...fadeUp}
              className="mt-8 rounded-2xl border border-line-2 bg-paper px-7 py-5"
              style={{ borderLeft: `3px solid ${ACCENT}` }}
            >
              <p className="text-[15px] leading-relaxed text-ink-2">
                We value learning ability, ownership, consistency, discipline, communication,
                collaboration, and contribution.
              </p>
            </motion.div>

            {/* Media placeholder — CAREERS-M03 */}
            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper"
            >
              <div className="text-center">
                <FlaskConical size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media CAREERS-M03
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Six-principle animated framework
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S4 — Teams and Career Areas
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#2563eb" }}>
                Career areas
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Find where you can contribute.
              </h2>
            </motion.div>

            <div className="mt-10 flex flex-col gap-4">
              {CAREER_AREAS.map((area, i) => {
                const Icon = area.icon;
                return (
                  <motion.div
                    key={area.title}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                    className="rounded-2xl border border-line bg-page p-7 transition-colors hover:border-line-2"
                  >
                    <div className="flex items-start gap-5">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: area.bg, color: area.color }}
                      >
                        <Icon size={20} />
                      </span>
                      <div className="flex-1">
                        <h3
                          className="text-[17px] font-semibold"
                          style={{ color: area.color }}
                        >
                          {area.title}
                        </h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-ink-3">{area.body}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {area.roles.map((role) => (
                            <span
                              key={role}
                              className="rounded-full px-3 py-1 text-[12px] font-medium"
                              style={{ background: area.bg, color: area.color }}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div {...fadeUp} className="mt-8">
              <button
                onClick={() => scrollTo(openingsRef)}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: GRADIENT }}
              >
                View Current Openings <ArrowRight size={17} />
              </button>
            </motion.div>

            {/* Media placeholder — CAREERS-M04 */}
            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper"
            >
              <div className="text-center">
                <Network size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media CAREERS-M04
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Five illustrated career-category cards
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S5 — Internship and Early-Career Pathway
        ════════════════════════════════════════════════════════ */}
        <section ref={internshipRef} className="py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#2563eb" }}>
                Internships and early careers
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Begin with real work — not simulated experience.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                Classess® internships are designed for students and recent graduates who want
                hands-on exposure to live products, business challenges, and cross-functional teams.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-3">
                Interns are expected to participate as active team members, learn quickly,
                communicate consistently, and take responsibility for assigned work.
              </p>
            </motion.div>

            {/* Media placeholder — CAREERS-M05 */}
            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[160px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper"
            >
              <div className="text-center">
                <GraduationCap size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media CAREERS-M05
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  3+3 internship pathway animation
                </p>
              </div>
            </motion.div>

            <motion.div {...fadeUp} className="mt-10">
              <p className="text-[17px] font-semibold text-ink">The 3+3 internship pathway</p>
            </motion.div>

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-stretch">
              {[
                {
                  label: "First three months",
                  body: "Full-time, hands-on learning through live projects, structured reporting, team reviews, practical assignments, and regular feedback.",
                  tags: ["Learning ability", "Ownership", "Consistency", "Discipline", "Communication", "Collaboration", "Problem-solving", "Contribution"],
                },
                {
                  label: "Three-month review",
                  body: "High-performing interns may be considered for an immediate full-time opportunity where a suitable role is available. Other interns may be offered an additional three months to strengthen their skills, contribution, and readiness.",
                  tags: [],
                },
                {
                  label: "Possible full-time opportunity",
                  body: "A pre-placement or full-time offer depends on performance, role availability, business requirements, professional conduct, and successful completion of the evaluation process.",
                  tags: [],
                  note: "An internship does not guarantee a full-time offer.",
                },
              ].map((stage, i) => (
                <motion.div
                  key={stage.label}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                  className="flex flex-1 flex-col rounded-2xl border border-line bg-paper p-7"
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-bold text-white"
                    style={{ background: GRADIENT }}
                  >
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-[16px] font-semibold text-ink">{stage.label}</h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-3">{stage.body}</p>
                  {stage.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {stage.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                          style={{ background: "#dbeafe", color: ACCENT }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {stage.note && (
                    <p className="mt-4 text-[12.5px] italic text-ink-4">{stage.note}</p>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div {...fadeUp} className="mt-10">
              <p className="text-[17px] font-semibold text-ink">Who should apply</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {[
                  "Students and recent graduates ready for full-time participation",
                  "Candidates interested in learning through practical responsibility",
                  "People who can work consistently and communicate clearly",
                  "Candidates willing to receive and act on feedback",
                  "People interested in technology, education, product, business, or operations",
                  "Candidates who can commit to the stated work location, schedule, and duration",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-ink-2">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fadeUp} className="mt-8">
              <button
                onClick={() => scrollTo(applyRef)}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: GRADIENT }}
              >
                Explore Internship Opportunities <ArrowRight size={17} />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S6 — Current Openings
        ════════════════════════════════════════════════════════ */}
        <section ref={openingsRef} className="bg-paper py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#2563eb" }}>
                Open roles
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Current opportunities
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-3">
                Explore open roles and find an opportunity that matches your skills, interests,
                experience, and career stage.
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              {...fadeUp}
              className="mt-8 flex flex-wrap gap-3"
            >
              {["Department", "Role Type", "Experience Level", "Work Location", "Employment Type"].map((filter) => (
                <button
                  key={filter}
                  className="rounded-full border border-line px-4 py-2 text-[13px] font-medium text-ink-3 transition-colors hover:border-line-2 hover:text-ink"
                >
                  {filter}
                </button>
              ))}
            </motion.div>

            {/* Empty state */}
            <motion.div
              {...fadeUp}
              className="mt-8 rounded-2xl border border-dashed border-line-2 bg-page px-8 py-14 text-center"
            >
              <Briefcase size={36} className="mx-auto text-ink-4" />
              <p className="mt-4 text-[16px] font-semibold text-ink">
                No matching role is open right now.
              </p>
              <p className="mx-auto mt-3 max-w-sm text-[14.5px] leading-relaxed text-ink-3">
                You may submit your profile for future opportunities, and our team can review it when
                a relevant position becomes available.
              </p>
              <button
                onClick={() => scrollTo(applyRef)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: GRADIENT }}
              >
                Submit Your Profile <ArrowRight size={17} />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S7 — Hiring Process
        ════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#2563eb" }}>
                Hiring process
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                A clear and practical hiring process.
              </h2>
            </motion.div>

            {/* Media placeholder — CAREERS-M06 */}
            <motion.div
              {...fadeUp}
              className="mt-8 flex min-h-[140px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper"
            >
              <div className="text-center">
                <Network size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media CAREERS-M06
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Five-step hiring-process animation
                </p>
              </div>
            </motion.div>

            <div className="mt-10 flex flex-col gap-3">
              {HIRING_STEPS.map((step, i) => (
                <motion.div
                  key={step.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                  className="flex items-start gap-5 rounded-2xl border border-line bg-paper px-6 py-5 transition-colors hover:border-line-2"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold text-white"
                    style={{ background: GRADIENT }}
                  >
                    {step.n}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-ink-3">{step.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div {...fadeUp} className="mt-6">
              <p className="text-[14.5px] text-ink-4">
                The exact process may vary according to the role and experience level.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="mt-6 rounded-2xl border border-line-2 bg-paper px-7 py-5"
              style={{ borderLeft: `3px solid ${ACCENT}` }}
            >
              <p className="text-[15px] leading-relaxed text-ink-2">
                We look for demonstrated ability, learning potential, professional conduct, and
                genuine role interest.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S8 — Working at Classess®
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#2563eb" }}>
                Working at Classess®
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                What candidates should know.
              </h2>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {WORK_INFO.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                    className="flex items-start gap-4 rounded-2xl border border-line bg-page p-6 transition-colors hover:border-line-2"
                  >
                    <span
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: "#dbeafe", color: ACCENT }}
                    >
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-ink">{card.title}</p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-3">{card.body}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S9 — Candidate Application
        ════════════════════════════════════════════════════════ */}
        <section ref={applyRef} className="py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#2563eb" }}>
                Apply now
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Ready to contribute?
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-3">
                Apply for an open role or share your profile for future opportunities.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="mt-10 rounded-2xl border border-line bg-paper p-8 md:p-10"
            >
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">

                {/* Application type */}
                <div>
                  <label className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                    Application type
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {["Full-Time Role", "Internship", "Future Opportunity"].map((opt) => (
                      <label key={opt} className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-[14px] text-ink-2 transition-colors hover:border-line-2">
                        <input type="radio" name="appType" value={opt} className="accent-[#1e3a5f]" />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Role applied for */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                      Role applied for
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer"
                      className="w-full rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-ink placeholder:text-ink-4 focus:border-line-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                      Full name
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-ink placeholder:text-ink-4 focus:border-line-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                      Email address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-ink placeholder:text-ink-4 focus:border-line-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-ink placeholder:text-ink-4 focus:border-line-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                      Current city
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad"
                      className="w-full rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-ink placeholder:text-ink-4 focus:border-line-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                      Highest qualification
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-ink placeholder:text-ink-4 focus:border-line-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                      Current organisation or institution
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. XYZ University"
                      className="w-full rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-ink placeholder:text-ink-4 focus:border-line-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                      Years of experience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2 years / Fresher"
                      className="w-full rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-ink placeholder:text-ink-4 focus:border-line-2 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Preferred career area */}
                <div>
                  <label className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                    Preferred career area
                  </label>
                  <select className="w-full rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-ink focus:border-line-2 focus:outline-none">
                    <option value="">Select a career area</option>
                    <option>Technology &amp; Engineering</option>
                    <option>Product, Design &amp; Research</option>
                    <option>Academic &amp; Learning Solutions</option>
                    <option>Business, Growth &amp; Partnerships</option>
                    <option>People, Finance &amp; Operations</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                      LinkedIn profile
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/yourname"
                      className="w-full rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-ink placeholder:text-ink-4 focus:border-line-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                      Portfolio, GitHub, or work-sample link
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/yourname"
                      className="w-full rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-ink placeholder:text-ink-4 focus:border-line-2 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Resume upload */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                    Resume upload
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line-2 bg-page px-5 py-4 transition-colors hover:bg-paper">
                    <Upload size={18} className="text-ink-4" />
                    <span className="text-[14px] text-ink-3">
                      Click to upload your resume (PDF or DOCX, max 5 MB)
                    </span>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
                  </label>
                </div>

                {/* Why interested */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                    Why are you interested in Classess®?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what draws you to Classess® and what you hope to contribute."
                    className="w-full resize-none rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-ink placeholder:text-ink-4 focus:border-line-2 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                      When can you join?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Immediately / 30 days notice"
                      className="w-full rounded-xl border border-line bg-page px-4 py-3 text-[15px] text-ink placeholder:text-ink-4 focus:border-line-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                      Available to work from stated location?
                    </label>
                    <div className="flex gap-4 pt-3">
                      {["Yes", "No"].map((opt) => (
                        <label key={opt} className="flex cursor-pointer items-center gap-2 text-[14px] text-ink-2">
                          <input type="radio" name="location" value={opt} className="accent-[#1e3a5f]" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Consent */}
                <label className="flex cursor-pointer items-start gap-3 text-[13.5px] text-ink-3">
                  <input type="checkbox" className="mt-0.5 accent-[#1e3a5f]" />
                  I confirm that the information submitted is accurate and consent to Classess®
                  using it for recruitment and related communication.
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 self-start rounded-xl px-8 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: GRADIENT }}
                >
                  Submit Application <ArrowRight size={17} />
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S10 — FAQs
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#2563eb" }}>
                Questions
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <motion.div {...fadeUp} className="mt-8 rounded-2xl border border-line bg-page px-7">
              {FAQS_VISIBLE.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
              {showMoreFaqs && FAQS_HIDDEN.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </motion.div>

            {!showMoreFaqs && (
              <motion.div {...fadeUp} className="mt-6 text-center">
                <button
                  onClick={() => setShowMoreFaqs(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-line-2 px-6 py-3 text-[14px] font-medium text-ink-2 transition-colors hover:bg-paper"
                >
                  View More Questions
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S11 — Final CTA
        ════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div
              {...fadeUp}
              className="relative overflow-hidden rounded-3xl px-8 py-16 text-center md:px-14"
              style={{ background: GRADIENT }}
            >
              {/* Background media placeholder — CAREERS-M07 */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
                <Network size={280} color="#fff" />
              </div>

              <p className="relative font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#93c5fd" }}>
                Join the team
              </p>
              <h2 className="relative mx-auto mt-3 max-w-2xl text-3xl font-serif font-medium leading-tight tracking-tight text-white md:text-4xl">
                Build something that can improve how people learn and teach.
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/80">
                Bring your skills, curiosity, discipline, and ambition to a team working on
                meaningful education challenges.
              </p>
              <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => scrollTo(openingsRef)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold transition-transform hover:scale-[1.02]"
                  style={{ color: ACCENT }}
                >
                  View Open Positions <ArrowRight size={17} />
                </button>
                <button
                  onClick={() => scrollTo(applyRef)}
                  className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Apply for an Internship
                </button>
              </div>
              <p className="relative mt-8 text-[13px] text-white/60">
                Come ready to learn. Stay ready to contribute.
              </p>
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
