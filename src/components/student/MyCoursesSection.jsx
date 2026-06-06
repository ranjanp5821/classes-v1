/**
 * MyCoursesSection.jsx — Enrolled courses grid for the scrollable Student page.
 */
import { motion } from "framer-motion";
import { PlayCircle, BookOpen } from "lucide-react";

const COURSES = [
  { id: 1, title: "Advanced Web Engineering", instructor: "Dr. Clara Barton", progress: 72, lessons: "18 / 25 lessons", category: "Development" },
  { id: 2, title: "Data Science Foundations", instructor: "Prof. Alan Reyes", progress: 45, lessons: "9 / 20 lessons", category: "Data" },
  { id: 3, title: "UI/UX Design Principles", instructor: "Mara Whitfield", progress: 90, lessons: "27 / 30 lessons", category: "Design" },
  { id: 4, title: "Calculus II", instructor: "Dr. Hideo Nakamura", progress: 30, lessons: "6 / 20 lessons", category: "Mathematics" },
  { id: 5, title: "Intro to Machine Learning", instructor: "Dr. Priya Anand", progress: 12, lessons: "3 / 24 lessons", category: "AI" },
  { id: 6, title: "Public Speaking & Rhetoric", instructor: "James Okoro", progress: 60, lessons: "12 / 20 lessons", category: "Communication" },
];

export default function MyCoursesSection({ accent, accentGradient }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {COURSES.map((course, i) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200"
        >
          {/* Banner */}
          <div className="h-24 relative flex items-center justify-center" style={{ background: accentGradient }}>
            <BookOpen size={28} className="text-white/90" />
            <span className="absolute top-3 left-3 text-[10.5px] font-bold uppercase tracking-wider text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
              {course.category}
            </span>
          </div>

          <div className="p-5">
            <div className="text-[15px] font-bold text-neutral-900 font-display leading-snug">{course.title}</div>
            <div className="text-[12.5px] text-neutral-400 mt-1">{course.instructor}</div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11.5px] font-semibold mb-1.5">
                <span className="text-neutral-400">{course.lessons}</span>
                <span style={{ color: accent }}>{course.progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${course.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: accentGradient }}
                />
              </div>
            </div>

            <button
              className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
              style={{ background: accentGradient }}
            >
              <PlayCircle size={15} />
              Resume
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
