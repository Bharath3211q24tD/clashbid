import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { WeightChips } from "@/components/game/attribute-bars";
import {
  Check,
  Gavel,
  Hourglass,
  Layers,
  Swords,
  Trophy,
  X_1,
} from "@/components/ui/icons";
import { challengeCatalog } from "@/lib/demo/challenges";

export const metadata: Metadata = {
  title: "How to play",
  description:
    "The CLASHBID arena protocol: matchmaking, the shared pool, 15-second auctions, and deterministic battle scoring.",
};

const phaseSteps = [
  {
    number: "01",
    title: "Enter the room",
    body: "Queue for 1v1. When the match assembles, both operators see the same 30-lot pool and the same clock.",
  },
  {
    number: "02",
    title: "Read the challenge",
    body: "Every match reveals one common challenge — Ultimate Squad, Intelligence War, Survival, Leadership, or Versatility. Its attribute weights tell you which squad profile pays off. Bid accordingly.",
  },
  {
    number: "03",
    title: "Bid the floor",
    body: "Lots open at their base price. Each accepted bid raises the price, resets the 15-second clock, and leaves a standing leader. Let a bid stand and the lot sells.",
  },
  {
    number: "04",
    title: "Know when to fold",
    body: "Pass withdraws you from the lot. Timeouts count as a pass. Two passes without an offer send the lot unsold — nobody pays a rupee for it.",
  },
  {
    number: "05",
    title: "Fill the five",
    body: "Fill five slots and keep wallet cover. With a ₹100 Cr chest, one 30 Cr impulse can leave the last two slots bare.",
  },
  {
    number: "06",
    title: "Battle and collect",
    body: "Once both squads are locked, the evaluation scores rosters on the challenge weights, balance, and synergy. Winner takes rating points.",
  },
] as const;

