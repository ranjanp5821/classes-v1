import { Routes, Route } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext";
import LandingPage from "./pages/LandingPage";
import LearnPage from "./pages/students/LearnPage";
import PracticePage from "./pages/students/PracticePage";
import ExamPreparationPage from "./pages/students/ExamPreparationPage";
import ProgressPage from "./pages/students/ProgressPage";
import AITutorPage from "./pages/students/AITutorPage";

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
      </Routes>
    </RoleProvider>
  );
}
