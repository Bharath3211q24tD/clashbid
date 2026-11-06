"use client";

import { cn } from "@/lib/utils";
import { ATTRIBUTE_LABELS, SUPPORTED_ATTRIBUTE_IDS } from "@/lib/demo/attributes";
import type { CharacterAttributes } from "@/types";
import type { ReactNode } from "react";

interface AttributeBarsProps {
  attributes: CharacterAttributes;
  compact?: boolean;
  className?: string;
}

export function AttributeBars({
  attributes,
  compact = false,
  className,
}: AttributeBarsProps) {
  return (
    <dl
      className={cn("flex flex-col gap-2.5", className)}
      aria-label="Game-balanced attributes"
    >
      {SUPPORTED_ATTRIBUTE_IDS.map((key) => (
        <div key={key} className="flex items-center gap-3">
          <dt
            className={cn(
              "font-display font-semibold tracking-[0.14em] text-subtle uppercase",
              compact ? "w-16 text-[0.5625rem]" : "w-24 text-[0.625rem]",
            )}
          >
            {ATTRIBUTE_LABELS[key]}
          </dt>
          <div
            className={cn(
              "relative flex-1 overflow-hidden rounded-pill bg-white/[0.06]",
              compact ? "h-1" : "h-1.5",
            )}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-pill bg-gradient-to-r from-gold-deep to-gold transition-[width] duration-700 ease-out-expo"
              style={{ width: `${attributes[key]}%` }}
            />
          </div>
          <dd
            className={cn(
              "font-display font-semibold text-foreground tabular-nums",
              compact ? "w-7 text-right text-xs" : "w-9 text-right text-sm",
            )}
          >
            {attributes[key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}

interface ComparisonBarProps {
  label: string;
  weight: number;
  you: number;
  rival: number;
  className?: string;
}

export function ComparisonBar({
  label,
  weight,
  you,
  rival,
  className,
}: ComparisonBarProps) {
  const youWins = you >= rival;
  return (
    <div className={cn("grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-3", className)}>      <span
        className={cn(
          "text-right font-display text-sm font-semibold tabular-nums",
          youWins ? "text-gold-bright" : "text-muted",
        )}
      >
        {you}
      </span>
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-[0.625rem] font-semibold tracking-[0.18em] text-foreground uppercase">
            {label}
          </p>
          <span className="font-display text-[0.5625rem] font-semibold tracking-[0.14em] text-subtle uppercase tabular-nums">
            wt {weight}%
          </span>
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          <div className="flex h-1.5 justify-end overflow-hidden rounded-pill bg-white/[0.06]">
            <div
              className={cn(
                "h-full" + " origin-right rounded-pill transition-[width] duration-700 ease-out-expo",
                youWins ? "bg-gradient-to-l from-gold to-gold-bright" : "bg-white/25",
              )}
              style={{ width: `${you}%` }}
            />
          </div>
          <div
            className={cn(
              "h-1.5 overflow-hidden rounded-pill bg-white/[0.06] transition-none",
            )}
          >
            <div
              className={cn(
                "h-full rounded-pill transition-[width] duration-700 ease-out-expo",
                youWins ? "bg-white/25" : "bg-danger/80",
              )}
              style={{ width: `${rival}%` }}
            />
          </div>
        </div>
      </div>
      <span
        className={cn(
          "font-display text-sm font-semibold tabular-nums",
          youWins ? "text-muted" : "text-danger",
        )}
      >
        {rival}
      </span>
    </div>
  );
}

export function WeightChips({
  weights,
  children,
}: {
  weights: Record<string, number>;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {SUPPORTED_ATTRIBUTE_IDS.map((key) => (
        <span
          key={key}
          className="rounded-control border border-line bg-white/[0.03] px-2 py-1 font-display text-[0.5625rem] font-semibold tracking-[0.14em] text-subtle uppercase tabular-nums"
        >
          {ATTRIBUTE_LABELS[key]} <span className="text-gold">{weights[key] }%</span>
        </span>
      ))}
      {children}
    </div>
  );
}
