import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@anam-ai/js-sdk";
import { Mic, MicOff, Phone, Loader2, X } from "lucide-react";
import { useRole } from "../hooks/useRole";

const VIDEO_ID = "anam-avatar-video";

const EVT_VIDEO_PLAY_STARTED  = "VIDEO_PLAY_STARTED";
const EVT_CONNECTION_CLOSED   = "CONNECTION_CLOSED";
const EVT_SESSION_READY       = "SESSION_READY";
const EVT_MSG_HISTORY         = "MESSAGE_HISTORY_UPDATED";
const EVT_USER_SPEECH_STARTED = "USER_SPEECH_STARTED";

const LANG_STORAGE_KEY = "vidya-lang";

// ─── Section navigation map ───────────────────────────────────────────────────
// Student sub-sections are listed first so they win over the generic "student" card entry.
// Keywords use multi-word phrases where possible to avoid false matches on common words.
// `keywords` carries both English and Hindi (Devanagari) variants — we match against the
// union of both regardless of the chosen language, since the speech-to-text may return
// either script. `label` is the English name, `labelHi` the Hindi one used when Vidya
// speaks Hindi.
const SECTION_MAP = [
  // ── Student sub-sections ─────────────────────────────────────────────────
  {
    id: "student-overview",
    label: "Features Overview",
    labelHi: "फ़ीचर्स ओवरव्यू",
    keywords: {
      // Use full phrases only — bare "back" would match "take me back to concepts"
      en: [
        "go back", "back to main", "back to overview", "back to features",
        "all features", "show all features", "feature overview", "features overview",
        "main section", "show features", "start over",
      ],
      hi: [
        "वापस", "मुख्य सेक्शन", "सभी फ़ीचर्स", "सारे फ़ीचर्स", "फ़ीचर्स ओवरव्यू",
        "ओवरव्यू", "शुरू से", "मुख्य पेज",
      ],
    },
  },
  {
    id: "student-hero",
    label: "Learning Path",
    labelHi: "लर्निंग पाथ",
    keywords: {
      en: [
        "learning path", "my path", "personalised", "personalized",
        "daily goal", "what to learn", "learning goal", "study plan",
        "student hero",
      ],
      hi: [
        "लर्निंग पाथ", "मेरा रास्ता", "अध्ययन योजना", "क्या सीखूं", "क्या सीखूँ",
        "डेली गोल", "लक्ष्य", "पढ़ाई की योजना",
      ],
    },
  },
  {
    id: "how-it-helps",
    label: "How It Helps",
    labelHi: "यह कैसे मदद करता है",
    keywords: {
      en: [
        "how it helps", "how it works", "transformation", "benefits",
        "why classess", "what does it do",
      ],
      hi: ["कैसे मदद", "कैसे काम करता", "फायदे", "फ़ायदे", "लाभ", "क्या करता है"],
    },
  },
  {
    id: "concepts",
    label: "Concept Understanding",
    labelHi: "कॉन्सेप्ट समझ",
    keywords: {
      en: [
        "concept", "concepts", "concept understanding",
        "understand concepts", "explain concepts", "theory",
      ],
      hi: ["कॉन्सेप्ट", "अवधारणा", "थ्योरी", "सिद्धांत", "समझ"],
    },
  },
  {
    id: "practice",
    label: "Purposeful Practice",
    labelHi: "अभ्यास",
    keywords: {
      en: [
        "practice", "purposeful practice", "practice exercises",
        "exercises", "drill", "drills",
      ],
      hi: ["प्रैक्टिस", "अभ्यास", "एक्सरसाइज", "व्यायाम"],
    },
  },
  {
    id: "exam-prep",
    label: "Exam Preparation",
    labelHi: "परीक्षा तैयारी",
    keywords: {
      en: [
        "exam", "exam prep", "exam preparation", "exams",
        "test prep", "study for exam", "learning gaps", "syllabus",
      ],
      hi: ["परीक्षा", "एग्जाम", "टेस्ट", "सिलेबस", "पाठ्यक्रम", "तैयारी"],
    },
  },
  {
    id: "progress",
    label: "Progress Tracking",
    labelHi: "प्रगति ट्रैकिंग",
    keywords: {
      en: [
        "progress", "progress tracking", "my progress",
        "how am i doing", "improvement", "insights", "stats",
      ],
      hi: ["प्रोग्रेस", "प्रगति", "मेरी प्रगति", "सुधार", "आंकड़े", "आँकड़े"],
    },
  },
  {
    id: "ai-tutor",
    label: "AI Tutor",
    labelHi: "एआई ट्यूटर",
    keywords: {
      en: [
        "ai tutor", "a.i. tutor", "artificial intelligence tutor",
        "independent learning", "smart tutor", "ai assistant",
      ],
      // Keep these as phrases (not bare "ट्यूटर") so the landing "tutor" role still wins.
      hi: ["एआई ट्यूटर", "ए आई ट्यूटर", "स्मार्ट ट्यूटर", "एआई सहायक"],
    },
  },
  {
    id: "faq",
    label: "FAQ",
    labelHi: "सामान्य प्रश्न",
    keywords: {
      en: [
        "faq", "frequently asked", "common questions",
        "frequently asked questions",
      ],
      hi: ["सवाल", "प्रश्न", "एफएक्यू", "अक्सर पूछे", "सामान्य प्रश्न"],
    },
  },
  // ── Landing-page sections ─────────────────────────────────────────────────
  {
    id: "products",
    label: "Products",
    labelHi: "प्रोडक्ट्स",
    keywords: {
      en: ["products", "product", "what you offer"],
      hi: ["प्रोडक्ट", "उत्पाद", "क्या देते हैं"],
    },
  },
  {
    id: "features",
    label: "Features",
    labelHi: "फ़ीचर्स",
    keywords: {
      en: ["what can it do", "capabilities"],
      hi: ["क्या कर सकता", "विशेषताएं", "विशेषताएँ", "खूबियां"],
    },
  },
  {
    id: "about",
    label: "About",
    labelHi: "हमारे बारे में",
    keywords: {
      en: ["about", "who are you", "your team", "tell me about"],
      hi: ["आपके बारे में", "हमारे बारे में", "कौन हैं", "आपकी टीम"],
    },
  },
  {
    id: "contact",
    label: "Contact",
    labelHi: "संपर्क",
    keywords: {
      en: ["contact", "reach you", "get in touch", "talk to someone"],
      hi: ["संपर्क", "कांटेक्ट", "बात करनी", "संपर्क करें"],
    },
  },
  {
    id: "student",
    label: "Students",
    labelHi: "छात्र",
    keywords: {
      en: [
        "student", "students", "online course",
        "i am a student", "for students",
      ],
      hi: ["छात्र", "विद्यार्थी", "स्टूडेंट", "मैं छात्र", "छात्रों के लिए"],
    },
  },
  {
    id: "tutor",
    label: "Tutors",
    labelHi: "शिक्षक",
    keywords: {
      en: [
        "tutor", "teacher", "teach", "blended", "manage students",
        "i am a tutor", "for tutors",
      ],
      hi: ["ट्यूटर", "शिक्षक", "अध्यापक", "टीचर", "पढ़ाता", "पढ़ाती", "शिक्षकों के लिए"],
    },
  },
  {
    id: "college",
    label: "Colleges",
    labelHi: "कॉलेज",
    keywords: {
      en: [
        "college", "institute", "institution", "university",
        "admission", "curricula", "for colleges", "i am a college",
      ],
      hi: ["कॉलेज", "संस्थान", "विश्वविद्यालय", "यूनिवर्सिटी", "एडमिशन", "दाखिला"],
    },
  },
];

