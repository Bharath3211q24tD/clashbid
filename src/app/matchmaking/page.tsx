import type { Metadata } from "next";
import { MatchmakingScene } from "@/features/matchmaking/matchmaking-scene";

export const metadata: Metadata = {
  title: "Matchmaking",
  description:
    "Queue for a 1v1 cross-universe character auction match in the demo arena.",
};

export default function MatchmakingPage() {
  return <MatchmakingScene />;
}
