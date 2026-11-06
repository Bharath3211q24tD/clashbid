"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  SQUAD_SIZE,
  TURN_TIMER_MS,
  useDemoMatch,
} from "@/stores/demo-match";
import { CountdownTimer } from "@/components/game/countdown-timer";
import { Button } from "@/components/ui/button";
import { Gavel, Lock, X_1 } from "@/components/ui/icons";
import { useSound } from "@/stores/sound";
import { cn, formatCrores } from "@/lib/utils";
import { characterById } from "@/lib/demo/characters";
import { LOT_INCREMENT_CR } from "@/stores/demo-match";

export function BidPanel({ className }: { className?: string }) {
  const match = useDemoMatch((state) => state.match);
  const bid = useDemoMatch((state) => state.bid);
  const pass = useDemoMatch((state) => state.pass);
  const tickTimeout = useDemoMatch((state) => state.tickTimeout);
  const playSound = useSound((state) => state.play);
  const reduced = useReducedMotion();

  if (!match || match.phase !== "AUCTION_ACTIVE") return null;

  const live = match.lotStage === "ACTIVE";
  const yourTurn = live && match.turn === "you";
  const leading = match.lotLeader === "you";
  const { character } = { character: characterById(match.lotOrder[match.lotIndex]!) };
  const resultingBid = match.lotLeader
    ? match.currentBidCr + LOT_INCREMENT_CR
    : character.basePriceCr;
  const affordable = match.players.you.walletCr >= resultingBid;
  const canBid = yourTurn && !leading && affordable;
  const slotsNeeded = Math.max(0, SQUAD_SIZE - match.players.you.squad.length);

  const handleBid = () => {
    const result = bid("you");
    playSound(result.ok ? "bid-accept" : "bid-fail");
  };

  const handlePass = () => {
    const result = pass("you");
    if (result.ok) playSound("ui-confirm");
  };

  return (
    <div
      className={cn(
        "relative flex flex-col gap-3.5 rounded-card border border-line-strong bg-elevated/85 p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-[0.625rem] font-semibold tracking-[0.22em] text-subtle uppercase">
          Bid controls
        </p>
        <span className="font-display text-[0.5625rem] font-semibold tracking-[0.18em] text-subtle uppercase tabular-nums">
          {slotsNeeded > 0
            ? `${slotsNeeded} slot${slotsNeeded > 1 ? "s" : ""} to fill`
            : "Squad complete"}
        </span>
      </div>

      <CountdownTimer
        turnEndsAt={match.turnEndsAt}
        totalMs={TURN_TIMER_MS}
        active={live}
        onExpire={() => tickTimeout()}
      />

      <AnimatePresence mode="wait">
        <motion.p
          key={yourTurn ? "you" : match.turn}
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className={cn(
            "text-center font-display text-sm font-semibold tracking-[0.14em] uppercase",
            yourTurn ? "text-gold-bright" : "text-muted",
          )}
        >
          {live
            ? yourTurn
              ? "Your move"
              : "Rival is deciding"
            : "Resolving lot"}
        </motion.p>
      </AnimatePresence>

      <div className="grid grid-cols-[1.6fr_1fr] gap-2.5">
        <Button
          onClick={handleBid}
          disabled={!canBid}
          size="lg"
          className={cn(!canBid && "grayscale-[0.4]")}
          aria-label={
            canBid
              ? `Bid ${formatCrores(resultingBid)}`
              : leading
                ? "You already lead this lot"
                : "Bidding unavailable"
          }
        >
          <Gavel className="size-4" />
          {leading ? (
            <span className="inline-flex items-center gap-2">
              Leading <Lock className="size-3" />
            </span>
          ) : (
            "Bid"
          )}
          <span className="ml-1 tabular-nums">{formatCrores(resultingBid)}</span>
        </Button>
        <Button
          variant="secondary"
          onClick={handlePass}
          disabled={!yourTurn}
          size="lg"
        >
          <X_1 className="size-4" />
          Pass
        </Button>
      </div>

      {!affordable && !leading && yourTurn ? (
        <p className="text-center text-xs text-danger">
          Not enough wallet left for this lot at {formatCrores(resultingBid)}.
        </p>
      ) : null}
    </div>
  );
}
