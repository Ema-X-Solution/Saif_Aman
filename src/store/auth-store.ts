import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthSession } from "@/types/auth";

interface AuthState {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      logout: () => set({ session: null }),
    }),
    {
      name: "saif-aman-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
      }),
    },
  ),
);
