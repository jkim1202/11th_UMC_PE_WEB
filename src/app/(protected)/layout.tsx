import type { ReactNode } from "react";
import { RequireAuth } from "../../components/auth/auth-gate";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