// IDs that live inside StudentHome and only exist in the DOM when the student page is open.
const STUDENT_SUB_IDS = new Set([
  "student-overview", "student-hero", "how-it-helps",
  "concepts", "practice", "exam-prep", "progress", "ai-tutor", "faq",
]);

const NAV_TRIGGERS = {
  en: [
    "show me", "take me", "go to", "navigate", "scroll to",
    "where is", "find the", "open", "visit", "check out",
    "i want to see", "i am a", "for students", "for tutors", "for colleges",
    "go back", "back to",
  ],
  hi: [
    "दिखाओ", "दिखाइए", "ले चलो", "ले जाओ", "जाओ", "कहाँ है", "कहां है",
    "खोलो", "खोलिए", "देखना है", "मैं हूँ", "मैं हूं", "वापस",
  ],
};

// Phrases that mean "explain whatever I'm selecting / pointing at".
const EXPLAIN_TRIGGERS = {
  en: [
    "explain this", "explain it", "explain that", "explain this section",
    "explain this part", "what is this", "what's this", "what does this mean",
    "what does it mean", "tell me about this", "describe this", "what is that",
    "help me understand this", "can you explain", "explain selected",
  ],
  hi: [
    "यह समझाओ", "इसे समझाओ", "ये समझाओ", "यह समझाइए", "इसे समझाइए",
    "यह क्या है", "ये क्या है", "इसका मतलब", "यह सेक्शन समझाओ",
    "इसके बारे में बताओ", "समझाओ", "समझाइए",
  ],
};

const ROLE_CARD_IDS  = new Set(["student", "tutor", "college"]);
const NAVBAR_HEIGHT  = 64;

