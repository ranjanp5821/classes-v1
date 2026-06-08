import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AuthModal from "../components/AuthModal";
import VoiceAssistant from "../components/VoiceAssistant";
import InstitutePage from "./InstitutePage";
import StudentPage from "./StudentPage";
import TeacherPage from "./TeacherPage";
import { StudentHero } from "../components/student/StudentHome";
import { useRole } from "../hooks/useRole";

export default function LandingPage() {
  const { activeRoleId, selectRole } = useRole();
  const roleSectionRef = useRef(null);

  // Auth popup ({ mode, pos }) lives here so the page content behind it
  // (navbar + hero + sections) can be blurred while the popup stays sharp.
  const [authModal, setAuthModal] = useState(null);

  // Student gets a dedicated hero (replacing the generic role-selection Hero);
  // every other state keeps the shared Hero with the role-specific sections
  // rendered below it.
  const renderHero = () => {
    if (activeRoleId === "student") return <StudentHero />;
    return <Hero onOpenAuth={(mode, pos) => setAuthModal({ mode, pos })} />;
  };

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

    // Student has its own hero at the top — land there instead of revealing
    // the sections below.
    if (activeRoleId === "student") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

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
  const authOpen = authModal !== null;

  const handleAuthRoleSelect = (roleId) => {
    selectRole(roleId);
    setAuthModal(null);
  };

  return (
    <div
      className={`bg-white min-h-screen ${
        lockScroll ? "md:h-screen md:overflow-hidden" : ""
      }`}
    >
      {/* Page content — blurred while the auth popup is open */}
      <div
        className="transition-[filter] duration-200"
        style={authOpen ? { filter: "blur(4px)" } : undefined}
        aria-hidden={authOpen}
      >
        <Navbar onOpenAuth={(mode, pos) => setAuthModal({ mode, pos })} />
        {renderHero()}
        <div ref={roleSectionRef}>{renderRoleSections()}</div>
      </div>

      {/* Sign In / Sign Up role picker — stays sharp above the blurred page */}
      <AuthModal
        open={authOpen}
        mode={authModal?.mode ?? "signin"}
        position={authModal?.pos ?? null}
        initialRoleId={activeRoleId}
        onClose={() => setAuthModal(null)}
        onSelectRole={handleAuthRoleSelect}
      />

      {/* Anam.ai avatar voice assistant — bottom-right launcher */}
      <VoiceAssistant />
    </div>
  );
}
