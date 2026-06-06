import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Filter, Users, BookOpen, Clock, Tag } from "lucide-react";
import { useRole } from "../../hooks/useRole";

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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function CoursesView() {
  const { activeRoleConfig } = useRole();
  const accentColor = activeRoleConfig?.accent ?? "#6366f1";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses = MOCK_COURSES.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-8 pt-24 pb-16 min-h-screen bg-neutral-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-display">
            Courses Catalog
          </h1>
          <p className="text-[14.5px] text-neutral-500 mt-1">
            Create, manage, and monitor all student curricula.
          </p>
        </div>
        <div>
          <button 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14.5px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 shadow-sm"
            style={{ background: activeRoleConfig?.accentGradient ?? accentColor }}
          >
            <Plus size={16} />
            Create Course
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses or instructors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-[14.5px] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all"
            style={{ "--tw-ring-color": `${accentColor}44` }}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <Filter size={16} className="text-neutral-400 mr-1 shrink-0" />
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold shrink-0 transition-all ${
                  isSelected 
                    ? "text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-950 bg-white border border-neutral-200"
                }`}
                style={isSelected ? { background: activeRoleConfig?.accentGradient ?? accentColor } : {}}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses Grid */}
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              layout
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between group"
            >
              {/* Card top banner */}
              <div 
                className="h-28 flex flex-col justify-end p-5 relative"
                style={{ background: course.color }}
              >
                <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider text-white/90 bg-black/20 backdrop-blur-sm">
                  {course.status}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/75 flex items-center gap-1">
                  <Tag size={10} />
                  {course.category}
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-1 leading-tight tracking-tight drop-shadow-sm">
                  {course.title}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div 
                      className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-[11px]"
                      style={{ color: accentColor }}
                    >
                      {course.instructor.split(" ").slice(-1)[0][0]}
                    </div>
                    <span className="text-[13px] text-neutral-500 font-medium">
                      Instructor: <strong className="text-neutral-700">{course.instructor}</strong>
                    </span>
                  </div>

                  {/* Course Details row */}
                  <div className="flex items-center gap-4 text-[12px] text-neutral-400 font-semibold mb-4">
                    <div className="flex items-center gap-1">
                      <Users size={14} className="text-neutral-400" />
                      {course.students} Students
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-neutral-400" />
                      {course.duration}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                {course.status !== "Draft" && (
                  <div className="mt-4 pt-4 border-t border-neutral-50">
                    <div className="flex justify-between items-center text-[12px] text-neutral-400 font-semibold mb-1.5">
                      <span>Avg. Completion</span>
                      <span className="text-neutral-600 font-bold">{course.avgCompletion}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${course.avgCompletion}%`, background: accentColor }}
                      />
                    </div>
                  </div>
                )}

                {course.status === "Draft" && (
                  <div className="mt-4 pt-4 border-t border-neutral-50 flex items-center justify-center text-[12.5px] font-bold text-neutral-400 py-1 border-dashed border rounded-xl">
                    <BookOpen size={13} className="mr-1.5" />
                    Under Construction
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredCourses.length === 0 && (
        <div className="bg-white border border-neutral-100 rounded-2xl py-16 px-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.03)] mt-8">
          <BookOpen size={36} className="mx-auto text-neutral-300 mb-3" />
          <h3 className="text-base font-bold text-neutral-700 font-display">No courses found</h3>
          <p className="text-[13px] text-neutral-400 mt-1 max-w-[280px] mx-auto">
            Try adjusting your search filters or add a new course curriculum.
          </p>
        </div>
      )}
    </div>
  );
}