// ─── Spoken / UI strings, keyed by language ───────────────────────────────────
const STRINGS = {
  en: {
    talkToVidya: "Talk to Vidya",
    connecting: "Connecting…",
    greetAskRole:
      "Hi there, I'm Vidya — lovely to meet you! I'm here to help you get the most out of Classess. " +
      "So I can help you best... are you a student, a teacher, or with an institution?",
    greetHasRole:
      "Hi, I'm Vidya — great to see you! I'm here to help you get the most out of Classess. " +
      "Ask me anything, or tell me what you'd like to explore.",
    greetWelcome:
      "Hello there, and a warm welcome to Classess! I'm Vidya, your personal guide here. " +
      "Before we start... may I know your name?",
    afterName: (name) =>
      `${name ? `Lovely to meet you, ${name}! ` : "Lovely to meet you! "}` +
      "Tell me — are you a student, a teacher, or with an institution?",
    afterNameKnownRole: (name) =>
      `${name ? `Lovely to meet you, ${name}! ` : "Lovely to meet you! "}` +
      "So tell me... what's the main thing you're hoping Classess can help you with?",
    askProblem: (name) =>
      `Wonderful!${name ? ` ${name},` : ""} what's the main challenge you're hoping Classess can help you with right now?`,
    problemMatched: (label) =>
      `I completely understand... let me take you straight to ${label} — that's exactly where Classess helps with this.`,
    problemUnmatched: (name) =>
      `I hear you${name ? `, ${name}` : ""}... that's something Classess can really help with. ` +
      "Ask me about any feature, or tell me what you'd like to see first.",
    roleFallback:
      "No problem! Just let me know... are you a student, a teacher, or an institution?",
    explainHint:
      "Sure! Move your cursor over a section or select some text, then say 'explain this'.",
    offerExplain: " Would you like me to explain this section?",
    okayQuiet: "No problem! Just say 'explain this' whenever you'd like.",
    backToOverview: "Sure! Taking you back to the features overview.",
    tookYouTo: (label) => `Sure! I've taken you to the ${label} section.`,
    openingStudent: (label) =>
      `Sure! Opening the student section and taking you to ${label}.`,
    notFound: (label) =>
      `I couldn't find the ${label} section right now. ` +
      "Please make sure the student page is open and try again.",
    navMenu:
      "I can take you to Products, Features, About, or Contact. " +
      "If you're in the student section I can also open Learning Path, Concept Understanding, " +
      "Practice, Exam Preparation, Progress Tracking, or the AI Tutor. Which one would you like?",
  },
  hi: {
    talkToVidya: "विद्या से बात करें",
    connecting: "कनेक्ट हो रहा है…",
    greetAskRole:
      "नमस्ते, मैं विद्या हूँ — आपसे मिलकर अच्छा लगा! मैं यहाँ Classess में आपकी पूरी मदद के लिए हूँ। " +
      "ताकि मैं आपकी सही मदद कर सकूँ... आप छात्र हैं, शिक्षक हैं, या किसी संस्थान से?",
    greetHasRole:
      "नमस्ते, मैं विद्या हूँ — आपसे मिलकर खुशी हुई! मैं यहाँ Classess में आपकी हर तरह से मदद के लिए हूँ। " +
      "कुछ भी पूछिए, या बताइए आप क्या देखना चाहेंगे।",
    greetWelcome:
      "नमस्ते, और Classess में आपका हार्दिक स्वागत है! मैं विद्या हूँ, यहाँ आपकी निजी गाइड। " +
      "शुरू करने से पहले... क्या मैं आपका नाम जान सकती हूँ?",
    afterName: (name) =>
      `${name ? `आपसे मिलकर बहुत अच्छा लगा, ${name}! ` : "आपसे मिलकर बहुत अच्छा लगा! "}` +
      "बताइए — आप छात्र हैं, शिक्षक हैं, या किसी संस्थान से?",
    afterNameKnownRole: (name) =>
      `${name ? `आपसे मिलकर बहुत अच्छा लगा, ${name}! ` : "आपसे मिलकर बहुत अच्छा लगा! "}` +
      "तो बताइए... आप किस चीज़ में Classess से सबसे ज़्यादा मदद चाहते हैं?",
    askProblem: (name) =>
      `बहुत बढ़िया!${name ? ` ${name},` : ""} अभी आपकी सबसे बड़ी समस्या क्या है जिसमें आप मदद चाहते हैं?`,
    problemMatched: (label) =>
      `मैं अच्छी तरह समझती हूँ... चलिए मैं आपको सीधे ${label} पर ले चलती हूँ — यहीं Classess इसमें आपकी मदद करता है।`,
    problemUnmatched: (name) =>
      `मैं समझती हूँ${name ? `, ${name}` : ""}... Classess इसमें ज़रूर मदद कर सकता है। ` +
      "किसी भी फ़ीचर के बारे में पूछिए, या बताइए आप पहले क्या देखना चाहेंगे।",
    roleFallback:
      "कोई बात नहीं! बस बता दीजिए... आप छात्र हैं, शिक्षक हैं, या संस्थान?",
    explainHint:
      "ज़रूर! कर्सर को किसी सेक्शन पर ले जाएँ या कुछ टेक्स्ट चुनें, फिर कहिए 'इसे समझाओ'।",
    offerExplain: " क्या आप चाहेंगे कि मैं इस सेक्शन को समझाऊँ?",
    okayQuiet: "कोई बात नहीं! जब चाहें बस कहिए 'इसे समझाओ'।",
    backToOverview: "ज़रूर! आपको फ़ीचर्स ओवरव्यू पर वापस ले जा रही हूँ।",
    tookYouTo: (label) => `ज़रूर! मैं आपको ${label} सेक्शन पर ले आई हूँ।`,
    openingStudent: (label) =>
      `ज़रूर! स्टूडेंट सेक्शन खोल रही हूँ और आपको ${label} पर ले जा रही हूँ।`,
    notFound: (label) =>
      `मुझे अभी ${label} सेक्शन नहीं मिला। ` +
      "कृपया सुनिश्चित करें कि स्टूडेंट पेज खुला है और फिर से कोशिश करें।",
    navMenu:
      "मैं आपको प्रोडक्ट्स, फ़ीचर्स, हमारे बारे में, या संपर्क पर ले जा सकती हूँ। " +
      "अगर आप स्टूडेंट सेक्शन में हैं तो लर्निंग पाथ, कॉन्सेप्ट समझ, अभ्यास, परीक्षा तैयारी, " +
      "प्रगति ट्रैकिंग, या एआई ट्यूटर भी खोल सकती हूँ। आप कौन सा देखना चाहेंगे?",
  },
};

// Match a transcript against a keyword set that holds both languages.
function matchesKeywords(set, lower) {
  return (set.en.some((kw) => lower.includes(kw)) ||
          set.hi.some((kw) => lower.includes(kw)));
}

// Detect the language Vidya should reply in. Devanagari is obviously Hindi, but
// users often speak Hindi written in Latin letters (Hinglish) such as
// "mai ek student hu" — so we also look for common Hindi marker words that rarely
// collide with English. ("main" is deliberately left out as it is also English.)
const DEVANAGARI_RE = /[ऀ-ॿ]/;
const HINGLISH_WORDS = new Set([
  "mai", "hu", "hoon", "hun", "hai", "hain", "ho", "mujhe", "mera", "meri", "mere",
  "hum", "aap", "tum", "tumhe", "kya", "kyu", "kyun", "kaise", "kaisa", "kab", "kahan",
  "kaha", "kaun", "nahi", "nahin", "haan", "haa", "ek", "aur", "lekin", "kar", "karo",
  "karna", "karein", "raha", "rahi", "rahe", "chahiye", "chahta", "chahti", "batao",
  "bataye", "samajh", "samjhao", "samjhaiye", "dikhao", "dikhaiye", "padhai", "padhna",
  "seekh", "seekhna", "sikhna", "theek", "accha", "acha", "namaste", "namaskar",
  "shikshak", "adhyapak", "vidyarthi", "chhatra", "sansthan", "kaksha",
]);
function detectLang(text, fallback) {
  if (DEVANAGARI_RE.test(text)) return "hi";
  const tokens = text.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  if (tokens.some((w) => HINGLISH_WORDS.has(w))) return "hi";
  if (tokens.length) return "en";
  return fallback;
}

// Build the prompt that asks Vidya to explain a given section.
function explainPrompt(heading, para, lang) {
  const body = para ? para.slice(0, 500) : "";
  if (lang === "hi") {
    return `इस सेक्शन को संक्षेप में, सरल हिंदी में समझाओ — "${heading}"।` +
           (body ? ` इसमें लिखा है: "${body}"` : "");
  }
  return `Briefly explain the "${heading}" section to me in simple terms.` +
         (body ? ` It says: "${body}"` : "");
}

// Build the prompt that asks Vidya to explain a piece of selected text.
function explainSelectionPrompt(sel, lang) {
  return lang === "hi"
    ? `इस चुने हुए हिस्से को सरल हिंदी में समझाओ: "${sel}"`
    : `Briefly explain this in simple terms: "${sel}"`;
}

