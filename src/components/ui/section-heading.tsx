import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  rule?: boolean;
}

export function Eyebrow({ children, className, rule = true }: EyebrowProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-display text-eyebrow text-gold uppercase",
        className,
      )}
    >
      {rule ? (
        <span aria-hidden="true" className="h-px w-7 bg-gold/60" />
      ) : null}
      {children}
    </p>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        centered && "md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "flex flex-col items-center text-center")}>
        {eyebrow ? (
          <Eyebrow
            className={cn(centered && "justify-center")}
          >
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h2 className="mt-4 text-display-lg text-foreground">{title}</h2>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
