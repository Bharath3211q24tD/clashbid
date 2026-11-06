import type { EntityCategory } from "@/types";

export const siteConfig = {
  name: "CLASHBID",
  tagline: "Cross-universe auction arena",
  description:
    "A competitive 1v1 character auction. Build a five-slot roster from thirty legendary lots with a ₹100 Cr war chest.",
} as const;

export const gameRules = {
  budgetCrores: 100,
  poolSize: 30,
  rosterSize: 5,
  matchFormat: "1v1",
} as const;

export const navItems = [
  { href: "/matchmaking", label: "Play" },
  { href: "/characters", label: "Characters" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/how-to-play", label: "How to play" },
] as const;

export const categories: readonly EntityCategory[] = [
  {
    id: "fictional",
    label: "Fictional & Marvel",
    kicker: "Universe 01",
    description:
      "Comic icons, cinematic legends, and heroes pulled from beyond the known multiverse.",
  },
  {
    id: "football",
    label: "Football",
    kicker: "Universe 02",
    description:
      "Match-winners, playmakers, and defensive walls from the world's biggest pitches.",
  },
  {
    id: "cricket",
    label: "Cricket",
    kicker: "Universe 03",
    description:
      "Captains, finishers, and game-changers forged across every format of the sport.",
  },
];
