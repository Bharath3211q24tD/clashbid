"use client";

let ctx: AudioContext | null = null;

function audioContext(): AudioContext | null {
  if (ctx) return ctx;
  const win = window as typeof window & {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  const Ctor = win.AudioContext ?? win.webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
    return ctx;
  } catch {
    return null;
  }
}

type Wave = OscillatorType;

const NOTE_FREQ: Record<string, number> = {
  A3: 220, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25,
  "F#5": 739.99, G5: 783.99, A5: 880, C6: 1046.5,
};

function schedule(
  specs: ([string, number, number, Wave, number])[],
): void {
  const context = audioContext();
  if (!context) return;
  const t0 = context.currentTime;
  specs.forEach(([name, duration, phaseGap, type, gain]) => {
    const freq = NOTE_FREQ[name];
    if (!freq) return;
    osc(context, t0 + phaseGap, duration, freq, type, gain);
  });
}

export function note(
  name: string,
  duration: number,
  phaseGap: number,
  type: Wave,
  gain: number,
): void {
  schedule([[name, duration, phaseGap, type, gain]]);
}

export function effect(specs: ([string, number, number, Wave, number])[]): void {
  schedule(specs);
}

export function osc(
  context: AudioContext,
  start: number,
  duration: number,
  freq: number,
  type: Wave,
  gainValue: number,
): void {
  const oscNode = context.createOscillator();
  const gain = context.createGain();
  const slide = context.createGain();
  slide.gain.value = 0.6;

  oscNode.type = type;
  oscNode.frequency.setValueAtTime(freq, start);
  oscNode.frequency.exponentialRampToValueAtTime(freq * 1.01, start + duration);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscNode.connect(slide).connect(gain).connect(context.destination);
  oscNode.start(start);
  oscNode.stop(start + duration + 0.05);
}
