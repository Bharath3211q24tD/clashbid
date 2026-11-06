"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/brand";
import { Menu, User } from "@/components/ui/icons";
import { SoundToggle } from "@/components/game/sound-toggle";
import { useAuth } from "@/stores/auth";
import { useScrolled } from "@/hooks/use-scrolled";
import { navItems } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  appShellActions,
  useMobileNavOpen,
} from "@/store/app-shell";
import { MobileNav } from "./mobile-nav";

function ProfileButtonSignal() {
  const user = useAuth((state) => state.user);

  if (user) {
    return (
      <Link
        href="/profile"
        className="flex size-11 items-center justify-center rounded-control border border-line-gold bg-gold-soft font-display text-sm font-bold text-gold-bright uppercase transition-colors hover:bg-gold/20"
        title={`Signed in as ${user.handle}`}
      >
        {user.handle.trim().charAt(0) || "P"}
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      title="Sign in"
      className="flex size-11 items-center justify-center rounded-control border border-line bg-white/[0.03] text-muted transition-colors hover:border-line-gold hover:text-gold-bright"
    >
      <User className="size-5" />
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled(12);
  const mobileNavOpen = useMobileNavOpen();

  useEffect(() => {
    appShellActions.closeMobileNav();
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || mobileNavOpen
            ? "border-line bg-background/85 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-[var(--spacing-header)] items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="CLASHBID home"
            className="shrink-0 transition-opacity hover:opacity-90"
          >
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative inline-flex flex-col py-2 font-display text-[0.6875rem] font-semibold tracking-[0.22em] uppercase transition-colors",
                        active
                          ? "text-gold-bright"
                          : "text-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-gold to-transparent transition-opacity duration-300",
                          active ? "opacity-100" : "opacity-0 group-hover:opacity-60",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <SoundToggle />

            <ProfileButtonSignal />

            <button
              type="button"
              aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-navigation"
              onClick={appShellActions.toggleMobileNav}
              className="flex size-11 items-center justify-center rounded-control border border-line bg-white/[0.03] text-foreground transition-colors hover:border-line-gold hover:text-gold-bright lg:hidden [&_svg]:size-5"
            >
              <Menu />
            </button>
          </div>
        </Container>
      </header>

      <MobileNav open={mobileNavOpen} />
    </>
  );
}
