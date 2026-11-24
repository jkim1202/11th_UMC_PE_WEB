import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  // localStorage에서 토큰을 다 불러왔는지 여부 (불러오기 전에는 로그인 여부를 판단하지 않음)
  hasHydrated: boolean;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      hasHydrated: false,
      setAccessToken: (token) => set({ accessToken: token }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
      // 서버 HTML과 브라우저 첫 렌더링을 같은 상태(토큰 없음)로 맞추기 위해
      // 자동으로 불러오지 않고, 브라우저에서 마운트된 뒤 rehydrate()로 불러온다.
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true });
      },
    },
  ),
);
