import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { LeaderboardBoard } from "@/features/leaderboard/leaderboard-board";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Season standings for the CLASHBID arena. Ranked play activates with player accounts.",
};

export default function LeaderboardPage() {
  return (
    <>
      <PageHero
        eyebrow="Leaderboard"
        title={
          <>
            Rank anything but{" "}
            <span className="text-gradient-gold">nothing personal.</span>
          </>
        }
        description="Global, country, and weekly boards light up as rated matches arrive. Until then, warm up in the demo arena and grow a local rating."
      >
        <ButtonLink href="/matchmaking" size="lg">
          Queue a demo match
        </ButtonLink>
      </PageHero>

      <Container className="pb-20">
        <LeaderboardBoard />
      </Container>
    </>
  );
}
