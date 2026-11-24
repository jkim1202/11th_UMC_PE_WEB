import { RedirectIfAuthenticated } from "../../components/auth/auth-gate";
import LoginPage from "../../views/auth/login-page";

export default function Page() {
  return (
    <RedirectIfAuthenticated>
      <LoginPage />
    </RedirectIfAuthenticated>
  );
}
