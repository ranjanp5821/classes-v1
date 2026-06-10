import StudentModulePage from "../../components/student/StudentModulePage";
import { STUDENT_MODULES } from "../../config/studentModules";

export default function ProgressPage() {
  return <StudentModulePage module={STUDENT_MODULES.progress} />;
}
