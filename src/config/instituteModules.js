/**
 * instituteModules.js — Content configuration for the five institution dedicated pages.
 * Mirrors the shape of teacherModules.js / studentModules.js. Each key matches the page slug.
 */

export const INSTITUTION_MODULES = {
  platform: {
    slug: "platform",
    path: "/institutions/platform",
    navLabel: "Platform",
    docTitle: "Platform — Classess.com® Institution",
    metaDescription:
      "Discover how the Classess.com® academic intelligence platform connects curriculum, teaching, assessment, student support, and leadership visibility for institutions.",
    heading: "One connected academic intelligence platform for your institution.",
    intro: [
      "Classess.com® is not just an LMS, ERP, assessment tool, or content platform. It is an academic intelligence layer that connects curriculum, planning, teaching, assessment, feedback, student support, and leadership visibility into one institution-specific system.",
    ],
    outcomes: [
      { title: "Better academic alignment", body: "Connect curriculum expectations with classroom planning, teaching activities, assessment, and student support across every grade and department." },
      { title: "Reduced teacher workload", body: "Help teachers spend less time on repetitive preparation, assessment administration, and reporting—so they have more time for students." },
      { title: "Earlier identification of learning gaps", body: "See where students are struggling before they fall further behind, using real learning evidence from classroom activity and assessment." },
      { title: "More meaningful assessments", body: "Move beyond tracking completion. Understand what students actually learned, where difficulty occurred, and what support is required." },
      { title: "Stronger leadership visibility", body: "Give principals, academic coordinators, and group leaders appropriate views of curriculum progress, teaching quality, and student outcomes." },
      { title: "Continuous institutional improvement", body: "Use academic evidence to improve teaching practices, assessment quality, student support, and institutional decisions over time." },
    ],
    sections: [
      {
        kind: "flow",
        heading: "A Connected Academic Journey",
        intro: "Academic activities should not remain isolated. A lesson plan influences classroom learning. Classroom learning influences assessment. Assessment reveals student needs. Those needs should guide feedback, intervention, and the next lesson. Classess.com® connects these stages so institutions can move from activity to insight and from insight to meaningful academic action.",
        steps: ["Curriculum", "Planning", "Teaching", "Assessment", "Feedback", "Learning Gaps", "Intervention", "Progress"],
      },
      {
        kind: "list",
        heading: "Stakeholder Experience",
        intro: "Classess.com® provides a connected experience for every academic stakeholder within the institution.",
        items: [
          "Leadership: institution-wide academic visibility and strategic decision support",
          "Academic coordinators: curriculum alignment, department oversight, and intervention coordination",
          "Teachers: planning, content creation, assessment, feedback, and student support",
          "Students: guided learning, practice, feedback, and progress visibility",
          "Parents: meaningful academic updates and progress communication",
          "Administrative teams: reporting, data management, and compliance support",
        ],
      },
      {
        kind: "list",
        heading: "Core Academic Capabilities",
        intro: "Classess.com® brings together the full range of academic functions an institution needs.",
        items: [
          "Curriculum management and learning-outcome mapping",
          "Lesson and academic planning",
          "Classroom support and engagement tools",
          "Assessments and evaluation",
          "Feedback and student communication",
          "Student insights and learning-gap identification",
          "Intervention assignment and monitoring",
          "Progress tracking and reporting",
        ],
      },
      {
        kind: "highlight",
        heading: "Independent Institution Experience",
        text: "One institution. One connected academic system.",
        copy: "Classess.com® helps independent institutions connect curriculum, teaching, assessment, feedback, student support, and leadership visibility within one academic environment. The platform can be configured according to the institution's curriculum, academic structure, terminology, policies, workflows, and priorities.",
      },
      {
        kind: "highlight",
        heading: "Education Group Experience",
        text: "Shared academic direction. Campus-level flexibility.",
        copy: "Classess.com® helps education groups create consistent academic standards across institutions while allowing each campus to work according to its curriculum, student needs, local context, and leadership structure. Group leaders receive appropriate network-level visibility while campus teams retain the control required to manage their academic environment.",
      },
      {
        kind: "list",
        heading: "How It Works",
        intro: "Classess.com® works by connecting academic context — curriculum, learning outcomes, teaching plans, student responses, assessment results, and intervention records — into a coherent academic intelligence layer. The platform supports the teacher and institution without replacing human judgement, professional responsibility, or institutional leadership.",
        items: [
          "Institution configures curriculum, structure, and academic context",
          "Teachers plan, create, and deliver learning with AI support",
          "Students engage, practise, and complete assessments",
          "Platform collects and connects academic evidence",
          "Leaders receive meaningful visibility and recommended actions",
          "Institutions review outcomes and improve continuously",
        ],
      },
    ],
    final: {
      heading: "Explore Classess.com® for your institution.",
      primary: "Request a Demo",
      secondary: "Back to Institution Home",
    },
  },

  "academic-intelligence": {
    slug: "academic-intelligence",
    path: "/institutions/academic-intelligence",
    navLabel: "Academic Intelligence",
    docTitle: "Academic Intelligence — Classess.com® Institution",
    metaDescription:
      "Learn how Classess.com® turns academic activities and data into meaningful insights, recommendations, and actions for institutions.",
    heading: "Turn academic activity into meaningful institutional intelligence.",
    intro: [
      "Classess.com® helps institutions understand not only what has been taught or completed, but what students actually learned, where gaps exist, and what action is required to improve academic outcomes.",
    ],
    outcomes: [
      { title: "Better decisions", body: "Give institutional leaders the academic context they need to make more informed decisions about curriculum, staffing, support, and investment." },
      { title: "Faster identification of problems", body: "Identify learning gaps, declining participation, and recurring misconceptions earlier — before they compound into larger academic challenges." },
      { title: "More relevant interventions", body: "Match the support provided to the actual academic evidence, not a general assumption about student performance." },
      { title: "Greater learning visibility", body: "See what students understand, where they struggle, and how they respond to teaching, practice, feedback, and support." },
      { title: "Improved academic coordination", body: "Help academic coordinators, heads of department, and campus leaders align their activities around shared academic evidence." },
      { title: "Stronger institutional knowledge", body: "Build an institutional understanding of academic patterns that persists beyond individual teacher or leadership changes." },
    ],
    sections: [
      {
        kind: "highlight",
        heading: "From Academic Data to Academic Understanding",
        text: "Storing academic information is not the same as understanding it.",
        copy: "Most platforms collect academic data. Classess.com® connects that data to its academic context — the curriculum, the learning outcome, the student's history, the teaching approach — so that what is stored becomes something institutions can actually use to improve learning.",
      },
      {
        kind: "list",
        heading: "Institution-Specific Intelligence",
        intro: "Academic intelligence is only useful when it reflects the institution's own academic environment. Classess.com® grounds its analysis in the institution's specific context.",
        items: [
          "Curriculum and syllabus structure",
          "Institutional policies and academic calendar",
          "Learning outcomes and assessment patterns",
          "Teaching plans and classroom activity",
          "Student-learning history and participation",
          "Institutional terminology and reporting requirements",
        ],
      },
      {
        kind: "list",
        heading: "Student-Learning Visibility",
        intro: "Institutions can understand what students have learned, where they are struggling, and what support they need — at individual, class, grade, and institutional level.",
        items: [
          "Concept mastery and understanding depth",
          "Learning gaps and skill gaps",
          "Repeated misconceptions and process errors",
          "Practice consistency and engagement patterns",
          "Assessment readiness and performance trends",
          "Progress after intervention and support",
        ],
      },
      {
        kind: "list",
        heading: "Teacher and Classroom Intelligence",
        intro: "Academic leaders and coordinators can understand teaching quality, curriculum progress, and classroom effectiveness across the institution.",
        items: [
          "Curriculum coverage and lesson completion",
          "Classroom understanding checks and response patterns",
          "Assessment quality and alignment with learning outcomes",
          "Feedback effectiveness and student response",
          "Intervention requirements and assignment status",
        ],
      },
      {
        kind: "list",
        heading: "Leadership Intelligence",
        intro: "Classess.com® provides appropriate views for every level of institutional leadership — so the right people see the right academic information.",
        items: [
          "Principal: institution-wide academic health and priorities",
          "Academic coordinator: curriculum alignment and department patterns",
          "Head of department: subject-level outcomes and teacher support needs",
          "Campus leadership: campus-specific academic visibility",
          "Group management: cross-campus comparisons and network trends",
        ],
      },
      {
        kind: "list",
        heading: "Recommendations and Next Actions",
        intro: "Classess.com® should not merely display dashboards. It should help institutions understand what to do next — and why.",
        items: [
          "What requires attention and where",
          "Which students or groups require support",
          "Why the issue is occurring",
          "What action is recommended",
          "Who should take responsibility",
          "Whether the intervention produced improvement",
        ],
      },
      {
        kind: "highlight",
        heading: "Agentic Academic Intelligence",
        text: "Role-based academic agents that support — not replace — institutional decision-making.",
        copy: "Classess.com® can support role-based academic intelligence that surfaces relevant information, recommends actions, and assists institutional leaders and teachers in making more informed academic decisions. Human oversight, approval, and accountability remain central to every important academic outcome.",
      },
    ],
    final: {
      heading: "Discover your institution's academic intelligence.",
      primary: "Request a Demo",
      secondary: "Back to Institution Home",
    },
  },

  implementation: {
    slug: "implementation",
    path: "/institutions/implementation",
    navLabel: "Implementation",
    docTitle: "Implementation — Classess.com® Institution",
    metaDescription:
      "Learn how Classess.com® can be introduced, configured, integrated, and adopted within your institution at the right pace.",
    heading: "Built around your institution — not the other way around.",
    intro: [
      "Classess.com® does not require institutions to change everything at once. Implementation begins with understanding your institution's academic context and configuring the platform to match — not forcing every institution into the same structure.",
    ],
    outcomes: [
      { title: "No disruption to existing operations", body: "Classess.com® can be introduced gradually, starting with one grade, subject, department, or campus — expanding as adoption grows." },
      { title: "Configured for your context", body: "The platform adapts to your institution's curriculum, terminology, hierarchy, policies, and workflows — not the reverse." },
      { title: "Works with existing systems", body: "Classess.com® can operate independently or connect with your existing ERP, SIS, LMS, and other academic platforms where integrations are available." },
      { title: "Supported adoption process", body: "From leadership orientation to teacher training and student onboarding — adoption is supported at every stage of the journey." },
      { title: "Phased expansion", body: "Begin with a pilot, review outcomes, and expand to additional campuses, grades, or departments based on readiness and results." },
      { title: "Continuous improvement", body: "Regular implementation reviews and academic outcome checks ensure the platform continues to serve your institution's evolving needs." },
    ],
    sections: [
      {
        kind: "list",
        heading: "Institution Discovery",
        intro: "Before configuration begins, Classess.com® works with your institution to understand the academic environment it needs to support.",
        items: [
          "Curriculum and syllabus structure",
          "Academic roles and leadership hierarchy",
          "Institutional policies and academic calendar",
          "Current systems and platforms in use",
          "Institutional terminology and naming conventions",
          "Reporting requirements and stakeholder expectations",
          "Institutional priorities and improvement goals",
        ],
      },
      {
        kind: "highlight",
        heading: "Institution Blueprint",
        text: "Your institution's structure. Not a generic template.",
        copy: "Classess.com® is configured around the institution rather than forcing every institution into the same structure. The academic hierarchy, curriculum alignment, role permissions, reporting formats, and approval workflows are set up to reflect how your institution actually works.",
      },
      {
        kind: "list",
        heading: "Integration Options",
        intro: "Classess.com® can connect with existing academic and institutional platforms where suitable integrations are available. Only approved, available, or planned integrations are listed.",
        items: [
          "ERP and student information systems",
          "Learning Management Systems",
          "Google Classroom and Microsoft Teams",
          "Assessment and evaluation platforms",
          "Timetable and attendance systems",
          "Existing academic databases",
        ],
      },
      {
        kind: "list",
        heading: "Data Preparation and Migration",
        intro: "Academic data is prepared and migrated in a controlled, structured process to ensure continuity and accuracy.",
        items: [
          "Student and teacher profile data",
          "Classes, sections, and academic groups",
          "Curriculum and subject configuration",
          "Academic calendar and assessment schedule",
          "Historical academic records where applicable",
        ],
      },
      {
        kind: "list",
        heading: "Training and Adoption",
        intro: "Adoption is supported at every level of the institution — from leadership to students.",
        items: [
          "Leadership orientation and strategic overview",
          "Academic coordinator and department onboarding",
          "Teacher training and platform familiarisation",
          "Student orientation and access setup",
          "Support resources and self-service materials",
          "Adoption monitoring and feedback collection",
        ],
      },
      {
        kind: "flow",
        heading: "Phased Implementation Journey",
        intro: "Implementation follows a clear, reviewable pathway — beginning with discovery and expanding to full institutional scale.",
        steps: ["Discover", "Configure", "Integrate", "Train", "Launch", "Review", "Scale"],
      },
      {
        kind: "highlight",
        heading: "Education Group Rollout",
        text: "Begin with selected campuses. Expand across the network.",
        copy: "Education groups can begin Classess.com® with one or a small number of campuses, review adoption and academic outcomes, and expand the rollout systematically across the institution network — maintaining campus-level flexibility while building group-level consistency.",
      },
    ],
    final: {
      heading: "Plan your institution's implementation.",
      primary: "Request a Demo",
      secondary: "Back to Institution Home",
    },
  },

  "trust-governance": {
    slug: "trust-governance",
    path: "/institutions/trust-governance",
    navLabel: "Trust & Governance",
    docTitle: "Trust & Governance — Classess.com® Institution",
    metaDescription:
      "Learn how Classess.com® approaches privacy, permissions, responsible AI, human oversight, and institutional accountability.",
    heading: "Responsible academic intelligence requires governance, not only technology.",
    intro: [
      "Academic intelligence is only trustworthy when it is governed appropriately. Classess.com® is designed around institution-controlled access, human oversight, responsible AI use, and clear accountability — so institutions can adopt academic intelligence with confidence.",
    ],
    outcomes: [
      { title: "Institution-controlled access", body: "Role-based permissions ensure that every stakeholder sees only the academic information appropriate to their role and responsibility." },
      { title: "Human oversight of AI", body: "AI-supported outputs require teacher or institutional review and approval before reaching students. Human judgement is never bypassed for important academic decisions." },
      { title: "Student data protection", body: "Student data is handled with appropriate minimisation, anonymisation, secure processing, and access controls." },
      { title: "Audit visibility", body: "Relevant activity, approvals, changes, and interventions can be recorded — supporting accountability and institutional review." },
      { title: "Parent and community confidence", body: "Responsible governance supports the trust of students, families, and communities in how their academic information is used." },
      { title: "Institutional policy alignment", body: "The platform can incorporate institutional AI policies, approval rules, and data practices into its configuration." },
    ],
    sections: [
      {
        kind: "list",
        heading: "Institution-Controlled Access",
        intro: "Access to academic information is structured according to the role, responsibility, and institutional position of each user.",
        items: [
          "Role-based access and permission levels",
          "Campus-level and department-level access controls",
          "Teacher access scoped to their classes and students",
          "Student access limited to their own learning information",
          "Leadership visibility appropriate to their position",
          "Configurable permission structures for each institution",
        ],
      },
      {
        kind: "list",
        heading: "Responsible AI",
        intro: "Classess.com® uses AI to support academic preparation and decision-making — not to automate important academic decisions without human review.",
        items: [
          "Teacher review and approval before content reaches students",
          "Appropriate use of academic data in AI-supported outputs",
          "Age-sensitive safeguards for student interactions",
          "Transparent recommendations with visible reasoning",
          "Acknowledgement of AI limitations and output uncertainty",
          "Editable, regenerable, and rejectable AI outputs",
        ],
      },
      {
        kind: "list",
        heading: "Student Data Protection",
        intro: "Student information is handled with appropriate care, minimisation, and control throughout the platform.",
        items: [
          "Data minimisation — only necessary information is collected",
          "Secure academic data handling and storage",
          "Anonymisation where appropriate for analysis",
          "Controlled processing within approved institutional contexts",
          "Access records and activity visibility",
          "Retention controls where applicable",
        ],
      },
      {
        kind: "highlight",
        heading: "Teacher and Leadership Control",
        text: "Important academic decisions remain under human responsibility.",
        copy: "Classess.com® supports teachers and institutional leaders — it does not replace their professional judgement. Every significant academic output, recommendation, or intervention assignment can be reviewed, edited, approved, or rejected by a qualified human before it affects a student's academic journey.",
      },
      {
        kind: "list",
        heading: "Auditability",
        intro: "Institutions can review how academic decisions were made, what AI-supported outputs were approved, and how interventions were assigned and followed up.",
        items: [
          "Approval records for AI-supported academic content",
          "Intervention assignment and completion records",
          "Assessment and feedback activity logs",
          "Leadership action and escalation records",
          "Configuration and permission change history",
        ],
      },
      {
        kind: "highlight",
        heading: "Parent and Student Confidence",
        text: "Governance builds trust beyond the institution.",
        copy: "When academic intelligence is governed responsibly — with appropriate access controls, human oversight, and clear data practices — it builds confidence among students, parents, and the wider community. Classess.com® is designed to support that confidence, not undermine it.",
      },
      {
        kind: "list",
        heading: "Institutional Policy Alignment",
        intro: "Classess.com® can incorporate your institution's own AI policies, data practices, and academic governance requirements into its platform configuration.",
        items: [
          "Institutional AI use policies and approval rules",
          "Data handling and privacy practices",
          "Parent and student consent frameworks",
          "Assessment integrity and anti-plagiarism policies",
          "Safeguarding and escalation procedures",
          "Reporting obligations and compliance requirements",
        ],
      },
    ],
    final: {
      heading: "Discuss trust and governance with our team.",
      primary: "Request a Demo",
      secondary: "Back to Institution Home",
    },
  },
};