// Yes / no replies to the "shall I explain this section?" offer. Single-word
// English answers are matched on whole tokens so "now" doesn't read as "no".
const AFFIRM = {
  en: ["yes", "yeah", "yep", "sure", "ok", "okay", "please", "go ahead", "do it", "explain", "alright", "why not"],
  hi: ["हाँ", "हां", "हा", "जी", "जी हाँ", "हाँ जी", "ज़रूर", "जरूर", "बिल्कुल", "ठीक", "समझाओ", "समझाइए", "बताओ"],
};
const NEGATE = {
  en: ["no", "nope", "nah", "not now", "no thanks", "no thank you", "later", "don't", "dont", "never mind", "skip"],
  hi: ["नहीं", "नही", "ना", "नहीं जी", "बाद में", "अभी नहीं", "रहने दो", "छोड़ो"],
};
function consentMatch(set, lower) {
  // English single-word keys match on whole tokens (so "now" doesn't read as "no");
  // multi-word and Hindi keys match on substring. Splitting on non-ASCII-letters is
  // enough since Hindi keys never use the token path.
  const tokens = lower.split(/[^a-z]+/i).filter(Boolean);
  return set.en.some((k) => (k.includes(" ") ? lower.includes(k) : tokens.includes(k)))
      || set.hi.some((k) => lower.includes(k));
}
const isAffirmative = (lower) => consentMatch(AFFIRM, lower);
const isNegative    = (lower) => consentMatch(NEGATE, lower);

// Read a section's heading + first paragraph from the DOM by element id.
function readSection(id) {
  const el = document.getElementById(id);
  if (!el) return { heading: id, para: "" };
  return {
    heading: el.querySelector("h1, h2, h3")?.textContent?.trim() || id,
    para:    el.querySelector("p")?.textContent?.trim() || "",
  };
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  return true;
}

// Navigate to the section named in the transcript. After a successful move to a
// content section, Vidya offers to explain it and `onOffer(id)` is called so the
// caller can arm the "yes/no" follow-up.
function navigateToSection(transcript, { client, lang, onOffer }) {
  const lower = transcript.toLowerCase().trim();
  const t     = STRINGS[lang];

  for (const section of SECTION_MAP) {
    if (matchesKeywords(section.keywords, lower)) {
      const label    = lang === "hi" ? section.labelHi : section.label;
      // "Back to overview" is pure navigation — no point offering to explain it.
      const canOffer = section.id !== "student-overview";

      // Role-card sections: click the card to open the page first.
      if (ROLE_CARD_IDS.has(section.id)) {
        document.getElementById(section.id)?.click();
      }

      const scrolled = scrollToId(section.id);

      if (scrolled) {
        // Element found — scroll happened.
        if (!canOffer) {
          client.talk(t.backToOverview);
        } else {
          client.talk(t.tookYouTo(label) + t.offerExplain);
          onOffer?.(section.id);
        }
        return;
      }

      // Element not in DOM yet — for student sub-sections, open the student page
      // first, then scroll to the target after it has rendered.
      if (STUDENT_SUB_IDS.has(section.id)) {
        const studentCard = document.getElementById("student");
        if (studentCard) {
          studentCard.click(); // opens StudentPage
          const targetId = section.id;
          client.talk(t.openingStudent(label) + t.offerExplain);
          // Wait for the student page to mount before scrolling + arming the offer.
          setTimeout(() => { scrollToId(targetId); onOffer?.(targetId); }, 1400);
          return;
        }
      }

      // Element genuinely missing — tell the user.
      client.talk(t.notFound(label));
      return;
    }
  }

  const hasNavIntent = matchesKeywords(NAV_TRIGGERS, lower);
  if (hasNavIntent) {
    client.talk(t.navMenu);
  }
}

// ─── Role detection for the guided "who are you?" greeting flow ────────────────
// Teacher / institution are checked before student because their phrases often
// contain the word "student" (e.g. "I teach students", "we manage students").
const ROLE_INTENTS = [
  {
    id: "teacher",
    keywords: {
      en: [
        "teacher", "tutor", "i teach", "teaching", "educator",
        "instructor", "i am a teacher", "i'm a teacher", "faculty", "mentor",
      ],
      hi: ["शिक्षक", "अध्यापक", "टीचर", "मैं पढ़ाता", "पढ़ाती", "ट्यूटर", "गुरु",
           "shikshak", "adhyapak", "padhata", "padhati", "ustad"],
    },
    intro: {
      en: "Great to meet you! As a teacher, Classess lets you blend your teaching with smart tools, manage your students, and track everyone's progress in one place. Just ask me to show any part and I'll take you there.",
      hi: "बहुत बढ़िया! एक शिक्षक के रूप में, Classess आपको स्मार्ट टूल्स के साथ पढ़ाने, अपने छात्रों को मैनेज करने, और सबकी प्रगति एक ही जगह देखने की सुविधा देता है। बस मुझे कोई भी हिस्सा दिखाने को कहें और मैं आपको वहाँ ले चलूँगी।",
    },
  },
  {
    id: "institute",
    keywords: {
      en: [
        "institution", "institute", "college", "university", "academy",
        "school admin", "organisation", "organization", "we are a", "our institute",
        "our college", "admissions", "principal",
      ],
      hi: ["संस्थान", "कॉलेज", "विश्वविद्यालय", "यूनिवर्सिटी", "एडमिशन", "दाखिला", "प्रिंसिपल", "हमारा संस्थान", "हमारा कॉलेज",
           "sansthan", "vishwavidyalaya", "mahavidyalaya", "principal"],
    },
    intro: {
      en: "Wonderful! For institutions, Classess brings admissions, curricula, and student management together at scale. Tell me what you'd like to explore and I'll open it for you.",
      hi: "शानदार! संस्थानों के लिए, Classess एडमिशन, पाठ्यक्रम और छात्र प्रबंधन को एक साथ बड़े पैमाने पर लाता है। बताइए आप क्या देखना चाहेंगे और मैं वह खोल दूँगी।",
    },
  },
  {
    id: "student",
    keywords: {
      en: [
        "student", "i study", "i learn", "learner", "studying", "pupil",
        "i am a student", "i'm a student", "school", "exam", "preparing",
      ],
      hi: ["छात्र", "विद्यार्थी", "स्टूडेंट", "मैं पढ़ता", "पढ़ती", "सीखता", "सीखती", "परीक्षा", "स्कूल",
           "vidyarthi", "chhatra", "padhta", "padhrahi", "seekhta", "seekhti"],
    },
    intro: {
      en: "Awesome — welcome to your student space! Everything here is built around you: a personalised learning path, concept understanding, purposeful practice, exam preparation, and progress tracking. Just name any feature and I'll take you straight there.",
      hi: "बहुत अच्छा... आपके स्टूडेंट स्पेस में आपका स्वागत है! यहाँ सब कुछ आपके लिए बना है — पर्सनलाइज़्ड लर्निंग पाथ, कॉन्सेप्ट समझ, सार्थक अभ्यास, परीक्षा की तैयारी, और प्रगति ट्रैकिंग। बस किसी भी फ़ीचर का नाम लें और मैं आपको सीधे वहाँ ले चलूँगी।",
    },
  },
];

