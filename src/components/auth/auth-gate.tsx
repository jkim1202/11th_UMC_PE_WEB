"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";

interface AuthGateProps {
  children: ReactNode;
}

// 로그인한 사용자만 볼 수 있는 화면을 감싼다. (기존 (protected) 라우트의 beforeLoad)
export function RequireAuth({ children }: AuthGateProps) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      router.replace("/login");
    }
  }, [hasHydrated, accessToken, router]);

  // 토큰을 불러오기 전이거나 로그인하지 않았다면 화면을 그리지 않는다.
  if (!hasHydrated || !accessToken) return null;
  return children;
}

// 로그인하지 않은 사용자만 볼 수 있는 화면을 감싼다. (기존 /login 라우트의 beforeLoad)
export function RedirectIfAuthenticated({ children }: AuthGateProps) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hasHydrated && accessToken) {
      router.replace("/");
    }
  }, [hasHydrated, accessToken, router]);

  if (!hasHydrated || accessToken) return null;
  return children;
}
