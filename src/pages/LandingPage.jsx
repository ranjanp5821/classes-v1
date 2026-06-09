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

  const renderHero = () => (
    <Hero onOpenAuth={(mode, pos) => setAuthModal({ mode, pos })} />
  );

  const renderRoleSections = () => {
    if (!activeRoleId) return null;
    if (activeRoleId === "institute") return <InstitutePage />;
    if (activeRoleId === "student") return <><StudentHero /><StudentPage /></>;
    if (activeRoleId === "teacher") return <TeacherPage />;
    return null;
  };

  // When a role is picked, gently scroll just below the hero to reveal the
  // start of the downstream section (~top half), so the user keeps scrolling
  // naturally rather than being jumped deep into the page.
  useEffect(() => {
    if (!activeRoleId) return;

    // Wait two frames so the newly rendered section has mounted + measured.
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = roleSectionRef.current;
        if (!el) return;
        const sectionTop = el.getBoundingClientRect().top + window.scrollY;
        const target = sectionTop - window.innerHeight * 0.5;
        window.scrollTo({ top: Math.max(target, 0), behavior: "smooth" });
      });
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

        {/* Anchor targets for avatar voice navigation & navbar links.
            Replace each div with a real content section as the site grows. */}
        <div id="products" />
        <div id="features" />
        <div id="about"    />
        <div id="contact"  />

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
