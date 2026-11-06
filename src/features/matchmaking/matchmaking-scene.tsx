"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { BrandMark } from "@/components/ui/brand";
import { DemoPill } from "@/components/game/demo-notice";
import { useDemoMatch } from "@/stores/demo-match";
import { useSound } from "@/stores/sound";
import { cn } from "@/lib/utils";

type Scene = "finding" | "found" | "preparing" | "starting";

export function MatchmakingScene() {
  const router = useRouter();
  const createMatch = useDemoMatch((state) => state.createMatch);
  const playSound = useSound((state) => state.play);
  const reduced = useReducedMotion();
  const [scene, setScene] = useState<Scene>("finding");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t: typeof timers.current = [];
    t.push(
      setTimeout(() => {
        setScene("found");
        playSound("turn-start");
      }, 2400),
    );
    t.push(
      setTimeout(() => {
        setScene("preparing");
        playSound("lot-open");
      }, 4300),
    );
    t.push(
      setTimeout(() => {
        setScene("starting");
        playSound("ui-confirm");
      }, 5400),
    );
    t.push(
      setTimeout(() => {
        const matchId = createMatch();
        router.push(`/match/${matchId}/challenge`);
      }, 6500),
    );
    timers.current = t;

    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, [createMatch, router, playSound]);

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-var(--spacing-header))] w-full max-w-4xl flex-col items-center justify-center gap-10 px-gutter pb-16 pt-10">
      <div className="flex items-center gap-3">
        <DemoPill />
        <span className="font-display text-[0.625rem] font-semibold tracking-[0.26em] text-subtle uppercase">
          Matchmaking queue · 1v1
        </span>
      </div>

      <div className="relative grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
        <PlayerCard side="you" handle="You" sub="Awaiting opponent" />

        <motion.div
          initial={reduced ? false : { scale: 0.4, opacity: 0 }}
          animate={
            scene === "finding"
              ? { scale: 1, opacity: 1 }
              : scene === "found"
                ? { scale: 1.12, opacity: 1 }
                : { scale: 1, opacity: 1 }
          }
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="relative z-10"
        >
          <span
            className={cn(
              "font-display text-5xl leading-none font-bold tracking-[0.08em] sm:text-6xl",
              "text-gradient-gold",
            )}
          >
            VS
          </span>
        </motion.div>

        <PlayerCard side="rival" handle="Sim Rival" sub="Demo operator" reveal={scene === "finding" ? false : true} />
      </div>

      <div className="flex min-h-10 flex-col items-center gap-3">
        {scene === "finding" ? (
          <StatusLine pulse>Scanning the open queue…</StatusLine>
        ) : null}
        {scene === "found" ? (
          <StatusLine tone="gold">Opponent locked in.</StatusLine>
        ) : null}
        {scene === "preparing" ? (
          <StatusLine tone="gold">Preparing the arena floor…</StatusLine>
        ) : null}
        {scene === "starting" ? (
          <StatusLine tone="gold">Both players ready — match starting.</StatusLine>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/lobby" variant="secondary">
          Cancel matchmaking
        </ButtonLink>
      </div>

      <p className="max-w-md text-center text-xs leading-relaxed text-muted">
        Demo matchmaking pairs you with a scripted local rival to showcase the
        auction arena. Live matchmaking arrives with player accounts and the
        realtime backend.
      </p>
    </section>
  );
}

function StatusLine({
  children,
  tone = "muted",
  pulse = false,
}: {
  children: React.ReactNode;
  tone?: "muted" | "gold";
  pulse?: boolean;
}) {
  return (
    <p
      className={cn(
        "animate-fade-in font-display text-sm font-semibold tracking-[0.2em] uppercase",
        tone === "gold" ? "text-gold-bright" : "text-muted",
        pulse && "motion-safe:animate-pulse",
      )}
    >
      {children}
    </p>
  );
}

function PlayerCard({
  side,
  handle,
  sub,
  reveal = true,
}: {
  side: "you" | "rival";
  handle: string;
  sub: string;
  reveal?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: side === "you" ? -48 : 48 }}
      animate={{ opacity: reveal ? 1 : 0.35, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col items-center gap-3 rounded-card border p-4 text-center sm:p-6",
        reveal
          ? "border-line-gold bg-elevated shadow-card"
          : "border-line bg-elevated/40",
      )}
    >
      <div
        className={cn(
          "flex size-14 items-center justify-center rounded-full border font-display text-lg font-bold uppercase",
          reveal
            ? "border-line-gold bg-gold-soft text-gold-bright shadow-glow"
            : "border-line bg-surface text-subtle",
        )}
      >
        {handle.charAt(0)}
      </div>
      <div>
        <p className="font-display text-sm font-bold tracking-[0.14em] text-foreground uppercase">
          {handle}
        </p>
        <p className="mt-1 text-[0.5625rem] font-medium tracking-[0.18em] text-subtle uppercase">
          {sub}
        </p>
      </div>
      <BrandMark className="size-6 opacity-70" />
    </motion.div>
  );
}

