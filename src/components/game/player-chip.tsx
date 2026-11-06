import { characterById } from "@/lib/demo/characters";
import { CATEGORY_ICONS } from "@/components/game/category-icons";
import { cn, formatCrores } from "@/lib/utils";
import type { PlayerState, SquadEntry } from "@/types";

export const SQUAD_SIZE_DISPLAY = 5;

interface PlayerChipProps {
  player: PlayerState;
  active?: boolean;
}

export function PlayerChip({ player, active }: PlayerChipProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-control border p-2.5 transition-colors",
        active ? "border-line-gold bg-gold-soft" : "border-line bg-elevated/60",
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-control border border-line-strong bg-surface font-display text-sm font-bold text-gold-bright uppercase"
      >
        {player.handle.trim().charAt(0) || "?"}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 font-display text-[0.625rem] font-semibold tracking-[0.2em] text-foreground uppercase">
          {player.handle}
          {active ? (
            <span className="size-1.5 rounded-full bg-gold shadow-[0_0_8px_rgb(240_185_74_/_0.9)]" />
          ) : null}
        </p>
        <p className="mt-0.5 text-[0.625rem] tracking-[0.08em] text-muted tabular-nums">
          {player.squad.length}/{SQUAD_SIZE_DISPLAY} squad ·{" "}
          {formatCrores(player.walletCr)}
        </p>
      </div>
    </div>
  );
}

interface SquadPanelProps {
  title: string;
  side: "you" | "rival";
  entries: SquadEntry[];
  className?: string;
  /** Extra line under each owned slot. */
  renderEntry?: (entry: SquadEntry) => React.ReactNode;
}

export function SquadPanel({
  title,
  side,
  entries,
  className,
  renderEntry,
}: SquadPanelProps) {
  return (
    <section aria-label={title} className={cn("flex flex-col gap-2", className)}>
      <header className="flex items-center justify-between px-1">
        <h2 className="font-display text-[0.625rem] font-semibold tracking-[0.22em] text-subtle uppercase">
          {title}
        </h2>
        <span className="font-display text-[0.625rem] font-semibold tracking-[0.14em] text-muted tabular-nums">
          {entries.length}/{SQUAD_SIZE_DISPLAY}
        </span>
      </header>
      <ul className="flex flex-col gap-1.5">
        {Array.from({ length: SQUAD_SIZE_DISPLAY }).map((_, index) => {
          const entry = entries[index] ?? null;
          const character = entry ? characterById(entry.characterId) : null;
          return (
            <li
              key={index}
              className={cn(
                "flex items-center gap-2.5 rounded-control border px-2.5 py-2",
                entry
                  ? "border-line-gold/50 bg-elevated/80"
                  : "border-dashed border-line/70 bg-transparent",
              )}
            >
              {entry && character ? (
                <>
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-control border font-display text-xs font-bold uppercase",
                      side === "you"
                        ? "border-line-gold bg-gold-soft text-gold-bright"
                        : "border-line-strong bg-surface text-muted",
                    )}
                  >
                    {character.name.charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-display text-[0.8125rem] font-semibold text-foreground">
                    {character.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <GlyphFor character={character.categoryId} />
                    <span className="font-display text-[0.6875rem] font-semibold text-muted tabular-nums">
                      {entry.priceCr}
                    </span>
                  </span>
                  {renderEntry ? renderEntry(entry) : null}
                </>
              ) : (
                <>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-control border border-dashed border-line font-display text-[0.5rem] font-semibold text-subtle tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-xs text-subtle">Empty slot</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function GlyphFor({
  character: categoryId,
}: {
  character: "fictional" | "football" | "cricket";
}) {
  const Glyph = CATEGORY_ICONS[categoryId];
  return <Glyph className="size-3.5 text-subtle" />;
}

export { formatCrores };
