/**
 * LibrarySection.jsx — Saved resources & reading material for the Student page.
 */
import { motion } from "framer-motion";
import { FileText, Video, Headphones, BookMarked, Download } from "lucide-react";

const TYPE = {
  pdf:   { icon: FileText, label: "PDF", color: "#ef4444", bg: "#fef2f2" },
  video: { icon: Video, label: "Video", color: "#6366f1", bg: "#eef2ff" },
  audio: { icon: Headphones, label: "Audio", color: "#10b981", bg: "#ecfdf5" },
  book:  { icon: BookMarked, label: "eBook", color: "#f59e0b", bg: "#fffbeb" },
};

const RESOURCES = [
  { id: 1, title: "Clean Architecture — Notes", meta: "PDF · 2.4 MB", type: "pdf" },
  { id: 2, title: "Neural Networks Explained", meta: "Video · 42 min", type: "video" },
  { id: 3, title: "Design Systems Handbook", meta: "eBook · 318 pages", type: "book" },
  { id: 4, title: "Calculus Lecture — Week 6", meta: "Audio · 58 min", type: "audio" },
  { id: 5, title: "REST vs GraphQL Cheatsheet", meta: "PDF · 1.1 MB", type: "pdf" },
  { id: 6, title: "Storytelling for Speakers", meta: "Video · 27 min", type: "video" },
];

export default function LibrarySection({ accent }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {RESOURCES.map((r, i) => {
        const t = TYPE[r.type];
        const Icon = t.icon;
        return (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.05, duration: 0.42 }}
            className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group hover:-translate-y-0.5 transition-transform duration-200"
          >
            <div className="p-3 rounded-xl shrink-0" style={{ background: t.bg, color: t.color }}>
              <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold text-neutral-900 truncate">{r.title}</div>
              <div className="text-[11.5px] text-neutral-400 mt-0.5">{r.meta}</div>
            </div>
            <button
              className="p-2 rounded-lg text-neutral-300 hover:text-neutral-600 hover:bg-neutral-50 transition-colors shrink-0"
              style={{ color: accent }}
              aria-label={`Download ${r.title}`}
            >
              <Download size={16} />
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
