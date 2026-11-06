import type { Metadata } from "next";
import { LobbyScreen } from "@/features/lobby/lobby-screen";

export const metadata: Metadata = {
  title: "Lobby",
  description:
    "The CLASHBID war room. Queue for 1v1 cross-universe character auctions.",
};

export default function LobbyPage() {
  return <LobbyScreen />;
}
