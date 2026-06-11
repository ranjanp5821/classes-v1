import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  BookOpen,
  Cpu,
  Users,
  ChevronDown,
  CheckCircle2,
  Network,
  Building2,
  Star,
} from "lucide-react";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import Footer from "../components/Footer";
import { useRole } from "../hooks/useRole";

const GRADIENT = "linear-gradient(135deg, #0f766e 0%, #0369a1 100%)";
const ACCENT   = "#0f766e";

const fadeUp = {
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

/* ── Data ── */

const MODELS = [
  {
    id: "growth",
    icon: TrendingUp,
    title: "Strategic Growth Partners",
    copy: "Develop markets, build institutional relationships, support adoption, and grow Classess® within an agreed region or segment.",
    cta: "Explore Growth Partnership",
    color: "#0f766e",
    bg: "#f0fdfa",
  },
  {
    id: "academic",
    icon: BookOpen,
    title: "Academic & Content Partners",
    copy: "Combine academic expertise, publishing, curriculum, training, or educational services with the Classess® platform.",
    cta: "Explore Academic Partnership",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    id: "affiliate",
    icon: Users,
    title: "Affiliate & Referral Partners",
    copy: "Introduce qualified institutions and education organisations to Classess® and earn performance-linked commissions.",
    cta: "Join the Affiliate Program",
    color: "#b45309",
    bg: "#fffbeb",
  },
  {
    id: "technology",
    icon: Cpu,
    title: "Technology & Integration Partners",
    copy: "Connect platforms, data, content, applications, and institutional systems with the Classess® ecosystem.",
    cta: "Explore Technology Partnership",
    color: "#0369a1",
    bg: "#eff6ff",
  },
];

const GROWTH_WHO = [
  "Education business leaders",
  "Regional education consultants",
  "Institutional sales organisations",
  "School and college solution providers",
  "Market-development professionals",
  "Education franchise or distribution networks",
  "Organisations with strong school, college, or government relationships",
];
const GROWTH_VALUE = [
  "Introduce Classess® to qualified institutions",
  "Develop local market opportunities",
  "Coordinate demonstrations and leadership discussions",
  "Support commercial negotiations",
  "Assist with local adoption and stakeholder engagement",
  "Build long-term regional or segment growth",
  "Share market insight with the Classess® team",
];
const GROWTH_SUPPORT = [
  "Product and solution training",
  "Demonstration support",
  "Sales and marketing material",
  "Proposal and commercial support",
  "Product documentation",
  "Implementation coordination",
  "Partner performance visibility",
  "Ongoing product and market updates",
];

const ACADEMIC_CONSULTANT = [
  "Academic audits",
  "Curriculum planning",
  "Teacher training",
  "Assessment frameworks",
  "School improvement programmes",
  "Classess® academic intelligence",
  "Learning-gap and progress visibility",
];
const PUBLISHER_BUNDLE = [
  "Digital learning support",
  "Chapter-level practice",
  "Assessments and quizzes",
  "AI-supported explanations",
  "Teacher resources",
  "Student progress visibility",
  "Revision and examination preparation",
];
const CONTENT_TYPES = [
  "Digital lessons", "Videos", "Interactive content",
  "Question banks", "Worksheets", "Assessments",
  "Teacher guides", "Examination preparation material",
];

const TECH_PARTNERS = [
  "Learning Management Systems", "Student Information Systems", "ERP platforms",
  "Assessment platforms", "Content platforms", "Communication systems",
  "Video and virtual-classroom providers", "Identity and authentication providers",
  "AI and educational technology providers",
];
const TECH_MODELS = [
  "API-based integration", "MCP-based tool and data connectivity",
  "Single sign-on", "Embedded Classess® capabilities",
  "Joint product offerings", "Shared institutional implementation",
  "Content and data interoperability", "Marketplace listing",
];

const AFFILIATE_WHO = [
  {
    title: "Educators and School Leaders",
    desc:  "Professionals with trusted relationships across schools, colleges, education groups, and academic communities.",
  },
  {
    title: "Education Consultants",
    desc:  "Consultants already advising institutions on curriculum, technology, admissions, training, assessment, or school improvement.",
  },
  {
    title: "Sales and Business Professionals",
    desc:  "Professionals with experience in institutional relationships, business development, and education solutions.",
  },
  {
    title: "Community and Network Leaders",
    desc:  "Individuals connected to school associations, education networks, alumni communities, foundations, NGOs, or local leadership groups.",
  },
  {
    title: "Technology and Service Providers",
    desc:  "Companies already serving institutions through ERP, LMS, content, training, finance, communication, or related services.",
  },
  {
    title: "Content Creators and Education Influencers",
    desc:  "Individuals with a relevant and credible audience among educators, parents, institutions, or education decision-makers.",
  },
];

const AFFILIATE_STEPS = [
  { n: 1, title: "Apply",                      copy: "Share your profile, network, geography, and the types of institutions you can reach." },
  { n: 2, title: "Get approved",               copy: "Eligible applicants receive onboarding, programme guidance, referral terms, and approved promotional material." },
  { n: 3, title: "Submit a qualified referral", copy: "Introduce an institution or submit a verified opportunity through the approved referral process." },
  { n: 4, title: "Classess® engages",          copy: "The Classess® team supports demonstrations, product discussions, proposals, and commercial follow-up." },
  { n: 5, title: "Track progress",             copy: "Approved partners receive visibility into the status of eligible referrals according to the programme process." },
  { n: 6, title: "Receive commission",         copy: "When an eligible referral converts and the applicable customer payment is received, the partner earns the agreed commission." },
];

const VALUE_CARDS = [
  { title: "A growing education ecosystem",    copy: "Participate in an expanding ecosystem covering academic intelligence, student learning, teacher support, institutional operations, communication, admissions, finance, and content." },
  { title: "Multiple ways to create value",    copy: "Build markets, strengthen services, bundle content, integrate technology, or introduce qualified customers." },
  { title: "Product and team support",         copy: "Receive appropriate training, demonstrations, content, documentation, and commercial support according to the partnership model." },
  { title: "Long-term opportunity",            copy: "Build recurring institutional relationships rather than depending only on one-time transactions." },
  { title: "Education with measurable purpose", copy: "Support a platform designed to help students learn better, teachers work more effectively, and institutions make stronger academic decisions." },
  { title: "Transparent partnership structure", copy: "Operate through defined responsibilities, approved opportunities, commercial terms, and partner agreements." },
];

const FAQS_INITIAL = [
  { q: "Is there a fee to become a Classess® partner?",       a: "The Affiliate & Referral Program does not require an upfront franchise, inventory, or product investment. Other partnership models may involve agreed responsibilities, implementation costs, resource commitments, or commercial terms depending on the nature of the partnership." },
  { q: "Is affiliate income guaranteed?",                     a: "No. Earnings depend on qualified referrals, successful customer conversions, contract value, receipt of customer payments, programme rules, and the applicable partner agreement." },
  { q: "When is an affiliate commission payable?",            a: "Commission becomes payable only when the referral meets the programme eligibility requirements, converts into an approved customer, and the applicable customer payment has been received." },
  { q: "Can academic consultants bundle Classess® with their services?", a: "Yes. Approved consultants may combine Classess® with curriculum, teacher-development, assessment, academic-transformation, or school-improvement services under an agreed partnership structure." },
  { q: "Can publishers bundle Classess® with books?",         a: "Yes. Publishers may create approved packages that combine printed or digital books with learning support, practice, assessments, teacher resources, and student-progress visibility." },
  { q: "Can a technology company integrate with Classess®?",  a: "Yes. Technology partnerships may include APIs, MCP-based connectivity, single sign-on, embedded capabilities, data exchange, joint implementation, or co-selling, subject to technical review and an approved agreement." },
];
const FAQS_HIDDEN = [
  { q: "Can I work in a specific city, state, region, or country?", a: "Territory and market arrangements depend on the partnership model, existing partner coverage, opportunity size, and the final agreement." },
  { q: "Will Classess® support demonstrations and proposals?", a: "Yes. The level of support depends on the partnership model and opportunity. It may include product training, demonstration support, proposal preparation, commercial discussions, and implementation coordination." },
  { q: "Can organisations join as affiliate partners?",        a: "Yes. Individuals, consultants, agencies, service providers, associations, and organisations may apply, subject to qualification and approval." },
  { q: "Can I promote Classess® publicly after joining?",     a: "Partners may use only approved Classess® messaging, logos, promotional materials, and claims according to the applicable brand and partner guidelines." },
];

/* ── Sub-components ── */

function BulletList({ items, color = ACCENT }) {
  return (
    <ul className="flex flex-col gap-2 mt-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[14.5px] text-ink-2">
          <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line last:border-0">
      <button
        className="flex w-full items-start justify-between gap-4 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-[15px] font-medium text-ink">{q}</span>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[18px] font-light leading-none select-none transition-colors duration-200"
          style={open
            ? { background: ACCENT, color: "#fff" }
            : { background: "#f0fdfa", color: ACCENT }
          }
        >
          {open ? "−" : "+"}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-[14.5px] leading-relaxed text-ink-3">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Page ── */

export default function PartnersPage() {
  const navigate = useNavigate();
  const { selectRole } = useRole();
  const [authModal, setAuthModal] = useState(null);
  const [activeModel, setActiveModel] = useState(null);
  const [showMoreFaq, setShowMoreFaq] = useState(false);
  const authOpen = authModal !== null;

  const applyRef = useRef(null);

  const sectionRefs = {
    growth:     useRef(null),
    academic:   useRef(null),
    technology: useRef(null),
    affiliate:  useRef(null),
  };

  const scrollToApply = () => {
    const el = applyRef.current;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const prev = document.title;
    document.title = "Partners — Classess";
    window.scrollTo({ top: 0 });
    return () => { document.title = prev; };
  }, []);

  const openSignup = () => setAuthModal({ mode: "signup", pos: null });

  const scrollToSection = (id) => {
    const el = sectionRefs[id]?.current;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setActiveModel(id);
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
          <div className="mx-auto max-w-5xl px-6 pt-28 pb-20 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <h1 className="mt-3 text-4xl font-serif font-medium leading-[1.08] tracking-tight text-ink md:text-[58px]">
                Build value. Expand impact. Grow with Classess®.
              </h1>
              <p className="mt-6 w-full text-[17px] leading-relaxed text-ink-3 md:text-[18px]">
                Classess® works with entrepreneurs, education leaders, academic experts, publishers,
                technology companies, consultants, and community connectors who want to bring better
                academic intelligence to more learners and institutions.
              </p>
              <p className="mt-4 w-full text-[17px] leading-relaxed text-ink-3 md:text-[18px]">
                Whether you want to build a market, strengthen your existing services, integrate your
                technology, or earn through trusted introductions, there is a partnership model
                designed for you.
              </p>
              <p className="mt-5 text-[15px] font-medium" style={{ color: ACCENT }}>
                The strongest education ecosystems are built together.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={scrollToApply}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: GRADIENT }}
                >
                  Become a Partner <ArrowRight size={17} />
                </button>
                <button
                  onClick={() => scrollToSection("growth")}
                  className="inline-flex items-center justify-center rounded-xl border border-line-2 bg-page px-6 py-3 text-[15px] font-semibold text-ink-2 transition-colors hover:bg-paper"
                >
                  Explore Partnership Models
                </button>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="mt-14 flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper md:min-h-[340px]"
            >
              <div className="text-center">
                <Network size={36} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">
                  Media PARTNERS-M01
                </p>
                <p className="mt-1 text-[13px] text-ink-4">
                  Ecosystem partnership animation — four partner groups
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S2 — Partnership Model Selector
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                Partnership models
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Choose how you would like to partner.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-3">
                Each partnership model is designed around a different capability, network, or business opportunity.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {MODELS.map((m, i) => {
                const Icon = m.icon;
                const isActive = activeModel === m.id;
                return (
                  <motion.button
                    key={m.id}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.07 }}
                    onClick={() => scrollToSection(m.id)}
                    className="flex items-start gap-4 rounded-2xl border p-7 text-left transition-all duration-200 hover:shadow-md"
                    style={{
                      borderColor: isActive ? m.color : "var(--line)",
                      background: isActive ? m.bg : "var(--page)",
                    }}
                  >
                    <span
                      className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                      style={{ background: m.color }}
                    >
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="text-[16px] font-semibold text-ink">{m.title}</p>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-3">{m.copy}</p>
                      <p className="mt-3 text-[13.5px] font-medium" style={{ color: m.color }}>
                        {m.cta} →
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S3 — Strategic Growth Partners
        ════════════════════════════════════════════════════════ */}
        <section className="py-20" ref={sectionRefs.growth}>
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#0f766e" }}>
                Strategic Growth Partners
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Build the Classess® presence in your market.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                Strategic Growth Partners work closely with Classess® to identify opportunities, build
                institutional relationships, support demonstrations, coordinate adoption, and expand the
                platform within an agreed geography, segment, or education network.
              </p>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-3">
                This model is suitable for partners who understand education markets and can build
                long-term institutional relationships.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { heading: "Who this is for",        items: GROWTH_WHO,     color: "#0f766e" },
                { heading: "How partners create value", items: GROWTH_VALUE, color: "#0f766e" },
                { heading: "What Classess® provides", items: GROWTH_SUPPORT, color: "#0f766e" },
              ].map((col, i) => (
                <motion.div
                  key={col.heading}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.07 }}
                  className="rounded-2xl border border-line bg-paper p-6"
                >
                  <p className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: col.color }}>
                    {col.heading}
                  </p>
                  <BulletList items={col.items} color={col.color} />
                </motion.div>
              ))}
            </div>

            <motion.div
              {...fadeUp}
              className="mt-8 rounded-2xl px-8 py-6"
              style={{ background: "#f0fdfa", border: "1px solid #99f6e4" }}
            >
              <p className="text-[16px] font-semibold text-ink">
                Build a market — not merely a transaction.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="mt-6">
              <button
                onClick={scrollToApply}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: GRADIENT }}
              >
                Apply as a Strategic Growth Partner
              </button>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper"
            >
              <div className="text-center">
                <TrendingUp size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">Media PARTNERS-M03</p>
                <p className="mt-1 text-[13px] text-ink-4">Market-development journey animation</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S4 — Academic & Content Partners
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20" ref={sectionRefs.academic}>
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#7c3aed" }}>
                Academic & Content Partners
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Add academic intelligence to what you already provide.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                Academic and content partners can combine their expertise, services, curriculum, books,
                assessments, or learning material with Classess® to create a more complete and valuable
                education solution. The objective is not to replace the partner's existing work — it is to
                make that work more personalised, measurable, interactive, and outcome-oriented.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { heading: "For academic consultants", items: ACADEMIC_CONSULTANT, color: "#7c3aed", result: "The institution receives both expert guidance and a digital system that helps implement, monitor, and sustain the programme." },
                { heading: "For publishers",           items: PUBLISHER_BUNDLE,    color: "#7c3aed", result: "The publisher moves from selling a book to offering a more complete learning package." },
                { heading: "For content creators",     items: CONTENT_TYPES,       color: "#7c3aed", result: "Content providers can publish, organise, license, and deliver learning material through Classess® by curriculum, grade, subject, and topic." },
              ].map((col, i) => (
                <motion.div
                  key={col.heading}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.07 }}
                  className="flex flex-col rounded-2xl border border-line bg-page p-6"
                >
                  <p className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: col.color }}>
                    {col.heading}
                  </p>
                  <BulletList items={col.items} color={col.color} />
                  <p className="mt-4 rounded-xl p-3 text-[13px] leading-relaxed text-ink-2" style={{ background: "#f5f3ff" }}>
                    {col.result}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              {...fadeUp}
              className="mt-8 rounded-2xl px-8 py-6"
              style={{ background: "#f5f3ff", border: "1px solid #ddd6fe" }}
            >
              <p className="text-[16px] font-semibold text-ink">
                Your academic expertise. Our intelligence layer. A stronger learning solution.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="mt-6">
              <button
                onClick={scrollToApply}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea)" }}
              >
                Become an Academic or Content Partner
              </button>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper"
            >
              <div className="text-center">
                <BookOpen size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">Media PARTNERS-M04</p>
                <p className="mt-1 text-[13px] text-ink-4">Three-use-case academic partnership animation</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S5 — Affiliate & Referral Program
        ════════════════════════════════════════════════════════ */}
        <section className="py-20" ref={sectionRefs.affiliate}>
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#c2410c" }}>
                Classess® Affiliate & Referral Program
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Your network can become a meaningful growth opportunity.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                Introduce qualified schools, colleges, education groups, NGOs, CSR initiatives, districts,
                and education organisations to Classess®. When an approved referral becomes a successful
                customer, eligible partners receive performance-linked commissions according to the
                applicable affiliate or referral agreement.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="mt-8 rounded-2xl p-8"
              style={{ background: "linear-gradient(135deg, #fff7ed, #ffedd5)", border: "1px solid #fdba74" }}
            >
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: "#c2410c" }}>
                Your network is your net worth.
              </p>
              <p className="mt-3 text-[24px] font-serif font-semibold text-ink">
                Build the potential to earn ₹10 lakh or more in a quarter.
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-3">
                There is no requirement to build a product, maintain inventory, open a franchise location,
                or make an upfront product investment. Your role is to use your trusted network to create
                qualified introductions and support the opportunity where required.
              </p>
              <p className="mt-4 text-[12.5px] leading-relaxed text-ink-4">
                Earnings are not guaranteed. Actual commissions depend on qualified conversions, contract
                value, collection of customer payments, territory, participation, and the applicable partner
                agreement.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={scrollToApply}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #c2410c, #ea580c)" }}
              >
                Join the Affiliate Program <ArrowRight size={17} />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S6+S7 — Affiliate & Referral Partners + How It Works
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">

            {/* — Section header — */}
            <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#b45309" }}>
                  Affiliate & Referral Partners
                </p>
                <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                  You may already know the institutions we want to reach.
                </h2>
              </div>
              <p className="shrink-0 text-[15px] leading-relaxed text-ink-3 md:max-w-xs md:text-right">
                No franchise. No inventory. Just trusted introductions that convert.
              </p>
            </motion.div>

            {/* — Who can join — */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {AFFILIATE_WHO.map((item, i) => (
                <motion.div
                  key={item.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                  className="rounded-2xl border border-line bg-page p-6"
                >
                  <p className="text-[15px] font-semibold text-ink">{item.title}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* — Divider with "How it works" label — */}
            <motion.div {...fadeUp} className="mt-16 flex items-center gap-4">
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, #fcd34d, transparent)" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#b45309" }}>
                How it works
              </p>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to left, #fcd34d, transparent)" }} />
            </motion.div>

            <motion.div {...fadeUp} className="mt-5 text-center">
              <h3 className="text-2xl font-serif font-medium tracking-tight text-ink md:text-3xl">
                Introduce. Track. Convert. Earn.
              </h3>
            </motion.div>

            {/* — Steps grid — */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {AFFILIATE_STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                  className="rounded-2xl border border-line bg-page p-6"
                >
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #b45309, #d97706)" }}
                  >
                    {step.n}
                  </span>
                  <p className="mt-4 text-[15px] font-semibold text-ink">{step.title}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-3">{step.copy}</p>
                </motion.div>
              ))}
            </div>

            {/* — Quote banner — */}
            <motion.div
              {...fadeUp}
              className="mt-8 rounded-2xl px-8 py-5"
              style={{ background: "#fffbeb", border: "1px solid #fcd34d" }}
            >
              <p className="text-[15.5px] font-semibold text-ink">
                You do not need to become a full-time salesperson. You need to make the right introduction.
              </p>
            </motion.div>

            {/* — Media placeholder — */}
            <motion.div
              {...fadeUp}
              className="mt-6 flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-page"
            >
              <div className="text-center">
                <Users size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">Media PARTNERS-M07</p>
                <p className="mt-1 text-[13px] text-ink-4">Partner-profile carousel</p>
              </div>
            </motion.div>

            {/* — CTA — */}
            <motion.div {...fadeUp} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={scrollToApply}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #b45309, #d97706)" }}
              >
                Apply to Become an Affiliate <ArrowRight size={17} />
              </button>
              <button
                onClick={scrollToApply}
                className="inline-flex items-center justify-center rounded-xl border border-line-2 bg-page px-6 py-3 text-[15px] font-semibold text-ink-2 transition-colors hover:bg-paper"
              >
                Join the Affiliate Program
              </button>
            </motion.div>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S8 — Technology & Integration Partners
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20" ref={sectionRefs.technology}>
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#0369a1" }}>
                Technology & Integration Partners
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Connect technology around a shared academic context.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-3">
                Classess® works with technology providers that want to make education systems more
                connected, intelligent, and useful for students, teachers, and institutions. Technology
                partnerships may include product integrations, data exchange, embedded capabilities,
                joint solutions, marketplace connections, or implementation collaboration.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <motion.div {...fadeUp} className="rounded-2xl border border-line bg-page p-7">
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: "#0369a1" }}>
                  Potential technology partners
                </p>
                <BulletList items={TECH_PARTNERS} color="#0369a1" />
              </motion.div>
              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.07 }} className="rounded-2xl border border-line bg-page p-7">
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: "#0369a1" }}>
                  Possible partnership models
                </p>
                <BulletList items={TECH_MODELS} color="#0369a1" />
              </motion.div>
            </div>

            <motion.div
              {...fadeUp}
              className="mt-6 rounded-2xl border border-line bg-page p-6"
            >
              <p className="text-[15px] leading-relaxed text-ink-3">
                Every integration should have a clear academic purpose and appropriate data permissions.
                The goal is not to connect systems simply because integration is possible — it is to help
                institutions reduce fragmentation and make better academic decisions.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="mt-6 rounded-2xl px-8 py-6"
              style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
            >
              <p className="text-[16px] font-semibold text-ink">
                Integration should create value — not another layer of complexity.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="mt-6">
              <button
                onClick={scrollToApply}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0369a1, #1d4ed8)" }}
              >
                Discuss a Technology Partnership
              </button>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="mt-10 flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-line-2 bg-paper"
            >
              <div className="text-center">
                <Cpu size={32} className="mx-auto text-ink-4" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-4">Media PARTNERS-M05</p>
                <p className="mt-1 text-[13px] text-ink-4">Integration ecosystem animation</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S9 — Why Partner with Classess®
        ════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                Why partner with us
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Grow with a platform designed for the future of education.
              </h2>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VALUE_CARDS.map((card, i) => (
                <motion.div
                  key={card.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                  className="rounded-2xl border border-line bg-paper p-7"
                >
                  <Star size={18} style={{ color: ACCENT }} />
                  <p className="mt-4 text-[16px] font-semibold text-ink">{card.title}</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-3">{card.copy}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              {...fadeUp}
              className="mt-8 rounded-2xl px-8 py-6"
              style={{ background: "#f0fdfa", border: "1px solid #99f6e4" }}
            >
              <p className="text-[16px] font-semibold text-ink">
                Create commercial value while helping education move from disconnected activity to
                academic intelligence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S10 — Partner Application
        ════════════════════════════════════════════════════════ */}
        <section className="bg-paper py-20" ref={applyRef}>
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                Apply
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Let us build the right partnership together.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-3">
                Tell us how you would like to work with Classess® and the value you can bring to the partnership.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="mt-10 rounded-2xl border border-line bg-page p-8"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-medium text-ink-2 mb-1.5">Partnership model</label>
                  <select className="w-full rounded-xl border border-line-2 bg-paper px-4 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink-3">
                    <option value="">Select a partnership model</option>
                    <option>Strategic Growth Partner</option>
                    <option>Academic & Content Partner</option>
                    <option>Technology & Integration Partner</option>
                    <option>Affiliate & Referral Partner</option>
                  </select>
                </div>
                {[
                  { label: "Individual or organisation name", span: 2 },
                  { label: "Full name",                       span: 1 },
                  { label: "Designation",                     span: 1 },
                  { label: "Email address",                   span: 1 },
                  { label: "Phone number",                    span: 1 },
                  { label: "Country and region",              span: 1 },
                  { label: "Website or professional profile", span: 1 },
                  { label: "Primary education network or market", span: 2 },
                ].map(({ label, span }) => (
                  <div key={label} className={span === 2 ? "md:col-span-2" : ""}>
                    <label className="block text-[13px] font-medium text-ink-2 mb-1.5">{label}</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-line-2 bg-paper px-4 py-2.5 text-[14px] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink-3"
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-medium text-ink-2 mb-1.5">Tell us about your proposed partnership</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl border border-line-2 bg-paper px-4 py-2.5 text-[14px] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink-3 resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-medium text-ink-2 mb-1.5">Estimated institutions or organisations you can reach</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-line-2 bg-paper px-4 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink-3"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 rounded border-line-2" />
                    <span className="text-[13.5px] text-ink-3 leading-relaxed">
                      I confirm that the information provided is accurate and that I agree to be
                      contacted regarding the Classess® Partner Program.
                    </span>
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: GRADIENT }}
                >
                  Submit Partner Application <ArrowRight size={17} />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S11 — FAQs
        ════════════════════════════════════════════════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <motion.div {...fadeUp}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                Questions
              </p>
              <h2 className="mt-2 text-3xl font-serif font-medium tracking-tight text-ink md:text-4xl">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <motion.div {...fadeUp} className="mt-8 rounded-2xl border border-line bg-paper px-6 py-2">
              {FAQS_INITIAL.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
              <AnimatePresence>
                {showMoreFaq && FAQS_HIDDEN.map((faq) => (
                  <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </AnimatePresence>
            </motion.div>

            {!showMoreFaq && (
              <motion.div {...fadeUp} className="mt-4 text-center">
                <button
                  onClick={() => setShowMoreFaq(true)}
                  className="text-[14px] font-medium transition-colors"
                  style={{ color: ACCENT }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  View More Questions ↓
                </button>
              </motion.div>
            )}
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
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#5eead4" }}>
                Get started
              </p>
              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-serif font-medium leading-tight tracking-tight text-white md:text-4xl">
                Ready to grow with Classess®?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/80">
                Whether you want to build a market, strengthen your services, integrate technology, or
                earn through trusted introductions — there is a partnership built for you.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={scrollToApply}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold transition-transform hover:scale-[1.02]"
                  style={{ color: ACCENT }}
                >
                  Become a Partner <ArrowRight size={17} />
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Contact Us
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
