/**
 * TeacherPage.jsx — Teacher role page wrapper.
 *
 * Mirrors the StudentPage pattern: thin wrapper that renders <TeacherHome />
 * plus the shared footer + "Switch Role" control.
 * All marketing content lives in src/components/teacher/TeacherHome.jsx.
 */

import { useRole } from "../hooks/useRole";
import TeacherHome from "../components/teacher/TeacherHome";
import Footer from "../components/Footer";

export default function TeacherPage({ onOpenAuth }) {
  const { activeRoleConfig, clearRole } = useRole();

  if (!activeRoleConfig) return null;

  return (
    <div className="w-full bg-white">
      <TeacherHome onOpenAuth={onOpenAuth} />
      <Footer />
    </div>
  );
}
