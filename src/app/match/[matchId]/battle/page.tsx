import type { Metadata } from "next";
import { MatchGate } from "@/components/game/match-gate";
import { BattleScreen } from "@/features/evaluation/battle-screen";

export const metadata: Metadata = {
  title: "Battle evaluation",
};

export default async function BattlePage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  return (
    <MatchGate matchId={matchId} stage="battle">
      <BattleScreen matchId={matchId} />
    </MatchGate>
  );
}
