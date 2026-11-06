"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CharacterCard } from "@/components/game/character-card";
import { CharacterDetailModal } from "@/components/game/character-detail-modal";
import { CATEGORY_ICONS } from "@/components/game/category-icons";
import { demoCharacters } from "@/lib/demo/characters";
import { DemoPill } from "@/components/game/demo-notice";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, Close } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { EntityCategoryId, GameCharacter } from "@/types";

type Filter = "all" | EntityCategoryId;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All lots" },
  { id: "fictional", label: "Fictional & Marvel" },
  { id: "football", label: "Football" },
  { id: "cricket", label: "Cricket" },
];

export function CharacterDatabase() {
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<GameCharacter | null>(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return demoCharacters.filter((character) => {
      const matchesFilter =
        filter === "all" || character.categoryId === filter;
      const matchesQuery =
        normalized.length === 0 ||
        character.name.toLowerCase().includes(normalized) ||
        character.aura.toLowerCase().includes(normalized) ||
        character.role.toLowerCase().includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-gutter pb-16 pt-8">
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_80%_at_100%_0%,rgb(240_185_74_/_0.09),transparent_65%)]"
        />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.25rem)] leading-[0.95] font-bold uppercase">
              Every legend has{" "}
              <span className="text-gradient-gold">a price.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              The shared auction pool — {demoCharacters.length} lots across
              three universes. Each entity carries game-balanced attributes;
              real-world sporting context arrives with the production dataset.
            </p>
          </div>
          <DemoPill />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-elevated/60 p-3">
        <ul className="flex flex-wrap gap-1.5" aria-label="Category filters">
          {FILTERS.map((option) => {
            const active = filter === option.id;
            const Glyph = option.id === "all" ? null : CATEGORY_ICONS[option.id];
            return (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => setFilter(option.id)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 font-display text-[0.625rem] font-semibold tracking-[0.16em] uppercase transition-colors",
                    active
                      ? "border-line-gold bg-gold-soft text-gold-bright"
                      : "border-line text-muted hover:border-line-strong hover:text-foreground",
                  )}
                >
                  {Glyph ? <Glyph className="size-3.5" /> : null}
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, aura, role…"
            aria-label="Search characters"
            className="h-10 w-full rounded-control border border-line bg-background-deep/70 pl-9 pr-8 text-sm text-foreground outline-none transition-[border-color] placeholder:text-subtle/70 focus:border-line-gold"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-control text-subtle hover:text-foreground"
            >
              <Close className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Pool grid */}
      <p
        className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-subtle uppercase tabular-nums"
        aria-live="polite"
      >
        {results.length} of {demoCharacters.length} lots
      </p>

      {results.length === 0 ? (
        <div className="rounded-card border border-dashed border-line/70">
          <EmptyState
            title="No lots match"
            description="Try a different search term or clear the active filter."
            className="py-12"
          />
        </div>
      ) : (
        <motion.div
          layout={reduced ? false : "position"}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {results.map((character, index) => (
            <CharacterCard
              key={character.id}
              character={character}
              index={index}
              href={`/characters?id=${character.id}`}
              onOpen={(candidate) => {
                setSelected(candidate);
              }}
            />
          ))}
        </motion.div>
      )}

      <CharacterDetailModal
        character={selected}
        onClose={() => {
          setSelected(null);
        }}
      />
    </section>
  );
}
