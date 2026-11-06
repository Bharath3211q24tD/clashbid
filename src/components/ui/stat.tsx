import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}

export function Stat({ label, value, hint, icon, className }: StatProps) {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      {icon ? (
        <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-control border border-line bg-white/[0.025] text-gold [&_svg]:size-5">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0">
        <p className="font-display text-[0.625rem] font-semibold tracking-[0.2em] text-subtle uppercase">
          {label}
        </p>
        <p className="mt-1 font-display text-2xl leading-none font-semibold text-foreground">
          {value}
        </p>
        {hint ? <p className="mt-2 text-xs text-muted">{hint}</p> : null}
      </div>
    </div>
  );
}
