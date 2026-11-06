"use client";

import { useEffect, useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { effect, note } from "./tone";

export type SoundCue =
  | "ui-hover"
  | "ui-confirm"
  | "bid-accept"
  | "bid-fail"
  | "turn-start"
  | "countdown-tense"
  | "lot-open"
  | "sold"
  | "unsold"
  | "win"
  | "loss";

interface SoundStore {
  enabled: boolean;
  hydrated: boolean;
  hydrate: () => void;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
  play: (cue: SoundCue) => void;
}

const STORAGE_KEY = "clashbid-sound";

/**
 * Tiny WebAudio blip synth. Sound is OFF until the user enables it, the
 * preference persists across visits, and cues degrade to no-ops when the
 * AudioContext is unavailable.
 */
export const useSound = create<SoundStore>()(
  persist(
    (set, get) => ({
      enabled: false,
      hydrated: false,
      hydrate: () => {
        if (typeof window === "undefined") return;
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (raw !== null) {
            set({ enabled: JSON.parse(raw) === true, hydrated: true });
          } else {
            set({ hydrated: true });
          }
        } catch {
          set({ hydrated: true });
        }
      },
      setEnabled: (enabled) => set({ enabled }),
      toggle: () => set({ enabled: !get().enabled }),
      play: (cue) => {
        if (!get().enabled || typeof window === "undefined") return;
        try {
          switch (cue) {
            case "ui-hover":
              note("C5", 0.05, 0.02, "triangle", 0.09);
              break;
            case "ui-confirm":
              note("E5", 0.09, 0.03, "triangle", 0.12);
              break;
            case "bid-accept":
              effect([
                ["A4", 0.07, 0, "square", 0.11],
                ["D5", 0.11, 0.06, "square", 0.13],
                ["F#5", 0.16, 0.13, "triangle", 0.1],
              ]);
              break;
            case "bid-fail":
              note("D4", 0.14, 0.02, "sawtooth", 0.08);
              break;
            case "turn-start":
              note("C4", 0.08, 0.02, "sine", 0.07);
              break;
            case "countdown-tense":
              note("E4", 0.06, 0.01, "square", 0.09);
              break;
            case "lot-open":
              effect([
                ["G4", 0.09, 0, "sine", 0.08],
                ["C5", 0.12, 0.08, "sine", 0.08],
              ]);
              break;
            case "sold":
              effect([
                ["C5", 0.14, 0, "square", 0.13],
                ["G5", 0.14, 0.1, "square", 0.13],
                ["E5", 0.2, 0.2, "triangle", 0.12],
              ]);
              break;
            case "unsold":
              effect([
                ["A4", 0.13, 0, "sine", 0.08],
                ["C4", 0.2, 0.1, "sine", 0.08],
              ]);
              break;
            case "win":
              effect([
                ["C5", 0.16, 0, "triangle", 0.12],
                ["E5", 0.16, 0.12, "triangle", 0.12],
                ["G5", 0.16, 0.24, "triangle", 0.12],
                ["C6", 0.34, 0.36, "triangle", 0.13],
              ]);
              break;
            case "loss":
              effect([
                ["E4", 0.2, 0, "sine", 0.09],
                ["B3", 0.26, 0.14, "sine", 0.09],
              ]);
              break;
          }
        } catch {
          // AudioContext unavailability must never break the interface.
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ enabled: state.enabled }),
    },
  ),
);

const hasMounted = { current: false };

/** Hydration-safe read: false during SSR/first render, real value afterward. */
export function useSoundEnabled(): boolean {
  const subscribe = useSound.subscribe;
  const enabled = useSyncExternalStore(
    subscribe,
    () => (hasMounted.current ? useSound.getState().enabled : false),
    () => false,
  );

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      useSound.getState().hydrate();
    }
  }, []);

  return enabled;
}
