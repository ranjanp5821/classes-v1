import { motion } from "framer-motion";
import { Download, TrendingUp, Calendar, ChevronRight, Award, BarChart3, GraduationCap } from "lucide-react";
import { useRole } from "../../hooks/useRole";

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function ReportsView() {
  const { activeRoleConfig } = useRole();
  const accentColor = activeRoleConfig?.accent ?? "#6366f1";

  const metrics = [
    { label: "Graduation rate", value: "98.4%", change: "+0.6% vs last cohort", icon: GraduationCap },
    { label: "Average GPA", value: "3.58 / 4.0", change: "+0.15 vs last cohort", icon: Award },
    { label: "Admissions Rate", value: "68.2%", change: "+4.1% year-on-year", icon: TrendingUp },
  ];

  const distribution = [
    { grade: "A (Excellent)", percentage: 48, count: 600, color: accentColor },
    { grade: "B (Good)", percentage: 32, count: 400, color: `${accentColor}cc` },
    { grade: "C (Satisfactory)", percentage: 15, count: 187, color: `${accentColor}99` },
    { grade: "D (Passing)", percentage: 4, count: 50, color: `${accentColor}66` },
    { grade: "F (Failing)", percentage: 1, count: 11, color: `${accentColor}33` },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-8 pt-24 pb-16 min-h-screen bg-neutral-50/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-display">
            Reports & Analytics
          </h1>
          <p className="text-[14.5px] text-neutral-500 mt-1">
            Analyze grades, enrollment demographics, and learning outcomes.
          </p>
        </div>
        <div>
          <button 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-semibold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-sm"
          >
            <Download size={15} />
            Export Annual Report (PDF)
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-semibold text-neutral-400 uppercase tracking-wider">{m.label}</span>
                <div 
                  className="p-2 rounded-lg"
                  style={{ background: `${accentColor}10`, color: accentColor }}
                >
                  <Icon size={16} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 font-display tracking-tight">{m.value}</h2>
              <p className="text-[12px] text-emerald-600 font-semibold mt-1.5 flex items-center">
                <TrendingUp size={11} className="mr-1" />
                {m.change}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Grade Distribution & Enrollment Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grade Distribution Chart */}
        <motion.div
          variants={cardVariants}
          custom={3}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 font-display">Grade Distribution</h3>
              <p className="text-[13px] text-neutral-400 mt-0.5">Overall GPA distribution for all active enrollments</p>
            </div>
            <BarChart3 size={18} className="text-neutral-400" />
          </div>

          <div className="space-y-4">
            {distribution.map((item) => (
              <div key={item.grade} className="space-y-1.5">
                <div className="flex justify-between text-[13px] font-semibold text-neutral-600">
                  <span>{item.grade}</span>
                  <span className="text-neutral-900">{item.count} students ({item.percentage}%)</span>
                </div>
                <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Admissions funnel / channels */}
        <motion.div
          variants={cardVariants}
          custom={4}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900 font-display">Admissions Funnel</h3>
              <Calendar size={18} className="text-neutral-400" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl">
                <div>
                  <div className="text-[13px] font-bold text-neutral-700">Total Applications</div>
                  <div className="text-[11.5px] text-neutral-400 mt-0.5">Submissions received</div>
                </div>
                <span className="text-base font-bold text-neutral-900 font-display">1,830</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl">
                <div>
                  <div className="text-[13px] font-bold text-neutral-700">Admitted</div>
                  <div className="text-[11.5px] text-neutral-400 mt-0.5">Qualified entries</div>
                </div>
                <span className="text-base font-bold text-neutral-900 font-display" style={{ color: accentColor }}>1,248</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl">
                <div>
                  <div className="text-[13px] font-bold text-neutral-700">Enrolled</div>
                  <div className="text-[11.5px] text-neutral-400 mt-0.5">Final registration</div>
                </div>
                <span className="text-base font-bold text-neutral-900 font-display">1,024</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-50">
            <div className="flex justify-between items-center text-[12.5px] font-semibold text-neutral-500">
              <span>Overall Conversion</span>
              <span className="font-bold text-neutral-800">56%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
