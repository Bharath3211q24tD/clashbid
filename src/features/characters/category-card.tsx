import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  ArrowUpRight,
  CricketBall,
  Football,
  Mask,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { EntityCategory, EntityCategoryId } from "@/types";

const categoryIcons: Record<
  EntityCategoryId,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  fictional: Mask,
  football: Football,
  cricket: CricketBall,
};

interface CategoryCardProps {
  category: EntityCategory;
  index: number;
  href?: string;
}

export function CategoryCard({ category, index, href }: CategoryCardProps) {
  const Icon = categoryIcons[category.id];

  const card = (
    <Card
      interactive={Boolean(href)}
      className={cn(
        "flex h-full flex-col p-6 transition-colors duration-400",
        href && "group-hover:bg-surface/90",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-16 size-48 rounded-full bg-gold/[0.05] blur-3xl transition-colors duration-500 group-hover:bg-gold/[0.1]"
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="font-display text-eyebrow text-subtle">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex size-12 items-center justify-center rounded-panel border border-line bg-white/[0.025] text-muted transition-colors duration-300 group-hover:border-line-gold group-hover:text-gold-bright [&_svg]:size-6">
          <Icon />
        </span>
      </div>

      <div className="relative mt-14">
        <p className="font-display text-[0.625rem] font-semibold tracking-[0.22em] text-gold uppercase">
          {category.kicker}
        </p>
        <h3 className="mt-2 font-display text-display-sm font-semibold text-foreground transition-colors group-hover:text-gold-bright">
          {category.label}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {category.description}
        </p>
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-4 border-t border-line pt-5">
        <span className="text-[0.625rem] tracking-[0.18em] text-subtle uppercase">
          Dossier sync pending
        </span>
        {href ? (
          <ArrowUpRight className="size-4 text-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
        ) : (
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-subtle"
          />
        )}
      </div>
    </Card>
  );

  if (!href) {
    return card;
  }

  return (
    <Link href={href} className="group block h-full">
      {card}
    </Link>
  );
}
