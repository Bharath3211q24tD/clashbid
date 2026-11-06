"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useDemoMatch } from "@/stores/demo-match";
import { cn } from "@/lib/utils";
import { BackToLobbyLink, DemoPill } from "@/components/game/demo-notice";

type StageRoute = "challenge" | "auction" | "battle" | "results";

const PHASE_ROUTES: Record<StageRoute, readonly string[]> = {
  challenge: ["CHALLENGE_SELECTION"],
  auction: ["AUCTION_ACTIVE", "AUCTION_COMPLETED"],
  battle: ["AUCTION_COMPLETED", "BATTLE_PROCESSING", "COMPLETED"],
  results: ["COMPLETED"],
};

interface MatchGateProps {
  matchId: string;
  stage: StageRoute;
  children: ReactNode;
}

export function MatchGate({ matchId, stage, children }: MatchGateProps) {
  const hydrated = useHydrated();
  const match = useDemoMatch((state) => state.match);
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;

    if (!match) {
      router.replace("/matchmaking");
      return;
    }
    if (match.matchId !== matchId) {
      router.replace("/lobby");
      return;
    }
    if (
      !PHASE_ROUTES[stage].includes(match.phase) &&
      match.phase !== "CANCELLED"
    ) {
      router.replace(routeForPhase(match));
      return;
    }
    if (match.phase === "CANCELLED") {
      router.replace("/lobby");
    }
  }, [hydrated, match, matchId, stage, router]);

  if (!hydrated) {
    return <MatchSkeleton />;
  }

  if (!match || match.matchId !== matchId || match.phase === "CANCELLED") {
    return <MatchSkeleton label="Redirecting" />;
  }

  const allowed = PHASE_ROUTES[stage].includes(match.phase) || false;
  if (!allowed) {
    return <MatchSkeleton label="Loading arena" />;
  }

  return (
    <div className="relative">
      <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between gap-3 px-gutter pt-6">
        <BackToLobbyLink />
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-mono text-[0.625rem] tracking-[0.1em] text-subtle",
            )}
          >
            {matchId}
          </span>
          <DemoPill />
        </div>
      </div>
      {children}
    </div>
  );
}

function routeForPhase(match: NonNullable<ReturnType<typeof useDemoMatch.getState>["match"]>): string {
  const base = `/match/${match.matchId}`;
  switch (match.phase) {
    case "CHALLENGE_SELECTION":
      return `${base}/challenge`;
    case "AUCTION_ACTIVE":
    case "AUCTION_COMPLETED":
      return `${base}/auction`;
    case "COMPLETED":
      return `/results/${match.matchId}`;
    case "CANCELLED":
      return "/lobby";
    default:
      return `${base}/challenge`;
  }
}

export function MatchSkeleton({ label = "Preparing" }: { label?: string }) {
  return (
    <div className="mx-auto flex w-full max-w-[92rem] flex-col gap-4 px-gutter pt-10">
      <div className="h-3 w-24 animate-pulse rounded-pill bg-white/[0.06]" />
      <div className="h-64 animate-pulse rounded-panel border border-line bg-white/[0.03]" />
      <p className="text-center font-display text-[0.6875rem] font-semibold tracking-[0.3em] text-subtle uppercase">
        {label}…
      </p>
      <p className="text-center text-xs text-muted">
        Back to{" "}
        <Link
          href="/lobby"
          className="text-gold-bright underline-offset-4 hover:underline"
        >
          the lobby
        </Link>
      </p>
    </div>
  );
}
