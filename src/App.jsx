import { Routes, Route } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext";
import LandingPage from "./pages/LandingPage";
import LearnPage from "./pages/students/LearnPage";
import PracticePage from "./pages/students/PracticePage";
import ExamPreparationPage from "./pages/students/ExamPreparationPage";
import ProgressPage from "./pages/students/ProgressPage";
import AITutorPage from "./pages/students/AITutorPage";
import HowItHelpsPage from "./pages/teachers/HowItHelpsPage";
import PlanAndCreatePage from "./pages/teachers/PlanAndCreatePage";
import AssessAndSupportPage from "./pages/teachers/AssessAndSupportPage";
import TutorialsPage from "./pages/teachers/TutorialsPage";
import PlatformPage from "./pages/institutions/PlatformPage";
import AcademicIntelligencePage from "./pages/institutions/AcademicIntelligencePage";
import ImplementationPage from "./pages/institutions/ImplementationPage";
import TrustGovernancePage from "./pages/institutions/TrustGovernancePage";
import ResourcesPage from "./pages/institutions/ResourcesPage";
import AboutPage from "./pages/AboutPage";
import PartnersPage from "./pages/PartnersPage";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <RoleProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/students/learn" element={<LearnPage />} />
        <Route path="/students/practice" element={<PracticePage />} />
        <Route path="/students/exam-preparation" element={<ExamPreparationPage />} />
        <Route path="/students/progress" element={<ProgressPage />} />
        <Route path="/students/ai-tutor" element={<AITutorPage />} />
        <Route path="/teachers/how-it-helps" element={<HowItHelpsPage />} />
        <Route path="/teachers/plan-and-create" element={<PlanAndCreatePage />} />
        <Route path="/teachers/assess-and-support" element={<AssessAndSupportPage />} />
        <Route path="/teachers/tutorials" element={<TutorialsPage />} />
        <Route path="/institutions/platform" element={<PlatformPage />} />
        <Route path="/institutions/academic-intelligence" element={<AcademicIntelligencePage />} />
        <Route path="/institutions/implementation" element={<ImplementationPage />} />
        <Route path="/institutions/trust-governance" element={<TrustGovernancePage />} />
        <Route path="/institutions/resources" element={<ResourcesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </RoleProvider>
  );
}