export const RESOURCE_CATEGORIES = [
  {
    id: "platform-resources",
    label: "Platform Resources",
    resources: [
      { title: "Platform Overview", desc: "A complete introduction to Classess.com® as an academic intelligence platform for institutions.", type: "PDF", action: "Download" },
      { title: "Product Brochure", desc: "A concise overview of platform capabilities, stakeholder benefits, and implementation options.", type: "PDF", action: "Download" },
      { title: "Module Summaries", desc: "Individual summaries for each core academic module: planning, assessment, insights, and more.", type: "PDF", action: "Download" },
      { title: "Academic Workflow Guide", desc: "A step-by-step guide to how academic activities connect from curriculum to student progress.", type: "Guide", action: "Read" },
      { title: "Frequently Asked Questions", desc: "Answers to the most common questions from institution leaders, academic coordinators, and IT teams.", type: "Article", action: "Read" },
    ],
  },
  {
    id: "leadership-resources",
    label: "Leadership Resources",
    resources: [
      { title: "Responsible AI Guide for Institutions", desc: "A practical guide to evaluating, adopting, and governing AI in an academic environment.", type: "Guide", action: "Download" },
      { title: "Academic Transformation Guide", desc: "How institutional leaders can lead a meaningful academic improvement initiative.", type: "Guide", action: "Download" },
      { title: "Digital Academic Strategy", desc: "A framework for developing a coherent digital academic strategy across your institution.", type: "Guide", action: "Read" },
      { title: "Institutional Readiness Checklist", desc: "Assess your institution's readiness to adopt academic intelligence before beginning implementation.", type: "Checklist", action: "Download" },
      { title: "Implementation Planning Template", desc: "A structured template to plan the Classess.com® implementation across your institution or group.", type: "Template", action: "Download" },
    ],
  },
  {
    id: "teacher-resources",
    label: "Teacher Resources",
    resources: [
      { title: "Teacher Getting-Started Guide", desc: "A concise guide to the most important features for teachers in the first weeks of adoption.", type: "Guide", action: "Download" },
      { title: "Teaching Templates", desc: "Ready-to-use lesson plan, activity, and assessment templates aligned to common curriculum formats.", type: "Template", action: "Download" },
      { title: "Assessment Resource Pack", desc: "Question banks, rubric templates, and marking-scheme examples for common academic subjects.", type: "Pack", action: "Download" },
      { title: "Product Training Videos", desc: "Short video walkthroughs of core teacher features: planning, assessment, feedback, and insights.", type: "Video", action: "Watch" },
      { title: "Professional Development Materials", desc: "Resources to support teacher professional learning around academic intelligence and responsible AI.", type: "PDF", action: "Download" },
    ],
  },
  {
    id: "implementation-resources",
    label: "Implementation Resources",
    resources: [
      { title: "Onboarding Guide", desc: "A structured guide to the full Classess.com® onboarding process for institutions.", type: "Guide", action: "Download" },
      { title: "Integration Information", desc: "An overview of available and planned integrations with common ERP, SIS, and LMS platforms.", type: "PDF", action: "Download" },
      { title: "Data Preparation Template", desc: "A structured template to prepare student, teacher, curriculum, and class data for migration.", type: "Template", action: "Download" },
      { title: "Rollout Checklist", desc: "A phase-by-phase checklist to track implementation progress from discovery to full launch.", type: "Checklist", action: "Download" },
      { title: "Training Schedule Template", desc: "A customisable schedule for planning leadership, teacher, and student training sessions.", type: "Template", action: "Download" },
    ],
  },
  {
    id: "evidence-success",
    label: "Evidence and Success",
    resources: [
      { title: "Institution Case Studies", desc: "Detailed accounts of how independent institutions and education groups have used Classess.com®.", type: "PDF", action: "Read" },
      { title: "Teacher Stories", desc: "First-hand accounts from teachers on how the platform changed their daily academic work.", type: "Article", action: "Read" },
      { title: "Student Outcome Summaries", desc: "Summaries of measurable learning improvements observed after platform adoption.", type: "PDF", action: "Download" },
      { title: "Programme Reports", desc: "Reports on academic programme outcomes for NGO, CSR, and district implementations.", type: "PDF", action: "Download" },
      { title: "Research and Impact Summary", desc: "An overview of the academic research and evidence base underpinning the Classess.com® approach.", type: "PDF", action: "Download" },
    ],
  },
];