function detectRole(text) {
  const lower = text.toLowerCase();
  for (const role of ROLE_INTENTS) {
    if (matchesKeywords(role.keywords, lower)) return role;
  }
  return null;
}

// Short profiles injected as live context so Vidya personalises everything she
// says — especially "how does this help me?" — to who is actually watching.
const ROLE_PROFILES = {
  student: {
    label: "a student",
    benefits:
      "a personalised learning path, clear step-by-step concept explanations, purposeful practice, exam preparation, real-time progress tracking, and a 24/7 AI tutor — all to help them learn faster and feel confident.",
  },
  teacher: {
    label: "a teacher",
    benefits:
      "planning lessons, creating academic resources, assessing student work, giving meaningful feedback, and seeing exactly who needs support — so they spend less time on admin and more time improving learning.",
  },
  institute: {
    label: "an institution",
    benefits:
      "connecting curriculum, teaching, assessment, student support, and leadership insights into one academic intelligence layer — improving outcomes and consistency across the whole institution.",
  },
};

// ─── Onboarding: map a user's stated PROBLEM to the section that solves it ─────
// Keyed by role, because each role's page has its own sections. The first route
// whose keywords appear in the problem wins. `id` is the in-page element id to
// scroll to (the role's page is already open by this point).
const PROBLEM_ROUTES = {
  student: [
    { id: "concepts",      label: "Concept Understanding", labelHi: "कॉन्सेप्ट समझ",   kw: ["understand", "concept", "samajh", "theory", "topic", "confus", "difficult", "hard", "tough", "samajhna"] },
    { id: "practice",      label: "Purposeful Practice",   labelHi: "अभ्यास",          kw: ["practice", "exercise", "solve", "abhyas", "question", "problems"] },
    { id: "exam-prep",     label: "Exam Preparation",      labelHi: "परीक्षा तैयारी",  kw: ["exam", "test", "prepare", "preparation", "syllabus", "pariksha", "board", "revision", "revise"] },
    { id: "progress",      label: "Progress Tracking",     labelHi: "प्रगति ट्रैकिंग", kw: ["progress", "track", "improve", "marks", "score", "weak", "result", "performance"] },
    { id: "student-hero",  label: "Learning Path",         labelHi: "लर्निंग पाथ",     kw: ["plan", "what to study", "schedule", "routine", "where to start", "path", "time", "manage time", "kya padhu"] },
    { id: "ai-tutor",      label: "AI Tutor",              labelHi: "एआई ट्यूटर",      kw: ["tutor", "doubt", "stuck", "ask", "explain", "help me", "guidance"] },
  ],
  teacher: [
    { id: "planning",          label: "Lesson Planning",       labelHi: "लेसन प्लानिंग",     kw: ["plan", "lesson", "prepare", "curriculum", "resource", "create", "content", "material"] },
    { id: "assessment",        label: "Assessment & Feedback", labelHi: "मूल्यांकन",          kw: ["assess", "grade", "grading", "feedback", "marking", "evaluate", "check", "correct"] },
    { id: "insights",          label: "Student Insights",      labelHi: "स्टूडेंट इनसाइट्स",  kw: ["who needs", "struggling", "insight", "support", "intervention", "weak student", "identify", "track student"] },
    { id: "classroom",         label: "Classroom Understanding", labelHi: "क्लासरूम समझ",    kw: ["classroom", "understand", "engagement", "live", "participation"] },
    { id: "ai-control",        label: "Teacher-Controlled AI", labelHi: "एआई कंट्रोल",       kw: ["automate", "save time", "admin", "workload", "control ai", "less time"] },
    { id: "teaching-workflow", label: "Teaching Workflow",     labelHi: "टीचिंग वर्कफ़्लो",   kw: ["workflow", "manage", "organize", "organise", "everything", "connect", "disconnected"] },
  ],
  institute: [
    { id: "academic-system",  label: "Academic System",     labelHi: "अकादमिक सिस्टम",     kw: ["system", "connect", "data", "dashboard", "academic", "visibility", "oversight"] },
    { id: "teacher-capacity", label: "Teacher Capacity",    labelHi: "टीचर कैपेसिटी",      kw: ["teacher", "capacity", "consistency", "quality", "staff", "training"] },
    { id: "student-learning", label: "Student Learning",    labelHi: "स्टूडेंट लर्निंग",    kw: ["student", "learning", "support", "intervention", "dropout", "at risk"] },
    { id: "outcomes",         label: "Measurable Outcomes", labelHi: "नतीजे",              kw: ["result", "outcome", "performance", "improve", "ranking", "metric"] },
    { id: "implementation",   label: "Integration",         labelHi: "इंटीग्रेशन",         kw: ["integrate", "implement", "rollout", "existing", "setup", "migration", "onboard"] },
    { id: "trust",            label: "Trust & Privacy",     labelHi: "ट्रस्ट और प्राइवेसी", kw: ["privacy", "trust", "security", "data protection", "governance", "compliance"] },
  ],
};

function matchProblem(roleId, lower) {
  const routes = PROBLEM_ROUTES[roleId] || PROBLEM_ROUTES.student;
  for (const r of routes) {
    if (r.kw.some((k) => lower.includes(k))) return r;
  }
  return null;
}

