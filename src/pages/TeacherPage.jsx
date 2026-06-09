/**
 * TeacherPage.jsx — Teacher role page wrapper.
 *
 * Mirrors the StudentPage pattern: thin wrapper that renders <TeacherHome />
 * plus the shared footer + "Switch Role" control.
 * All marketing content lives in src/components/teacher/TeacherHome.jsx.
 */

import { useRole } from "../hooks/useRole";
import TeacherHome from "../components/teacher/TeacherHome";

export default function TeacherPage() {
  const { activeRoleConfig, clearRole } = useRole();

  if (!activeRoleConfig) return null;

  return (
    <div className="w-full bg-white">
      <TeacherHome />

      {/* Footer */}
      <footer className="border-t border-neutral-100 bg-neutral-50 py-10 text-center">
        <p className="text-[13px] text-neutral-400 font-medium">
          © 2026 Classess.com® · Teacher Platform · Built for Modern Educators
        </p>
        <button
          onClick={clearRole}
          className="mt-3 text-[12px] text-neutral-400 hover:text-neutral-600 underline-offset-2 hover:underline transition-colors"
        >
          ← Switch Role
        </button>
      </footer>
    </div>
  );
}
