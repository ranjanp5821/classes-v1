/**
 * StudentPage.jsx — Independent Student Homepage (downstream sections).
 *
 * Rendered below the shared Hero once the Student role is selected.
 * The marketing/landing content lives in <StudentHome />; this page wraps it
 * with the shared footer + "Switch Role" control.
 */

import { useRole } from "../hooks/useRole";
import StudentHome from "../components/student/StudentHome";
import Footer from "../components/Footer";

export default function StudentPage() {
  const { activeRoleConfig, clearRole } = useRole();

  if (!activeRoleConfig) return null;

  return (
    <div className="w-full bg-white">
      <StudentHome />
      <Footer />
    </div>
  );
}
