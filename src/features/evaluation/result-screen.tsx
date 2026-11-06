"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Button, ButtonLink } from "@/components/ui/button";
import { ComparisonBar } from "@/components/game/attribute-bars";
import { DemoPill } from "@/components/game/demo-notice";
import { SquadPanel } from "@/components/game/player-chip";
import { battleExplanation, SQUAD_SIZE, useDemoMatch } from "@/stores/demo-match";
import { challengeById } from "@/lib/demo/challenges";
import { useDemoCareer } from "@/stores/demo-career";
import { ATTRIBUTE_LABELS } from "@/lib/demo/attributes";
import { useSound } from "@/stores/sound";
import { cn, formatCrores } from "@/lib/utils";
import type { BattleEvaluation, DemoMatch } from "@/types";

export function ResultScreen({ matchId }: { matchId: string }) {
  const match = useDemoMatch((state) => state.match);
  const rematch = useDemoMatch((state) => state.rematch);
  const playSound = useSound((state) => state.play);
  const record = useDemoCareer((state) => state.record);
  const router = useRouter();
  const reduced = useReducedMotion();

  const ready =
    match !== null &&
    match.matchId === matchId &&
    match.phase === "COMPLETED" &&
    match.evaluation !== null;

  useEffect(() => {
    if (!ready || !match) return;
    record(match);
    const evaluation = match.evaluation;
    if (!evaluation) return;
    playSound(
      evaluation.final.you === evaluation.final.rival
        ? "turn-start"
        : evaluation.final.you > evaluation.final.rival
          ? "win"
          : "loss",
    );
  }, [ready, match, record, playSound]);

  if (!ready || !match || !match.evaluation) {
    return null;
  }

  const evaluation: BattleEvaluation = match.evaluation;
  const youWon = evaluation.final.you > evaluation.final.rival;
  const draw = evaluation.final.you === evaluation.final.rival;
  const challenge = challengeById(match.challengeId ?? "ultimate-squad");

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-gutter pb-20 pt-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-[0.625rem] font-semibold tracking-[0.3em] text-gold uppercase">
            Match result
          </p>
          <h1 className="mt-2 font-display text-[clamp(2.5rem,8vw,4.5rem)] leading-[0.95] font-bold uppercase">
            {draw ? (
              <span className="text-foreground">Dead heat</span>
            ) : youWon ? (
              <span className="text-gradient-gold">Victory</span>
            ) : (
              <span className="text-muted">Defeat</span>
            )}
          </h1>
        </div>
        <DemoPill />
      </header>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-3"
      >
        <ResultStat
          label={`${challenge.name} score`}
          accent={youWon}
          value={evaluation.final.you}
          sub={`rival ${evaluation.final.rival}`}
        />
        <ResultStat
          label="Rating change"
          accent={evaluation.ratingDelta.you > 0}
          value={formatDelta(evaluation.ratingDelta.you)}
          sub="demo rating"
        />
        <ResultStat
          label="Big spend"
          accent={false}
          value={formatCrores(topPriceOf(match))}
          sub={`match ${match.matchId}`}
        />
      </motion.div>

      <div className="rounded-card border border-line bg-elevated/60 p-4 sm:p-5">
        <p className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-gold uppercase">
          Why it went this way
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {battleExplanation(evaluation)}
        </p>
      </div>

      <div className="rounded-panel border border-line bg-elevated/70 p-4 sm:p-6">
        <p className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-gold uppercase">
          Attribute breakdown
        </p>
        <div className="mt-4 grid gap-3.5">
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
        <div className="mt-5 grid gap-2 border-t border-line pt-4 text-xs text-muted sm:grid-cols-3">
          <p className="tabular-nums">
            Individual — you {evaluation.individual.you} · rival{" "}
            {evaluation.individual.rival}
          </p>
          <p className="tabular-nums">
            Balance — you {evaluation.balance.you} · rival{" "}
            {evaluation.balance.rival}
          </p>
          <p className="tabular-nums">
            Synergy — you {evaluation.synergy.you} · rival{" "}
            {evaluation.synergy.rival}
          </p>
        </div>
        <p className="mt-3 text-[0.625rem] tracking-[0.14em] text-subtle uppercase">
          Scoring version {evaluation.scoringVersion} — identical squad data
          always yields this exact result.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-panel border border-line-gold/60 bg-elevated/70 p-4">
          <SquadPanel
            title={`${match.players.you.handle} — final squad`}
            side="you"
            entries={match.players.you.squad}
          />
          <p className="mt-3 px-1 text-[0.6875rem] text-muted tabular-nums">
            Spent {formatCrores(spendOf(match, "you"))} of 100 Cr ·{" "}
            {match.players.you.squad.length}/{SQUAD_SIZE} slots filled
          </p>
        </div>
        <div className="rounded-panel border border-line bg-elevated/50 p-4">
          <SquadPanel
            title={`${match.players.rival.handle} — final squad`}
            side="rival"
            entries={match.players.rival.squad}
          />
          <p className="mt-3 px-1 text-[0.6875rem] text-muted tabular-nums">
            Spent {formatCrores(spendOf(match, "rival"))} of 100 Cr
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          size="lg"
          onClick={() => {
            playSound("ui-confirm");
            const nextMatchId = rematch();
            router.push(`/match/${nextMatchId}/challenge`);
          }}
        >
          Rematch now
        </Button>
        <ButtonLink href="/lobby" variant="secondary" size="lg">
          Return to lobby
        </ButtonLink>
      </div>

      <p className="text-center text-[0.625rem] text-subtle">
        Match ID {match.matchId} ·{" "}
        <Link
          href="/characters"
          className="text-gold-bright underline-offset-4 hover:underline"
        >
          Scout the full pool
        </Link>
      </p>
    </section>
  );
}

function ResultStat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  sub: string;
  accent: boolean;
}) {
  return (
    <div className="bg-background/90 px-5 py-5 text-center">
      <p className="font-display text-[0.625rem] font-semibold tracking-[0.2em] text-subtle uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-3xl font-bold tabular-nums",
          accent ? "text-gold-bright" : "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="mt-1 truncate font-mono text-[0.625rem] text-subtle">{sub}</p>
    </div>
  );
}

function spendOf(match: DemoMatch, player: "you" | "rival"): number {
  return match.players[player].squad.reduce((sum, e) => sum + e.priceCr, 0);
}

function topPriceOf(match: DemoMatch): number {
  const all = [...match.players.you.squad, ...match.players.rival.squad];
  return all.reduce((max, e) => Math.max(max, e.priceCr), 0);
}

function formatDelta(delta: number): string {
  if (delta === 0) {
    return "0";
  }
  return delta > 0 ? `+${delta}` : String(delta);
}
