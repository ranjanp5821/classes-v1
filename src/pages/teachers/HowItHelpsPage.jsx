import TeacherModulePage from "../../components/teacher/TeacherModulePage";
import { TEACHER_MODULES } from "../../config/teacherModules";

export default function HowItHelpsPage() {
  return <TeacherModulePage module={TEACHER_MODULES["how-it-helps"]} />;
}