export default function HowToPlayPage() {
  return (
    <>
      <PageHero
        eyebrow="Arena protocol"
        title={
          <>
            Bid smart.{" "}
            <span className="text-gradient-gold">Squad harder.</span>
          </>
        }
        description="Six steps from matchmaking to rating points. Read the weights, watch your wallet, and never bid from panic."
      >
        <ButtonLink href="/matchmaking" size="lg">
          Play a demo match
        </ButtonLink>
        <ButtonLink href="/characters" variant="secondary" size="lg">
          Scout the pool first
        </ButtonLink>
      </PageHero>

      <section className="border-t border-line py-section">
        <Container>
          <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {phaseSteps.map((step) => (
              <li key={step.number}>
                <Card interactive className="flex h-full flex-col p-6">
                  <span
                    aria-hidden="true"
                    className="font-display text-3xl leading-none font-semibold text-white/[0.07]"
                  >
                    {step.number}
                  </span>
                  <h2 className="mt-4 font-display text-display-sm font-semibold text-foreground">
                    {step.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-t border-line bg-elevated/25 py-section">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <SectionHeading
                title="The turn clock"
                description="Both operators act on one clock. Pressure is the point — plan before the lot opens."
              />
              <div className="mt-6 flex flex-col gap-3">
                <ClockRow
                  icon={<Hourglass className="size-4" />}
                  label="15 – 6 sec"
                  tone="normal"
                  text="Calm phase. The bid bar and leaderboard are yours to read."
                />
                <ClockRow
                  icon={<Hourglass className="size-4" />}
                  label="5 – 3 sec"
                  tone="warning"
                  text="Amber warning. Decide your increment and commit."
                />
                <ClockRow
                  icon={<X_1 className="size-4" />}
                  label="2 – 0 sec"
                  tone="danger"
                  text="Red pressure. At zero the lot resolves exactly as if you passed."
                />
              </div>
            </div>
            <div>
              <SectionHeading
                title="Bid economics"
                description="Wallet discipline decides matches as often as attributes do."
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <RuleCard
                  icon={<Gavel className="size-4" />}
                  title="Escrow on every bid"
                  body="The moment you lead a lot, that amount is committed from your wallet. Overbids refund your committed credit."
                />
                <RuleCard
                  icon={<Check className="size-4" />}
                  title="Sold at the hammer"
                  body="Highest standing bid when passes or timeouts end the round. Price never exceeds what bidders actually pushed."
                />
                <RuleCard
                  icon={<X_1 className="size-4" />}
                  title="Unsold is free"
                  body="No bids and double passes return everyone's escrow. Budget spent is budget chosen."
                />
                <RuleCard
                  icon={<X_1 className="size-4" />}
                  title="Pass means it"
                  body="Passing while a rival leads is final — sold to their standing bid. Spend attention, not credit."
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-section">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Five challenges"
            title="Weights before wallets."
            description="Challenge weights are revealed before the auction. Draft the profile they reward."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {challengeCatalog.map((challenge) => (
              <Card key={challenge.id} interactive className="flex h-full flex-col p-5">
                <h3 className="font-display text-lg font-semibold tracking-[0.08em] text-foreground uppercase">
                  {challenge.name}
                </h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">
                  {challenge.description}
                </p>
                <div className="mt-4">
                  <WeightChips weights={challenge.weights} />
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-elevated/25 py-section">
        <Container>
          <SectionHeading
            align="center"
            title="Battle scoring, made public."
            description="Evaluation is deterministic: identical squads always produce the identical result. Animation never changes the numbers."
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            <ScoreCard
              icon={<Trophy className="size-4" />}
              title="Individual depth"
              body="Each squad scores the weighted average of its attributes against the challenge profile."
            />
            <ScoreCard
              icon={<Layers className="size-4" />}
              title="Balance + synergy"
              body="Even-out squads earn a stability bonus; category and role diversity earn a coverage bonus."
            />
            <ScoreCard
              icon={<Swords className="size-4" />}
              title="Final comparison"
              body="Individual + balance + synergy makes the final score. Highest total wins the room."
            />
            <ScoreCard
              icon={<Check className="size-4" />}
              title="Rating movement"
              body="Wins move ranking rating. The production board lists global, country, and weekly standings."
            />
          </div>
          <div className="mt-10 flex justify-center">
            <ButtonLink href="/matchmaking" size="lg">
              Enter the demo arena
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

function ClockRow({
  icon,
  label,
  tone,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "normal" | "warning" | "danger";
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-control border border-line bg-background/60 px-4 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-control border border-line bg-white/[0.03] text-gold">
        {icon}
      </div>
      <div>
        <p className="flex items-center gap-2.5 font-display text-[0.6875rem] font-semibold tracking-[0.18em] text-foreground uppercase tabular-nums">
          {label}
          <span
            className={
              tone === "normal"
                ? "rounded-pill bg-white/[0.06] px-2 py-0.5 text-[0.5625rem] text-muted"
                : tone === "warning"
                  ? "rounded-pill bg-gold/15 px-2 py-0.5 text-[0.5625rem] text-gold-bright"
                  : "rounded-pill bg-danger/15 px-2 py-0.5 text-[0.5625rem] text-danger"
            }
          >
            {tone === "normal" ? "calm" : tone === "warning" ? "press" : "critical"}
          </span>
        </p>
        <p className="mt-1 text-xs text-muted">{text}</p>
      </div>
    </div>
  );
}

function RuleCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-card border border-line bg-background/60 p-4">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-control border border-line-gold bg-gold-soft text-gold">
          {icon}
        </div>
        <h3 className="font-display text-sm font-semibold tracking-[0.1em] text-foreground uppercase">
          {title}
        </h3>
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function ScoreCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-card border border-line bg-background/60 p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-control border border-line-gold bg-gold-soft text-gold">
          {icon}
        </div>
        <h3 className="font-display text-base font-semibold tracking-[0.08em] text-foreground uppercase">
          {title}
        </h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

export function HowToPlayFooter() {
  return null;
}
