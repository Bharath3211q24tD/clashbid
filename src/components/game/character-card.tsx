"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { CharacterArtwork } from "@/components/game/character-artwork";
import { CATEGORY_ICONS } from "@/components/game/category-icons";
import { Gavel } from "@/components/ui/icons";
import { ATTRIBUTE_SHORT } from "@/lib/demo/attributes";
import { cn, formatCrores } from "@/lib/utils";
import type { GameCharacter } from "@/types";

const rarityBorder: Record<GameCharacter["rarity"], string> = {
  iconic: "border-line-gold",
  elite: "border-line-strong",
  rising: "border-line",
};

const ATTRIBUTE_KEYS = [
  "power",
  "strategy",
  "leadership",
  "adaptability",
  "endurance",
] as const;

interface CharacterCardProps {
  character: GameCharacter;
  href?: string;
  index?: number;
  compact?: boolean;
  onOpen?: (character: GameCharacter) => void;
}

export function CharacterCard({
  character,
  href,
  index = 0,
  compact = false,
  onOpen,
}: CharacterCardProps) {
  const reduced = useReducedMotion();
  const CategoryIcon = CATEGORY_ICONS[character.categoryId];

  const body = (
    <>
      <div className="relative">
        <CharacterArtwork
          character={character}
          size={compact ? "sm" : "md"}
          zoomable
        />
        {character.rarity === "iconic" ? (
          <span className="absolute top-2.5 right-3 rounded-pill border border-line-gold bg-background/85 px-2 py-0.5 font-display text-[0.5rem] font-semibold tracking-[0.2em] text-gold-bright uppercase">
            Iconic
          </span>
        ) : null}
      </div>

      <div className="relative px-4 pt-3.5">
        <div className="flex items-center gap-2 text-[0.5625rem] font-semibold tracking-[0.18em] text-subtle uppercase">
          <CategoryIcon className="size-3.5 text-gold/70" />
          {character.role}
        </div>
        <h3 className="mt-1.5 font-display text-lg leading-tight font-semibold text-foreground transition-colors group-hover:text-gold-bright">
          {character.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
          {character.flavor}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="inline-flex items-center gap-1.5 font-display text-[0.5625rem] font-semibold tracking-[0.18em] text-subtle uppercase">
            <Gavel className="size-3.5 text-gold/70" />
            Base
          </span>
          <span className="font-display text-base font-semibold tracking-[0.02em] text-gold-bright tabular-nums">
            {formatCrores(character.basePriceCr)}
          </span>
        </div>
      </div>

      {compact ? null : (
        <div className="mt-4 grid grid-cols-5 gap-2 px-4 pb-4">
          {ATTRIBUTE_KEYS.map((key) => (
            <div key={key} className="text-center">
              <p className="font-display text-[0.5625rem] font-semibold tracking-[0.12em] text-subtle">
                {ATTRIBUTE_SHORT[key]}
              </p>
              <p className="mt-1 font-display text-sm leading-none font-semibold text-foreground tabular-nums">
                {character.attributes[key]}
              </p>
              <div className="mt-1.5 h-0.5 overflow-hidden rounded-pill bg-white/10">
                <div
                  className="h-full rounded-pill bg-gold/80"
                  style={{ width: `${character.attributes[key]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const shellClass = cn(
    "group relative block h-full overflow-hidden rounded-card border bg-elevated/90 shadow-card transition-[border-color,transform,box-shadow] duration-400 ease-out-expo",
    "hover:-translate-y-1 hover:border-line-gold hover:shadow-glow hover:shadow-glow/60",
    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold",
    rarityBorder[character.rarity],
  );

  const clickHandler = onOpen
    ? {
        onClick: (event: React.MouseEvent) => {
          event.preventDefault();
          onOpen(character);
        },
      }
    : {};

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.045, 0.35),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full"
    >
      {onOpen ? (
        <Link href={href ?? "#"} {...clickHandler} className={shellClass} aria-label={`${character.name} details`}>
          {body}
        </Link>
      ) : (
        <Link href={href ?? "#"} className={shellClass}>
          {body}
        </Link>
      )}
    </motion.article>
  );
}
