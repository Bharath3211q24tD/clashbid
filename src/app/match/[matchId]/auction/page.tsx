import type { Metadata } from "next";
import { MatchGate } from "@/components/game/match-gate";
import { AuctionScreen } from "@/features/auction/auction-screen";

export const metadata: Metadata = {
  title: "Auction arena",
};

export default async function AuctionPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  return (
    <MatchGate matchId={matchId} stage="auction">
      <AuctionScreen matchId={matchId} />
    </MatchGate>
  );
}
