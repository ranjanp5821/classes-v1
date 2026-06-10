import TeacherModulePage from "../../components/teacher/TeacherModulePage";
import { TEACHER_MODULES } from "../../config/teacherModules";

export default function PlanAndCreatePage() {
  return <TeacherModulePage module={TEACHER_MODULES["plan-and-create"]} />;
}