// Pull a likely first name out of a spoken introduction. Returns null if the
// utterance doesn't look like a name (so we just continue without one).
const NON_NAME_WORDS = new Set([
  "student", "students", "teacher", "tutor", "institute", "institution", "college", "university",
  "yes", "no", "yeah", "nope", "fine", "good", "ok", "okay", "nothing", "hello", "hi", "hey", "na",
  "i", "im", "me", "my", "name", "is", "am", "a", "an", "the", "from", "with", "here", "actually",
]);
function extractName(text) {
  let t = (text || "").trim();
  t = t.replace(/^(hi|hello|hey|yeah|yes|so|well|um+|uh+)\b[\s,.!]*/i, "");
  t = t.replace(/\b(my name is|my name's|i am|i'm|im|this is|myself|call me|name is|it's|its)\b[\s,.!]*/i, "");
  const words = (t.match(/[^\s,.!?]+/g) || []).slice(0, 2);
  if (!words.length) return null;
  if (NON_NAME_WORDS.has(words[0].toLowerCase())) return null;
  return words.join(" ").replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

// ─────────────────────────────────────────────────────────────────────────────

export default function VoiceAssistant() {
  const [status,    setStatus]    = useState("idle"); // idle | connecting | live | error
  const [muted,     setMuted]     = useState(false);
  const [error,     setError]     = useState(null);
  const [idleMedia, setIdleMedia] = useState(null);  // { videoUrl, imageUrl }
  const [language,  setLanguage]  = useState(
    () => (typeof localStorage !== "undefined" && localStorage.getItem(LANG_STORAGE_KEY)) || "en"
  );
  const { activeRoleId, selectRole } = useRole();

  const clientRef        = useRef(null);
  const lastUserMsgRef   = useRef(null);
  const greetingRef      = useRef(null);      // first line Vidya speaks once live
  const phaseRef         = useRef("await-role"); // "await-role" | "active"
  const statusRef        = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);

  // Keep the chosen language readable inside stable callbacks, and persist it.
  const langRef = useRef(language);
  useEffect(() => {
    langRef.current = language;
    try { localStorage.setItem(LANG_STORAGE_KEY, language); } catch { /* ignore */ }
  }, [language]);

  // After navigating to a section, Vidya offers to explain it. This holds the
  // pending section ({ id, heading, para }) until the user answers yes / no.
  const pendingExplainRef = useRef(null);

  // The section the cursor is currently resting on (or last navigated to), so
  // that "explain this" always has a concrete target to explain.
  const currentSectionRef = useRef(null);

  // Onboarding conversation: the user's name and chosen role, captured in the
  // welcome → name → role → problem flow.
  const nameRef   = useRef(null);
  const roleIdRef = useRef(null);

  // Keep the current role readable inside stable callbacks (wake-word / SDK events).
  const activeRoleIdRef = useRef(activeRoleId);
  useEffect(() => { activeRoleIdRef.current = activeRoleId; }, [activeRoleId]);

  // ── "Explain this" support ────────────────────────────────────────────────
  // Keep Vidya aware of what the user has SELECTED or is POINTING AT, by feeding
  // it as live context. Then the user can simply say "explain this / explain it".
  const lastContextRef = useRef("");

  const pushContext = (content) => {
    if (!content || statusRef.current !== "live" || !clientRef.current) return;
    if (content === lastContextRef.current) return;
    lastContextRef.current = content;
    try { clientRef.current.addContext(content); } catch { /* not streaming yet */ }
  };

  // Tell Vidya who she's talking to, so she personalises her answers (especially
  // "how does this help me?"). Sent as soon as the role is known.
  const pushRoleContext = (roleId) => {
    const p = ROLE_PROFILES[roleId];
    if (!p || !clientRef.current) return;
    try {
      clientRef.current.addContext(
        `ABOUT THIS USER: You are talking with ${p.label}. For ${p.label}, Classess helps with ${p.benefits} ` +
        `Make everything personal for them — speak to their goals using "you" and "your". When they ask how Classess ` +
        `or any feature helps them, answer specifically and warmly for ${p.label} with a concrete benefit, then offer to show them.`
      );
    } catch { /* not streaming yet */ }
  };

  // Track highlighted text.
  useEffect(() => {
    let t;
    const onSelect = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const text = (window.getSelection?.()?.toString() || "").trim();
        if (text.length >= 3) {
          pushContext(
            `The user has just selected this text on the page: "${text.slice(0, 700)}". ` +
            `If they ask you to "explain this", "explain it", or anything similar, explain THIS selected text.`
          );
        }
      }, 400);
    };
    document.addEventListener("selectionchange", onSelect);
    return () => { clearTimeout(t); document.removeEventListener("selectionchange", onSelect); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track which section the cursor is hovering over and keep it as live context,
  // so that wherever the cursor rests, saying "explain this" explains that part.
  useEffect(() => {
    let t, lastId = "";
    const onOver = (e) => {
      const section = e.target?.closest?.("section[id]");
      if (!section || section.id === lastId) return;
      lastId = section.id;
      clearTimeout(t);
      t = setTimeout(() => {
        const heading = section.querySelector("h1, h2, h3")?.textContent?.trim() || section.id;
        const para    = section.querySelector("p")?.textContent?.trim() || "";
        currentSectionRef.current = { heading, para };
        pushContext(
          `The user is currently pointing at the "${heading}" section of the page. ` +
          (para ? `It says: "${para.slice(0, 500)}". ` : "") +
          `If they ask to explain "this" or "this section", explain this part.`
        );
      }, 450);
    };
    document.addEventListener("mouseover", onOver, true);
    return () => { clearTimeout(t); document.removeEventListener("mouseover", onOver, true); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch the avatar's idling video URL on mount (signed URL, fresh each load).
  useEffect(() => {
    fetch("/api/anam-avatar")
      .then((r) => r.json())
      .then((d) => { if (d.videoUrl || d.imageUrl) setIdleMedia(d); })
      .catch(() => {});
  }, []);

  // Wake-word listener: auto-starts the session when "vidya" is heard while idle.
  // A single en-US recogniser reliably catches "hello vidya" / "namaste vidya" /
  // "vidya". The greeting language is a best-effort guess from the wake phrase;
  // from there the conversation adapts to whatever language the user speaks.
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || status !== "idle") return;

    const recognition = new SR();
    recognition.continuous     = true;
    recognition.interimResults = true;
    recognition.lang           = "en-US";

    let triggered = false;

    recognition.onresult = (e) => {
      if (triggered) return;
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ")
        .toLowerCase();
      // Wake on "vidya" / "hi vidya" / "hello vidya" (+ common mis-hearings),
      // or the Devanagari form "विद्या".
      if (/\b(vidya|vidhya|widya|video assistant)\b/.test(transcript) ||
          /विद्या|विधा/.test(transcript)) {
        triggered = true;
        recognition.stop();
        // Best-effort greeting language: a Hindi greeting like "namaste vidya"
        // starts in Hindi; everything afterwards adapts per utterance anyway.
        const wakeLang =
          DEVANAGARI_RE.test(transcript) || /namaste|namaskar|pranam/.test(transcript)
            ? "hi" : "en";
        start(wakeLang);
      }
    };

    recognition.onerror = () => {};

    // Restart on silence so the listener stays alive.
    recognition.onend = () => {
      if (!triggered) {
        try { recognition.start(); } catch { /* already started */ }
      }
    };

    try { recognition.start(); } catch { /* mic not available yet */ }

    return () => {
      triggered = true;          // prevents restart in onend
      recognition.onend = null;
      try { recognition.stop(); } catch { /* already stopped */ }
    };
  }, [status]); // stops when status leaves "idle", restarts when it returns

  const stop = async () => {
    try { await clientRef.current?.stopStreaming(); } catch { /* already stopped */ }
    clientRef.current      = null;
    lastUserMsgRef.current = null;
    greetingRef.current    = null;
    phaseRef.current       = "await-role";
    setStatus("idle");
    setMuted(false);
    // Refresh the idle video URL — the signed URL expires after 1 hour.
    fetch("/api/anam-avatar")
      .then((r) => r.json())
      .then((d) => { if (d.videoUrl || d.imageUrl) setIdleMedia(d); })
      .catch(() => {});
  };

  // Switch language. If a session is live, end it so the new voice + prompt apply
  // cleanly on the next start (the user re-triggers with the wake word or a tap).
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
    if (statusRef.current === "live" || statusRef.current === "connecting") {
      stop();
    }
  };

  useEffect(() => {
    return () => { clientRef.current?.stopStreaming().catch(() => {}); };
  }, []);

  const start = async (langOverride) => {
    if (status === "connecting" || status === "live") return;

    // Greet (and load the voice) in the language the user woke Vidya with;
    // fall back to the toggle when started by a tap. `langOverride` is only a
    // string from the wake-word path — guard against a click event being passed.
    const lang = (typeof langOverride === "string" ? langOverride : null) || langRef.current;
    if (lang !== langRef.current) {
      langRef.current = lang;  // keep stable callbacks in sync right away
      setLanguage(lang);       // update the toggle + persisted choice
    }

    setStatus("connecting");
    setError(null);

    const t = STRINGS[lang];

    // Always open with the friendly onboarding flow: welcome → name → role →
    // problem. If a role was already picked (e.g. via a role card), we remember
    // it and skip the role question after getting their name.
    nameRef.current     = null;
    roleIdRef.current   = activeRoleIdRef.current || null;
    phaseRef.current    = "await-name";
    greetingRef.current = t.greetWelcome;
    lastUserMsgRef.current = null;

    try {
      const res = await fetch("/api/anam-session-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang }),
      });
      if (!res.ok) throw new Error(`Token request failed (${res.status})`);
      const { sessionToken } = await res.json();
      if (!sessionToken) throw new Error("No session token returned");

      const client = createClient(sessionToken);
      clientRef.current = client;

      // ── Readiness gate ──────────────────────────────────────────────────
      // Only speak the greeting once BOTH the video is playing AND the session
      // is fully ready — otherwise the first words clip/stutter on startup.
      let videoReady = false, sessionReady = false, greeted = false;
      const maybeGreet = () => {
        if (greeted || !videoReady || !sessionReady) return;
        const greeting = greetingRef.current;
        if (!greeting) return;
        greeted = true;
        greetingRef.current = null;
        // Brief settle so the stream is smooth before she starts talking.
        setTimeout(() => clientRef.current?.talk(greeting), 450);
      };

      client.addListener(EVT_VIDEO_PLAY_STARTED, () => {
        setStatus("live");
        videoReady = true;
        maybeGreet();
      });
      client.addListener(EVT_CONNECTION_CLOSED, () => stop());

      // React to what the user says (registered once the session is ready).
      client.addListener(EVT_SESSION_READY, () => {
        sessionReady = true;
        // If we already know the user's role, personalise Vidya from the start.
        if (activeRoleIdRef.current) pushRoleContext(activeRoleIdRef.current);
        client.addListener(EVT_MSG_HISTORY, (messages) => {
          const userMsgs = messages.filter((m) => m.role === "user");
          const latest   = userMsgs[userMsgs.length - 1];
          if (!latest || latest.id === lastUserMsgRef.current) return;
          lastUserMsgRef.current = latest.id;
          handleUserSpeech(latest.content || "");
        });
        maybeGreet();
      });

      // Natural turn-taking: when the user starts speaking, stop Vidya so she
      // never talks over them — keeps the conversation clear and continuous.
      client.addListener(EVT_USER_SPEECH_STARTED, () => {
        if (!greeted) return; // don't cut off the opening greeting
        try { clientRef.current?.interruptPersona(); } catch { /* noop */ }
      });

      await client.streamToVideoElement(VIDEO_ID);
    } catch (err) {
      setError(err.message || "Could not start the assistant");
      setStatus("error");
      clientRef.current = null;
    }
  };

  // Routes a user utterance: in the greeting phase we detect their role and open
  // that page; afterwards we treat speech as section-navigation commands.
  const handleUserSpeech = (text) => {
    const client = clientRef.current;
    if (!client) return;

    // Reply in whatever language the user just spoke (falls back to the toggle).
    const lang  = detectLang(text, langRef.current);
    const t     = STRINGS[lang];
    const lower = text.toLowerCase();

    // ── Onboarding step 1: their name ─────────────────────────────────────
    if (phaseRef.current === "await-name") {
      const name = extractName(text);
      nameRef.current = name;
      if (name) {
        try {
          client.addContext(`The user's name is ${name}. Address them by their name occasionally and warmly.`);
        } catch { /* not streaming yet */ }
      }
      if (roleIdRef.current) {
        // Role already known → skip straight to asking about their problem.
        phaseRef.current = "await-problem";
        client.talk(t.afterNameKnownRole(name));
      } else {
        phaseRef.current = "await-role";
        client.talk(t.afterName(name));
      }
      return;
    }

    // ── Onboarding step 2: their role ─────────────────────────────────────
    if (phaseRef.current === "await-role") {
      const role = detectRole(text);
      if (role) {
        roleIdRef.current = role.id;
        selectRole(role.id);                 // opens the role's page (LandingPage scrolls to it)
        pushRoleContext(role.id);            // personalise every later answer for this role
        phaseRef.current = "await-problem";
        // Let the page mount, then ask what they're hoping to solve.
        setTimeout(() => clientRef.current?.talk(t.askProblem(nameRef.current)), 1500);
      } else {
        client.talk(t.roleFallback);
      }
      return;
    }

    // ── Onboarding step 3: their problem → navigate to the right section ──
    if (phaseRef.current === "await-problem") {
      phaseRef.current = "active";
      try {
        client.addContext(`The user's main challenge is: "${text.slice(0, 300)}". Relate your help to this whenever relevant.`);
      } catch { /* not streaming yet */ }

      const route = matchProblem(roleIdRef.current, lower);
      if (route) {
        const label = lang === "hi" ? (route.labelHi || route.label) : route.label;
        client.talk(t.problemMatched(label) + t.offerExplain);
        const id = route.id;
        // Scroll once (the role's page is already mounted), then arm "yes/explain".
        setTimeout(() => {
          scrollToId(id);
          const { heading, para } = readSection(id);
          currentSectionRef.current = { heading, para };
          pendingExplainRef.current = { id, heading, para };
        }, 900);
      } else {
        client.talk(t.problemUnmatched(nameRef.current));
      }
      return;
    }

    // Just offered to explain the section we navigated to? Honour yes / no.
    if (pendingExplainRef.current) {
      const pending = pendingExplainRef.current;
      if (isNegative(lower)) {
        pendingExplainRef.current = null;
        client.talk(t.okayQuiet);            // step back, stay quiet until asked
        return;
      }
      if (isAffirmative(lower)) {
        pendingExplainRef.current = null;
        try { client.interruptPersona(); } catch { /* nothing playing */ }
        client.sendUserMessage(explainPrompt(pending.heading, pending.para, lang));
        return;
      }
      // Anything else → drop the offer and handle the utterance normally.
      pendingExplainRef.current = null;
    }

    // "Explain this / it / this section" → explain whatever the cursor is resting
    // on (or the section we just navigated to). We drive the explanation directly
    // with sendUserMessage so it is reliable, instead of hoping the LLM picks up
    // the injected context on its own.
    if (matchesKeywords(EXPLAIN_TRIGGERS, lower)) {
      const sel = (window.getSelection?.()?.toString() || "").trim();
      try { client.interruptPersona(); } catch { /* nothing playing */ }
      if (sel.length >= 3) {
        client.sendUserMessage(explainSelectionPrompt(sel.slice(0, 700), lang));
      } else if (currentSectionRef.current) {
        const { heading, para } = currentSectionRef.current;
        client.sendUserMessage(explainPrompt(heading, para, lang));
      } else {
        client.talk(t.explainHint);
      }
      return;
    }

    // Navigate, then offer to explain the destination section.
    navigateToSection(text, {
      client,
      lang,
      onOffer: (id) => {
        const { heading, para } = readSection(id);
        currentSectionRef.current = { heading, para }; // so "explain this" targets it later
        pushContext(
          `The user is now looking at the "${heading}" section. ` +
          (para ? `It says: "${para.slice(0, 500)}". ` : "") +
          `If they say "yes" or "explain this", explain this section.`
        );
        pendingExplainRef.current = { id, heading, para };
      },
    });
  };

  const toggleMute = () => {
    const client = clientRef.current;
    if (!client) return;
    if (muted) { client.unmuteInputAudio(); setMuted(false); }
    else        { client.muteInputAudio();  setMuted(true);  }
  };

  const isIdle = status === "idle";
  const t      = STRINGS[language];

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-[90] w-[220px] overflow-hidden rounded-2xl ${
        isIdle ? "cursor-pointer" : ""
      }`}
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={isIdle ? () => start() : undefined}
    >
      {/* ── Avatar video area (no card, no background) ─────────────── */}
      <div className="relative aspect-[3/4]">

        {/* Real Anam stream — always in DOM so SDK can attach */}
        <video
          id={VIDEO_ID}
          autoPlay
          playsInline
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            status === "live" ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
        />

        {/* ── Language toggle (top-right) — sets the starting language ── */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleLanguage(); }}
          aria-label={language === "en" ? "Switch starting language to Hindi" : "Switch starting language to English"}
          className="absolute right-2.5 top-2.5 z-10 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          {language === "en" ? "EN" : "हिं"}
        </button>

        {/* ── Idle: looping avatar video ── */}
        {isIdle && (
          <div className="absolute inset-0">
            {idleMedia?.videoUrl ? (
              <video
                src={idleMedia.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            ) : idleMedia?.imageUrl ? (
              <img
                src={idleMedia.imageUrl}
                alt="Vidya"
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #0f172a 100%)",
                }}
              />
            )}

            {/* "Talk to Vidya" overlay at the bottom */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 bg-gradient-to-t from-black/65 via-black/5 to-transparent">
              <motion.div
                className="flex flex-col items-center gap-2"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/30">
                  <Mic size={18} className="text-white" />
                </div>
                <span className="text-[12px] font-semibold text-white/90 tracking-wide">
                  {t.talkToVidya}
                </span>
              </motion.div>
            </div>
          </div>
        )}

        {/* ── Connecting ── */}
        {status === "connecting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-900">
            <Loader2 size={26} className="animate-spin text-white" />
            <p className="text-[12px] text-neutral-300">{t.connecting}</p>
          </div>
        )}

        {/* ── Error ── */}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-900">
            <X size={26} className="text-red-400" />
            <p className="px-5 text-center text-[12px] text-neutral-300">{error}</p>
            <button
              onClick={(e) => { e.stopPropagation(); start(); }}
              className="mt-1 rounded-lg bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-white/20"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Live badge (top-left) ── */}
        {status === "live" && (
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[10px] font-semibold text-white">Live</span>
          </div>
        )}

        {/* ── Active controls overlay (bottom) ── */}
        {(status === "live" || status === "connecting") && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 px-3 pb-3 pt-8 bg-gradient-to-t from-black/60 to-transparent">
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              disabled={status !== "live"}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-colors hover:bg-white/30 disabled:opacity-40"
            >
              {muted ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); stop(); }}
              aria-label="End conversation"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
            >
              <Phone size={15} className="rotate-[135deg]" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
