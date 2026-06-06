/**
 * AssignmentsSection.jsx — Upcoming & submitted assignments for the Student page.
 */
import { motion } from "framer-motion";
import { FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const ASSIGNMENTS = [
  { id: 1, title: "REST API Design Document", course: "Advanced Web Engineering", due: "Due in 2 days", status: "pending" },
  { id: 2, title: "Linear Regression Notebook", course: "Data Science Foundations", due: "Due in 5 days", status: "pending" },
  { id: 3, title: "Wireframe Critique", course: "UI/UX Design Principles", due: "Submitted", status: "done" },
  { id: 4, title: "Problem Set 4 — Integrals", course: "Calculus II", due: "Overdue by 1 day", status: "late" },
  { id: 5, title: "Persuasive Speech Outline", course: "Public Speaking & Rhetoric", due: "Submitted", status: "done" },
];

const STATUS = {
  pending: { label: "Pending", icon: Clock, color: "#f59e0b", bg: "#fffbeb" },
  done:    { label: "Submitted", icon: CheckCircle2, color: "#10b981", bg: "#ecfdf5" },
  late:    { label: "Overdue", icon: AlertTriangle, color: "#ef4444", bg: "#fef2f2" },
};

export default function AssignmentsSection({ accent }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
      {ASSIGNMENTS.map((a, i) => {
        const s = STATUS[a.status];
        const Icon = s.icon;
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="flex items-center gap-4 px-5 py-4 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/60 transition-colors"
          >
            <div className="p-2.5 rounded-xl shrink-0" style={{ background: `${accent}10`, color: accent }}>
              <FileText size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold text-neutral-900 truncate">{a.title}</div>
              <div className="text-[12px] text-neutral-400 mt-0.5 truncate">{a.course}</div>
            </div>
            <div className="hidden sm:block text-[12px] text-neutral-400 font-medium shrink-0">{a.due}</div>
            <span
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0"
              style={{ background: s.bg, color: s.color }}
            >
              <Icon size={12} />
              {s.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
