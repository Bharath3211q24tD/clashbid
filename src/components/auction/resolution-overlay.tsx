"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CharacterArtwork } from "@/components/game/character-artwork";
import { useDemoMatch } from "@/stores/demo-match";
import { RESOLUTION_FALLBACK_MS } from "@/stores/demo-match";
import { characterById } from "@/lib/demo/characters";
import { formatCrores } from "@/lib/utils";

const HOLD_MS = 1750;

export function ResolutionOverlay() {
  const match = useDemoMatch((state) => state.match);
  const acknowledge = useDemoMatch((state) => state.acknowledgeResolution);
  const reduced = useReducedMotion();

  const resolving =
    match && match.phase === "AUCTION_ACTIVE" && match.lotStage === "RESOLVING";

  useEffect(() => {
    if (!resolving) return;

    // If the held overlay never advances (interrupted render path), the
    // engine's fallback deadline still resolves the lot.
    const ackAt = window.setTimeout(() => acknowledge(), HOLD_MS);
    return () => window.clearTimeout(ackAt);
  }, [resolving, acknowledge]);

  useEffect(() => {
    if (!resolving) return;
    const referee = window.setTimeout(() => {
      if (
        useDemoMatch.getState().match?.lotStage === "RESOLVING" &&
        useDemoMatch.getState().match?.turnEndsAt &&
        Date.now() > useDemoMatch.getState().match!.turnEndsAt
      ) {
        acknowledge();
      }
    }, RESOLUTION_FALLBACK_MS + 100);
    return () => window.clearTimeout(referee);
  }, [resolving, acknowledge]);

  if (!resolving || !match) return null;

  const characterId = match.lotOrder[match.lotIndex];
  if (!characterId) return null;
  const character = characterById(characterId);
  const sold = match.lotOutcome === "sold";
  const winner = match.players.you.squad.some(
    (entry) => entry.characterId === characterId,
  )
    ? "you"
    : match.players.rival.squad.some((entry) => entry.characterId === characterId)
      ? "rival"
      : null;

  const headline = sold ? "SOLD" : "UNSOLD";
  const subline = sold
    ? `${winner === "you" ? "You" : "Sim Rival"} · ${formatCrores(match.currentBidCr)}`
    : "No bid met the floor";

  return (
    <div
      role="alertdialog"
      aria-label={sold ? `Sold — ${character.name}` : `Unsold — ${character.name}`}
      className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden rounded-panel bg-background/80 backdrop-blur-md"
    >
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgb(240_185_74_/_0.2),transparent_70%)]"
      />

      <div className="relative flex flex-col items-center gap-6 px-6 text-center">
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.7, rotate: sold ? -6 : 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 17,
            delay: reduced ? 0 : 0.25,
          }}
          className="w-40 sm:w-52"
        >
          <CharacterArtwork
            character={character}
            size="sm"
            className={
              sold
                ? "border-line-gold shadow-glow-strong"
                : "opacity-60 grayscale"
            }
          />
        </motion.div>

        <div className="overflow-hidden">
          <motion.h2
            initial={reduced ? false : { y: "115%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: reduced ? 0 : 0.5 }}
            className={
              sold
                ? "font-display text-[clamp(3.5rem,10vw,6.5rem)] leading-none font-bold tracking-[0.06em] text-gradient-gold uppercase select-none"
                : "font-display text-[clamp(2.5rem,8vw,5rem)] leading-none font-bold tracking-[0.06em] text-muted/60 uppercase select-none"
            }
          >
            {headline}
          </motion.h2>
            <motion.p
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.85, duration: 0.4 }}
            className="mt-2 font-display text-sm font-semibold tracking-[0.28em] text-foreground uppercase"
          >
            {character.name}
          </motion.p>
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 1, duration: 0.4 }}
            className="mt-1 text-xs text-muted"
          >
            {subline}
          </motion.p>
        </div>

        <motion.div
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: reduced ? 0 : 0.4, ease: "easeOut" }}
          className="hairline h-px w-56"
        />
      </div>
    </div>
  );
}
