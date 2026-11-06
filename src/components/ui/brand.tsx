import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function BrandMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("size-9", className)}
      {...props}
    >
      <defs>
        <linearGradient
          id="clashbid-gold"
          x1="10"
          y1="4"
          x2="38"
          y2="45"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFE9B0" />
          <stop offset="0.45" stopColor="#F0B94A" />
          <stop offset="1" stopColor="#A77A2A" />
        </linearGradient>
      </defs>
      <path
        d="M24 2.5 45.5 14.8v18.4L24 45.5 2.5 33.2V14.8L24 2.5Z"
        stroke="url(#clashbid-gold)"
        strokeWidth="1.5"
        opacity="0.55"
      />
      <path
        d="M14.6 10.5 37.5 33.4 33.4 37.5 10.5 14.6 14.6 10.5Z"
        fill="url(#clashbid-gold)"
      />
      <path
        d="M33.4 10.5 10.5 33.4 14.6 37.5 37.5 14.6 33.4 10.5Z"
        fill="url(#clashbid-gold)"
        opacity="0.55"
      />
      <path
        d="m24 18.2 5.8 5.8L24 29.8 18.2 24 24 18.2Z"
        fill="#08090D"
        stroke="#FFD778"
        strokeWidth="1.2"
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  markClassName?: string;
  showTagline?: boolean;
}

export function Logo({
  className,
  markClassName,
  showTagline = false,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <BrandMark className={markClassName} />
      <span className="flex flex-col">
        <span className="font-display text-[1.35rem] leading-none font-bold tracking-[0.16em] uppercase">
          Clash<span className="text-gold">bid</span>
        </span>
        {showTagline ? (
          <span className="mt-1.5 text-[0.5rem] leading-none font-semibold tracking-[0.3em] text-muted uppercase">
            Cross-universe auction
          </span>
        ) : null}
      </span>
    </span>
  );
}
