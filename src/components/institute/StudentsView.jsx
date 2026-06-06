import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, UserCheck, GraduationCap, XCircle, AlertCircle, ChevronDown, UserX } from "lucide-react";
import { useRole } from "../../hooks/useRole";

const MOCK_STUDENTS = [
  {
    id: 1,
    name: "Alex Rivera",
    email: "alex.rivera@edu.org",
    course: "Advanced Web Engineering",
    status: "Active",
    gpa: "3.85",
    joinedDate: "Sept 12, 2025",
  },
  {
    id: 2,
    name: "Marcus Vance",
    email: "m.vance@edu.org",
    course: "Introduction to Data Science",
    status: "Active",
    gpa: "3.42",
    joinedDate: "Sept 15, 2025",
  },
  {
    id: 3,
    name: "Helena Rostova",
    email: "h.rostova@edu.org",
    course: "UI/UX Design Masterclass",
    status: "Completed",
    gpa: "3.98",
    joinedDate: "Jan 10, 2026",
  },
  {
    id: 4,
    name: "Tyler Durden",
    email: "soapmaker@edu.org",
    course: "Quantum Physics & Relativity",
    status: "Suspended",
    gpa: "2.10",
    joinedDate: "Nov 02, 2025",
  },
  {
    id: 5,
    name: "Sophie Dubois",
    email: "s.dubois@edu.org",
    course: "English Literature & Creative Writing",
    status: "Active",
    gpa: "3.65",
    joinedDate: "Jan 12, 2026",
  },
  {
    id: 6,
    name: "Brandon Stark",
    email: "brandon.stark@edu.org",
    course: "Introduction to Data Science",
    status: "Completed",
    gpa: "4.00",
    joinedDate: "Sept 10, 2025",
  },
  {
    id: 7,
    name: "Cassandra Cage",
    email: "c.cage@edu.org",
    course: "Advanced Web Engineering",
    status: "Active",
    gpa: "3.15",
    joinedDate: "Feb 01, 2026",
  },
];

const STATUS_FILTERS = ["All", "Active", "Completed", "Suspended"];

export default function StudentsView() {
  const { activeRoleConfig } = useRole();
  const accentColor = activeRoleConfig?.accent ?? "#6366f1";

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.course.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === "All" || student.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return { bg: "#ecfdf5", text: "#10b981", border: "#a7f3d0", icon: UserCheck };
      case "Completed":
        return { bg: "#e0f2fe", text: "#0ea5e9", border: "#bae6fd", icon: GraduationCap };
      case "Suspended":
        return { bg: "#fef2f2", text: "#ef4444", border: "#fecaca", icon: XCircle };
      default:
        return { bg: "#f4f4f5", text: "#71717a", border: "#e4e4e7", icon: AlertCircle };
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-8 pt-24 pb-16 min-h-screen bg-neutral-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-display">
            Student Directory
          </h1>
          <p className="text-[14.5px] text-neutral-500 mt-1">
            Browse profile files, grades, and enrollments.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search name, email, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-[14px] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all"
            style={{ "--tw-ring-color": `${accentColor}44` }}
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {STATUS_FILTERS.map((status) => {
            const isSelected = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold shrink-0 transition-all ${
                  isSelected 
                    ? "text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-950 bg-white border border-neutral-200"
                }`}
                style={isSelected ? { background: activeRoleConfig?.accentGradient ?? accentColor } : {}}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-neutral-100">
                <th className="px-6 py-4 text-[12.5px] font-bold uppercase tracking-wider text-neutral-400">Student Info</th>
                <th className="px-6 py-4 text-[12.5px] font-bold uppercase tracking-wider text-neutral-400">Primary Curriculum</th>
                <th className="px-6 py-4 text-[12.5px] font-bold uppercase tracking-wider text-neutral-400">Status</th>
                <th className="px-6 py-4 text-[12.5px] font-bold uppercase tracking-wider text-neutral-400">GPA</th>
                <th className="px-6 py-4 text-[12.5px] font-bold uppercase tracking-wider text-neutral-400">Date Joined</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredStudents.map((student, idx) => {
                  const style = getStatusStyle(student.status);
                  const StatusIcon = style.icon;
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      className="border-b border-neutral-50 hover:bg-neutral-50/40 transition-colors"
                    >
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13.5px] text-white shadow-sm"
                            style={{ background: activeRoleConfig?.accentGradient ?? accentColor }}
                          >
                            {student.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <div className="text-[14.5px] font-bold text-neutral-800">{student.name}</div>
                            <div className="text-[12.5px] text-neutral-400 font-medium flex items-center gap-1.5 mt-0.5">
                              <Mail size={12} />
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="text-[14px] font-semibold text-neutral-700">{student.course}</div>
                      </td>
                      <td className="px-6 py-4.5">
                        <span 
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase border"
                          style={{
                            backgroundColor: style.bg,
                            color: style.text,
                            borderColor: style.border,
                          }}
                        >
                          <StatusIcon size={12} />
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="text-[14px] font-bold text-neutral-700">{student.gpa}</div>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="text-[13px] text-neutral-400 font-medium">{student.joinedDate}</div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="py-16 text-center">
            <UserX size={36} className="mx-auto text-neutral-300 mb-3" />
            <h3 className="text-base font-bold text-neutral-700 font-display">No students found</h3>
            <p className="text-[13px] text-neutral-400 mt-1 max-w-[280px] mx-auto">
              No registration logs matched your search or status query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
