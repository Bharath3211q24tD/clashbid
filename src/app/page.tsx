import { CategoryShowcase } from "@/features/home/category-showcase";
import { Hero } from "@/features/home/hero";
import { PhaseCta } from "@/features/home/phase-cta";
import { ProtocolSection } from "@/features/home/protocol-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <ProtocolSection />
      <PhaseCta />
    </>
  );
}
