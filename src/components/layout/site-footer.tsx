import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/brand";
import { Container } from "@/components/ui/container";
import { ArrowUpRight } from "@/components/ui/icons";
import { categories, gameRules, navItems, siteConfig } from "@/lib/site";
import { formatCrores } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-background-deep/60">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgb(240_185_74_/_0.08),transparent_70%)]"
      />

      <Container className="relative py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="CLASHBID home" className="inline-flex">
              <Logo showTagline markClassName="size-11" />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge tone="gold">Demo build</Badge>
              <Badge tone="muted">Foundation build</Badge>
            </div>
          </div>

          <FooterColumn title="Arena">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold-bright"
                >
                  {item.label}
                  <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Universes">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href="/characters"
                  className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold-bright"
                >
                  {category.label}
                  <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-subtle">
            © {new Date().getFullYear()} {siteConfig.name}. A virtual arena
            experience.
          </p>
          <p className="text-[0.625rem] tracking-[0.18em] text-subtle uppercase">
            {formatCrores(gameRules.budgetCrores)} war chest · {gameRules.poolSize}{" "}
            lots · {gameRules.rosterSize} roster slots
          </p>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="pointer-events-none relative -mb-6 overflow-hidden sm:-mb-10"
      >
        <p className="translate-y-[18%] text-center font-display text-[18vw] leading-none font-bold tracking-[0.08em] text-white/[0.025] uppercase select-none">
          Clashbid
        </p>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  children: ReactNode;
}

function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div>
      <h2 className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-subtle uppercase">
        {title}
      </h2>
      <ul className="mt-5 flex flex-col gap-3">{children}</ul>
    </div>
  );
}
