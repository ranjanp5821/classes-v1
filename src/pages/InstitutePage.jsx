import { useRole } from "../hooks/useRole";
import InstituteHome from "../components/institute/InstituteHome";

export default function InstitutePage() {
  const { activeRoleConfig, clearRole } = useRole();

  if (!activeRoleConfig) return null;

  return (
    <div className="w-full bg-white">
      <InstituteHome />

      <footer className="border-t border-neutral-100 bg-neutral-50 py-10 text-center">
        <p className="text-[13px] text-neutral-400 font-medium">
          © 2026 Classess.com® · Institution Platform · Built for Academic Leadership
        </p>
        <button
          onClick={clearRole}
          className="mt-3 text-[12px] text-neutral-400 hover:text-neutral-600 underline-offset-2 hover:underline transition-colors"
        >
          ← Switch Role
        </button>
      </footer>
    </div>
  );
}
