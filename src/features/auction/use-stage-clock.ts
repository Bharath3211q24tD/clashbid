"use client";

import { useEffect } from "react";
import { useDemoMatch } from "@/stores/demo-match";

/**
 * Drives the server-clocked turn expiry check for the live lot while the
 * arena is mounted. Idempotent — the engine ignores early ticks.
 */
export function useStageClock(matchId: string): void {
  useEffect(() => {
    const interval = window.setInterval(() => {
      const state = useDemoMatch.getState();
      if (
        state.match &&
        state.match.matchId === matchId &&
        state.match.phase === "AUCTION_ACTIVE"
      ) {
        state.tickTimeout();
      }
    }, 250);
    return () => window.clearInterval(interval);
  }, [matchId]);
}
