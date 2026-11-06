"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface DemoUser {
  handle: string;
  email: string;
  method: "demo" | "email";
}

interface AuthStore {
  user: DemoUser | null;
  signIn: (user: DemoUser) => void;
  signOut: () => void;
}

/** Frontend-only session placeholder. Production auth ships with the backend. */
export const useAuth = create<AuthStore>()(
  persist<AuthStore, [], [], { user: DemoUser | null }>(
    (set) => ({
      user: null,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    {
      name: "clashbid-demo-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ user }) => ({ user }),
    },
  ),
);
