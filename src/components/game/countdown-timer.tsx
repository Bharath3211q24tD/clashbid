"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { useSound } from "@/stores/sound";

interface CountdownTimerProps {
  /** Absolute epoch ms when the current turn expires (server-clocked). */
  turnEndsAt: number;
  totalMs: number;
  /** Fires once when the clock reaches zero. */
  onExpire: () => void;
  active: boolean;
  className?: string;
}

type TimerTone = "normal" | "warning" | "critical";

export function CountdownTimer({
  turnEndsAt,
  totalMs,
  onExpire,
  active,
  className,
}: CountdownTimerProps) {
  const remainingMs = useRemaining(turnEndsAt, active);
  const sound = useSound((state) => state.play);
  const firedRef = useRef(false);
  const toneRef = useRef<TimerTone>("normal");

  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const ratio = Math.max(0, Math.min(1, remainingMs / totalMs));

  const tone: TimerTone =
    seconds <= 2 ? "critical" : seconds <= 5 && seconds > 0 ? "warning" : "normal";

  useEffect(() => {
    firedRef.current = false;
    toneRef.current = "normal";
  }, [turnEndsAt]);

  useEffect(() => {
    if (!active) return;
    if (seconds <= 0) {
      if (!firedRef.current) {
        firedRef.current = true;
        onExpire();
      }
      return;
    }
    if (tone !== "normal" && tone !== toneRef.current) {
      toneRef.current = tone;
      sound("countdown-tense");
    }
  }, [active, seconds, tone, onExpire, sound]);

  return (
    <div
      className={cn("relative", className)}
      role="timer"
      aria-label={`Countdown ${seconds} seconds remaining`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p
          aria-hidden="true"
          className="font-display text-[0.625rem] font-semibold tracking-[0.22em] text-subtle uppercase"
        >
          Turn clock
        </p>
        <p
          className={cn(
            "font-display text-3xl leading-none font-bold tabular-nums transition-colors duration-200",
            tone === "normal" && "text-foreground",
            tone === "warning" && "text-gold-bright",
            tone === "critical" && "text-danger",
          )}
        >
          {String(seconds).padStart(2, "0")}
          <span className="ml-1 text-xs tracking-[0.2em] text-subtle uppercase">sec</span>
        </p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-white/[0.06]">
        <div
          className={cn(
            "h-full rounded-pill will-change-[width]",
            tone === "normal" && "bg-gradient-to-r from-gold-deep to-gold duration-300 ease-linear",
            tone === "warning" && "bg-gradient-to-r from-gold to-gold-bright duration-100 ease-linear",
            tone === "critical" && "bg-danger duration-100 ease-linear",
          )}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <span aria-hidden="true" className="sr-only">
        {seconds > 0
          ? `${seconds} seconds remaining`
          : "Time expired"}
      </span>
    </div>
  );
}

function useRemaining(turnEndsAt: number, active: boolean): number {
  const read = () => Math.floor(Math.max(0, turnEndsAt - Date.now()));
  return useSyncExternalStore(
    useCallback(
      (notify) => {
        if (!active) return () => undefined;
        const handle = window.setInterval(notify, 100);
        return () => window.clearInterval(handle);
      },
    [active],
    ),
    read,
    () => Math.max(0, turnEndsAt - Date.now()),
  );
}
