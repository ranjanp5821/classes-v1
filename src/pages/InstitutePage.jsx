import { useRole } from "../hooks/useRole";
import InstituteHome from "../components/institute/InstituteHome";
import Footer from "../components/Footer";

export default function InstitutePage() {
  const { activeRoleConfig, clearRole } = useRole();

  if (!activeRoleConfig) return null;

  return (
    <div className="w-full bg-white">
      <InstituteHome />
      <Footer />
    </div>
  );
}
