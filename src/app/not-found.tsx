import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRight, Radar } from "@/components/ui/icons";
import { Eyebrow } from "@/components/ui/section-heading";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 sm:pt-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="arena-grid absolute inset-x-0 top-0 h-full opacity-40" />
        <div className="absolute top-10 left-1/2 size-96 -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[110px]" />
      </div>

      <Container size="narrow" className="relative text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-panel border border-line-gold bg-gold-soft text-gold">
          <Radar className="size-7" />
        </div>
        <Eyebrow className="mt-8 justify-center" rule={false}>
          404 · Signal lost
        </Eyebrow>
        <h1 className="mt-4 text-display-xl text-foreground">
          This arena does not exist.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted">
          The route you followed has been sealed or never made it into the
          foundation. Head back to safe ground.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" size="lg">
            Return home
            <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink href="/lobby" variant="secondary" size="lg">
            Open the lobby
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
