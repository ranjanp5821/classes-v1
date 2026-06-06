/**
 * ProgressSection.jsx — Learning stats & weekly study trend for the Student page.
 */
import { motion } from "framer-motion";
import { Flame, Award, Clock, Target, TrendingUp } from "lucide-react";

export default function ProgressSection({ accent, accentGradient }) {
  const stats = [
    { title: "Current Streak", value: "14 days", change: "Personal best!", icon: Flame },
    { title: "Hours Studied", value: "126h", change: "+9h this week", icon: Clock },
    { title: "Certificates", value: "5", change: "+1 this month", icon: Award },
    { title: "Avg. Score", value: "88%", change: "+3% vs last term", icon: Target },
  ];

  // Mock weekly study hours
  const week = [
    { day: "Mon", hrs: 2.5 },
    { day: "Tue", hrs: 3.2 },
    { day: "Wed", hrs: 1.8 },
    { day: "Thu", hrs: 4.0 },
    { day: "Fri", hrs: 2.2 },
    { day: "Sat", hrs: 3.8 },
    { day: "Sun", hrs: 1.2 },
  ];
  const maxHrs = Math.max(...week.map((w) => w.hrs));

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11.5px] font-bold tracking-wider text-neutral-400 uppercase">{stat.title}</span>
                <div className="p-2 rounded-xl" style={{ background: `${accent}10`, color: accent }}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="text-2xl font-bold text-neutral-900 font-display tracking-tight">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1.5">
                <TrendingUp size={11} className="text-emerald-500" />
                <span className="text-[11.5px] text-emerald-600 font-semibold">{stat.change}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly study chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      >
        <div className="mb-6">
          <div className="text-[15px] font-bold text-neutral-900 font-display">Weekly Study Time</div>
          <div className="text-[12.5px] text-neutral-400 mt-0.5">Hours spent learning this week</div>
        </div>
        <div className="flex items-end justify-between gap-3 h-44">
          {week.map((w, i) => (
            <div key={w.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] font-bold" style={{ color: accent }}>{w.hrs}h</span>
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${(w.hrs / maxHrs) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.6, ease: "easeOut" }}
                className="w-full rounded-t-lg"
                style={{ background: accentGradient, minHeight: 6 }}
              />
              <span className="text-[11px] text-neutral-400 font-semibold">{w.day}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
