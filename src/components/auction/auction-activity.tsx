"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useDemoMatch } from "@/stores/demo-match";
import { Gavel, Hourglass, Check, X_1 } from "@/components/ui/icons";
import type { AuctionLogEntry } from "@/types";

const kindIcon: Record<AuctionLogEntry["kind"], typeof Gavel | null> = {
  bid: Gavel,
  pass: X_1,
  timeout: Hourglass,
  "lot-open": null,
  sold: Check,
  unsold: X_1,
};

const kindColor: Record<AuctionLogEntry["kind"], string> = {
  bid: "text-gold",
  pass: "text-subtle",
  timeout: "text-gold-bright",
  "lot-open": "text-foreground",
  sold: "text-success",
  unsold: "text-subtle",
};

export function AuctionActivity({ className }: { className?: string }) {
  const match = useDemoMatch((state) => state.match);
  const reduced = useReducedMotion();

  const entries = match ? match.log.slice(-7).reverse() : [];

  return (
    <section aria-label="Auction activity" className={cn("flex min-h-0 flex-col", className)}>
      <header className="flex shrink-0 items-center justify-between px-1 pb-2">
        <h2 className="font-display text-[0.625rem] font-semibold tracking-[0.22em] text-subtle uppercase">
          Auction activity
        </h2>
        <span
          className="size-1.5 rounded-full bg-success shadow-[0_0_8px_rgb(110_207_155_/_0.8)]"
          aria-label="Feed live"
        />
      </header>
      <ul
        className="min-h-0 flex-1 overflow-y-auto pr-1"
        aria-live="polite"
      >
        {entries.length === 0 ? (
          <li className="px-2 py-4 text-center text-xs text-subtle">
            Auction feed opens with the first lot.
          </li>
        ) : null}
        {entries.map((entry) => {
          const Icon = kindIcon[entry.kind];
          return (
            <li key={entry.id} className="border-t border-line/70 first:border-t-0">
              <motion.div
                initial={reduced ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-start gap-2 px-2 py-2"
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-control border border-line bg-white/[0.03]",
                    kindColor[entry.kind],
                  )}
                >
                  {Icon ? <Icon className="size-3" /> : null}
                </span>
                <p className="min-w-0 flex-1 text-[0.6875rem] leading-snug text-muted">
                  <span
                    className={cn(
                      "font-display font-semibold capitalize",
                      kindColor[entry.kind],
                    )}
                  >
                    {entry.kind.split("-").join(" ")}
                  </span>{" "}
                  <span className="text-foreground/90">{entry.message}</span>
                </p>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
