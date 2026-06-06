/**
 * ReportsSection.jsx — Analytics & reports block for the scrollable Institute page.
 */
import { motion } from "framer-motion";
import { Download, TrendingUp, GraduationCap, Award, BarChart3, Calendar } from "lucide-react";

export default function ReportsSection({ accent, accentGradient }) {
  const metrics = [
    { label: "Graduation Rate", value: "98.4%", change: "+0.6% vs last cohort", icon: GraduationCap },
    { label: "Average GPA", value: "3.58 / 4.0", change: "+0.15 vs last cohort", icon: Award },
    { label: "Admissions Rate", value: "68.2%", change: "+4.1% year-on-year", icon: TrendingUp },
  ];

  const distribution = [
    { grade: "A  Excellent", pct: 48, count: 600 },
    { grade: "B  Good", pct: 32, count: 400 },
    { grade: "C  Satisfactory", pct: 15, count: 187 },
    { grade: "D  Passing", pct: 4, count: 50 },
    { grade: "F  Failing", pct: 1, count: 11 },
  ];

  const funnelItems = [
    { label: "Total Applications", sub: "Submissions received", value: "1,830", highlight: false },
    { label: "Admitted", sub: "Qualified entries", value: "1,248", highlight: true },
    { label: "Enrolled", sub: "Final registration", value: "1,024", highlight: false },
  ];

  return (
    <div>
      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11.5px] font-bold tracking-wider text-neutral-400 uppercase">{m.label}</span>
                <div className="p-2 rounded-lg" style={{ background: `${accent}10`, color: accent }}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="text-2xl font-bold text-neutral-900 font-display tracking-tight">{m.value}</div>
              <p className="text-[11.5px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-0.5">
                <TrendingUp size={11} />{m.change}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Chart row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade distribution */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[15px] font-bold text-neutral-900 font-display">Grade Distribution</div>
              <div className="text-[12.5px] text-neutral-400 mt-0.5">All active enrollments — current term</div>
            </div>
            <BarChart3 size={18} className="text-neutral-400" />
          </div>
          <div className="space-y-4">
            {distribution.map((item, idx) => (
              <div key={item.grade}>
                <div className="flex justify-between text-[12.5px] font-semibold text-neutral-600 mb-1.5">
                  <span>{item.grade}</span>
                  <span className="text-neutral-800">{item.count} students ({item.pct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 + 0.3, duration: 0.7, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: accent, opacity: 1 - idx * 0.17 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Admissions funnel */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="text-[15px] font-bold text-neutral-900 font-display">Admissions Funnel</div>
              <Calendar size={16} className="text-neutral-400" />
            </div>
            <div className="space-y-3">
              {funnelItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl">
                  <div>
                    <div className="text-[13px] font-bold text-neutral-700">{item.label}</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">{item.sub}</div>
                  </div>
                  <span
                    className="text-[15px] font-bold font-display"
                    style={{ color: item.highlight ? accent : "#171717" }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-5 border-t border-neutral-50 mt-5">
            <div className="flex justify-between text-[12.5px] font-semibold text-neutral-500">
              <span>Overall Conversion</span>
              <span className="font-bold text-neutral-900">56%</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "56%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: accentGradient }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
