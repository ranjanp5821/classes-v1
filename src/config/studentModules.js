/**
 * studentModules.js — Content for the five student module pages.
 *
 * Each entry drives a full routed page (e.g. /students/learn) rendered by
 * <StudentModulePage>. Copy follows the "Independent Student Website
 * Navigation and Module Page Structure" spec. Bracketed internal/developer
 * notes from the spec are intentionally NOT included here — only public copy.
 *
 * Block kinds used in `blocks`:
 *   flow      — a left-to-right "Subject → Module → …" journey + optional copy
 *   list      — a heading, optional intro line, and a bullet/chip list
 *   example   — a before/now/next style example card + copy
 *   highlight — a callout line + supporting copy
 */

export const STUDENT_MODULES = {
  learn: {
    slug: "learn",
    path: "/students/learn",
    navLabel: "Learn",
    docTitle: "Learn — Classess",
    metaDescription:
      "Understand difficult concepts clearly with a structured learning path, explanations, examples, and AI-guided support.",
    heading: "Understand difficult concepts in a way that works for you.",
    intro: [
      "Classess.com® organises your subject into a structured learning path and breaks difficult topics into smaller, manageable learning steps.",
      "Learn through explanations, examples, videos, voice support, read-aloud content, and AI-guided assistance until the concept becomes clear.",
    ],
    outcomes: [
      { title: "Understand instead of memorising", body: "Build a clearer understanding of concepts rather than depending only on repetition and recall." },
      { title: "Learn at your own pace", body: "Pause, repeat, simplify, revisit, or explore a concept in another way without feeling rushed." },
      { title: "Know what to learn next", body: "Follow a learning path based on your academic level, course, syllabus, and progress." },
      { title: "Build confidence in difficult subjects", body: "Approach difficult topics step by step and strengthen your confidence before moving forward." },
    ],
    blocks: [
      {
        kind: "flow",
        heading: "A structured path from subject to understanding",
        steps: ["Subject", "Module", "Topic", "Subtopic", "Learning Nugget"],
        copy: "Each subject is organised into a clear academic structure. The platform then recommends what to learn based on the student's course, selected subject, previous progress, and academic goals.",
      },
      {
        kind: "list",
        heading: "Supporting Capabilities",
        items: [
          "Personalised learning paths",
          "Smaller learning nuggets",
          "Written explanations",
          "Video support",
          "Read-aloud",
          "Text and voice questions",
          "Real-life examples",
          "Visual and worked examples",
          "Beyond-syllabus exploration where appropriate",
        ],
      },
    ],
    final: {
      heading: "Move from confusion to clarity.",
      copy: "Classess.com® helps students understand what they are learning, why it matters, and how it connects to the next concept.",
      primary: "Start Learning",
      secondary: "Try a Sample Concept",
    },
  },

  practice: {
    slug: "practice",
    path: "/students/practice",
    navLabel: "Practice",
    docTitle: "Practice — Classess",
    metaDescription:
      "Practise what matters with activities recommended from your learning, performance, and where you need improvement.",
    heading: "Practise what matters—not just what is available.",
    intro: [
      "Classess.com® recommends practice based on what you are learning, how you have performed, and where you need improvement.",
      "Every activity is designed to strengthen a specific academic skill.",
    ],
    outcomes: [
      { title: "Strengthen understanding", body: "Use practice to confirm whether you have genuinely understood a concept." },
      { title: "Apply what you have learned", body: "Move beyond recognition and practise solving, reasoning, comparing, explaining, and applying." },
      { title: "Remember for longer", body: "Revisit concepts through different formats to improve recall and long-term retention." },
      { title: "Correct mistakes early", body: "Identify misunderstandings while the topic is still fresh and take corrective action before moving ahead." },
    ],
    blocks: [
      {
        kind: "list",
        heading: "Practice changes according to your learning needs",
        intro: "The platform can recommend different activities based on:",
        items: [
          "Concepts recently learned",
          "Incorrect responses",
          "Unattempted questions",
          "Repeated mistakes",
          "Skills requiring improvement",
          "Examination priorities",
          "Previous practice performance",
        ],
      },
      {
        kind: "list",
        heading: "Practice Experiences",
        items: [
          "Short quizzes",
          "Flashcards",
          "Fill-in-the-blanks",
          "Concept matching",
          "Sequencing activities",
          "Reasoning exercises",
          "Written responses",
          "Application questions",
          "Self-tests",
          "Gamified academic challenges",
        ],
      },
    ],
    final: {
      heading: "Every practice activity should move you closer to mastery.",
      copy: "Instead of completing random questions, students receive practice that is connected to their learning progress and academic needs.",
      primary: "Start Practising",
      secondary: "Explore Practice Formats",
    },
  },

  "exam-preparation": {
    slug: "exam-preparation",
    path: "/students/exam-preparation",
    navLabel: "Exam Preparation",
    docTitle: "Exam Preparation — Classess",
    metaDescription:
      "Move from exam anxiety to structured preparation with a study plan that balances learning, practice, revision, and self-testing.",
    heading: "Prepare with a plan—not panic.",
    intro: [
      "Add your examination date, subjects, syllabus, and available study time.",
      "Classess.com® creates a structured preparation path that balances learning, practice, revision, self-testing, and weak-topic improvement.",
    ],
    outcomes: [
      { title: "Know what to study each day", body: "Receive a clear daily or weekly preparation plan." },
      { title: "Complete the syllabus systematically", body: "Break the syllabus into manageable learning and revision goals." },
      { title: "Focus on weaker areas", body: "Give additional time to topics and skills that require improvement." },
      { title: "Revise at the right time", body: "Include revision and self-testing as part of the plan rather than leaving them until the final days." },
      { title: "Build examination confidence", body: "Understand how prepared you are and what still requires attention." },
    ],
    blocks: [
      {
        kind: "list",
        heading: "A preparation plan built around your examination",
        intro: "The study plan can consider:",
        items: [
          "Examination date",
          "Subject and syllabus",
          "Available study time",
          "Current syllabus completion",
          "Previous assessment performance",
          "Difficult topics",
          "Learning gaps",
          "Revision requirements",
          "Practice priorities",
        ],
      },
      {
        kind: "flow",
        heading: "Preparation Journey",
        steps: ["Plan", "Learn", "Practise", "Revise", "Self-Test", "Improve"],
      },
    ],
    final: {
      heading: "Walk into the examination knowing you prepared with purpose.",
      copy: "Classess.com® gives students a clearer sense of direction, readiness, and control throughout examination preparation.",
      primary: "Create My Study Plan",
      secondary: "See a Sample Plan",
    },
  },

  progress: {
    slug: "progress",
    path: "/students/progress",
    navLabel: "Progress",
    docTitle: "Progress — Classess",
    metaDescription:
      "See more than your marks. Understand your improvement across learning, practice, revision, consistency, and exam readiness.",
    heading: "See more than your marks. See how your learning is improving.",
    intro: [
      "Classess.com® helps students understand progress across learning, practice, revision, corrected mistakes, study consistency, and examination readiness.",
    ],
    outcomes: [
      { title: "See what you have understood", body: "Identify concepts that you can explain, apply, and answer independently." },
      { title: "See what has improved", body: "Understand which weaker areas have improved after revision and targeted practice." },
      { title: "See where you still need support", body: "Identify concepts, skills, or topics that require further attention." },
      { title: "See how consistently you are learning", body: "Review learning patterns, practice participation, and study-plan completion." },
      { title: "See how ready you are", body: "Understand syllabus coverage and preparation status before an examination." },
    ],
    blocks: [
      {
        kind: "example",
        heading: "Progress should tell you what to do next.",
        rows: [
          { label: "Previously", value: "Needed support with application questions" },
          { label: "Now", value: "Improving after targeted practice" },
          { label: "Next step", value: "Complete one application challenge independently" },
        ],
        copy: "Instead of showing only a score, the platform connects progress with the next recommended learning action.",
      },
      {
        kind: "list",
        heading: "Progress Areas",
        items: [
          "Topic completion",
          "Concept understanding",
          "Practice performance",
          "Corrected learning gaps",
          "Quiz and self-test results",
          "Study consistency",
          "Revision progress",
          "Examination readiness",
          "Improvement over time",
        ],
      },
    ],
    final: {
      heading: "When progress becomes visible, improvement becomes manageable.",
      copy: "",
      primary: "View My Progress",
      secondary: "See a Sample Dashboard",
    },
  },

  "ai-tutor": {
    slug: "ai-tutor",
    path: "/students/ai-tutor",
    navLabel: "AI Tutor",
    docTitle: "AI Tutor — Classess",
    metaDescription:
      "Meet Vidya, your AI learning companion — academic support for doubts, explanations, revision, and next-step guidance.",
    productName: "Vidya — Your AI Learning Companion",
    heading: "Academic support when you need it.",
    intro: [
      "Vidya helps students clarify doubts, understand explanations, practise concepts, review assignments, revise completed topics, and decide what to learn next.",
      "It is designed to support thinking—not replace it.",
    ],
    outcomes: [
      { title: "Get help when learning gets difficult", body: "Ask questions using text or voice and receive guidance suited to your academic level." },
      { title: "Understand a concept in another way", body: "Request a simpler explanation, another example, a step-by-step approach, or a visual explanation." },
      { title: "Work through questions", body: "Receive hints and guiding questions instead of being given the final answer immediately." },
      { title: "Revise with support", body: "Use Vidya to recall concepts, generate practice questions, review completed topics, and prepare for assessments." },
      { title: "Know what to do next", body: "Receive guidance based on your learning progress, upcoming examination, or study plan." },
    ],
    blocks: [
      {
        kind: "list",
        heading: "How Vidya Supports the Student",
        items: [
          "Doubt clarification",
          "Concept explanation",
          "Assignment support",
          "Revision assistance",
          "Guided problem-solving",
          "Practice conversations",
          "Read-aloud",
          "Voice interaction",
          "Next-step recommendations",
          "Study-plan guidance",
        ],
      },
      {
        kind: "highlight",
        heading: "Academic Principle",
        text: "AI that helps you think—not avoid thinking.",
        copy: "Vidya is designed to guide students through explanations, hints, questions, and reflection. The purpose is not to replace teachers, tutors, or human guidance. It is to ensure that learning does not stop between classes.",
      },
    ],
    final: {
      heading: "Become more independent without being left unsupported.",
      copy: "",
      primary: "Meet Vidya",
      secondary: "Watch Vidya in Action",
    },
  },
};

/** Ordered list for nav / iteration. */
export const STUDENT_MODULE_ORDER = [
  "learn",
  "practice",
  "exam-preparation",
  "progress",
  "ai-tutor",
];
