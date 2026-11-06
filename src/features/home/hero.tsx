"use client";

import { motion, useReducedMotion } from "motion/react";
import { CharacterArtwork } from "@/components/game/character-artwork";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRight, Lock } from "@/components/ui/icons";
import { characterById } from "@/lib/demo/characters";
import { gameRules } from "@/lib/site";
import { cn, formatCrores } from "@/lib/utils";

const heroStats = [
  { label: "War chest", value: formatCrores(gameRules.budgetCrores) },
  { label: "Auction lots", value: String(gameRules.poolSize) },
  { label: "Squad size", value: `${gameRules.rosterSize} v 5` },
  { label: "Turn clock", value: "15 sec" },
] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const spotlight = [
    characterById("f02"), // Void Reaper
    characterById("g02"), // Tarik Osei
    characterById("c06"), // Yash Nair
  ];

  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 lg:pt-44 lg:pb-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="arena-grid absolute inset-x-0 top-0 h-[44rem] opacity-50" />
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[64rem] -translate-x-1/2 rounded-full bg-gold/[0.09] blur-[130px]" />
        <div className="absolute top-24 right-[-10%] size-96 rounded-full bg-[#3d4a75]/20 blur-[120px]" />
        <div className="absolute -left-40 top-1/2 size-[28rem] -translate-y-1/2 rounded-full bg-gold/[0.05] blur-[110px]" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="gold" dot>
                Demo season
              </Badge>
              <span className="text-[0.625rem] font-semibold tracking-[0.24em] text-subtle uppercase">
                Cross-universe auction arena
              </span>
            </div>

            <h1 className="mt-7 text-display-2xl">
              <StaggerLine delay={0}>
                <span className="block text-foreground">Build your squad.</span>
              </StaggerLine>
              <StaggerLine delay={0.14}>
                <span className="text-gradient-gold block">
                  Outsmart your rival.
                </span>
              </StaggerLine>
            </h1>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            >
              Enter the arena. Bid for legends. Build the ultimate five-slot
              squad from heroes, footballers, and cricketers — then prove your
              strategy in the cross-universe showdown.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.56, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <ButtonLink href="/matchmaking" size="lg">
                Play now
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/how-to-play" variant="secondary" size="lg">
                How it works
              </ButtonLink>
            </motion.div>

            <p className="mt-6 flex items-center gap-2 text-[0.625rem] font-semibold tracking-[0.18em] text-subtle uppercase">
              <Lock className="size-3.5 text-gold" />
              Demo build · Matches simulate locally, production backend in development
            </p>
          </div>

          {/* Spotlight trio */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-10 rounded-[3rem] bg-gold/[0.06] blur-3xl"
            />
            <div className="relative grid grid-cols-3 gap-3" suppressHydrationWarning>
              {spotlight.map((character, index) => (
                <motion.div
                  key={character.id}
                  initial={reduced ? false : { opacity: 0, y: 34, rotate: index === 1 ? 90 : index === 0 ? -4 : 3 }}
                  animate={{ opacity: 1, y: 0, rotate: index === 1 ? 0 : index === 0 ? -2 : 2 }}
                  transition={{
                    delay: 0.6 + index * 0.12,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    "relative",
                    index === 1 && "z-10 -translate-y-4",
                  )}
                >
                  <CharacterArtwork
                    character={character}
                    size="md"
                    className={
                      index === 1
                        ? "border-line-gold shadow-glow"
                        : "opacity-80"
                    }
                  />
                  <p
                    className={cn(
                      "mt-2 truncate text-center font-display text-[0.6875rem] font-semibold tracking-[0.1em] uppercase",
                      index === 1 ? "text-gold-bright" : "text-muted",
                    )}
                  >
                    {character.name}
                  </p>
                  <p className="mt-0.5 text-center text-[0.5625rem] text-subtle tabular-nums">
                    Base {formatCrores(character.basePriceCr)}
                  </p>
                </motion.div>
              ))}
            </div>
            <p className="mt-4 text-center text-[0.5625rem] font-semibold tracking-[0.22em] text-subtle uppercase">
              Placeholder art · production set
            </p>
          </div>
        </div>

        {/* Config stats strip (real product configuration, not fabricated activity) */}
        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:mt-20 sm:grid-cols-4">
          {heroStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.5 }}
              className="relative bg-background/85 px-5 py-5 backdrop-blur-sm sm:px-6 sm:py-6"
            >
              <span
                aria-hidden="true"
                className="absolute top-4 right-4 font-display text-[0.5625rem] tracking-[0.2em] text-subtle/60"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-[0.625rem] font-semibold tracking-[0.2em] text-subtle uppercase">
                {stat.label}
              </p>
              <p className="mt-2 font-display text-2xl leading-none font-semibold text-foreground tabular-nums sm:text-[1.75rem]">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StaggerLine({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="block"
    >
      {children}
    </motion.span>
  );
}
