import TeacherModulePage from "../../components/teacher/TeacherModulePage";
import { TEACHER_MODULES } from "../../config/teacherModules";

export default function AssessAndSupportPage() {
  return <TeacherModulePage module={TEACHER_MODULES["assess-and-support"]} />;
}
