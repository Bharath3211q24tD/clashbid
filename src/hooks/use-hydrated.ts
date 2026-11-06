"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => undefined;

/**
 * Gates client-only, persist-rehydrated state so server and client markup
 * stay in sync on first paint. Uses the external-store snapshot trick so the
 * hydration pass resolves without triggering extra renders.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
