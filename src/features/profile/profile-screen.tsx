"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { DemoPill } from "@/components/game/demo-notice";
import { Swords, User, Trophy, Flame, Gavel, Shield } from "@/components/ui/icons";
import { useAuth } from "@/stores/auth";
import { careerTotals, useDemoCareer } from "@/stores/demo-career";
import { useSound } from "@/stores/sound";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ACHIEVEMENTS = [
  { icon: Gavel, name: "First hammer", body: "Win your first auction battle." },
  { icon: Flame, name: "Three in a row", body: "Win three demo matches consecutively." },
  { icon: Shield, name: "Balanced buyer", body: "Take a match with all five slots filled and a synergy bonus above 4." },
  { icon: Trophy, name: "Grand final", body: "Climb past 1250 rating on the local ladder." },
] as const;

export function ProfileScreen() {
  const user = useAuth((state) => state.user);
  const signOut = useAuth((state) => state.signOut);
  const career = useDemoCareer((state) => state);
  const reset = useDemoCareer((state) => state.reset);
  const router = useRouter();
  const playSound = useSound((state) => state.play);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const totals = careerTotals(career.results);
  const handle = user?.handle ?? "Operator";

  const winRate = totals.played > 0 ? Math.round((totals.wins / totals.played) * 100) : 0;
  const streak = computeStreak(career.results);

  return (
    <Container className="flex flex-col gap-6 pb-20 pt-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-panel border border-line-strong bg-elevated/70 px-6 py-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_100%_0%,rgb(240_185_74_/_0.1),transparent_65%)]"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <span className="flex size-16 items-center justify-center rounded-card border border-line-gold bg-gold-soft font-display text-2xl font-bold text-gold-bright uppercase">
              {handle.trim().charAt(0) || "P"}
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-[0.06em] text-foreground uppercase">
                {handle}
              </h1>
              <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                {user ? (
                  user.email ? (
                    <span className="font-mono text-[0.625rem]">{user.email}</span>
                  ) : (
                    "Signed in on this device"
                  )
                ) : (
                  <>
                    Demo session —{" "}
                    <Link
                      href="/login"
                      className="text-gold-bright underline-offset-4 hover:underline"
                    >
                      sign in
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DemoPill />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                playSound("ui-confirm");
                signOut();
                router.push("/lobby");
              }}
            >
              Sign out
            </Button>
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-4">
          <CareerStat label="Rating" value={String(career.rating)} />
          <CareerStat label="Win rate" value={`${winRate}%`} accent />
          <CareerStat label="Matches" value={String(totals.played)} />
          <CareerStat
            label="Streak"
            value={streak > 0 ? (streakLastWin(career.results) ? `W${streak}` : `L${streak}`) : "—"}
            accent={streak > 0 && streakLastWin(career.results)}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Match history */}
        <section className="rounded-panel border border-line bg-elevated/60 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-gold uppercase">
              Match history
            </h2>
            {totalingReset(confirmingReset, reset, setConfirmingReset)}
          </div>
          {career.results.length === 0 ? (
            <EmptyState
              icon={<Swords className="size-6" />}
              title="No matches yet"
              description="Your demo matches will appear here with scores and rating movement."
              className="py-10"
            >
              <ButtonLink href="/matchmaking" size="sm">
                Play your first match
              </ButtonLink>
            </EmptyState>
          ) : (
            <ul className="mt-3 flex flex-col divide-y divide-line">
              {career.results.map((result) => (
                <li key={result.matchId} className="flex items-center justify-between gap-3 py-3">
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-control border font-display text-xs font-bold",
                        result.outcome === "W"
                          ? "border-success/40 bg-success/10 text-success"
                          : result.outcome === "L"
                            ? "border-danger/40 bg-danger/10 text-danger"
                            : "border-line bg-white/[0.03] text-muted",
                      )}
                    >
                      {result.outcome}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[0.625rem] text-subtle">
                        {result.matchId}
                      </span>
                      <span className="text-[0.625rem] text-muted tabular-nums">
                        {new Date(result.at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 font-display text-sm font-semibold tabular-nums">
                    <span className="text-foreground">
                      {result.scoreYou} – {result.scoreRival}
                    </span>
                    <Badge
                      tone={
                        result.ratingDelta > 0 ? "success" : result.ratingDelta < 0 ? "muted" : "neutral"
                      }
                      className="tabular-nums"
                    >
                      {result.ratingDelta > 0 ? "+" : ""}
                      {result.ratingDelta}
                    </Badge>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Achievements */}
        <section className="rounded-panel border border-line bg-elevated/60 p-5">
          <h2 className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-gold uppercase">
            Achievements
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <li
                  key={achievement.name}
                  className="flex items-start gap-3 rounded-card border border-dashed border-line/80 px-3.5 py-3"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-control border border-line bg-white/[0.03] text-subtle">
                    <Icon className="size-4" />
                  </span>
                  <span>
                    <span className="block font-display text-[0.8125rem] font-semibold tracking-[0.06em] text-muted uppercase">
                      {achievement.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-subtle">
                      {achievement.body}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 px-1 text-[0.625rem] leading-relaxed text-subtle">
            Achievements unlock as you play on this device. Account-tied trophy
            cases arrive with ranked play.
          </p>
        </section>
      </div>
    </Container>
  );
}

function CareerStat({
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
          "mt-1.5 font-display text-2xl font-semibold tabular-nums",
          accent ? "text-gold-bright" : "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function computeStreak(results: { outcome: "W" | "L" | "D" }[]): number {
  if (results.length === 0) return 0;
  const first = results[0]!.outcome;
  let count = 0;
  for (const result of results) {
    if (result.outcome === first && first !== "D") count += 1;
    else break;
  }
  return count;
}

function streakLastWin(results: { outcome: "W" | "L" | "D" }[]): boolean {
  return results[0]?.outcome === "W";
}

function totalingReset(
  confirming: boolean,
  reset: () => void,
  setConfirming: (v: boolean) => void,
) {
  if (confirming) {
    return (
      <span className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setConfirming(false)}
        >
          Keep data
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            reset();
            setConfirming(false);
          }}
        >
          Erase demo stats
        </Button>
      </span>
    );
  }
  return (
    <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
      Reset demo stats
    </Button>
  );
}

export function ProfileGateHint() {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted">
      <User className="size-4" />
      Sign in to sync across devices
    </span>
  );
}
