import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
  aside?: ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  aside,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="arena-grid absolute inset-x-0 top-0 h-full opacity-40" />
        <div className="absolute top-0 left-1/2 h-64 w-[56rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[110px]" />
        <div className="absolute -top-24 right-[-10%] size-72 rounded-full bg-[#3d4a75]/15 blur-[100px]" />
      </div>

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl animate-fade-up">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-5 text-display-xl text-foreground">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {description}
            </p>
            {children ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {children}
              </div>
            ) : null}
          </div>
          {aside ? (
            <div className="animate-fade-up [animation-delay:140ms]">{aside}</div>
          ) : null}
        </div>
      </Container>

      <div aria-hidden="true" className="hairline absolute inset-x-0 bottom-0 opacity-60" />
    </section>
  );
}
