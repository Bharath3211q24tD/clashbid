import type { Metadata } from "next";
import { MatchGate } from "@/components/game/match-gate";
import { ResultScreen } from "@/features/evaluation/result-screen";

export const metadata: Metadata = {
  title: "Match result",
};

export default async function ResultPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  return (
    <MatchGate matchId={matchId} stage="results">
      <ResultScreen matchId={matchId} />
    </MatchGate>
  );
}
