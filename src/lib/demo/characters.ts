import type {
  AttributeId,
  CharacterAttributes,
  GameCharacter,
  RarityTier,
} from "@/types";

export const ATTRIBUTE_LABELS: Record<AttributeId, string> = {
  power: "Power",
  strategy: "Strategy",
  leadership: "Leadership",
  adaptability: "Adaptability",
  endurance: "Endurance",
};

export const RARITY_LABELS: Record<RarityTier, string> = {
  iconic: "Iconic",
  elite: "Elite",
  rising: "Rising",
};

export function rarityForBasePrice(basePriceCr: number): RarityTier {
  if (basePriceCr >= 10) return "iconic";
  if (basePriceCr >= 6) return "elite";
  return "rising";
}

function attr(
  power: number,
  strategy: number,
  leadership: number,
  adaptability: number,
  endurance: number,
): CharacterAttributes {
  return { power, strategy, leadership, adaptability, endurance };
}

const fictional: Omit<GameCharacter, "rarity">[] = [
  {
    id: "f01",
    name: "Solar Sentinel",
    aura: "Dawn Beholder",
    categoryId: "fictional",
    role: "Anchor",
    basePriceCr: 12,
    attributes: attr(88, 71, 92, 64, 90),
    flavor:
      "Holds the frontline and rallies the squad. Dealers pay a premium for certainty.",
  },
  {
    id: "f02",
    name: "Void Reaper",
    aura: "Eclipse Wraith",
    categoryId: "fictional",
    role: "Assassin",
    basePriceCr: 11,
    attributes: attr(94, 84, 42, 88, 58),
    flavor:
      "Highest raw power in the pool. Low endurance makes for a nervy opener.",
  },
  {
    id: "f03",
    name: "Crimson Aegis",
    aura: "Bulwark of Mars",
    categoryId: "fictional",
    role: "Tank",
    basePriceCr: 9,
    attributes: attr(76, 62, 78, 58, 96),
    flavor: "A wall that never clocks out. Sucks pressure out of every round.",
  },
  {
    id: "f04",
    name: "Tempest Queen",
    aura: "Stormfall Sovereign",
    categoryId: "fictional",
    role: "Vanguard",
    basePriceCr: 10,
    attributes: attr(84, 74, 82, 70, 76),
    flavor: "Commands the tempo of a fight from the first second.",
  },
  {
    id: "f05",
    name: "Null Herald",
    aura: "The Unwitnessed",
    categoryId: "fictional",
    role: "Trickster",
    basePriceCr: 7,
    attributes: attr(62, 95, 55, 90, 60),
    flavor: "Rewrites matchups. Strategy-first squads bid hard for this one.",
  },
  {
    id: "f06",
    name: "Obsidian Fist",
    aura: "Iron Verdict",
    categoryId: "fictional",
    role: "Brawler",
    basePriceCr: 6,
    attributes: attr(90, 44, 52, 66, 82),
    flavor: "Pure pressure. Needs a strategist around it to stay disciplined.",
  },
  {
    id: "f07",
    name: "Static Bloom",
    aura: "Voltage Garden",
    categoryId: "fictional",
    role: "Support",
    basePriceCr: 4,
    attributes: attr(48, 78, 74, 88, 56),
    flavor: "Enabler. Steals are common — underrated by price down buyers.",
  },
  {
    id: "f08",
    name: "Dusk Marshal",
    aura: "Twilight Command",
    categoryId: "fictional",
    role: "Captain",
    basePriceCr: 8,
    attributes: attr(58, 80, 97, 62, 72),
    flavor: "Best leadership stat in the pool. Leadership challenges orbit it.",
  },
  {
    id: "f09",
    name: "Velvet Viper",
    aura: "Serpentine Whisper",
    categoryId: "fictional",
    role: "Duelist",
    basePriceCr: 5,
    attributes: attr(70, 72, 44, 84, 62),
    flavor: "Adapts to any matchup — a Versatility sleeper at this price.",
  },
  {
    id: "f10",
    name: "Emberwright",
    aura: "Forge Eternal",
    categoryId: "fictional",
    role: "Forger",
    basePriceCr: 3,
    attributes: attr(52, 58, 66, 76, 70),
    flavor: "Balanced floor values with no weakness to exploit. Cheap depth.",
  },
];

