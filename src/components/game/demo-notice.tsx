"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DemoNotice({
  className,
  compact = false,
  children = "Demo build — matches are simulated locally while the production auction backend is under development.",
}: {
  className?: string;
  compact?: boolean;
  children?: string | React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-control border border-line bg-white/[0.025] px-3 py-1.5",
        className,
      )}
    >
      <Badge tone="gold" dot className="shrink-0">
        Demo
      </Badge>
      {compact ? null : (
        <p className="text-[0.6875rem] leading-snug text-muted">{children}</p>
      )}
    </div>
  );
}

export function DemoPill({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border border-line-gold bg-gold-soft px-2 py-0.5 font-display text-[0.5rem] font-semibold tracking-[0.2em] text-gold-bright uppercase",
        className,
      )}
    >
      Demo sim
    </span>
  );
}

export function BackToLobbyLink({ className }: { className?: string }) {
  return (
    <Link
      href="/lobby"
      className={cn(
        "font-display text-[0.625rem] font-semibold tracking-[0.22em] text-subtle uppercase transition-colors hover:text-gold-bright",
        className,
      )}
    >
      ← Exit to lobby
    </Link>
  );
}
