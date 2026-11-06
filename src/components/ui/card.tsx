import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "base" | "elevated" | "outline" | "glass";

const variantStyles: Record<CardVariant, string> = {
  base: "border border-line bg-elevated/90 shadow-card",
  elevated: "border border-line bg-surface shadow-float",
  outline: "border border-line-strong bg-transparent",
  glass:
    "border border-line bg-elevated/60 shadow-card backdrop-blur-xl",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
}

export function Card({
  variant = "base",
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card",
        variantStyles[variant],
        interactive &&
          "transition-[border-color,background-color,transform,box-shadow] duration-400 ease-out-expo hover:-translate-y-1 hover:border-line-gold hover:shadow-glow",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-0", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-display text-display-sm font-semibold text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted", className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-3 border-t border-line px-6 py-4", className)}
      {...props}
    />
  );
}
