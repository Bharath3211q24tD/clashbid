"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  characterById,
  demoCharacters,
} from "@/lib/demo/characters";
import { challengeById, challengeCatalog } from "@/lib/demo/challenges";
import {
  ATTRIBUTE_LABELS,
  RARITY_LABELS,
  SUPPORTED_ATTRIBUTE_IDS,
} from "@/lib/demo/attributes";
import type {
  AuctionLogEntry,
  BattleEvaluation,
  DemoMatch,
  EvaluationCategory,
  GameCharacter,
  LotOutcome,
  PlayerId,
} from "@/types";

export const TURN_TIMER_MS = 15_000;
export const RESOLUTION_FALLBACK_MS = 6_000;
export const LOT_INCREMENT_CR = 1;
export const SQUAD_SIZE = 5;
const GAME_WALLET_CR = 100;
const LOG_LIMIT = 120;

export interface DemoMatchStore {
  match: DemoMatch | null;
  resolutionStartedAt: number | null;

  createMatch: () => string;
  abandonMatch: () => void;
  startAuction: () => void;
  openNextLot: () => void;
  bid: (playerId: PlayerId) => { ok: boolean; reason?: string };
  pass: (playerId: PlayerId, kind?: "pass" | "timeout") => { ok: boolean; reason?: string };
  tickTimeout: (now?: number) => void;
  acknowledgeResolution: () => "advanced" | "auction-complete" | "idle";
  runBattle: () => void;
  rematch: () => string;
}

type LocalSet = (
  partial:
    | DemoMatchStore
    | Partial<DemoMatchStore>
    | ((state: DemoMatchStore) => DemoMatchStore | Partial<DemoMatchStore>),
) => void;

