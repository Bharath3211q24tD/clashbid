"use client";

import { cn, formatCrores } from "@/lib/utils";
import { Wallet } from "@/components/ui/icons";

interface WalletDisplayProps {
  walletCr: number;
  label?: string;
  compact?: boolean;
  flash?: "spend" | "gain" | null;
  className?: string;
}

export function WalletDisplay({
  walletCr,
  label = "Wallet",
  compact = false,
  flash = null,
  className,
}: WalletDisplayProps) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 overflow-hidden rounded-control border border-line bg-elevated/70 px-3 py-2",
        flash === "spend" && "border-danger/40",
        flash === "gain" && "border-success/40",
        className,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-control border border-line-gold bg-gold-soft [&_svg]:size-4">
        <Wallet className="text-gold" />
      </div>
      <div className="min-w-0">
        <p className="font-display text-[0.5625rem] font-semibold tracking-[0.2em] text-subtle uppercase">
          {label}
        </p>
        <p
          className={cn(
            "font-display font-semibold tracking-[0.02em] tabular-nums",
            compact ? "text-base" : "text-xl",
            walletCr < 15 ? "text-gold-bright" : "text-foreground",
          )}
        >
          {formatCrores(walletCr)}
        </p>
      </div>
      {flash ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 animate-fade-out",
            flash === "spend"
              ? "bg-danger/15"
              : "bg-success/15",
          )}
        />
      ) : null}
    </div>
  );
}
