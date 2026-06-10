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
      </Routes>
    </RoleProvider>
  );
}
