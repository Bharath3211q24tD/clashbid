import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "gold" | "neutral" | "success" | "muted";

const toneStyles: Record<BadgeTone, string> = {
  gold: "border-line-gold bg-gold-soft text-gold-bright",
  neutral: "border-line-strong bg-white/[0.03] text-foreground",
  success: "border-success/30 bg-success/10 text-success",
  muted: "border-line bg-transparent text-muted",
};

const dotStyles: Record<BadgeTone, string> = {
  gold: "bg-gold",
  neutral: "bg-foreground",
  success: "bg-success",
  muted: "bg-subtle",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
}

export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border px-2.5 py-1 font-display text-[0.625rem] font-semibold tracking-[0.18em] uppercase",
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full", dotStyles[tone])}
        />
      ) : null}
      {children}
    </span>
  );
}
