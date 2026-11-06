import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ContainerSize = "narrow" | "default" | "wide";

const sizeStyles: Record<ContainerSize, string> = {
  narrow: "max-w-4xl",
  default: "max-w-7xl",
  wide: "max-w-[90rem]",
};

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

export function Container({
  size = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-gutter", sizeStyles[size], className)}
      {...props}
    />
  );
}
