import { BrandMark } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRight } from "@/components/ui/icons";
import { Eyebrow } from "@/components/ui/section-heading";

export function PhaseCta() {
  return (
    <section className="relative py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-panel border border-line-gold bg-elevated px-6 py-10 shadow-card sm:px-10 sm:py-12 lg:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_100%_50%,rgb(240_185_74_/_0.12),transparent_60%)]"
          />
          <BrandMark className="pointer-events-none absolute -right-10 -bottom-16 size-64 rotate-12 opacity-[0.06]" />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <Eyebrow>Demo arena · playable now</Eyebrow>
              <h2 className="mt-4 text-display-lg text-foreground">
                Thirty lots are locked and loaded.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                The full loop is playable in the demo arena: matchmaking, the
                15-second auction clock, battle scoring, and rematch flow. Ranked
                ladders arrive with player accounts.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/matchmaking" size="lg">
                Play now
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/characters" variant="secondary" size="lg">
                View characters
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
