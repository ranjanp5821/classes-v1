import InstitutionModulePage from "../../components/institute/InstitutionModulePage";
import { INSTITUTION_MODULES } from "../../config/instituteModules";

export default function TrustGovernancePage() {
  return <InstitutionModulePage module={INSTITUTION_MODULES["trust-governance"]} />;
}
