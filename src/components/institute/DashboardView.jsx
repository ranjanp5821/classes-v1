import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Plus, 
  ArrowUpRight, 
  GraduationCap 
} from "lucide-react";
import { useRole } from "../../hooks/useRole";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
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

export default function DashboardView() {
  const { activeRoleConfig, setActiveTab } = useRole();
  const accentColor = activeRoleConfig?.accent ?? "#6366f1";

  const stats = [
    {
      title: "Total Students",
      value: "1,248",
      change: "+12% this month",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Courses",
      value: "42",
      change: "+4 new drafts",
      trend: "up",
      icon: BookOpen,
    },
    {
      title: "Graduation Rate",
      value: "98.4%",
      change: "+0.6% vs last year",
      trend: "up",
      icon: GraduationCap,
    },
    {
      title: "Monthly Revenue",
      value: "$48,250",
      change: "+8.3% vs last month",
      trend: "up",
      icon: DollarSign,
    },
  ];

  const recentActivity = [
    { id: 1, type: "enrollment", message: "Sarah Jenkins enrolled in Advanced Web Engineering", time: "10 mins ago" },
    { id: 2, type: "course_created", message: "Dr. Clara Barton published Introduction to Data Science", time: "1 hour ago" },
    { id: 3, type: "payment", message: "University sponsorship payment processed successfully", time: "3 hours ago" },
    { id: 4, type: "system", message: "Weekly system backup completed successfully", time: "5 hours ago" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-8 pt-24 pb-16 min-h-screen bg-neutral-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-display">
            Welcome back, Administrator
          </h1>
          <p className="text-[14.5px] text-neutral-500 mt-1">
            Here's the latest overview for your institution's activities today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab("Courses")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14.5px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 shadow-sm"
            style={{ background: activeRoleConfig?.accentGradient ?? accentColor }}
          >
            <Plus size={16} />
            Manage Courses
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden group"
            >
              {/* Colored corner accent on hover */}
              <div 
                className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at top right, ${accentColor}12, transparent 70%)`
                }}
              />
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-semibold tracking-wider text-neutral-400 uppercase">
                  {stat.title}
                </span>
                <div 
                  className="p-2.5 rounded-xl"
                  style={{ background: `${accentColor}10`, color: accentColor }}
                >
                  <Icon size={18} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 font-display tracking-tight">
                {stat.value}
              </h2>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[12px] font-semibold text-emerald-600 flex items-center">
                  <TrendingUp size={12} className="mr-0.5" />
                  {stat.change.split(" ")[0]}
                </span>
                <span className="text-[12px] text-neutral-400 font-medium">
                  {stat.change.substring(stat.change.indexOf(" "))}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart & Activity Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Trend Chart */}
        <motion.div
          variants={cardVariants}
          custom={4}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 font-display">Student Registration Trend</h3>
              <p className="text-[13px] text-neutral-400 mt-0.5">Monthly enrollments for the current academic year</p>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-neutral-500 bg-neutral-50 px-2.5 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
              Active Enrollments
            </div>
          </div>

          {/* Premium Custom SVG Line Chart */}
          <div className="h-64 w-full relative pt-4">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0.00" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="0" y1="190" x2="500" y2="190" stroke="#e4e4e7" strokeWidth="1" />

              {/* Area path */}
              <path 
                d="M 10 190 L 10 150 Q 80 130 110 100 T 210 110 T 310 60 T 410 80 T 490 30 L 490 190 Z" 
                fill="url(#chartGrad)" 
              />
              
              {/* Line path */}
              <path 
                d="M 10 150 Q 80 130 110 100 T 210 110 T 310 60 T 410 80 T 490 30" 
                fill="none" 
                stroke={accentColor} 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />

              {/* Interactive Dots */}
              <circle cx="10" cy="150" r="4.5" fill="white" stroke={accentColor} strokeWidth="2.5" />
              <circle cx="110" cy="100" r="4.5" fill="white" stroke={accentColor} strokeWidth="2.5" />
              <circle cx="210" cy="110" r="4.5" fill="white" stroke={accentColor} strokeWidth="2.5" />
              <circle cx="310" cy="60" r="4.5" fill="white" stroke={accentColor} strokeWidth="2.5" />
              <circle cx="410" cy="80" r="4.5" fill="white" stroke={accentColor} strokeWidth="2.5" />
              <circle cx="490" cy="30" r="4.5" fill="white" stroke={accentColor} strokeWidth="2.5" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex justify-between text-[11px] text-neutral-400 font-semibold pt-2 px-1">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Nov</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity Log */}
        <motion.div
          variants={cardVariants}
          custom={5}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div 
                className="p-2 rounded-lg"
                style={{ background: `${accentColor}10`, color: accentColor }}
              >
                <Activity size={16} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 font-display">Recent Activity</h3>
            </div>
            <div className="space-y-4.5">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3 text-left">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-2 shrink-0" style={{ background: accentColor }} />
                  <div>
                    <p className="text-[13.5px] font-medium text-neutral-700 leading-tight">
                      {activity.message}
                    </p>
                    <span className="text-[11.5px] text-neutral-400 font-medium block mt-1">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => setActiveTab("Reports")}
            className="mt-6 w-full py-2.5 text-center text-[13.5px] font-semibold text-neutral-500 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100/80 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            View Full Audit Log
            <ArrowUpRight size={14} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
