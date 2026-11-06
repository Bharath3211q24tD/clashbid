"use client";

import { useEffect } from "react";
import { Volume, VolumeOff } from "@/components/ui/icons";
import { useSound, useSoundEnabled } from "@/stores/sound";

/**
 * Persistent mute control. Audio stays OFF until the player enables it, per
 * the motion-and-sound policy (no autoplayed loud audio). The preference
 * survives reloads via localStorage.
 */
export function SoundToggle() {
  const enabled = useSoundEnabled();
  const toggle = useSound((state) => state.toggle);
  const play = useSound((state) => state.play);

  useEffect(() => {
    if (enabled) {
      play("ui-confirm");
    }
  }, [enabled, play]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Disable sound effects" : "Enable sound effects"}
      title={enabled ? "Sound on" : "Sound off"}
      className="flex size-11 items-center justify-center rounded-control border border-line bg-white/[0.03] text-muted transition-colors hover:border-line-gold hover:text-gold-bright"
    >
      {enabled ? <Volume className="size-5" /> : <VolumeOff className="size-5" />}
    </button>
  );
}
