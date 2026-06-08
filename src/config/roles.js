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
      eyebrow: "College",
      title: "Institutions Worldwide",
      description: "Run admissions, curricula, and reporting from one dashboard.",
    },
    accent: "#6366f1",
    accentLight: "#eef2ff",
    accentBorder: "#a5b4fc",
    accentGradient: "linear-gradient(135deg, #6366f1, #818cf8)",

    navbar: {
      links: [
        { label: "Dashboard", href: "#dashboard" },
        { label: "Courses",   href: "#courses"   },
        { label: "Students",  href: "#students"  },
        { label: "Reports",   href: "#reports"   },
        { label: "Settings",  href: "#settings"  },
      ],
      primaryCta: "Manage Institute",
      secondaryCta: "Sign In",
    },

    hero: {
      headline: "Power Your Institution With",
      headlineGradient: "Smarter Education.",
      subheadline:
        "Streamline admissions, manage curricula, and track student outcomes — all from one unified dashboard built for modern institutes.",
      ctaLabel: "Get Started",
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
    accent: "#0ea5e9",
    accentLight: "#e0f2fe",
    accentBorder: "#7dd3fc",
    accentGradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",

    navbar: {
      links: [
        { label: "How It Helps",    href: "#how-it-helps" },
        { label: "Learn Concepts",  href: "#concepts"     },
        { label: "Practice",        href: "#practice"     },
        { label: "Exam Prep",       href: "#exam-prep"    },
        { label: "AI Tutor",        href: "#ai-tutor"     },
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
      title: "Any Subject, Blended",
      description: "Build courses, manage students, and grow your impact globally.",
    },
    accent: "#10b981",
    accentLight: "#ecfdf5",
    accentBorder: "#6ee7b7",
    accentGradient: "linear-gradient(135deg, #10b981, #34d399)",

    navbar: {
      links: [
        { label: "My Classes",    href: "#my-classes"    },
        { label: "Create Course", href: "#create-course" },
        { label: "Students",      href: "#my-students"   },
        { label: "Earnings",      href: "#earnings"      },
        { label: "Analytics",     href: "#analytics"     },
      ],
      primaryCta: "Start Teaching",
      secondaryCta: "Sign In",
    },

    hero: {
      headline: "Teach Your Way, Scale Your",
      headlineGradient: "Impact Globally.",
      subheadline:
        "Create engaging courses, manage your students, and grow your teaching practice — with powerful tools designed for modern educators.",
      ctaLabel: "Create a Course",
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
