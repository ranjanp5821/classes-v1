/**
 * StudentsSection.jsx — Student directory table for the scrollable Institute page.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, UserCheck, GraduationCap, XCircle, UserX } from "lucide-react";

const MOCK_STUDENTS = [
  { id: 1, name: "Alex Rivera", email: "alex.rivera@edu.org", course: "Advanced Web Engineering", status: "Active", gpa: "3.85", joinedDate: "Sept 12, 2025" },
  { id: 2, name: "Marcus Vance", email: "m.vance@edu.org", course: "Introduction to Data Science", status: "Active", gpa: "3.42", joinedDate: "Sept 15, 2025" },
  { id: 3, name: "Helena Rostova", email: "h.rostova@edu.org", course: "UI/UX Design Masterclass", status: "Completed", gpa: "3.98", joinedDate: "Jan 10, 2026" },
  { id: 4, name: "Tyler Durden", email: "soapmaker@edu.org", course: "Quantum Physics & Relativity", status: "Suspended", gpa: "2.10", joinedDate: "Nov 02, 2025" },
  { id: 5, name: "Sophie Dubois", email: "s.dubois@edu.org", course: "English Literature & Creative Writing", status: "Active", gpa: "3.65", joinedDate: "Jan 12, 2026" },
  { id: 6, name: "Brandon Stark", email: "brandon.stark@edu.org", course: "Introduction to Data Science", status: "Completed", gpa: "4.00", joinedDate: "Sept 10, 2025" },
  { id: 7, name: "Cassandra Cage", email: "c.cage@edu.org", course: "Advanced Web Engineering", status: "Active", gpa: "3.15", joinedDate: "Feb 01, 2026" },
];

const STATUS_FILTERS = ["All", "Active", "Completed", "Suspended"];

const STATUS_STYLES = {
  Active:    { bg: "#ecfdf5", text: "#10b981", border: "#a7f3d0", icon: UserCheck },
  Completed: { bg: "#e0f2fe", text: "#0ea5e9", border: "#bae6fd", icon: GraduationCap },
  Suspended: { bg: "#fef2f2", text: "#ef4444", border: "#fecaca", icon: XCircle },
};

export default function StudentsSection({ accent, accentGradient }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = MOCK_STUDENTS.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative max-w-sm w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search name, email, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-[13.5px] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all"
            style={{ "--tw-ring-color": `${accent}44` }}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((st) => {
            const sel = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-lg text-[12.5px] font-semibold transition-all ${
                  sel ? "text-white shadow-sm" : "text-neutral-500 bg-white border border-neutral-200 hover:border-neutral-300"
                }`}
                style={sel ? { background: accentGradient } : {}}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                {["Student", "Enrolled Course", "Status", "GPA", "Joined"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-[11.5px] font-bold uppercase tracking-wider text-neutral-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.map((student, idx) => {
                  const style = STATUS_STYLES[student.status] ?? { bg: "#f4f4f5", text: "#71717a", border: "#e4e4e7", icon: UserX };
                  const Icon = style.icon;
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.28 }}
                      className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[12.5px] text-white shadow-sm"
                            style={{ background: accentGradient }}
                          >
                            {student.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="text-[13.5px] font-bold text-neutral-800">{student.name}</div>
                            <div className="text-[11.5px] text-neutral-400 font-medium flex items-center gap-1 mt-0.5">
                              <Mail size={11} />{student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-semibold text-neutral-600 max-w-[180px] leading-snug">{student.course}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-bold tracking-wider uppercase border"
                          style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
                        >
                          <Icon size={11} />{student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[13.5px] font-bold text-neutral-800">{student.gpa}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[12.5px] text-neutral-400 font-medium">{student.joinedDate}</div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-14 text-center">
            <UserX size={32} className="mx-auto text-neutral-300 mb-3" />
            <p className="text-[13.5px] font-bold text-neutral-500">No students match your query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
