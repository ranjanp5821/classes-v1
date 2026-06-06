/**
 * CoursesSection.jsx — Courses content block for the scrollable Institute page.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Clock, Tag, BookOpen, Plus } from "lucide-react";

const MOCK_COURSES = [
  {
    id: 1,
    title: "Advanced Web Engineering",
    category: "Computer Science",
    instructor: "Dr. Clara Barton",
    students: 154,
    status: "Active",
    duration: "12 Weeks",
    avgCompletion: 84,
    color: "linear-gradient(135deg, #6366f1, #818cf8)",
  },
  {
    id: 2,
    title: "Introduction to Data Science",
    category: "Data & Math",
    instructor: "Prof. Arthur Pendelton",
    students: 230,
    status: "Popular",
    duration: "10 Weeks",
    avgCompletion: 91,
    color: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    category: "Design",
    instructor: "Sarah Jenkins",
    students: 98,
    status: "Active",
    duration: "8 Weeks",
    avgCompletion: 76,
    color: "linear-gradient(135deg, #f59e0b, #fbbf24)",
  },
  {
    id: 4,
    title: "Machine Learning Foundations",
    category: "AI & CS",
    instructor: "Dr. Clara Barton",
    students: 112,
    status: "Draft",
    duration: "14 Weeks",
    avgCompletion: 0,
    color: "linear-gradient(135deg, #ec4899, #f472b6)",
  },
  {
    id: 5,
    title: "English Literature & Creative Writing",
    category: "Arts",
    instructor: "Diana Prince",
    students: 65,
    status: "Active",
    duration: "6 Weeks",
    avgCompletion: 88,
    color: "linear-gradient(135deg, #10b981, #34d399)",
  },
  {
    id: 6,
    title: "Quantum Physics & Relativity",
    category: "Science",
    instructor: "Albert E. Neumann",
    students: 48,
    status: "Active",
    duration: "16 Weeks",
    avgCompletion: 68,
    color: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  },
];

const CATEGORIES = ["All", "Computer Science", "Data & Math", "Design", "AI & CS", "Arts", "Science"];

export default function CoursesSection({ accent, accentGradient }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = MOCK_COURSES.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
        <div className="relative max-w-sm w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search courses or instructors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-[13.5px] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all"
            style={{ "--tw-ring-color": `${accent}44` }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => {
            const sel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all ${
                  sel ? "text-white shadow-sm" : "text-neutral-500 bg-white border border-neutral-200 hover:border-neutral-300"
                }`}
                style={sel ? { background: accentGradient } : {}}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Course Cards */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((course) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-200"
            >
              {/* Banner */}
              <div className="h-28 flex flex-col justify-end p-4 relative" style={{ background: course.color }}>
                <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/90 bg-black/20 backdrop-blur-sm">
                  {course.status}
                </span>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-white/70 flex items-center gap-1">
                  <Tag size={9} />{course.category}
                </span>
                <h3 className="text-[15px] font-bold text-white font-display mt-0.5 leading-tight drop-shadow-sm">
                  {course.title}
                </h3>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] text-white"
                      style={{ background: accentGradient }}
                    >
                      {course.instructor.split(" ").slice(-1)[0][0]}
                    </div>
                    <span className="text-[12px] text-neutral-500 font-medium">
                      <strong className="text-neutral-700">{course.instructor}</strong>
                    </span>
                  </div>
                  <div className="flex gap-4 text-[11.5px] text-neutral-400 font-semibold">
                    <span className="flex items-center gap-1"><Users size={12} />{course.students} students</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{course.duration}</span>
                  </div>
                </div>

                {course.status !== "Draft" ? (
                  <div className="mt-4 pt-4 border-t border-neutral-50">
                    <div className="flex justify-between text-[11.5px] font-semibold text-neutral-400 mb-1.5">
                      <span>Avg. Completion</span>
                      <span className="text-neutral-700 font-bold">{course.avgCompletion}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${course.avgCompletion}%`, background: accent }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-dashed border-neutral-150 text-center text-[11.5px] font-bold text-neutral-300 py-1">
                    <BookOpen size={12} className="inline mr-1" />Under Construction
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-14 bg-white rounded-2xl border border-neutral-100 mt-4">
          <BookOpen size={32} className="mx-auto text-neutral-300 mb-3" />
          <p className="text-[13.5px] font-bold text-neutral-500">No courses match your search.</p>
        </div>
      )}
    </div>
  );
}
