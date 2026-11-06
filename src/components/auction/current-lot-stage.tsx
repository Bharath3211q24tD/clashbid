"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CharacterArtwork } from "@/components/game/character-artwork";
import { CATEGORY_ICONS } from "@/components/game/category-icons";
import { Badge } from "@/components/ui/badge";
import { Gavel } from "@/components/ui/icons";
import { useDemoMatch } from "@/stores/demo-match";
import { cn, formatCrores } from "@/lib/utils";
import { characterById } from "@/lib/demo/characters";
import type { PlayerId } from "@/types";

export function CurrentLotStage({ className }: { className?: string }) {
  const match = useDemoMatch((state) => state.match);
  const reduced = useReducedMotion();

  if (!match) return null;

  const characterId = match.lotOrder[match.lotIndex];
  if (match.lotStage === "PENDING" || !characterId) {
    return <EmptyStage className={className} />;
  }

  const character = characterById(characterId);
  const CategoryIcon = CATEGORY_ICONS[character.categoryId];
  const leader = match.lotLeader
    ? match.players[match.lotLeader as PlayerId]
    : null;

  return (
    <section
      aria-label={`Current lot — ${character.name}`}
      className={cn("relative flex min-h-0 flex-col", className)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-6 -top-10 h-64 bg-[radial-gradient(ellipse_60%_70%_at_50%_30%,rgb(240_185_74_/_0.14),transparent_70%)]"
      />

      <header className="relative flex items-center justify-between px-1">
        <span className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-gold uppercase">
          Lot {String(match.lotIndex + 1).padStart(2, "0")} / 30
        </span>
        <span className="inline-flex items-center gap-2 font-display text-[0.5625rem] font-semibold tracking-[0.2em] text-subtle uppercase">
          <CategoryIcon className="size-4 text-gold/70" />
          {character.rarity} · {character.categoryId}
        </span>
      </header>

      <div
        key={character.id}
        className={cn(
          "news relative mt-3 flex min-h-0 flex-1 items-center justify-center",
          className,
        )}
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="group relative flex h-full min-h-0 w-full max-w-sm flex-col items-center justify-center gap-4"
        >
          <div className="relative w-full max-w-[16rem] lg:max-w-none lg:flex-1 lg:min-h-0">
            <CharacterArtwork
              character={character}
              size="xl"
              zoomable
              className="h-full w-full lg:!aspect-auto"
            />
            <motion.div
              aria-hidden="true"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2.4, times: [0, 0.3, 1], repeat: Infinity, repeatDelay: 2.6 }}
              className="absolute inset-0 rounded-card bg-gold/[0.05] pointer-events-none"
            />
          </div>

          <div className="relative text-center lg:w-full">
            <h2 className="font-display text-3xl font-bold tracking-[0.04em] text-foreground uppercase lg:text-4xl">
              {character.name}
            </h2>
            <p className="mt-1 font-display text-[0.625rem] font-semibold tracking-[0.3em] text-gold uppercase">
              {character.aura}
            </p>
            <p className="mt-2 text-xs text-muted">
              Role: <span className="text-foreground">{character.role}</span> · Base:{" "}
              <span className="text-foreground tabular-nums">
                {formatCrores(character.basePriceCr)}
              </span>
            </p>
          </div>

          <div className="relative w-full max-w-md">
            <div className="flex items-center justify-between rounded-card border border-line-strong bg-background-deep/85 px-4 py-3">
              <div className="min-w-0">
                <p className="font-display text-[0.5625rem] font-semibold tracking-[0.22em] text-subtle uppercase">
                  {match.lotLeader ? "Winning bid" : "Awaiting opening bid"}
                </p>
                <p
                  key={match.currentBidCr}
                  className={cn(
                    "mt-1 font-display text-2xl leading-none font-bold tabular-nums",
                    match.lotLeader ? "text-gold-bright" : "text-muted",
                  )}
                >
                  {match.lotLeader ? formatCrores(match.currentBidCr) : "₹ —"}
                </p>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={leader?.id ?? "none"}
                  initial={reduced ? false : { opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.3 }}
                  className="flex size-12 shrink-0 flex-col items-center justify-center rounded-control border text-center"
                  data-leader={leader ? "set" : "empty"}
                  style={{
                    borderColor: leader?.id === "you" ? "rgb(240 185 74 / 0.5)" : "rgb(245 243 237 / 0.16)",
                    backgroundColor: leader?.id === "you" ? "rgb(240 185 74 / 0.1)" : "rgb(16 19 26 / 0.8)",
                  }}
                >
                  <span className="font-display text-lg font-bold uppercase leading-none">
                    {leader ? leader.handle.charAt(0) : "—"}
                  </span>
                  <span className="mt-1 text-[0.45rem] font-semibold tracking-[0.14em] text-subtle uppercase">
                    {leader ? (leader.id === "you" ? "You lead" : "Rival") : "No bid"}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-2 flex items-center justify-center gap-2">
              <Badge tone="muted" className="gap-1.5">
                <Gavel className="size-3" />
                Bid +1 Cr increments
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function EmptyStage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-center rounded-card border border-dashed border-line/70 text-center",
        className,
      )}
    >
      <div>
        <p className="font-display text-sm font-semibold tracking-[0.2em] text-subtle uppercase">
          Next lot in preparation
        </p>
        <p className="mt-2 text-xs text-muted">
          The pool of 30 shared lots is loading into the arena.
        </p>
      </div>
    </div>
  );
}
