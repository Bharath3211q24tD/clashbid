export type EntityCategoryId = "fictional" | "football" | "cricket";

export type RarityTier = "iconic" | "elite" | "rising";

export type AttributeId =
  | "power"
  | "strategy"
  | "leadership"
  | "adaptability"
  | "endurance";

export type CharacterAttributes = Record<AttributeId, number>;

export interface EntityCategory {
  id: EntityCategoryId;
  label: string;
  kicker: string;
  description: string;
}

export interface GameCharacter {
  id: string;
  // Placeholder identity. Production entity data ships with backend content.
  name: string;
  aura: string;
  categoryId: EntityCategoryId;
  role: string;
  rarity: RarityTier;
  basePriceCr: number;
  attributes: CharacterAttributes;
  flavor: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  emphasis: string;
  weights: Record<AttributeId, number>;
}

export type PlayerId = "you" | "rival";

export type MatchPhase =
  | "idle"
  | "MATCHED"
  | "CHALLENGE_SELECTION"
  | "AUCTION_ACTIVE"
  | "AUCTION_COMPLETED"
  | "BATTLE_PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export type LotStage = "PENDING" | "ACTIVE" | "RESOLVING" | "RESOLVED";

export type LotOutcome = "sold" | "unsold";

export interface AuctionLogEntry {
  id: number;
  lotIndex: number;
  at: number;
  kind: "bid" | "pass" | "timeout" | "lot-open" | "sold" | "unsold";
  playerId: PlayerId | null;
  amountCr?: number;
  message: string;
}

export interface SquadEntry {
  characterId: string;
  priceCr: number;
}

export interface PlayerState {
  id: PlayerId;
  handle: string;
  walletCr: number;
  squad: SquadEntry[];
}

export interface EvaluationCategory {
  attributeId: AttributeId;
  weight: number;
  you: number;
  rival: number;
}

export interface BattleEvaluation {
  scoringVersion: string;
  challengeId: string;
  categories: EvaluationCategory[];
  individual: { you: number; rival: number };
  balance: { you: number; rival: number };
  synergy: { you: number; rival: number };
  final: { you: number; rival: number };
  ratingDelta: { you: number; rival: number };
}

export interface DemoMatch {
  matchId: string;
  createdAt: number;
  seed: number;
  phase: MatchPhase;
  challengeId: string | null;
  lotOrder: string[];
  lotStage: LotStage;
  lotIndex: number;
  lotOutcome: LotOutcome | null;
  lotLeader: PlayerId | null;
  currentBidCr: number;
  lotOpenedAt: number;
  turnEndsAt: number;
  turn: PlayerId;
  turnTimerMs: number;
  passFlags: Record<PlayerId, boolean>;
  players: Record<PlayerId, PlayerState>;
  log: AuctionLogEntry[];
  evaluation: BattleEvaluation | null;
  soldCount: number;
  unsoldCount: number;
}
