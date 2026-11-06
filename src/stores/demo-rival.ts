"use client";

import { characterById } from "@/lib/demo/characters";
import { challengeById } from "@/lib/demo/challenges";
import { LOT_INCREMENT_CR, SQUAD_SIZE, TURN_TIMER_MS, useDemoMatch } from "@/stores/demo-match";
import type { DemoMatch } from "@/types";

/**
 * Scripted rival driver for the local demo match. Bids with a noisy valuation
 * of each lot and respects a wallet reserve so it behaves like a cautious
 * operator carrying a five-slot plan. Purely client-side simulation.
 */

const RESERVE_PER_OPEN_SLOT_CR = 3;
const SPIKE_CHANCE = 0.18;

function rivalValuation(match: DemoMatch, characterId: string): number {
  const character = characterById(characterId);
  const challenge = challengeById(match.challengeId ?? "ultimate-squad");

  let score = 0;
  let weightSum = 0;
  SUPPORTED_ATTRIBUTE_KEYS.forEach((key) => {
    score += challenge.weights[key]! * character.attributes[key]!;
    weightSum += challenge.weights[key]!;
  });
  const weighted = weightSum === 0 ? 0 : score / weightSum;

  const noise = ((match.seed ^ characterId.length) % 1000) / 1000;
  return character.basePriceCr + weighted * 0.22 + noise * 2.4;
}

const SUPPORTED_ATTRIBUTE_KEYS = [
  "power",
  "strategy",
  "leadership",
  "adaptability",
  "endurance",
] as const;

function rivalSpike(match: DemoMatch): number {
  const roll = ((match.seed + Date.now()) % 97) / 97;
  return roll < SPIKE_CHANCE ? 2 : 0;
}

function rivalReserve(match: DemoMatch): number {
  const openSlots = Math.max(0, SQUAD_SIZE - match.players.rival.squad.length);
  return Math.max(0, openSlots - 1) * RESERVE_PER_OPEN_SLOT_CR;
}

export function rivalWantsToBid(match: DemoMatch): boolean {
  if (match.turn !== "rival" || match.lotStage !== "ACTIVE") return false;
  if (match.lotLeader === "rival") return false;
  const characterId = match.lotOrder[match.lotIndex];
  if (!characterId) return false;

  const amount = match.lotLeader
    ? match.currentBidCr + LOT_INCREMENT_CR
    : characterById(characterId).basePriceCr;

  const valuation = rivalValuation(match, characterId) + rivalSpike(match);
  const reserve = rivalReserve(match);
  const wallet = match.players.rival.walletCr;

  return (
    wallet >= amount && amount <= valuation && wallet - amount >= reserve
  );
}

const driver = {
  timer: null as null | ReturnType<typeof setTimeout>,
};

export function cancelRivalTurn(): void {
  if (driver.timer !== null) {
    clearTimeout(driver.timer);
    driver.timer = null;
  }
}

export function scheduleRivalTurn(): void {
  cancelRivalTurn();

  const match = useDemoMatch.getState().match;
  if (!match || match.phase !== "AUCTION_ACTIVE") return;
  if (match.lotStage !== "ACTIVE" || match.turn !== "rival") return;

  const observedLotIndex = match.lotIndex;
  const observedMatchId = match.matchId;

  const remainingMs = Math.max(0, match.turnEndsAt - Date.now());
  const delay =
    remainingMs <= 1400
      ? Math.max(400, remainingMs - 300)
      : 700 + (remainingMs / TURN_TIMER_MS) * 2600;

  driver.timer = setTimeout(() => {
    driver.timer = null;
    const state = useDemoMatch.getState();
    const current = state.match;
    if (
      !current ||
      current.matchId !== observedMatchId ||
      current.lotStage !== "ACTIVE" ||
      current.lotIndex !== observedLotIndex ||
      current.turn !== "rival"
    ) {
      return;
    }

    if (rivalWantsToBid(current)) {
      state.bid("rival");
    } else {
      state.pass("rival");
    }
  }, Math.max(500, delay));
}
