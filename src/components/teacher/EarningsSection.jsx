/**
 * EarningsSection.jsx — Revenue stats, monthly chart & payouts (Teacher page).
 */
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Wallet, CreditCard, ArrowDownToLine } from "lucide-react";

export default function EarningsSection({ accent, accentGradient }) {
  const stats = [
    { title: "Total Earnings", value: "$24,180", change: "+11% this month", icon: DollarSign },
    { title: "This Month", value: "$3,420", change: "+8.5% vs last month", icon: Wallet },
    { title: "Pending Payout", value: "$1,260", change: "Clears in 3 days", icon: CreditCard },
  ];

  const months = [
    { m: "Jan", v: 1.8 }, { m: "Feb", v: 2.1 }, { m: "Mar", v: 1.6 },
    { m: "Apr", v: 2.6 }, { m: "May", v: 3.0 }, { m: "Jun", v: 3.42 },
  ];
  const max = Math.max(...months.map((x) => x.v));

  const payouts = [
    { id: 1, date: "May 28, 2026", amount: "$3,140", method: "Bank Transfer", status: "Paid" },
    { id: 2, date: "Apr 28, 2026", amount: "$2,610", method: "Bank Transfer", status: "Paid" },
    { id: 3, date: "Mar 28, 2026", amount: "$1,580", method: "PayPal", status: "Paid" },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="mb-6">
            <div className="text-[15px] font-bold text-neutral-900 font-display">Monthly Revenue</div>
            <div className="text-[12.5px] text-neutral-400 mt-0.5">Earnings over the last 6 months ($K)</div>
          </div>
          <div className="flex items-end justify-between gap-3 h-44">
            {months.map((x, i) => (
              <div key={x.m} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-bold" style={{ color: accent }}>${x.v}K</span>
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(x.v / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.6, ease: "easeOut" }}
                  className="w-full rounded-t-lg"
                  style={{ background: accentGradient, minHeight: 6 }}
                />
                <span className="text-[11px] text-neutral-400 font-semibold">{x.m}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payout history */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg" style={{ background: `${accent}10`, color: accent }}>
              <ArrowDownToLine size={15} />
            </div>
            <div className="text-[15px] font-bold text-neutral-900 font-display">Recent Payouts</div>
          </div>
          <div className="space-y-4">
            {payouts.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div>
                  <div className="text-[13.5px] font-semibold text-neutral-800">{p.amount}</div>
                  <div className="text-[11.5px] text-neutral-400">{p.date} · {p.method}</div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
