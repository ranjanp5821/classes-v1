/**
 * MyClassesSection.jsx — Active classes the tutor teaches (Teacher page).
 */
import { motion } from "framer-motion";
import { Users, Star, CalendarClock, MoreHorizontal } from "lucide-react";

const CLASSES = [
  { id: 1, title: "Advanced Web Engineering", students: 128, rating: 4.9, next: "Today · 4:00 PM", status: "Live" },
  { id: 2, title: "Data Science Foundations", students: 96, rating: 4.7, next: "Tomorrow · 10:00 AM", status: "Scheduled" },
  { id: 3, title: "UI/UX Design Principles", students: 152, rating: 4.8, next: "Wed · 2:00 PM", status: "Scheduled" },
  { id: 4, title: "Intro to Machine Learning", students: 74, rating: 4.6, next: "Fri · 11:00 AM", status: "Draft" },
];

const STATUS = {
  Live:      { color: "#10b981", bg: "#ecfdf5" },
  Scheduled: { color: "#6366f1", bg: "#eef2ff" },
  Draft:     { color: "#94a3b8", bg: "#f1f5f9" },
};

export default function MyClassesSection({ accent, accentGradient }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {CLASSES.map((c, i) => {
        const s = STATUS[c.status];
        return (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group hover:-translate-y-0.5 transition-transform duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10.5px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="text-[16px] font-bold text-neutral-900 font-display mt-2 leading-snug">{c.title}</div>
              </div>
              <button className="p-1.5 rounded-lg text-neutral-300 hover:text-neutral-600 hover:bg-neutral-50 transition-colors shrink-0">
                <MoreHorizontal size={16} />
              </button>
            </div>

            <div className="flex items-center gap-5 mt-4 text-[12.5px] text-neutral-500 font-medium">
              <span className="inline-flex items-center gap-1.5"><Users size={13} style={{ color: accent }} />{c.students} students</span>
              <span className="inline-flex items-center gap-1.5"><Star size={13} className="text-amber-400 fill-amber-400" />{c.rating}</span>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
              <span className="inline-flex items-center gap-1.5 text-[12.5px] text-neutral-400 font-medium">
                <CalendarClock size={13} />{c.next}
              </span>
              <button
                className="text-[12.5px] font-semibold px-3.5 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90 active:scale-95"
                style={{ background: accentGradient }}
              >
                Manage
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
