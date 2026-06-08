/**
 * StudentPage.jsx — Independent Student Homepage (downstream sections).
 *
 * Rendered below the shared Hero once the Student role is selected.
 * The marketing/landing content lives in <StudentHome />; this page wraps it
 * with the shared footer + "Switch Role" control.
 */

import { useRole } from "../hooks/useRole";
import StudentHome from "../components/student/StudentHome";

export default function StudentPage() {
  const { activeRoleConfig, clearRole } = useRole();

  if (!activeRoleConfig) return null;

  return (
    <div className="w-full bg-white">
      <StudentHome />

      {/* Footer */}
      <footer className="border-t border-neutral-100 bg-neutral-50 py-10 text-center">
        <p className="text-[13px] text-neutral-400 font-medium">
          © 2026 Classess · Independent Student Homepage · Built for Lifelong Learners
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
