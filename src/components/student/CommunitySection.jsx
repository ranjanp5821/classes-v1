/**
 * CommunitySection.jsx — Discussion threads & study groups for the Student page.
 */
import { motion } from "framer-motion";
import { MessageSquare, Users, ThumbsUp, Hash } from "lucide-react";

const THREADS = [
  { id: 1, author: "Sarah Jenkins", avatar: "SJ", topic: "How do you structure a scalable React app?", tag: "Development", replies: 24, likes: 58 },
  { id: 2, author: "Brandon Stark", avatar: "BS", topic: "Best resources for learning gradient descent?", tag: "AI", replies: 17, likes: 41 },
  { id: 3, author: "Mara Whitfield", avatar: "MW", topic: "Share your favorite design portfolios", tag: "Design", replies: 33, likes: 72 },
  { id: 4, author: "Hideo Nakamura", avatar: "HN", topic: "Calculus II study group — Saturdays?", tag: "Mathematics", replies: 9, likes: 15 },
];

const GROUPS = [
  { id: 1, name: "Frontend Guild", members: 1280 },
  { id: 2, name: "ML Study Circle", members: 864 },
  { id: 3, name: "Design Crit Club", members: 612 },
];

export default function CommunitySection({ accent, accentGradient }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Threads */}
      <div className="lg:col-span-2 space-y-4">
        {THREADS.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.06, duration: 0.42 }}
            className="flex gap-4 bg-white p-5 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-transform duration-200"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
              style={{ background: accentGradient }}
            >
              {t.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold text-neutral-900 leading-snug">{t.topic}</div>
              <div className="text-[12px] text-neutral-400 mt-0.5">{t.author}</div>
              <div className="flex items-center gap-4 mt-3 text-[12px] text-neutral-400 font-medium">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: `${accent}10`, color: accent }}>
                  <Hash size={11} />{t.tag}
                </span>
                <span className="inline-flex items-center gap-1"><MessageSquare size={12} />{t.replies}</span>
                <span className="inline-flex items-center gap-1"><ThumbsUp size={12} />{t.likes}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Study groups */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-fit"
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-lg" style={{ background: `${accent}10`, color: accent }}>
            <Users size={15} />
          </div>
          <div className="text-[15px] font-bold text-neutral-900 font-display">Study Groups</div>
        </div>
        <div className="space-y-3">
          {GROUPS.map((g) => (
            <div key={g.id} className="flex items-center justify-between">
              <div>
                <div className="text-[13.5px] font-semibold text-neutral-800">{g.name}</div>
                <div className="text-[11.5px] text-neutral-400">{g.members.toLocaleString()} members</div>
              </div>
              <button
                className="text-[12px] font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90 active:scale-95"
                style={{ background: accentGradient }}
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
