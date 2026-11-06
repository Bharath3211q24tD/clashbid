"use client";

import { Trophy } from "@/components/ui/icons";
import { careerTotals, useDemoCareer } from "@/stores/demo-career";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PODIUM_META = [
  { place: 2, label: "Second", height: "h-40", tone: "silver" },
  { place: 1, label: "Champion", height: "h-52", tone: "gold" },
  { place: 3, label: "Third", height: "h-32", tone: "bronze" },
] as const;

const toneStyles: Record<string, string> = {
  gold: "border-line-gold bg-gold-soft text-gold-bright",
  silver: "border-white/25 bg-white/[0.05] text-muted",
  bronze: "border-[#c98b5f]/40 bg-[#c98b5f]/10 text-[#e6a97e]",
};

export function LeaderboardBoard() {
  const career = useDemoCareer((state) => state);
  const totals = careerTotals(career.results);

  return (
    <div className="flex flex-col gap-6">
      {/* Podium — locked until ranked players exist */}
      <div
        className="grid grid-cols-3 items-end gap-3 rounded-panel border border-line bg-elevated/60 p-4 sm:p-6"
        aria-label="Season podium"
      >
        {PODIUM_META.map((slot) => (
          <div key={slot.place} className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "flex w-full flex-col items-center justify-between rounded-t-card border border-b-0 px-3 pt-4 pb-8",
                toneStyles[slot.tone],
                slot.height,
              )}
            >
              <Trophy className="size-5 opacity-70" />
              <div className="text-center">
                <p className="font-display text-2xl font-bold tabular-nums">
                  {slot.place}
                </p>
                <p className="mt-1 font-display text-[0.5625rem] font-semibold tracking-[0.22em] uppercase opacity-70">
                  Awaiting
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Season standings list */}
      <div className="rounded-panel border border-line bg-elevated/60">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <p className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-muted uppercase">
            Season standings
          </p>
          <div
            className="flex gap-1.5"
            role="tablist"
            aria-label="Leaderboard scope"
          >
            {["Global", "Country", "Weekly"].map((scope, i) => (
              <span
                key={scope}
                role="tab"
                aria-selected={i === 0}
                className={cn(
                  "rounded-pill border px-3 py-1 font-display text-[0.625rem] font-semibold tracking-[0.18em] uppercase",
                  i === 0
                    ? "border-line-gold bg-gold-soft text-gold-bright"
                    : "border-line text-subtle",
                )}
              >
                {scope}
              </span>
            ))}
          </div>
        </div>

        <EmptyState
          icon={<Trophy className="size-6" />}
          title="Standings open with ranked players"
          description="The board populates from real rated matches once player accounts go live. Demo matches never post to rankings."
          className="py-12"
        >
          <ButtonLink href="/matchmaking" variant="outline" size="sm">
            Warm up in the demo arena
          </ButtonLink>
        </EmptyState>
      </div>

      {/* Your demo standing (local device only) */}
      <div className="rounded-card border border-line bg-elevated/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-gold uppercase">
              Your demo rating
            </p>
            <p className="mt-1.5 font-display text-3xl font-bold text-foreground tabular-nums">
              {career.rating}
            </p>
            <p className="mt-1 text-xs text-muted tabular-nums">
              {totals.played} demo match{totals.played === 1 ? "" : "es"} ·{" "}
              {totals.wins}W {totals.losses}L {totals.draws}D
            </p>
          </div>
          <p className="max-w-xs text-[0.6875rem] leading-relaxed text-subtle">
            Ratings are computed locally from the demo engine scoring and never
            leave this browser. Ranked ratings activate with accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
