/**
 * StudentsSection.jsx — Roster of the tutor's students (Teacher page).
 */
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const STUDENTS = [
  { id: 1, name: "Sarah Jenkins", avatar: "SJ", course: "Advanced Web Engineering", progress: 72, last: "2h ago" },
  { id: 2, name: "Brandon Stark", avatar: "BS", course: "Intro to Machine Learning", progress: 38, last: "Yesterday" },
  { id: 3, name: "Mara Whitfield", avatar: "MW", course: "UI/UX Design Principles", progress: 91, last: "5h ago" },
  { id: 4, name: "Hideo Nakamura", avatar: "HN", course: "Data Science Foundations", progress: 54, last: "3d ago" },
  { id: 5, name: "Priya Anand", avatar: "PA", course: "Advanced Web Engineering", progress: 67, last: "1h ago" },
];

export default function StudentsSection({ accent, accentGradient }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header row */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100">
        <div className="col-span-4">Student</div>
        <div className="col-span-4">Course</div>
        <div className="col-span-3">Progress</div>
        <div className="col-span-1 text-right">Active</div>
      </div>

      {STUDENTS.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className="grid grid-cols-12 gap-4 items-center px-5 py-4 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/60 transition-colors"
        >
          {/* Student */}
          <div className="col-span-12 md:col-span-4 flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
              style={{ background: accentGradient }}
            >
              {s.avatar}
            </div>
            <span className="text-[14px] font-semibold text-neutral-900 truncate">{s.name}</span>
          </div>

          {/* Course */}
          <div className="col-span-6 md:col-span-4 text-[12.5px] text-neutral-500 truncate">{s.course}</div>

          {/* Progress */}
          <div className="col-span-4 md:col-span-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-neutral-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: accentGradient }} />
            </div>
            <span className="text-[11.5px] font-semibold w-8 text-right" style={{ color: accent }}>{s.progress}%</span>
          </div>

          {/* Last active + actions */}
          <div className="col-span-2 md:col-span-1 flex items-center justify-end gap-1">
            <span className="hidden lg:inline text-[11.5px] text-neutral-400 mr-1">{s.last}</span>
            <button className="p-1.5 rounded-lg text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100 transition-colors" aria-label={`Email ${s.name}`}>
              <Mail size={14} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
