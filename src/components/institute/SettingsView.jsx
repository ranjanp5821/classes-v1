import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Palette, Shield, Building, ToggleLeft, ToggleRight, Check } from "lucide-react";
import { useRole } from "../../hooks/useRole";

const THEME_OPTIONS = [
  {
    name: "Classic Indigo",
    accent: "#6366f1",
    accentLight: "#eef2ff",
    accentBorder: "#a5b4fc",
    accentGradient: "linear-gradient(135deg, #6366f1, #818cf8)",
  },
  {
    name: "Ocean Sky",
    accent: "#0ea5e9",
    accentLight: "#e0f2fe",
    accentBorder: "#7dd3fc",
    accentGradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
  },
  {
    name: "Emerald Forest",
    accent: "#10b981",
    accentLight: "#ecfdf5",
    accentBorder: "#6ee7b7",
    accentGradient: "linear-gradient(135deg, #10b981, #34d399)",
  },
  {
    name: "Crimson Rose",
    accent: "#f43f5e",
    accentLight: "#fff1f2",
    accentBorder: "#fda4af",
    accentGradient: "linear-gradient(135deg, #f43f5e, #fda4af)",
  },
  {
    name: "Amber Gold",
    accent: "#d97706",
    accentLight: "#fef3c7",
    accentBorder: "#fde68a",
    accentGradient: "linear-gradient(135deg, #d97706, #f59e0b)",
  },
];

export default function SettingsView() {
  const { activeRoleConfig, activeRoleId, updateRoleBrandColors } = useRole();
  const accentColor = activeRoleConfig?.accent ?? "#6366f1";

  // General fields
  const [instName, setInstName] = useState("EduSphere Ecosystem");
  const [domain, setDomain] = useState("edusphere.edu");
  const [adminEmail, setAdminEmail] = useState("admin@edusphere.edu");
  
  // Toggles
  const [toggles, setToggles] = useState({
    enableForums: true,
    enableGrading: true,
    showGPAToStudents: true,
    twoFactorAuth: false,
  });

  const toggleOption = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // Notify or animate save effect
    alert("Settings saved successfully!");
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-8 pt-24 pb-16 min-h-screen bg-neutral-50/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-display">
            Settings & Branding
          </h1>
          <p className="text-[14.5px] text-neutral-500 mt-1">
            Configure system parameters and dynamic identity styling.
          </p>
        </div>
        <div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14.5px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 shadow-sm"
            style={{ background: activeRoleConfig?.accentGradient ?? accentColor }}
          >
            <Save size={15} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-5">
              <Building size={18} style={{ color: accentColor }} />
              <h3 className="text-lg font-bold text-neutral-900 font-display">Institution Profile</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-neutral-500 mb-1.5">Institution Name</label>
                <input 
                  type="text" 
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-[14px] text-neutral-800 focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": `${accentColor}44` }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-neutral-500 mb-1.5">Domain name</label>
                  <input 
                    type="text" 
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-[14px] text-neutral-800 focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": `${accentColor}44` }}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-neutral-500 mb-1.5">Administrative Email</label>
                  <input 
                    type="email" 
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-[14px] text-neutral-800 focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": `${accentColor}44` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feature toggles */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-5">
              <Shield size={18} style={{ color: accentColor }} />
              <h3 className="text-lg font-bold text-neutral-900 font-display">System Controls</h3>
            </div>

            <div className="divide-y divide-neutral-50">
              <div className="flex items-center justify-between py-3.5">
                <div>
                  <div className="text-[13.5px] font-bold text-neutral-700">Enable Community Forums</div>
                  <div className="text-[12px] text-neutral-400">Allows student-student interactions</div>
                </div>
                <button onClick={() => toggleOption("enableForums")} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                  {toggles.enableForums ? (
                    <ToggleRight size={38} className="transition-all" style={{ color: accentColor }} />
                  ) : (
                    <ToggleLeft size={38} className="transition-all text-neutral-300" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between py-3.5">
                <div>
                  <div className="text-[13.5px] font-bold text-neutral-700">Display GPA Outcomes</div>
                  <div className="text-[12px] text-neutral-400">Allows students to view cumulative grading trends</div>
                </div>
                <button onClick={() => toggleOption("showGPAToStudents")} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                  {toggles.showGPAToStudents ? (
                    <ToggleRight size={38} style={{ color: accentColor }} />
                  ) : (
                    <ToggleLeft size={38} className="text-neutral-300" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between py-3.5">
                <div>
                  <div className="text-[13.5px] font-bold text-neutral-700">Two-Factor Authentication</div>
                  <div className="text-[12px] text-neutral-400">Force administrative accounts to use 2FA</div>
                </div>
                <button onClick={() => toggleOption("twoFactorAuth")} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                  {toggles.twoFactorAuth ? (
                    <ToggleRight size={38} style={{ color: accentColor }} />
                  ) : (
                    <ToggleLeft size={38} className="text-neutral-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Color Palette Branding */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-fit">
          <div className="flex items-center gap-2 mb-5">
            <Palette size={18} style={{ color: accentColor }} />
            <h3 className="text-lg font-bold text-neutral-900 font-display">Accent Branding</h3>
          </div>
          <p className="text-[13px] text-neutral-400 mb-5 leading-relaxed">
            Select a primary theme color. All button states, badge background tints, and active highlights will adapt dynamically.
          </p>

          <div className="space-y-3">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = activeRoleConfig?.accent === opt.accent;
              return (
                <button
                  key={opt.name}
                  onClick={() => updateRoleBrandColors(activeRoleId, {
                    accent: opt.accent,
                    accentLight: opt.accentLight,
                    accentBorder: opt.accentBorder,
                    accentGradient: opt.accentGradient,
                  })}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected 
                      ? "border-neutral-900 shadow-sm"
                      : "border-neutral-100 hover:border-neutral-200"
                  }`}
                  style={isSelected ? { background: `${opt.accent}05` } : {}}
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-5.5 h-5.5 rounded-full block border"
                      style={{ background: opt.accentGradient, borderColor: opt.accentBorder }}
                    />
                    <span className={`text-[13.5px] font-bold ${isSelected ? "text-neutral-800" : "text-neutral-600"}`}>
                      {opt.name}
                    </span>
                  </div>
                  {isSelected && <Check size={16} className="text-neutral-800" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
