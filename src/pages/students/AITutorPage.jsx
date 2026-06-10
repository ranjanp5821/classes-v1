import StudentModulePage from "../../components/student/StudentModulePage";
import { STUDENT_MODULES } from "../../config/studentModules";

export default function AITutorPage() {
  return <StudentModulePage module={STUDENT_MODULES["ai-tutor"]} />;
}
