/**
 * SettingsSection.jsx — Settings & branding block for the scrollable Institute page.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Building, Shield, Palette, ToggleLeft, ToggleRight, Check, Save } from "lucide-react";
import { useRole } from "../../hooks/useRole";

const THEME_OPTIONS = [
  { name: "Classic Indigo", accent: "#6366f1", accentLight: "#eef2ff", accentBorder: "#a5b4fc", accentGradient: "linear-gradient(135deg, #6366f1, #818cf8)" },
  { name: "Ocean Sky",      accent: "#0ea5e9", accentLight: "#e0f2fe", accentBorder: "#7dd3fc", accentGradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)" },
  { name: "Emerald Forest", accent: "#10b981", accentLight: "#ecfdf5", accentBorder: "#6ee7b7", accentGradient: "linear-gradient(135deg, #10b981, #34d399)" },
  { name: "Crimson Rose",   accent: "#f43f5e", accentLight: "#fff1f2", accentBorder: "#fda4af", accentGradient: "linear-gradient(135deg, #f43f5e, #fda4af)" },
  { name: "Amber Gold",     accent: "#d97706", accentLight: "#fef3c7", accentBorder: "#fde68a", accentGradient: "linear-gradient(135deg, #d97706, #f59e0b)" },
];

export default function SettingsSection({ accent, accentGradient }) {
  const { activeRoleId, activeRoleConfig, updateRoleBrandColors } = useRole();

  const [instName, setInstName] = useState("EduSphere Ecosystem");
  const [domain, setDomain] = useState("edusphere.edu");
  const [adminEmail, setAdminEmail] = useState("admin@edusphere.edu");

  const [toggles, setToggles] = useState({
    enableForums: true,
    showGPAToStudents: true,
    twoFactorAuth: false,
  });

  const toggle = (key) => setToggles((p) => ({ ...p, [key]: !p[key] }));

  const saved = () => alert("Settings saved!");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left — General + Toggles */}
      <div className="lg:col-span-2 space-y-5">
        {/* General */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg" style={{ background: `${accent}10`, color: accent }}>
              <Building size={15} />
            </div>
            <span className="text-[15px] font-bold text-neutral-900 font-display">Institution Profile</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-neutral-500 mb-1.5">Institution Name</label>
              <input
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-[13.5px] text-neutral-800 focus:outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": `${accent}44` }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-neutral-500 mb-1.5">Domain</label>
                <input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-[13.5px] text-neutral-800 focus:outline-none focus:ring-2 transition-all"
                  style={{ "--tw-ring-color": `${accent}44` }}
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-neutral-500 mb-1.5">Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-[13.5px] text-neutral-800 focus:outline-none focus:ring-2 transition-all"
                  style={{ "--tw-ring-color": `${accent}44` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Toggles */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg" style={{ background: `${accent}10`, color: accent }}>
              <Shield size={15} />
            </div>
            <span className="text-[15px] font-bold text-neutral-900 font-display">System Controls</span>
          </div>
          <div className="divide-y divide-neutral-50">
            {[
              { key: "enableForums", title: "Community Forums", desc: "Allow student-to-student discussion boards" },
              { key: "showGPAToStudents", title: "Display GPA Outcomes", desc: "Let students view their cumulative GPA trends" },
              { key: "twoFactorAuth", title: "Two-Factor Authentication", desc: "Force admin accounts to use 2FA" },
            ].map(({ key, title, desc }) => (
              <div key={key} className="flex items-center justify-between py-3.5">
                <div>
                  <div className="text-[13px] font-bold text-neutral-700">{title}</div>
                  <div className="text-[11.5px] text-neutral-400 mt-0.5">{desc}</div>
                </div>
                <button onClick={() => toggle(key)} className="ml-4 flex-shrink-0">
                  {toggles[key]
                    ? <ToggleRight size={36} style={{ color: accent }} />
                    : <ToggleLeft size={36} className="text-neutral-300" />
                  }
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        <button
          onClick={saved}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm"
          style={{ background: accentGradient }}
        >
          <Save size={15} />Save Changes
        </button>
      </div>

      {/* Right — Brand picker */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-fit"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg" style={{ background: `${accent}10`, color: accent }}>
            <Palette size={15} />
          </div>
          <span className="text-[15px] font-bold text-neutral-900 font-display">Accent Branding</span>
        </div>
        <p className="text-[12.5px] text-neutral-400 leading-relaxed mb-5">
          Pick a primary color. Buttons, badges, and active states update instantly throughout the platform.
        </p>
        <div className="space-y-2.5">
          {THEME_OPTIONS.map((opt) => {
            const isSel = activeRoleConfig?.accent === opt.accent;
            return (
              <button
                key={opt.name}
                onClick={() =>
                  updateRoleBrandColors(activeRoleId, {
                    accent: opt.accent,
                    accentLight: opt.accentLight,
                    accentBorder: opt.accentBorder,
                    accentGradient: opt.accentGradient,
                  })
                }
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all text-left ${
                  isSel ? "border-neutral-300 shadow-sm" : "border-neutral-100 hover:border-neutral-200"
                }`}
                style={isSel ? { background: `${opt.accent}06` } : {}}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full border block flex-shrink-0"
                    style={{ background: opt.accentGradient, borderColor: opt.accentBorder }}
                  />
                  <span className={`text-[13px] font-bold ${isSel ? "text-neutral-800" : "text-neutral-600"}`}>
                    {opt.name}
                  </span>
                </div>
                {isSel && <Check size={15} className="text-neutral-700" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
