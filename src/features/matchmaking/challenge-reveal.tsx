"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "@/components/ui/icons";
import { WeightChips } from "@/components/game/attribute-bars";
import { challengeById, challengeCatalog } from "@/lib/demo/challenges";
import { useDemoMatch } from "@/stores/demo-match";
import { useSound } from "@/stores/sound";
import { cn } from "@/lib/utils";

export function ChallengeReveal({ matchId }: { matchId: string }) {
  const match = useDemoMatch((state) => state.match);
  const playSound = useSound((state) => state.play);
  const router = useRouter();
  const reduced = useReducedMotion();

  const challengeId = match?.challengeId ?? null;
  const challenge = challengeId ? challengeByIdSafe(challengeId) : null;

  useEffect(() => {
    if (!challenge) return;
    playSound("lot-open");
  }, [challenge, playSound]);

  if (!challenge) return null;

  const handleContinue = () => {
    playSound("ui-confirm");
    const state = useDemoMatch.getState();
    state.startAuction();
    router.push(`/match/${matchId}/auction`);
  };

  return (
    <section className="relative mx-auto flex min-h-[calc(100dvh-var(--spacing-header)-2rem)] w-full max-w-3xl flex-col items-center justify-center gap-8 px-gutter pb-20 pt-8 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_38%,rgb(240_185_74_/_0.12),transparent_70%)]"
      />

      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.6, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="relative flex size-24 items-center justify-center rounded-full border border-line-gold bg-gold-soft shadow-glow"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-dashed border-gold/40 motion-safe:animate-[spin_26s_linear_infinite]"
        />
        <Sparkles className="size-9 text-gold" />
      </motion.div>

      <div className="relative overflow-hidden">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="font-display text-[0.6875rem] font-semibold tracking-[0.34em] text-gold uppercase"
        >
          Common challenge revealed
        </motion.p>
        <div className="mt-3 overflow-hidden">
          <motion.h1
            initial={reduced ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(2.75rem,9vw,5rem)] leading-none font-bold tracking-[0.04em] text-gradient-gold uppercase"
          >
            {challenge.name}
          </motion.h1>
        </div>
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.5 }}
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base"
        >
          {challenge.description}
        </motion.p>
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.55 }}
        className="relative flex w-full flex-col items-center gap-4 rounded-card border border-line-strong bg-elevated/70 px-5 py-5 sm:px-8"
      >
        <p className="font-display text-[0.625rem] font-semibold tracking-[0.26em] text-subtle uppercase">
          Attribute weights — build for this profile
        </p>
        <WeightChips weights={challenge.weights} />
        <p className="text-[0.6875rem] tracking-[0.06em] text-muted">
          {challenge.emphasis}
        </p>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.35, duration: 0.5 }}
        className="flex flex-col items-center gap-3"
      >
        <Button size="lg" onClick={handleContinue}>
          Continue to the auction
        </Button>
        <p className="text-[0.625rem] tracking-[0.14em] text-subtle uppercase">
          The shared pool of 30 lots rotates in fixed order · Demo sim
        </p>
      </motion.div>
    </section>
  );
}

function challengeByIdSafe(id: string) {
  try {
    return challengeById(id);
  } catch {
    return challengeCatalog[0] ?? null;
  }
}

export function ChallengeEmblemFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-16 items-center justify-center rounded-full border border-line bg-elevated",
        className,
      )}
    >
      <Sparkles className="size-6 text-subtle" />
    </div>
  );
}
