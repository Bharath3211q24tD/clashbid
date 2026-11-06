import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRight } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories, gameRules } from "@/lib/site";
import { CategoryCard } from "@/features/characters/category-card";

export function CategoryShowcase() {
  return (
    <section className="relative border-t border-line py-section">
      <Container>
        <SectionHeading
          eyebrow={`${gameRules.poolSize} shared lots`}
          title={
            <>
              Three universes.
              <br />
              <span className="text-gradient-gold">One bidding floor.</span>
            </>
          }
          description="Heroes, footballers, and cricketers share the same auction pool. Scarcity is universal — and so is the pressure."
          action={
            <ButtonLink href="/characters" variant="outline">
              Browse database
              <ArrowRight className="size-3.5" />
            </ButtonLink>
          }
        />

        <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              href="/characters"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
