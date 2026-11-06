import type { Metadata } from "next";
import { ChallengeReveal } from "@/features/matchmaking/challenge-reveal";
import { MatchGate } from "@/components/game/match-gate";

export const metadata: Metadata = {
  title: "Challenge reveal",
};

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  return (
    <MatchGate matchId={matchId} stage="challenge">
      <ChallengeReveal matchId={matchId} />
    </MatchGate>
  );
}
