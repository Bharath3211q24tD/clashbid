import type { ComponentProps, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const baseStyles =
  "relative inline-flex shrink-0 items-center justify-center gap-2 rounded-control font-display font-semibold uppercase tracking-[0.14em] transition-[background-color,border-color,color,box-shadow,transform,filter] duration-300 ease-out-expo focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border border-gold-bright/70 bg-gradient-to-b from-gold-bright to-gold text-background shadow-glow hover:-translate-y-0.5 hover:brightness-105 hover:shadow-glow-strong active:translate-y-0",
  secondary:
    "border border-line-strong bg-elevated/80 text-foreground backdrop-blur-sm hover:border-line-gold hover:bg-surface",
  outline:
    "border border-line-gold bg-gold-soft text-gold-bright hover:bg-gold/20 hover:text-gold-bright",
  ghost: "border border-transparent text-muted hover:bg-white/5 hover:text-foreground",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[0.625rem]",
  md: "h-11 px-5 text-[0.6875rem]",
  lg: "h-13 px-7 text-xs",
  icon: "size-11 p-0",
};

interface StyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: StyleOptions = {}): string {
  return cn(baseStyles, variantStyles[variant], sizeStyles[size], className);
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    StyleOptions {}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}

type LinkProps = ComponentProps<typeof Link>;

export interface ButtonLinkProps
  extends Omit<LinkProps, "className">,
    StyleOptions {
  className?: string;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonStyles({ variant, size, className })} {...props} />
  );
}
