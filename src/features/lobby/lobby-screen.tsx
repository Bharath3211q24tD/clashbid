"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { challengeCatalog } from "@/lib/demo/challenges";
import { ATTRIBUTE_SHORT } from "@/lib/demo/attributes";
import { DemoNotice, DemoPill } from "@/components/game/demo-notice";
import { Swords, Gavel, Trophy, Wallet, Bolt } from "@/components/ui/icons";
import { useAuth } from "@/stores/auth";
import { useSound } from "@/stores/sound";
import { careerTotals, useDemoCareer } from "@/stores/demo-career";
import { useDemoMatch } from "@/stores/demo-match";
import type { AttributeId } from "@/types";
import { gameRules } from "@/lib/site";
import { cn } from "@/lib/utils";

export function LobbyScreen() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const career = useDemoCareer((state) => state);
  const match = useDemoMatch((state) => state.match);
  const playSound = useSound((state) => state.play);

  const totals = careerTotals(career.results);
  const featured = featuredChallenge(career.results.length);

  const play = () => {
    playSound("ui-confirm");
    router.push("/matchmaking");
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-gutter pb-20 pt-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-panel border border-line-strong bg-elevated/70 px-6 py-8 sm:px-10 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_85%_20%,rgb(240_185_74_/_0.1),transparent_65%)]"
        />
        {match && (match.phase === "AUCTION_ACTIVE" || match.phase === "CHALLENGE_SELECTION") ? (
          <ResumeStrip match={match} />
        ) : null}

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-lg">
            <p className="flex items-center gap-2 font-display text-[0.6875rem] font-semibold tracking-[0.3em] text-gold uppercase">
              <Bolt className="size-4" />
              Welcome back, {user?.handle ?? "Operator"}
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.95] font-bold uppercase">
              The auction floor
              <br />
              <span className="text-gradient-gold">is waiting.</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              Queue for 1v1, draft a five-slot squad from the shared pool, and
              out-bid the rival before the war chest runs dry.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={play}>
                <Swords className="size-4" />
                Play 1v1
              </Button>
              <ButtonLink href="/how-to-play" variant="secondary" size="lg">
                How to play
              </ButtonLink>
            </div>
            <div className="mt-5">
              <DemoNotice>Matchmaking simulates a local rival until the realtime backend lands.</DemoNotice>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-4 lg:w-[26rem]">
            <LobbyStat label="Rating" value={String(career.rating)} />
            <LobbyStat label="Matches" value={String(totals.played)} />
            <LobbyStat label="Wins" value={String(totals.wins)} accent />
            <LobbyStat label="Losses" value={String(totals.losses)} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        {/* Featured challenge */}
        <Card className="relative p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-gold uppercase">
              Featured challenge pool
            </p>
            <DemoPill />
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-[0.06em] text-foreground uppercase">
            {featured.name}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            {featured.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {featureChips(featured.weights)}
          </div>
        </Card>

        {/* Recent matches / career */}
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-gold uppercase">
              Recent matches
            </p>
            <span className="text-[0.625rem] tracking-[0.16em] text-subtle uppercase">
              {totals.played > 0 ? `${totals.wins}W ${totals.losses}L ${totals.draws}D` : "No matches yet"}
            </span>
          </div>
          {career.results.length === 0 ? (
            <div className="mt-2">
              <EmptyState
                icon={<Gavel className="size-6" />}
                title="No matches played"
                description="Run your first demo auction to populate match history on this device."
                className="px-0 py-8"
              />
            </div>
          ) : (
            <ul className="mt-3 flex flex-col divide-y divide-line">
              {career.results.slice(0, 4).map((result) => (
                <li
                  key={result.matchId}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-control border font-display text-xs font-bold",
                        result.outcome === "W"
                          ? "border-success/40 bg-success/10 text-success"
                          : result.outcome === "L"
                            ? "border-danger/40 bg-danger/10 text-danger"
                            : "border-line bg-white/[0.03] text-muted",
                      )}
                    >
                      {result.outcome}
                    </span>
                    <span className="font-mono text-[0.625rem] text-subtle">
                      {result.matchId}
                    </span>
                  </span>
                  <span className="font-display text-xs font-semibold text-muted tabular-nums">
                    {result.scoreYou} – {result.scoreRival} · Δ {formatDelta(result.ratingDelta)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickCard
          href="/characters"
          icon={<Wallet className="size-5" />}
          title="Character database"
          description={`${gameRules.poolSize} demo lots across three universes, with base prices and game-balanced attributes.`}
          cta="Scout the pool"
        />
        <QuickCard
          href="/leaderboard"
          icon={<Trophy className="size-5" />}
          title="Leaderboard"
          description="Ranked standings arrive with player accounts. Podium preview is live."
          cta="View standings"
        />
        <QuickCard
          href="/how-to-play"
          icon={<Gavel className="size-5" />}
          title="Arena protocol"
          description="Bidding increments, the 15-second clock, and how battle scoring reads your roster."
          cta="Read the rules"
        />
      </div>
    </section>
  );
}

function ResumeStrip({ match }: { match: NonNullable<ReturnType<typeof useDemoMatch.getState>["match"]> }) {
  const href =
    match.phase === "CHALLENGE_SELECTION"
      ? `/match/${match.matchId}/challenge`
      : match.phase === "AUCTION_ACTIVE"
        ? `/match/${match.matchId}/auction`
        : `/match/${match.matchId}/battle`;
  return (
    <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-line-gold bg-gold-soft px-4 py-3">
      <p className="text-xs text-muted">
        <span className="font-display font-semibold tracking-[0.14em] text-gold-bright uppercase">
          Match in progress
        </span>{" "}
        <span className="font-mono text-[0.625rem]">{match.matchId}</span>
      </p>
      <ButtonLink href={href} size="sm" variant="outline">
        Rejoin match
      </ButtonLink>
    </div>
  );
}

function LobbyStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-background/85 px-4 py-4">
      <p className="font-display text-[0.5625rem] font-semibold tracking-[0.2em] text-subtle uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 font-display text-xl font-semibold tabular-nums",
          accent ? "text-success" : "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function featureChips(weights: Record<string, number>) {
  return Object.entries(weights).map(([key, weight]) => (
    <Badge key={key} tone="muted" className="tabular-nums">
      {ATTRIBUTE_SHORT[key as AttributeId] ?? key} {weight}%
    </Badge>
  ));
}

function QuickCard({
  href,
  icon,
  title,
  description,
  cta,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={href}
        className="group flex h-full flex-col rounded-card border border-line bg-elevated/70 p-5 transition-[border-color,transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-line-gold"
      >
        <span className="flex size-10 items-center justify-center rounded-control border border-line-gold bg-gold-soft text-gold">
          {icon}
        </span>
        <h3 className="mt-4 font-display text-base font-semibold tracking-[0.08em] text-foreground uppercase group-hover:text-gold-bright">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">
          {description}
        </p>
        <span className="mt-4 font-display text-[0.625rem] font-semibold tracking-[0.22em] text-gold uppercase">
          {cta} →
        </span>
      </Link>
    </motion.div>
  );
}

function featuredChallenge(seed: number) {
  return challengeCatalog[seed % challengeCatalog.length]!;
}

function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : String(delta);
}
