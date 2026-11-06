import type { AttributeId, RarityTier } from "@/types";

export const SUPPORTED_ATTRIBUTE_IDS: AttributeId[] = [
  "power",
  "strategy",
  "leadership",
  "adaptability",
  "endurance",
];

export const ATTRIBUTE_LABELS: Record<AttributeId, string> = {
  power: "Power",
  strategy: "Strategy",
  leadership: "Leadership",
  adaptability: "Adaptability",
  endurance: "Endurance",
};

export const ATTRIBUTE_SHORT: Record<AttributeId, string> = {
  power: "PWR",
  strategy: "STR",
  leadership: "LEA",
  adaptability: "ADP",
  endurance: "END",
};

export const RARITY_LABELS: Record<RarityTier, string> = {
  iconic: "Iconic",
  elite: "Elite",
  rising: "Rising",
};

export const RARITY_TONE: Record<RarityTier, string> = {
  iconic: "text-gold-bright",
  elite: "text-foreground",
  rising: "text-muted",
};
