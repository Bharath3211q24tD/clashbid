"use client";

import { createStore, useStore } from "./create-store";

export interface AppShellState {
  mobileNavOpen: boolean;
}

const initialState: AppShellState = {
  mobileNavOpen: false,
};

export const appShellStore = createStore(initialState);

export const appShellActions = {
  openMobileNav: () => appShellStore.setState({ mobileNavOpen: true }),
  closeMobileNav: () => appShellStore.setState({ mobileNavOpen: false }),
  toggleMobileNav: () =>
    appShellStore.setState((state) => ({
      mobileNavOpen: !state.mobileNavOpen,
    })),
};

export function useMobileNavOpen(): boolean {
  return useStore(appShellStore, (state) => state.mobileNavOpen);
}
