"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { DemoMatch } from "@/types";

export interface DemoMatchResult {
  matchId: string;
  at: number;
  outcome: "W" | "L" | "D";
  scoreYou: number;
  scoreRival: number;
  ratingDelta: number;
}

interface DemoCareerStore {
  rating: number;
  results: DemoMatchResult[];
  recordedMatchIds: string[];
  record: (match: DemoMatch) => void;
  reset: () => void;
}

/** Demo progress ledger. Local-only persistence; production data comes from accounts. */
export const useDemoCareer = create<DemoCareerStore>()(
  persist<DemoCareerStore, [], [], Omit<DemoCareerStore, "reset" | "record">>(
    (set, get) => ({
      rating: 1200,
      results: [],
      recordedMatchIds: [],
      record: (match) => {
        const evaluation = match.evaluation;
        if (match.phase !== "COMPLETED" || !evaluation) return;
        const state = get();
        if (state.recordedMatchIds.includes(match.matchId)) return;

        const scoreYou = evaluation.final.you;
        const scoreRival = evaluation.final.rival;
        const outcome: DemoMatchResult["outcome"] =
          scoreYou > scoreRival ? "W" : scoreYou < scoreRival ? "L" : "D";

        set({
          rating: Math.max(100, state.rating + evaluation.ratingDelta.you),
          results: [
            {
              matchId: match.matchId,
              at: match.createdAt,
              outcome,
              scoreYou,
              scoreRival,
              ratingDelta: evaluation.ratingDelta.you,
            },
            ...state.results,
          ].slice(0, 10),
          recordedMatchIds: [...state.recordedMatchIds, match.matchId].slice(-30),
        });
      },
      reset: () =>
        set({ rating: 1200, results: [], recordedMatchIds: [] }),
    }),
    {
      name: "clashbid-demo-career",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ results, rating, recordedMatchIds }) => ({
        results,
        rating,
        recordedMatchIds,
      }),
    },
  ),
);

export function careerTotals(results: DemoMatchResult[]): {
  wins: number;
  losses: number;
  draws: number;
  played: number;
} {
  const wins = results.filter((r) => r.outcome === "W").length;
  const losses = results.filter((r) => r.outcome === "L").length;
  const draws = results.filter((r) => r.outcome === "D").length;
  return { wins, losses, draws, played: results.length };
}
