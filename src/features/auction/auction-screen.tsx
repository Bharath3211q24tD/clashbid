"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuctionArena } from "@/components/auction/auction-arena";
import { useStageClock } from "@/features/auction/use-stage-clock";
import { useDemoMatch } from "@/stores/demo-match";
import { scheduleRivalTurn, cancelRivalTurn } from "@/stores/demo-rival";
import { useSound } from "@/stores/sound";

export function AuctionScreen({ matchId }: { matchId: string }) {
  const match = useDemoMatch((state) => state.match);
  const playSound = useSound((state) => state.play);
  const router = useRouter();
  const mountedRef = useRef(false);
  const lotRef = useRef(-1);

  const lotSignature = match ? `${match.lotIndex}:${match.lotStage}` : "idle";
  const bidSignature = match ? `${match.lotIndex}:${match.currentBidCr}` : "idle";
  const outcomeSignature = match
    ? `${match.lotIndex}:${match.lotOutcome ?? "none"}`
    : "idle";

  useStageClock(matchId);

  // Scripted rival acts when handed the turn. Lot-open cue keyed here too.
  useEffect(() => {
    if (mountedRef.current && match) {
      if (match.lotStage === "ACTIVE" && match.lotIndex !== lotRef.current) {
        lotRef.current = match.lotIndex;
        playSound("lot-open");
      }
    }
    mountedRef.current = true;

    const state = useDemoMatch.getState();
    if (
      state.match &&
      state.match.phase === "AUCTION_ACTIVE" &&
      state.match.lotStage === "ACTIVE" &&
      state.match.turn === "rival"
    ) {
      scheduleRivalTurn();
    }
    return cancelRivalTurn;
  }, [lotSignature, match, playSound]);

  // Server-confirmed value cues (skip the mount pass).
  useEffect(() => {
    if (!mountedRef.current) return;
    playSound("bid-accept");
  }, [bidSignature, playSound]);

  useEffect(() => {
    if (!mountedRef.current) return;
    if (outcomeSignature.endsWith("sold")) playSound("sold");
    if (outcomeSignature.endsWith("unsold")) playSound("unsold");
  }, [outcomeSignature, playSound]);

  // Auction completion routes into battle evaluation.
  useEffect(() => {
    if (match && match.phase === "AUCTION_COMPLETED") {
      router.push(`/match/${matchId}/battle`);
    }
  }, [match, matchId, router]);

  if (!match || match.matchId !== matchId) return null;

  return (
    <div className="relative">
      <AuctionArena matchId={matchId} />
    </div>
  );
}
