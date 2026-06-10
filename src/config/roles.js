/**
 * roles.js — Centralized Role Configuration
 *
 * This is the single source of truth for all role data.
 * Each role contains:
 *   - Identity (id, label, image, accent colors)
 *   - Navbar configuration
 *   - Hero content
 *   - Section stubs (features, workflows, testimonials) — to be populated later
 *
 * To add a new role: add a new key to ROLES_CONFIG and push to ROLES_LIST.
 */

export const ROLE_IDS = {
  INSTITUTE: "institute",
  STUDENT: "student",
  TEACHER: "teacher",
};

export const ROLES_CONFIG = {
  // ─── Institute ────────────────────────────────────────────────────────────
  institute: {
    id: "institute",
    label: "Institute",
    shortLabel: "Institute",
    image: "/assets/college-img.png",
    card: {
      eyebrow: "Institute",
      title: "I am an Institute",
      description: "Run admissions, curricula, and reporting from one dashboard.",
    },
    accent: "#6366f1",
    accentLight: "#eef2ff",
    accentBorder: "#a5b4fc",
    accentGradient: "linear-gradient(135deg, #6366f1, #818cf8)",

    navbar: {
      links: [
        { label: "Platform", href: "/institutions/platform" },
        { label: "Academic Intelligence", href: "/institutions/academic-intelligence" },
        { label: "Implementation", href: "/institutions/implementation" },
        { label: "Trust & Governance", href: "/institutions/trust-governance" },
        { label: "Resources", href: "/institutions/resources" },
      ],
      primaryCta: "Request a Demo",
      secondaryCta: "Sign In",
    },

    hero: {
      headline: "See what is happening academically—and know",
      headlineGradient: "what to improve next.",
      subheadline:
        "Classess.com® connects curriculum, teaching, assessment, student support, and leadership insights into one academic intelligence layer.",
      ctaLabel: "Request a Demo",
    },

    // ─── Section stubs (content to be added in future iterations) ───────────
    features: [
      // { id: "admissions", icon: "...", title: "Admissions Management", description: "..." },
    ],
    workflows: [
      // { id: "onboarding", step: 1, title: "Onboard Students", description: "..." },
    ],
    testimonials: [
      // { id: "1", name: "...", role: "Principal", quote: "...", avatar: "..." },
    ],
  },

  // ─── Student ──────────────────────────────────────────────────────────────
  student: {
    id: "student",
    label: "Student",
    shortLabel: "Student",
    image: "/assets/Student-img.png",
    card: {
      eyebrow: "Student",
      title: "I am a Student",
      description: "Learn at your own pace and track progress in real time.",
    },
    accent: "#2563EB",
    accentLight: "#EBF0FD",
    accentBorder: "#93AFEE",
    accentGradient: "linear-gradient(135deg, #3B82F6 0%, #4F46E5 100%)",

    navbar: {
      links: [
        { label: "Learn", href: "/students/learn" },
        { label: "Practice", href: "/students/practice" },
        { label: "Exam Preparation", href: "/students/exam-preparation" },
        { label: "Progress", href: "/students/progress" },
        { label: "AI Tutor", href: "/students/ai-tutor" },
      ],
      primaryCta: "Start Learning Free",
      secondaryCta: "Sign In",
    },

    hero: {
      headline: "Learn Anything, Anywhere With",
      headlineGradient: "Boundless Access.",
      subheadline:
        "Access thousands of courses, track your progress in real time, and connect with expert tutors — at your own pace, on any device.",
      ctaLabel: "Explore Courses",
    },

    features: [],
    workflows: [],
    testimonials: [],
  },

  // ─── Teacher ──────────────────────────────────────────────────────────────
  teacher: {
    id: "teacher",
    label: "Teacher / Tutor",
    shortLabel: "Teacher",
    image: "/assets/tutor-img.png",
    card: {
      eyebrow: "Tutor",
      title: "I am a Teacher",
      description: "Plan lessons, assess student work, and understand who needs support.",
    },
    accent: "#1CA363",
    accentLight: "#E8F7F0",
    accentBorder: "#A9DDBF",
    accentGradient: "linear-gradient(135deg, #22C55E 0%, #1CA363 100%)",

    navbar: {
      links: [
        { label: "How It Helps", href: "/teachers/how-it-helps" },
        { label: "Plan & Create", href: "/teachers/plan-and-create" },
        { label: "Assess & Support", href: "/teachers/assess-and-support" },
        { label: "Tutorials", href: "/teachers/tutorials" },
      ],
      primaryCta: "Start as a Teacher",
      secondaryCta: "Sign In",
    },

    hero: {
      headline: "Spend less time managing work. Spend more time",
      headlineGradient: "improving learning.",
      subheadline:
        "Classess.com® helps teachers plan lessons, create academic resources, assess student work, provide meaningful feedback, and understand who needs support—all from one connected academic workspace. Use it independently or through your institution.",
      ctaLabel: "Start as a Teacher",
    },

    features: [],
    workflows: [],
    testimonials: [],
  },
};

/**
 * Ordered list of roles for the role-selection UI.
 * Reorder entries here to change display order in role cards.
 */
export const ROLES_LIST = [
  ROLES_CONFIG[ROLE_IDS.STUDENT],
  ROLES_CONFIG[ROLE_IDS.TEACHER],
  ROLES_CONFIG[ROLE_IDS.INSTITUTE],
];
