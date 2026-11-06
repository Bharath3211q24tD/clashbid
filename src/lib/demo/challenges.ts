import type { Challenge } from "@/types";

export const challengeCatalog: readonly Challenge[] = [
  {
    id: "ultimate-squad",
    name: "Ultimate Squad",
    description:
      "The classic gauntlet. No attribute is a hero and no attribute is a liability — judge the whole roster.",
    emphasis: "Balanced across all five attributes",
    weights: {
      power: 20,
      strategy: 20,
      leadership: 20,
      adaptability: 20,
      endurance: 20,
    },
  },
  {
    id: "intelligence-war",
    name: "Intelligence War",
    description:
      "Out-think the rival. Minds over muscle — squads of thinkers dismantle muscle every time.",
    emphasis: "Strategy and Adaptability dominate",
    weights: {
      power: 15,
      strategy: 40,
      leadership: 10,
      adaptability: 20,
      endurance: 15,
    },
  },
  {
    id: "survival",
    name: "Survival",
    description:
      "The slog. Attrition, pressure, and a roster that keeps standing when everything else doesn't.",
    emphasis: "Endurance and Power dominate",
    weights: {
      power: 25,
      strategy: 10,
      leadership: 10,
      adaptability: 15,
      endurance: 40,
    },
  },
  {
    id: "leadership",
    name: "Leadership",
    description:
      "Command wins close matches. Rosters glue together under captains who own the room.",
    emphasis: "Leadership and Strategy dominate",
    weights: {
      power: 10,
      strategy: 20,
      leadership: 40,
      adaptability: 15,
      endurance: 15,
    },
  },
  {
    id: "versatility",
    name: "Versatility",
    description:
      "Any matchup, any condition. Flexibility is the weapon — specialize at your peril.",
    emphasis: "Adaptability and Endurance dominate",
    weights: {
      power: 15,
      strategy: 15,
      leadership: 10,
      adaptability: 40,
      endurance: 20,
    },
  },
];

export const challengeIndex: ReadonlyMap<string, Challenge> = new Map(
  challengeCatalog.map((challenge) => [challenge.id, challenge]),
);

export function challengeById(challengeId: string): Challenge {
  const entry = challengeIndex.get(challengeId);
  if (!entry) {
    throw new Error(`Unknown demo challenge: ${challengeId}`);
  }
  return entry;
}
