import InstitutionModulePage from "../../components/institute/InstitutionModulePage";
import { INSTITUTION_MODULES } from "../../config/instituteModules";

export default function AcademicIntelligencePage() {
  return <InstitutionModulePage module={INSTITUTION_MODULES["academic-intelligence"]} />;
}
