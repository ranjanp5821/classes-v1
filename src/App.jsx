import { RoleProvider } from "./context/RoleContext";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <RoleProvider>
      <LandingPage />
    </RoleProvider>
  );
}

