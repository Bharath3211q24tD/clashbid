import { cn } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/components/game/category-icons";
import type { GameCharacter } from "@/types";

type ArtworkSize = "sm" | "md" | "lg" | "xl";

const sizeStyles: Record<ArtworkSize, string> = {
  sm: "aspect-[4/5]",
  md: "aspect-[4/5]",
  lg: "aspect-[3/4]",
  xl: "aspect-[4/5] sm:aspect-square lg:aspect-[3/4]",
};

function hashString(value: string): number {
  let hash = 7;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

interface CharacterArtworkProps {
  character: GameCharacter;
  size?: ArtworkSize;
  className?: string;
  zoomable?: boolean;
  label?: boolean;
}

/**
 * Placeholder character artwork. Production character art ships licensed
 * assets from the backend content pipeline — this programmatic panel keeps
 * layout stable and clearly marks itself as placeholder.
 */
export function CharacterArtwork({
  character,
  size = "md",
  className,
  zoomable = false,
  label = true,
}: CharacterArtworkProps) {
  const Glyph = CATEGORY_ICONS[character.categoryId];
  const seed = hashString(character.id);
  const angle = 12 + (seed % 6) * 42;
  const glowShift = 18 + (seed % 5) * 9;
  const initial = character.name.trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-card border border-line bg-[#0b0d13]",
        sizeStyles[size],
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
        style={{
          background:
            `radial-gradient(ellipse 90% 70% at ${glowShift}% 12%, rgb(240 185 74 / 0.22), transparent 60%),` +
            `radial-gradient(ellipse 60% 52% at 82% 88%, rgb(255 215 120 / 0.10), transparent 65%),` +
            `linear-gradient(${angle}deg, #10131b 0%, #0b0d13 58%, #07080c 100%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(245 243 237 / 0.5) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgb(245 243 237 / 0.5) 1px, transparent 1px)",
          backgroundSize: "2.25rem 2.25rem",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, black 0%, transparent 72%)",
        }}
      />

      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[7.5rem] leading-none font-bold text-white/[0.05] select-none sm:text-[9rem]"
      >
        {initial}
      </span>
      <Glyph
        aria-hidden="true"
        className={cn(
          "absolute right-3 bottom-3 text-gold/25",
          size === "sm" ? "size-5" : "size-7",
        )}
      />

      {zoomable ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-transparent via-gold/[0.07] to-transparent motion-safe:animate-scan"
        />
      ) : null}

      {label ? (
        <span className="absolute top-2.5 left-3 font-display text-[0.5rem] font-semibold tracking-[0.24em] text-white/25 uppercase">
          Placeholder art
        </span>
      ) : null}

      <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-11 bg-gradient-to-t from-black/55 to-transparent" />
    </div>
  );
}
