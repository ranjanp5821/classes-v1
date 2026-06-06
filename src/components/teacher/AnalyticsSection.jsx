/**
 * AnalyticsSection.jsx — Engagement metrics & top courses (Teacher page).
 */
import { motion } from "framer-motion";
import { Eye, UserPlus, Percent, Star, Trophy } from "lucide-react";

export default function AnalyticsSection({ accent, accentGradient }) {
  const metrics = [
    { title: "Course Views", value: "18.4K", change: "+14% this month", icon: Eye },
    { title: "New Enrollments", value: "312", change: "+22 this week", icon: UserPlus },
    { title: "Completion Rate", value: "76%", change: "+4% vs last term", icon: Percent },
    { title: "Avg. Rating", value: "4.8", change: "Across all courses", icon: Star },
  ];

  const topCourses = [
    { id: 1, name: "UI/UX Design Principles", students: 152, share: 100 },
    { id: 2, name: "Advanced Web Engineering", students: 128, share: 84 },
    { id: 3, name: "Data Science Foundations", students: 96, share: 63 },
    { id: 4, name: "Intro to Machine Learning", students: 74, share: 49 },
  ];

  return (
    <div>
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11.5px] font-bold tracking-wider text-neutral-400 uppercase">{m.title}</span>
                <div className="p-2 rounded-xl" style={{ background: `${accent}10`, color: accent }}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="text-2xl font-bold text-neutral-900 font-display tracking-tight">{m.value}</div>
              <div className="text-[11.5px] text-neutral-400 font-medium mt-1.5">{m.change}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Top courses leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg" style={{ background: `${accent}10`, color: accent }}>
            <Trophy size={15} />
          </div>
          <div className="text-[15px] font-bold text-neutral-900 font-display">Top Performing Courses</div>
        </div>
        <div className="space-y-5">
          {topCourses.map((c, i) => (
            <div key={c.id} className="flex items-center gap-4">
              <span className="text-[13px] font-bold text-neutral-300 w-5 shrink-0">#{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13.5px] font-semibold text-neutral-800 truncate">{c.name}</span>
                  <span className="text-[12px] text-neutral-400 font-medium shrink-0 ml-3">{c.students} students</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.share}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.7, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: accentGradient }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
