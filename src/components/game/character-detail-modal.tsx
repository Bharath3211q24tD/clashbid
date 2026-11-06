"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CharacterArtwork } from "@/components/game/character-artwork";
import { CATEGORY_ICONS } from "@/components/game/category-icons";
import { AttributeBars } from "@/components/game/attribute-bars";
import { WeightChips } from "@/components/game/attribute-bars";
import { challengeCatalog } from "@/lib/demo/challenges";
import { RARITY_LABELS } from "@/lib/demo/attributes";
import { gameRules } from "@/lib/site";
import { useEscapeKey, useLockBodyScroll } from "@/hooks";
import { cn, formatCrores } from "@/lib/utils";
import { useSound } from "@/stores/sound";
import type { GameCharacter } from "@/types";

const MODAL_FALLBACK = "demo-eval-1.0 attribution — game-balanced figures, not real-world stats";

export function CharacterDetailModal({
  character,
  onClose,
}: {
  character: GameCharacter | null;
  onClose: () => void;
}) {
  const open = character !== null;
  const playSound = useSound((state) => state.play);
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);
  useEscapeKey(open, onClose);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  if (!open || !character) return null;

  const CategoryIcon = CATEGORY_ICONS[character.categoryId];

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`${character.name} details`}
      onKeyDown={handleKeyDown}
    >
      <motion.button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-background/85 backdrop-blur-md"
      />

      <motion.div
        ref={panelRef}
        initial={reduced ? false : { opacity: 0, y: 42, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="grain relative max-h-[88dvh] w-full max-w-2xl overflow-y-auto rounded-t-panel border border-line-strong bg-elevated shadow-float sm:rounded-panel"
      >
        <div className="relative grid gap-5 p-5 sm:grid-cols-[240px_1fr] sm:p-6">
          <div className="flex flex-col gap-3">
            <CharacterArtwork character={character} size="lg" className="w-full" />
            <div className="rounded-control border border-line bg-background-deep/60 px-3 py-2.5">
              <p className="font-display text-[0.5625rem] font-semibold tracking-[0.2em] text-subtle uppercase">
                Base price
              </p>
              <p className="mt-1 font-display text-xl font-bold text-gold-bright tabular-nums">
                {formatCrores(character.basePriceCr)}
              </p>
            </div>
            <p className="text-[0.5625rem] leading-relaxed tracking-[0.14em] text-subtle uppercase">
              {MODAL_FALLBACK}
            </p>
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 font-display text-[0.625rem] font-semibold tracking-[0.2em] text-gold uppercase">
                <CategoryIcon className="size-4" />
                {character.categoryId} · lot #
                {characterSlotNumber(character.id)}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => {
                  playSound("ui-confirm");
                  onClose();
                }}
                aria-label="Close details"
                className="flex size-9 items-center justify-center rounded-control border border-line bg-white/[0.03] text-muted transition-colors hover:border-line-gold hover:text-foreground [&_svg]:size-4"
              >
                ✕
              </button>
            </div>

            <h1 className="mt-2 font-display text-3xl font-bold tracking-[0.04em] text-foreground uppercase">
              {character.name}
            </h1>
            <p className="mt-1 font-display text-sm font-semibold tracking-[0.2em] text-gold uppercase">
              {character.aura}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-pill border border-line-strong bg-white/[0.03] px-2.5 py-1 font-display text-[0.5625rem] font-semibold tracking-[0.18em] text-foreground uppercase">
                Role · {character.role}
              </span>
              <span
                className={cn(
                  "rounded-pill border px-2.5 py-1 font-display text-[0.5625rem] font-semibold tracking-[0.18em] uppercase",
                  character.rarity === "iconic"
                    ? "border-line-gold bg-gold-soft text-gold-bright"
                    : "border-line-strong bg-white/[0.03] text-muted",
                )}
              >
                {RARITY_LABELS[character.rarity]}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              {character.flavor}
            </p>

            <div className="mt-5">
              <p className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-gold uppercase">
                Game-balanced attributes
              </p>
              <div className="mt-3">
                <AttributeBars attributes={character.attributes} compact />
              </div>
            </div>

            <div className="mt-5 border-t border-line pt-4">
              <p className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-subtle uppercase">
                Scored against challenge weights
              </p>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
                {challengeCatalog.map((challenge) => (
                  <span
                    key={challenge.id}
                    className="rounded-control border border-line bg-white/[0.02] px-2 py-1 text-[0.625rem] text-muted"
                  >
                    <strong className="font-display font-semibold text-foreground">
                      {challenge.name}
                    </strong>{" "}
                    <span className="tabular-nums">
                      ≈ {challengeValue(character, challenge.weights)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function challengeValue(
  character: GameCharacter,
  weights: Record<string, number>,
): number {
  let total = 0;
  let weightSum = 0;
  (Object.keys(weights) as (keyof typeof character.attributes)[]).forEach(
    (key) => {
      total += weights[key]! * character.attributes[key]!;
      weightSum += weights[key]!;
    },
  );
  return Math.round(total / (weightSum || 1));
}

function characterSlotNumber(characterId: string): number {
  // Stable pseudo-lot display number derived from id ordering.
  return parseInt(characterId.replace(/\D/g, ""), 10) || 0;
}

export function CharacterStatNote() {
  return (
    <p className="text-xs text-muted">
      Fictional entity stats are game-balanced for the demo. {gameRules.poolSize}{" "}
      lots ship in the match pool.
    </p>
  );
}

export { WeightChips };