const football: Omit<GameCharacter, "rarity">[] = [
  {
    id: "g01",
    name: "Luca Ferrante",
    aura: "The Maestro",
    categoryId: "football",
    role: "Num 10",
    basePriceCr: 10,
    attributes: attr(70, 94, 86, 72, 64),
    flavor: "Playmaker with an elite mind. Dictates the final third.",
  },
  {
    id: "g02",
    name: "Tarik Osei",
    aura: "Golden Boot",
    categoryId: "football",
    role: "Striker",
    basePriceCr: 11,
    attributes: attr(92, 68, 60, 78, 80),
    flavor: "Lethal finisher. Every Intelligence-War buyer debates one anyway.",
  },
  {
    id: "g03",
    name: "Ryo Segawa",
    aura: "Deep Line",
    categoryId: "football",
    role: "Anchor",
    basePriceCr: 7,
    attributes: attr(58, 88, 74, 70, 86),
    flavor: "Half-back timing. Makes dull matches winnable.",
  },
  {
    id: "g04",
    name: "Ivan Bogdanov",
    aura: "The Wall",
    categoryId: "football",
    role: "Centre Back",
    basePriceCr: 6,
    attributes: attr(82, 64, 78, 48, 94),
    flavor: "Endurance tank. Plays through anything short of a thunderstorm.",
  },
  {
    id: "g05",
    name: "Rey Solano",
    aura: "Wing Flash",
    categoryId: "football",
    role: "Winger",
    basePriceCr: 8,
    attributes: attr(74, 62, 42, 94, 72),
    flavor: "Highest adaptability in the football pool. Trouble for markers.",
  },
  {
    id: "g06",
    name: "Jonas Lindqvist",
    aura: "Sweeper Gloves",
    categoryId: "football",
    role: "Goalkeeper",
    basePriceCr: 5,
    attributes: attr(50, 84, 68, 66, 82),
    flavor: "Command-box presence. Undervalued outside Leadership gauntlets.",
  },
  {
    id: "g07",
    name: "Amara Diallo",
    aura: "Press Monster",
    categoryId: "football",
    role: "Presser",
    basePriceCr: 4,
    attributes: attr(68, 70, 54, 86, 88),
    flavor: "Sets traps for 90 minutes. Stamina is the selling point.",
  },
  {
    id: "g08",
    name: "Mateo Duarte",
    aura: "Set-Piece Architect",
    categoryId: "football",
    role: "Specialist",
    basePriceCr: 2,
    attributes: attr(60, 89, 50, 58, 62),
    flavor: "Strategy burst on a budget. Corners and free kicks are objectives.",
  },
  {
    id: "g09",
    name: "Kwame Boateng",
    aura: "Box Treadmill",
    categoryId: "football",
    role: "Box-to-box",
    basePriceCr: 3,
    attributes: attr(72, 66, 60, 74, 90),
    flavor: "Covers every blade of grass. Survival squads rate it quietly high.",
  },
  {
    id: "g10",
    name: "Nikolai Vranov",
    aura: "Iron Shoulders",
    categoryId: "football",
    role: "Target Forward",
    basePriceCr: 9,
    attributes: attr(88, 56, 70, 52, 76),
    flavor: "Aerial bully. Power concentration makes price tags climb fast.",
  },
];

const cricket: Omit<GameCharacter, "rarity">[] = [
  {
    id: "c01",
    name: "Arjun Verma",
    aura: "Silk Drive",
    categoryId: "cricket",
    role: "Batsman",
    basePriceCr: 10,
    attributes: attr(74, 92, 88, 76, 70),
    flavor: "Masterful timing and shot selection. Strategy auctions centre it.",
  },
  {
    id: "c02",
    name: "Zafar Rizvi",
    aura: "The Wiper",
    categoryId: "cricket",
    role: "Spinner",
    basePriceCr: 8,
    attributes: attr(64, 90, 72, 92, 62),
    flavor: "Reads everything. Adaptive minds never leave the top brackets.",
  },
  {
    id: "c03",
    name: "Rohan Menon",
    aura: "Death Overs",
    categoryId: "cricket",
    role: "Finisher",
    basePriceCr: 9,
    attributes: attr(94, 58, 48, 82, 74),
    flavor: "Zero hesitation at the death. Power buys tension on the floor.",
  },
  {
    id: "c04",
    name: "Kunal Bhatt",
    aura: "Ledger Keeper",
    categoryId: "cricket",
    role: "Wicketkeeper",
    basePriceCr: 4,
    attributes: attr(48, 86, 80, 70, 78),
    flavor: "Talks batters into mistakes. Cheap leadership weight.",
  },
  {
    id: "c05",
    name: "Dev Rana",
    aura: "New Ball Artist",
    categoryId: "cricket",
    role: "Seam Bowler",
    basePriceCr: 7,
    attributes: attr(84, 72, 56, 68, 84),
    flavor: "Power play specialist. Early wickets swing Survival matches.",
  },
  {
    id: "c06",
    name: "Yash Nair",
    aura: "Centurion Habit",
    categoryId: "cricket",
    role: "Batsman",
    basePriceCr: 11,
    attributes: attr(78, 84, 74, 62, 96),
    flavor: "Bats for days. Survival challenges hand it the floor.",
  },
  {
    id: "c07",
    name: "Peter Okonkwo",
    aura: "Yorker Machine",
    categoryId: "cricket",
    role: "Strike Bowler",
    basePriceCr: 6,
    attributes: attr(90, 52, 62, 58, 88),
    flavor: "Sends the stumps into the stands. Control comes from others.",
  },
  {
    id: "c08",
    name: "Toa Whitlock",
    aura: "Captain Steady",
    categoryId: "cricket",
    role: "Captain",
    basePriceCr: 9,
    attributes: attr(60, 78, 96, 72, 68),
    flavor: "Field placements are chess. Leadership weight gravitates here.",
  },
  {
    id: "c09",
    name: "Ishaan Pillai",
    aura: "Golden Arm",
    categoryId: "cricket",
    role: "Utility",
    basePriceCr: 2,
    attributes: attr(62, 68, 64, 88, 74),
    flavor: "Swiss-army role. Versatility buyers circle it late.",
  },
  {
    id: "c10",
    name: "Aslam Sheikh",
    aura: "Middle Overs Iron",
    categoryId: "cricket",
    role: "Allrounder",
    basePriceCr: 3,
    attributes: attr(70, 74, 70, 72, 72),
    flavor: "No holes in the profile, no fireworks either. Depth bid.",
  },
];

/**
 * Demo fixture roster — placeholder entities for interface development only.
 * Production entity data ships with the backend integration.
 */
export const demoCharacters: readonly GameCharacter[] = [
  ...fictional,
  ...football,
  ...cricket,
].map((character) => ({
  ...character,
  rarity: rarityForBasePrice(character.basePriceCr),
}));

export const characterIndex: ReadonlyMap<string, GameCharacter> = new Map(
  demoCharacters.map((character) => [character.id, character]),
);

export function characterById(characterId: string): GameCharacter {
  const entry = characterIndex.get(characterId);
  if (!entry) {
    throw new Error(`Unknown demo character: ${characterId}`);
  }
  return entry;
}