type LocalGet = () => DemoMatchStore;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeMatchId(now: number): string {
  return `demo-${now.toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

function shuffledLotOrder(seed: number): string[] {
  const rand = mulberry32(seed);
  const ids = demoCharacters.map((character) => character.id);
  for (let i = ids.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const a = ids[i]!;
    ids[i] = ids[j]!;
    ids[j] = a;
  }
  return ids;
}

function makeLogEntry(
  match: DemoMatch,
  kind: AuctionLogEntry["kind"],
  playerId: PlayerId | null,
  message: string,
  amountCr?: number,
): AuctionLogEntry {
  return {
    id: match.log.length + 1,
    lotIndex: match.lotIndex,
    at: Date.now(),
    kind,
    playerId,
    amountCr,
    message,
  };
}

function appendLog(match: DemoMatch, entry: AuctionLogEntry): AuctionLogEntry[] {
  return [...match.log.slice(-(LOG_LIMIT - 1)), entry];
}

function currentLotOf(match: DemoMatch): {
  character: GameCharacter;
  index: number;
} {
  const characterId = match.lotOrder[match.lotIndex];
  if (!characterId) {
    throw new Error("No active lot");
  }
  return { character: characterById(characterId), index: match.lotIndex };
}

function effectiveBid(match: DemoMatch, character: GameCharacter): number {
  return match.lotLeader
    ? match.currentBidCr + LOT_INCREMENT_CR
    : character.basePriceCr;
}

function patchMatch(
  set: LocalSet,
  match: DemoMatch,
): void {
  set({ match });
}

/* ------------------------------------------------------------------ */
/* Store                                                               */

export const useDemoMatch = create<DemoMatchStore>()(
  persist<DemoMatchStore, [], [], { match: DemoMatch | null }>(
    (set, get): DemoMatchStore => {
      const openNextLot = (): void => {
        const match = get().match;
        if (!match || match.phase !== "AUCTION_ACTIVE") return;

        const nextIndex = match.lotIndex + 1;
        const squadsFull =
          match.players.you.squad.length >= SQUAD_SIZE &&
          match.players.rival.squad.length >= SQUAD_SIZE;

        if (nextIndex >= match.lotOrder.length || squadsFull) {
          finishAuction(set, get);
          return;
        }

        const now = Date.now();
        const turn: PlayerId = nextIndex % 2 === 0 ? "rival" : "you";
        const character = characterById(match.lotOrder[nextIndex]!);
        const entry = makeLogEntry(
          { ...match, lotIndex: nextIndex },
          "lot-open",
          null,
          `Lot ${nextIndex + 1} opens — ${character.name} (${character.basePriceCr} Cr base)`,
        );

        patchMatch(set, {
          ...match,
          lotStage: "ACTIVE",
          lotIndex: nextIndex,
          lotOutcome: null,
          lotLeader: null,
          currentBidCr: 0,
          lotOpenedAt: now,
          turnEndsAt: now + TURN_TIMER_MS,
          turn,
          passFlags: { you: false, rival: false },
          log: appendLog(match, entry),
        });
      };

      const commitBid = (match: DemoMatch, playerId: PlayerId) => {
        const { character } = currentLotOf(match);
        const amount = effectiveBid(match, character);
        if (match.players[playerId].walletCr < amount) {
          return { ok: false as const, reason: "Insufficient wallet" };
        }

        const players = { ...match.players };
        if (match.lotLeader && match.lotLeader !== playerId) {
          players[match.lotLeader] = {
            ...players[match.lotLeader]!,
            walletCr: players[match.lotLeader]!.walletCr + match.currentBidCr,
          };
        }
        players[playerId] = {
          ...players[playerId]!,
          walletCr: players[playerId]!.walletCr - amount,
        };

        const entry = makeLogEntry(
          match,
          "bid",
          playerId,
          `${players[playerId]!.handle} bids ${amount} Cr`,
          amount,
        );

        const startedAt = Date.now();
        patchMatch(set, {
          ...match,
          lotLeader: playerId,
          currentBidCr: amount,
          players,
          passFlags: { you: false, rival: false },
          turn: playerId === "you" ? "rival" : "you",
          turnEndsAt: startedAt + TURN_TIMER_MS,
          log: appendLog(match, entry),
        });
        return { ok: true as const };
      };

      const commitPass = (
        match: DemoMatch,
        playerId: PlayerId,
        kind: "pass" | "timeout",
      ) => {
        const passFlags = { ...match.passFlags, [playerId]: true };
        const bothPassedNoLeader =
          !match.lotLeader && passFlags.you === true && passFlags.rival === true;

        const message =
          kind === "timeout"
            ? `${match.players[playerId].handle} let the clock run out`
            : `${match.players[playerId].handle} passed`;

        const base: DemoMatch = {
          ...match,
          passFlags,
          log: appendLog(match, makeLogEntry(match, kind, playerId, message)),
        };

        if (bothPassedNoLeader) {
          resolveLot(set, { ...get(), match: base }, "unsold", null);
          return { ok: true as const };
        }

        if (match.lotLeader && match.lotLeader !== playerId) {
          resolveLot(set, { ...get(), match: base }, "sold", match.lotLeader);
          return { ok: true as const };
        }

        patchMatch(set, {
          ...base,
          turn: playerId === "you" ? "rival" : "you",
        });
        return { ok: true as const };
      };

      return {
        match: null,
        resolutionStartedAt: null,

        createMatch: () => {
          const now = Date.now();
          const seed = (now ^ Math.floor(now * 0.618 * 1000)) >>> 0;
          const rand = mulberry32(seed ^ 0x9e3779b9);
          const challenge =
            challengeCatalog[Math.floor(rand() * challengeCatalog.length)]!;

          const makePlayer = (id: PlayerId, handle: string) => ({
            id,
            handle,
            walletCr: GAME_WALLET_CR,
            squad: [] satisfies DemoMatch["players"]["you"]["squad"],
          });

          const match: DemoMatch = {
            matchId: makeMatchId(now),
            createdAt: now,
            seed,
            phase: "CHALLENGE_SELECTION",
            challengeId: challenge.id,
            lotOrder: shuffledLotOrder(seed),
            lotStage: "PENDING",
            lotIndex: -1,
            lotOutcome: null,
            lotLeader: null,
            currentBidCr: 0,
            lotOpenedAt: now,
            turnEndsAt: 0,
            turn: "rival",
            turnTimerMs: TURN_TIMER_MS,
            passFlags: { you: false, rival: false },
            players: {
              you: makePlayer("you", "You"),
              rival: makePlayer("rival", "Sim Rival"),
            },
            log: [],
            evaluation: null,
            soldCount: 0,
            unsoldCount: 0,
          };

          set({ match, resolutionStartedAt: null });
          return match.matchId;
        },

        abandonMatch: () => {
          const match = get().match;
          if (!match) return;
          set({
            resolutionStartedAt: null,
            match: { ...match, phase: "CANCELLED", lotStage: "RESOLVED", turnEndsAt: 0 },
          });
        },

        startAuction: () => {
          const match = get().match;
          if (!match || match.phase !== "CHALLENGE_SELECTION") return;
          patchMatch(set, { ...match, phase: "AUCTION_ACTIVE" });
          openNextLot();
        },

        openNextLot,

        bid: (playerId) => {
          const match = get().match;
          if (!match || match.phase !== "AUCTION_ACTIVE") {
            return { ok: false, reason: "No live lot" };
          }
          if (match.lotStage !== "ACTIVE" || match.turn !== playerId) {
            return { ok: false, reason: "Not your turn" };
          }
          if (match.lotLeader === playerId) {
            return { ok: false, reason: "Already the leading bidder" };
          }
          return commitBid(match, playerId);
        },

        pass: (playerId, kind = "pass") => {
          const match = get().match;
          if (!match || match.phase !== "AUCTION_ACTIVE") {
            return { ok: false, reason: "No live lot" };
          }
          if (match.lotStage !== "ACTIVE" || match.turn !== playerId) {
            return { ok: false, reason: "Not your turn" };
          }
          return commitPass(match, playerId, kind);
        },

        tickTimeout: (nowArg?: number) => {
          const now = nowArg ?? Date.now();
          const match = get().match;
          if (!match || match.phase !== "AUCTION_ACTIVE") return;
          if (match.lotStage !== "ACTIVE") return;
          if (now < match.turnEndsAt) return;
          get().pass(match.turn, "timeout");
        },

        acknowledgeResolution: () => {
          const match = get().match;
          if (!match || match.phase !== "AUCTION_ACTIVE") return "idle";
          if (match.lotStage !== "RESOLVING") return "idle";
          set({ resolutionStartedAt: null });
          openNextLot();
          return "advanced";
        },

        runBattle: () => {
          const match = get().match;
          if (!match || match.phase !== "AUCTION_COMPLETED") return;
          if (match.evaluation) {
            set({ match: { ...match, phase: "COMPLETED" } });
            return;
          }
          const evaluation = evaluateBattle(match);
          set({
            resolutionStartedAt: null,
            match: { ...match, evaluation, phase: "COMPLETED" },
          });
        },

        rematch: () => {
          get().abandonMatch();
          return get().createMatch();
        },
      };
    },
    {
      name: "clashbid-demo-match",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ match: state.match }),
    },
  ),
);

/* ------------------------------------------------------------------ */
/* Lot resolution                                                      */

function resolveLot(
  set: LocalSet,
  state: DemoMatchStore,
  outcome: LotOutcome,
  winner: PlayerId | null,
): void {
  const match = state.match;
  if (!match || match.lotStage !== "ACTIVE") return;

  const { character } = currentLotOf(match);
  const now = Date.now();
  let players = match.players;
  let log = match.log;
  let soldCount = match.soldCount;
  let unsoldCount = match.unsoldCount;

  if (outcome === "sold" && winner) {
    const amount = match.currentBidCr;
    players = {
      ...players,
      [winner]: {
        ...players[winner]!,
        squad: [...players[winner]!.squad, { characterId: character.id, priceCr: amount }],
      },
    } as DemoMatch["players"];
    soldCount += 1;
    log = appendLog(
      match,
      makeLogEntry(
        match,
        "sold",
        winner,
        `${match.players[winner].handle} won ${character.name} for ${amount} Cr`,
        amount,
      ),
    );
  } else {
    if (match.lotLeader) {
      players = {
        ...players,
        [match.lotLeader]: {
          ...players[match.lotLeader]!,
          walletCr: players[match.lotLeader]!.walletCr + match.currentBidCr,
        },
      } as DemoMatch["players"];
    }
    unsoldCount += 1;
    log = appendLog(
      match,
      makeLogEntry(match, "unsold", null, `${character.name} went unsold`),
    );
  }

  set({
    resolutionStartedAt: now,
    match: {
      ...match,
      players,
      log,
      soldCount,
      unsoldCount,
      lotStage: "RESOLVING",
      lotOutcome: outcome,
      turnEndsAt: now + RESOLUTION_FALLBACK_MS,
    },
  });
}

function finishAuction(set: LocalSet, get: LocalGet): void {
  const match = get().match;
  if (!match) return;
  set({
    match: {
      ...match,
      lotStage: "RESOLVED",
      phase: "AUCTION_COMPLETED",
      turnEndsAt: 0,
    },
  });
}

/* ------------------------------------------------------------------ */
/* Deterministic battle evaluation (demo scoring engine)               */

const SCORING_VERSION = "demo-eval-1.0";

function weightedScore(
  attributes: Record<string, number>,
  weights: Record<string, number>,
): number {
  let total = 0;
  let weightSum = 0;
  SUPPORTED_ATTRIBUTE_IDS.forEach((key) => {
    total += weights[key]! * attributes[key]!;
    weightSum += weights[key]!;
  });
  return weightSum === 0 ? 0 : total / weightSum;
}

function diversityBonus(squad: { characterId: string }[]): number {
  const categories = new Set<string>();
  const roles = new Set<string>();
  squad.forEach((entry) => {
    const character = characterById(entry.characterId);
    categories.add(character.categoryId);
    roles.add(character.role);
  });
  return categories.size * 2.2 + roles.size * 1.4;
}

export function evaluateBattle(match: DemoMatch): BattleEvaluation {
  const challenge = challengeById(match.challengeId ?? "ultimate-squad");
  const weights = challenge.weights;

  const categories: EvaluationCategory[] = SUPPORTED_ATTRIBUTE_IDS.map(
    (attributeId) => {
      const average = (playerId: PlayerId): number => {
        const squad = match.players[playerId].squad;
        if (squad.length === 0) return 0;
        return (
          squad.reduce(
            (sum, entry) =>
              sum + characterById(entry.characterId).attributes[attributeId]!,
            0,
          ) / squad.length
        );
      };
      return {
        attributeId,
        weight: weights[attributeId]!,
        you: Math.round(average("you")),
        rival: Math.round(average("rival")),
      };
    },
  );

  const slotScore = (playerId: PlayerId): number[] =>
    match.players[playerId].squad.map((entry) =>
      weightedScore(
        characterById(entry.characterId).attributes,
        weights,
      ),
    );

  const individualOf = (playerId: PlayerId): number => {
    const scores = slotScore(playerId);
    if (scores.length === 0) return 0;
    return Math.floor(
      scores.reduce((sum, value) => sum + value, 0) / scores.length,
    );
  };

  const balanceOf = (playerId: PlayerId): number => {
    const scores = slotScore(playerId);
    if (scores.length === 0) return 0;
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance =
      scores.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      scores.length;
    const stdDev = Math.sqrt(variance);
    return Math.round((1 - Math.min(1, stdDev / 25)) * 15);
  };

  const individual = { you: individualOf("you"), rival: individualOf("rival") };
  const balance = { you: balanceOf("you"), rival: balanceOf("rival") };
  const synergy = {
    you:
      Math.round(Math.min(10, diversityBonus(match.players.you.squad))) +
      (match.players.you.squad.length === SQUAD_SIZE ? 2 : 0),
    rival:
      Math.round(Math.min(10, diversityBonus(match.players.rival.squad))) +
      (match.players.rival.squad.length === SQUAD_SIZE ? 2 : 0),
  };
  const final = {
    you: individual.you + balance.you + synergy.you,
    rival: individual.rival + balance.rival + synergy.rival,
  };

  const diff = final.you - final.rival;
  const magnitude =
    Math.abs(diff) >= 10 ? 12 : Math.abs(diff) >= 4 ? 7 : Math.abs(diff) >= 1 ? 3 : 0;
  const ratingDelta = {
    you: diff === 0 ? 0 : diff > 0 ? magnitude : -magnitude,
    rival: diff === 0 ? 0 : diff > 0 ? -magnitude : magnitude,
  };

  return {
    scoringVersion: SCORING_VERSION,
    challengeId: challenge.id,
    categories,
    individual,
    balance,
    synergy,
    final,
    ratingDelta,
  };
}

export function battleExplanation(evaluation: BattleEvaluation): string {
  const youWon = evaluation.final.you >= evaluation.final.rival;
  const winnerLabel = youWon ? "Your squad" : "The rival squad";
  const loserLabel = youWon ? "the rival squad" : "your squad";
  const decisive = [...evaluation.categories]
    .filter((category) => category.weight >= 20)
    .sort(
      (a, b) => Math.abs(b.you - b.rival) - Math.abs(a.you - a.rival),
    );
  const top = decisive[0];

  if (!top || Math.abs(top.you - top.rival) < 2) {
    return `${winnerLabel} edged ${loserLabel} on squad balance and synergy — the attribute race finished nearly level.`;
  }

  const attributeName = ATTRIBUTE_LABELS[top.attributeId];
  if ((top.you > top.rival) === youWon) {
    return `${winnerLabel} outperformed ${loserLabel} in ${attributeName} (${top.you} vs ${top.rival}) — the weight that decided this challenge.`;
  }
  return `${winnerLabel} took the match despite ${loserLabel} holding stronger ${attributeName} (${top.you} vs ${top.rival}) — balance and coverage carried the result.`;
}

export { RARITY_LABELS };
