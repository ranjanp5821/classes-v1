/**
 * DashboardSection.jsx — Dashboard content block for the scrollable Institute page.
 */
import { motion } from "framer-motion";
import { Users, BookOpen, TrendingUp, DollarSign, Activity, ArrowUpRight, GraduationCap } from "lucide-react";

export default function DashboardSection({ accent, accentGradient }) {
  const stats = [
    { title: "Total Students", value: "1,248", change: "+12% this month", icon: Users },
    { title: "Active Courses", value: "42", change: "+4 new this term", icon: BookOpen },
    { title: "Graduation Rate", value: "98.4%", change: "+0.6% vs last year", icon: GraduationCap },
    { title: "Monthly Revenue", value: "$48,250", change: "+8.3% vs last month", icon: DollarSign },
  ];

  const recentActivity = [
    { id: 1, message: "Sarah Jenkins enrolled in Advanced Web Engineering", time: "10 mins ago" },
    { id: 2, message: "Dr. Clara Barton published Introduction to Data Science", time: "1 hour ago" },
    { id: 3, message: "University sponsorship payment processed successfully", time: "3 hours ago" },
    { id: 4, message: "Weekly system backup completed successfully", time: "5 hours ago" },
    { id: 5, message: "Brandon Stark achieved 4.0 GPA milestone", time: "Yesterday" },
  ];

  return (
    <div>
      {/* Stats Grid */}
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
              className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group hover:-translate-y-0.5 transition-transform duration-200"
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

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[15px] font-bold text-neutral-900 font-display">Student Registration Trend</div>
              <div className="text-[12.5px] text-neutral-400 mt-0.5">Monthly enrollments — current academic year</div>
            </div>
            <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-neutral-400 bg-neutral-50 px-2.5 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
              Enrollments
            </div>
          </div>
          <div className="h-52 w-full relative pt-2">
            <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="36" x2="500" y2="36" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="0" y1="124" x2="500" y2="124" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="0" y1="170" x2="500" y2="170" stroke="#e4e4e7" strokeWidth="1" />
              <path d="M 10 170 L 10 135 Q 80 115 110 88 T 210 98 T 310 52 T 410 70 T 490 26 L 490 170 Z" fill="url(#dashGrad)" />
              <path d="M 10 135 Q 80 115 110 88 T 210 98 T 310 52 T 410 70 T 490 26" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
              {[{cx:10,cy:135},{cx:110,cy:88},{cx:210,cy:98},{cx:310,cy:52},{cx:410,cy:70},{cx:490,cy:26}].map((p,i)=>(
                <circle key={i} cx={p.cx} cy={p.cy} r="4" fill="white" stroke={accent} strokeWidth="2.5" />
              ))}
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10.5px] text-neutral-400 font-semibold px-1">
              {["Jan","Mar","May","Jul","Sep","Nov"].map(m=><span key={m}>{m}</span>)}
            </div>
          </div>
        </motion.div>

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg" style={{ background: `${accent}10`, color: accent }}>
              <Activity size={15} />
            </div>
            <div className="text-[15px] font-bold text-neutral-900 font-display">Recent Activity</div>
          </div>
          <div className="space-y-4">
            {recentActivity.map(a => (
              <div key={a.id} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: accent }} />
                <div>
                  <p className="text-[13px] font-medium text-neutral-700 leading-snug">{a.message}</p>
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
