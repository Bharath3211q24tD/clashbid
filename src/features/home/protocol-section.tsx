import type { ComponentType, SVGProps } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Gavel, Swords, Trophy } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";

interface ProtocolStep {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const steps: readonly ProtocolStep[] = [
  {
    icon: Swords,
    title: "Enter the room",
    description:
      "Two operators drop into a private 1v1 arena with one shared pool and one shared clock.",
  },
  {
    icon: Gavel,
    title: "Bid the pool",
    description:
      "Thirty lots rotate through the floor. Every bid is public, and every credit counts.",
  },
  {
    icon: Trophy,
    title: "Lock the five",
    description:
      "Fill five roster slots with the strongest possible squad before the war chest runs dry.",
  },
];

export function ProtocolSection() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-elevated/25 py-section">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,rgb(240_185_74_/_0.05),transparent_70%)]"
      />

      <Container className="relative">
        <SectionHeading
          align="center"
          eyebrow="Arena protocol"
          title="From first bid to final five."
          description="Bid against a scripted rival in the demo arena. Every mechanism below is playable right now — the production backend wires the same flow."
        />

        <div className="relative mt-14 grid gap-5 md:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute top-12 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent md:block"
          />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.title} className="relative">
                <div className="relative h-full rounded-card border border-line bg-background/70 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-line-gold">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex size-12 items-center justify-center rounded-panel border border-line-gold bg-gold-soft text-gold [&_svg]:size-5">
                      <Icon />
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-display text-3xl leading-none font-semibold text-white/[0.06]"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-10 font-display text-display-sm font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>

                  <div className="mt-6 border-t border-line pt-4">
                    <Badge tone="gold">Demo sim</Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <ButtonLink href="/how-to-play" variant="outline">
            Read the full arena protocol
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
