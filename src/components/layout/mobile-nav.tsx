"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Close } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/brand";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { gameRules, navItems } from "@/lib/site";
import { cn, formatCrores } from "@/lib/utils";
import { appShellActions } from "@/store/app-shell";

interface MobileNavProps {
  open: boolean;
}

export function MobileNav({ open }: MobileNavProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll(open);
  useEscapeKey(open, appShellActions.closeMobileNav);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      previouslyFocused?.focus();
    };
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (!focusable || focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) {
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      id="mobile-navigation"
      aria-hidden={!open}
      inert={!open}
      onKeyDown={handleKeyDown}
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <button
        type="button"
        aria-label="Close navigation"
        tabIndex={-1}
        onClick={appShellActions.closeMobileNav}
        className={cn(
          "absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          "grain absolute inset-y-0 right-0 flex w-full max-w-[24rem] flex-col overflow-y-auto border-l border-line bg-elevated/95 shadow-float backdrop-blur-2xl transition-transform duration-500 ease-out-expo",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgb(240_185_74_/_0.12),transparent_70%)]"
        />

        <div className="relative flex items-center justify-between border-b border-line px-6 py-5">
          <Link href="/" onClick={appShellActions.closeMobileNav} aria-label="CLASHBID home">
            <Logo />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={appShellActions.closeMobileNav}
            aria-label="Close menu"
            className="flex size-11 items-center justify-center rounded-control border border-line bg-white/[0.03] text-muted transition-colors hover:border-line-gold hover:text-gold-bright [&_svg]:size-5"
          >
            <Close />
          </button>
        </div>

        <nav aria-label="Mobile primary" className="relative flex-1 px-6 py-4">
          <ul>
            {navItems.map((item, index) => {
              const active = pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={appShellActions.closeMobileNav}
                    className={cn(
                      "group flex items-center justify-between border-b border-line py-5 transition-colors",
                      active ? "text-gold-bright" : "text-foreground hover:text-gold",
                    )}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-display text-[0.5625rem] font-semibold tracking-[0.26em] text-subtle">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-2xl font-semibold tracking-[0.06em] uppercase">
                        {item.label}
                      </span>
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                        active ? "text-gold" : "text-subtle",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative mt-auto border-t border-line px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <Badge tone="gold" dot>
              Phase 0
            </Badge>
            <span className="text-[0.625rem] tracking-[0.16em] text-subtle uppercase">
              Foundation build
            </span>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            {formatCrores(gameRules.budgetCrores)} war chest.{" "}
            {gameRules.poolSize} lots. {gameRules.rosterSize} roster slots. One
            arena.
          </p>
          <ButtonLink
            href="/lobby"
            onClick={appShellActions.closeMobileNav}
            className="mt-5 w-full"
          >
            Enter the lobby
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
