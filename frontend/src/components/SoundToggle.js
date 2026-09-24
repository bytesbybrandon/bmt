import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { getSoundPreference, setSoundEnabled } from "@/audio/soundscape";

export const SoundToggle = () => {
  const [on, setOn] = useState(getSoundPreference());

  const toggle = () => {
    const next = !on;
    setOn(next);
    setSoundEnabled(next);
  };

  return (
    <motion.button
      data-testid="sound-toggle"
      type="button"
      onClick={toggle}
      aria-label={on ? "Mute ambient sound" : "Enable ambient sound"}
      className="group fixed bottom-6 right-6 z-[60] flex items-center gap-3 md:bottom-8 md:right-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400 transition-colors duration-300 group-hover:text-amber-200">
        {on ? "Sound On" : "Sound Off"}
      </span>
      <span className="droplet relative flex h-8 w-8 items-center justify-center transition-transform duration-300 group-hover:scale-110">
        {on ? (
          <Volume2 className="relative z-10 h-3.5 w-3.5 text-amber-100" />
        ) : (
          <VolumeX className="relative z-10 h-3.5 w-3.5 text-neutral-300" />
        )}
      </span>
    </motion.button>
  );
};
