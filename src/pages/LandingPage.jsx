import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import InstitutePage from "./InstitutePage";
import StudentPage from "./StudentPage";
import TeacherPage from "./TeacherPage";
import { useRole } from "../hooks/useRole";

export default function LandingPage() {
  const { activeRoleId } = useRole();
  const roleSectionRef = useRef(null);

  // The Hero stays the same for every role. Only the Navbar (driven by
  // RoleContext) and the role-specific sections below the Hero change.
  const renderRoleSections = () => {
    if (!activeRoleId) return null;
    if (activeRoleId === "institute") return <InstitutePage hideHero />;
    if (activeRoleId === "student") return <StudentPage />;
    if (activeRoleId === "teacher") return <TeacherPage />;
    return null;
  };

  // When a role is picked, reveal roughly the top 50% of the downstream
  // section by scrolling its midpoint to the bottom edge of the viewport.
  useEffect(() => {
    if (!activeRoleId) return;
    const el = roleSectionRef.current;
    if (!el) return;

    // Wait a frame so the newly rendered section has its real height.
    const id = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      // Scroll so half the section sits within the viewport.
      const target = sectionTop - window.innerHeight * 0.5;
      window.scrollTo({ top: Math.max(target, 0), behavior: "smooth" });
    });

    return () => cancelAnimationFrame(id);
  }, [activeRoleId]);

  // Only lock scroll on the role-selection screen (no role picked yet)
  const lockScroll = !activeRoleId;

  return (
    <div
      className="bg-white min-h-screen"
      style={lockScroll ? { height: "100vh", overflow: "hidden" } : {}}
    >
      <Navbar />
      <Hero />
      <div ref={roleSectionRef}>{renderRoleSections()}</div>
    </div>
  );
}
