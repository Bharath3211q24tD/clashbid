"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ComparisonBar } from "@/components/game/attribute-bars";
import { DemoPill } from "@/components/game/demo-notice";
import { Swords, Trophy, Shield, Users, Layers } from "@/components/ui/icons";
import { characterById } from "@/lib/demo/characters";
import { challengeById } from "@/lib/demo/challenges";
import { ATTRIBUTE_LABELS } from "@/lib/demo/attributes";
import { SQUAD_SIZE, useDemoMatch } from "@/stores/demo-match";
import { useSound } from "@/stores/sound";
import { cn } from "@/lib/utils";
import type { BattleEvaluation, DemoMatch } from "@/types";

const STAGES = 6 as const;

const STAGE_META = [
  { icon: Swords, label: "Squads locked" },
  { icon: Users, label: "Contributions" },
  { icon: Layers, label: "Categories" },
  { icon: Shield, label: "Team balance" },
  { icon: Users, label: "Synergy" },
  { icon: Trophy, label: "Final score" },
] as const;

export function BattleScreen({ matchId }: { matchId: string }) {
  const match = useDemoMatch((state) => state.match);
  const runBattle = useDemoMatch((state) => state.runBattle);
  const playSound = useSound((state) => state.play);
  const router = useRouter();
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0);

  // BATTLE_PROCESSING banner → deterministic evaluation → staged reveal.
  useEffect(() => {
    if (!match || match.phase !== "AUCTION_COMPLETED") return;
    const timer = window.setTimeout(() => {
      runBattle();
    }, 900);
    return () => window.clearTimeout(timer);
  }, [match, runBattle]);

  useEffect(() => {
    if (!match || match.phase !== "COMPLETED") return;
    const stepMs = 850;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let s = 1; s <= STAGES; s += 1) {
      timers.push(setTimeout(() => setStage(s), s * stepMs));
    }
    timers.push(
      setTimeout(
        () => playSound(match.evaluation && match.evaluation.final.you >= match.evaluation.final.rival ? "win" : "loss"),
        STAGES * stepMs + 200,
      ),
    );
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [match, playSound]);

  if (
    !match ||
    match.matchId !== matchId ||
    match.phase === "CANCELLED"
  ) {
    return null;
  }

  const evaluation = match.evaluation;

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-gutter pb-20 pt-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Swords className="size-5 text-gold" />
          <h1 className="font-display text-2xl font-bold tracking-[0.14em] text-foreground uppercase">
            Battle evaluation
          </h1>
        </div>
        <DemoPill />
      </header>

      <div className="rounded-panel border border-line-strong bg-elevated/70 p-5 sm:p-8">
        <StageRail stage={match.phase === "COMPLETED" ? stage : 0} />

        {match.phase === "AUCTION_COMPLETED" ? (
          <div className="mt-6 flex flex-col items-center gap-3 py-10">
            <span className="font-display text-sm font-semibold tracking-[0.3em] text-gold-bright uppercase motion-safe:animate-pulse">
              Scoring squads…
            </span>
            <p className="text-xs text-muted">
              Deterministic evaluation — identical squads always produce an
              identical result.
            </p>
          </div>
        ) : evaluation ? (
          <div className="mt-6 flex flex-col gap-5">
            <Show when={stage >= 1}>
              <SquadsLocked match={match} />
            </Show>
            <Show when={stage >= 2}>
              <Contributions match={match} evaluation={evaluation} />
            </Show>
            <Show when={stage >= 3}>
              <Categories evaluation={evaluation} />
            </Show>
            <Show when={stage >= 4}>
              <MetricRow
                title="Team balance"
                description="Spread of weighted scores across the roster. Even squads hold up under pressure."
                a={evaluation.balance.you}
                b={evaluation.balance.rival}
              />
            </Show>
            <Show when={stage >= 5}>
              <MetricRow
                title="Synergy"
                description="Category and role diversity bonus, plus completing the five-slot roster."
                a={evaluation.synergy.you}
                b={evaluation.synergy.rival}
              />
            </Show>
            <Show when={stage >= 6}>
              <FinalScore evaluation={evaluation} />
              <FinalActions
                match={match}
                onReplay={() => setStage(0)}
                onContinue={() => router.push(`/results/${matchId}`)}
              />
            </Show>
          </div>
        ) : null}
      </div>

      <p className="text-center text-[0.625rem] tracking-[0.16em] text-subtle uppercase">
        Scoring version {evaluation?.scoringVersion ?? "demo-eval-1.0"} · Squads
        of {SQUAD_SIZE} · Demo fixtures
      </p>
      {reduced ? null : null}
    </section>
  );
}

