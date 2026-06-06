import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import InstitutePage from "./InstitutePage";
import StudentPage from "./StudentPage";
import TeacherPage from "./TeacherPage";
import { useRole } from "../hooks/useRole";

export default function LandingPage() {
  const { activeRoleId } = useRole();

  // The Hero stays the same for every role. Only the Navbar (driven by
  // RoleContext) and the role-specific sections below the Hero change.
  const renderRoleSections = () => {
    if (!activeRoleId) return null;
    if (activeRoleId === "institute") return <InstitutePage hideHero />;
    if (activeRoleId === "student") return <StudentPage />;
    if (activeRoleId === "teacher") return <TeacherPage />;
    return null;
  };

  // Only lock scroll on the role-selection screen (no role picked yet)
  const lockScroll = !activeRoleId;

  return (
    <div
      className="bg-white min-h-screen"
      style={lockScroll ? { height: "100vh", overflow: "hidden" } : {}}
    >
      <Navbar />
      <Hero />
      {renderRoleSections()}
    </div>
  );
}



