/**
 * CreateCourseSection.jsx — Course-builder steps & quick start (Teacher page).
 */
import { motion } from "framer-motion";
import { FileText, Video, ListChecks, Rocket, Plus } from "lucide-react";

const STEPS = [
  { id: 1, title: "Course Details", desc: "Title, category, and description", icon: FileText, done: true },
  { id: 2, title: "Upload Lessons", desc: "Add video lectures and slides", icon: Video, done: true },
  { id: 3, title: "Build Assessments", desc: "Create quizzes and assignments", icon: ListChecks, done: false },
  { id: 4, title: "Publish & Launch", desc: "Set pricing and go live", icon: Rocket, done: false },
];

export default function CreateCourseSection({ accent, accentGradient }) {
  const completed = STEPS.filter((s) => s.done).length;
  const pct = Math.round((completed / STEPS.length) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Steps */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <div className="text-[15px] font-bold text-neutral-900 font-display">New Course Setup</div>
          <span className="text-[12.5px] font-semibold" style={{ color: accent }}>{pct}% complete</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden mb-6">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: accentGradient }}
          />
        </div>

        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex items-center gap-4 p-3.5 rounded-xl border border-neutral-100 hover:bg-neutral-50/60 transition-colors"
              >
                <div
                  className="p-2.5 rounded-xl shrink-0"
                  style={
                    step.done
                      ? { background: accentGradient, color: "#fff" }
                      : { background: `${accent}10`, color: accent }
                  }
                >
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-neutral-900">{step.title}</div>
                  <div className="text-[12px] text-neutral-400 mt-0.5">{step.desc}</div>
                </div>
                <span
                  className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0"
                  style={step.done
                    ? { background: "#ecfdf5", color: "#10b981" }
                    : { background: "#f1f5f9", color: "#94a3b8" }}
                >
                  {step.done ? "Done" : "Pending"}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick start card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-2xl p-6 text-white flex flex-col justify-between shadow-md"
        style={{ background: accentGradient }}
      >
        <div>
          <div className="p-2.5 rounded-xl bg-white/20 w-fit mb-4">
            <Plus size={20} />
          </div>
          <div className="text-[18px] font-bold font-display leading-snug">Start a New Course</div>
          <p className="text-[13px] text-white/85 mt-2 leading-relaxed">
            Build engaging lessons, add assessments, and reach learners worldwide — all from one place.
          </p>
        </div>
        <button className="mt-6 w-full py-2.5 rounded-xl bg-white text-[13.5px] font-bold transition-transform hover:scale-[1.02] active:scale-95" style={{ color: accent }}>
          Create Course
        </button>
      </motion.div>
    </div>
  );
}