const reducedFlag = null; // reduced handled per Show
void reducedFlag;

function Show({
  when,
  children,
}: {
  when: boolean;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  if (!when) return null;
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StageRail({ stage }: { stage: number }) {
  return (
    <nav aria-label="Reveal stages" className="mt-4 border-b border-line pb-5">
      <ol className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {STAGE_META.map((meta, index) => {
          const revealed = stage >= index + 1;
          const Icon = meta.icon;
          return (
            <li
              key={meta.label}
              className={cn(
                "flex items-center gap-2 font-display text-[0.625rem] font-semibold tracking-[0.14em] uppercase transition-colors",
                revealed ? "text-gold-bright" : "text-subtle/60",
              )}
            >
              <Icon
                className={cn("size-4", revealed ? "text-gold" : "text-subtle/50")}
              />
              {meta.label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function SquadsLocked({ match }: { match: DemoMatch }) {
  const challenge = challengeById(match.challengeId ?? "ultimate-squad");
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
      <div>
        <p className="font-display text-[0.625rem] font-semibold tracking-[0.28em] text-gold uppercase">
          Challenge
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold text-foreground uppercase sm:text-3xl">
          {challenge.name}
        </h2>
      </div>
      <div className="flex items-center gap-4 font-display text-sm font-semibold uppercase tabular-nums">
        <span className="text-foreground">
          {match.players.you.handle} · {match.players.you.squad.length}/{SQUAD_SIZE}
        </span>
        <span className="text-gold">VS</span>
        <span className="text-foreground">
          {match.players.rival.handle} · {match.players.rival.squad.length}/{SQUAD_SIZE}
        </span>
      </div>
    </div>
  );
}

function Contributions({
  match,
  evaluation,
}: {
  match: DemoMatch;
  evaluation: BattleEvaluation;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(["you", "rival"] as const).map((side) => (
        <div
          key={side}
          className="rounded-card border border-line bg-background-deep/60 p-4"
        >
          <p className="font-display text-[0.625rem] font-semibold tracking-[0.22em] text-subtle uppercase">
            {side === "you" ? "Your slots" : "Rival slots"}{" "}
            <span className="text-gold-bright tabular-nums">
              · individual {evaluation.individual[side]}
            </span>
          </p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {match.players[side].squad.map((entry) => (
              <li
                key={entry.characterId}
                className="flex items-center justify-between gap-2 rounded-control border border-line/70 px-2.5 py-1.5"
              >
                <span className="truncate font-display text-[0.8125rem] font-semibold text-foreground">
                  {characterById(entry.characterId).name}
                </span>
                <span className="shrink-0 text-[0.6875rem] text-muted tabular-nums">
                  {entry.priceCr} Cr
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Categories({ evaluation }: { evaluation: BattleEvaluation }) {
  return (
    <div className="rounded-card border border-line bg-background-deep/60 p-4 sm:p-5">
      <StageTag label="Attribute categories" />
      <div className="mt-4 flex flex-col gap-4">
        {evaluation.categories.map((category) => (
          <ComparisonBar
            key={category.attributeId}
            label={ATTRIBUTE_LABELS[category.attributeId]}
            weight={category.weight}
            you={category.you}
            rival={category.rival}
          />
        ))}
      </div>
    </div>
  );
}

function MetricRow({
  title,
  description,
  a,
  b,
}: {
  title: string;
  description: string;
  a: number;
  b: number;
}) {
  return (
    <div className="grid gap-3 rounded-card border border-line bg-background-deep/60 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6 sm:p-5">
      <div>
        <StageTag label={title} />
        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
        <span className="font-display text-[0.5625rem] font-semibold tracking-[0.2em] text-subtle uppercase">
          You
        </span>
        <span
          className={cn(
            "font-display text-2xl font-bold tabular-nums",
            a >= b ? "text-gold-bright" : "text-muted",
          )}
        >
          +{a}
        </span>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-1">
        <span className="font-display text-[0.5625rem] font-semibold tracking-[0.2em] text-subtle uppercase">
          Rival
        </span>
        <span
          className={cn(
            "font-display text-2xl font-bold tabular-nums",
            b > a ? "text-danger" : "text-muted",
          )}
        >
          +{b}
        </span>
      </div>
    </div>
  );
}

function FinalScore({ evaluation }: { evaluation: BattleEvaluation }) {
  const youWon = evaluation.final.you >= evaluation.final.rival;
  return (
    <div className="grid gap-3 rounded-card border border-line-gold bg-gold-soft p-4 sm:grid-cols-2 sm:p-5">
      <ScoreCard
        label="Your final score"
        value={evaluation.final.you}
        highlight={youWon}
        detail={`${evaluation.individual.you} + ${evaluation.balance.you} balance + ${evaluation.synergy.you} synergy`}
      />
      <ScoreCard
        label="Rival final score"
        value={evaluation.final.rival}
        highlight={!youWon}
        danger
        detail={`${evaluation.individual.rival} + ${evaluation.balance.rival} balance + ${evaluation.synergy.rival} synergy`}
      />
    </div>
  );
}

function ScoreCard({
  label,
  value,
  highlight,
  danger = false,
  detail,
}: {
  label: string;
  value: number;
  highlight: boolean;
  danger?: boolean;
  detail: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border p-4 text-center",
        highlight
          ? "border-gold/60 bg-background/85 shadow-glow"
          : cn(borderStyle(danger)),
      )}
    >
      <p className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-subtle uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-4xl font-bold tabular-nums",
          highlight
            ? "text-gradient-gold"
            : danger
              ? "text-muted/60"
              : "text-muted",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-[0.625rem] text-muted tabular-nums">{detail}</p>
    </div>
  );
}

function borderStyle(danger: boolean): string {
  return danger
    ? "border-danger/30 bg-danger/[0.06]"
    : "border-line bg-background/85";
}

function StageTag({ label }: { label: string }) {
  return (
    <p className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-gold uppercase">
      {label}
    </p>
  );
}

function FinalActions({
  match,
  onReplay,
  onContinue,
}: {
  match: DemoMatch;
  onReplay: () => void;
  onContinue: () => void;
}) {
  const evaluation = match.evaluation;
  const youWon =
    (evaluation?.final.you ?? 0) >= (evaluation?.final.rival ?? 0);
  return (
    <div className="flex flex-col items-center gap-4 pt-1">
      <p
        className={cn(
          "font-display text-xl font-bold tracking-[0.14em] uppercase",
          youWon ? "text-gradient-gold" : "text-muted",
        )}
      >
        {youWon ? "Your squad takes the match" : "The rival squad takes it"}
      </p>
      {evaluation ? (
        <p className="max-w-md text-center text-xs text-muted tabular-nums">
          Rating changes — You {formatDelta(evaluation.ratingDelta.you)} · Rival{" "}
          {formatDelta(evaluation.ratingDelta.rival)}
        </p>
      ) : null}
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={onContinue}>View final result</Button>
        <Button variant="secondary" onClick={onReplay}>
          Replay reveal
        </Button>
      </div>
    </div>
  );
}

function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : String(delta);
}
