import { motion } from "framer-motion";
import { Moon, Sun, SunMoon } from "lucide-react";
import { cycleTheme, useTheme } from "@/utils/theme";

const ICONS = { night: Moon, day: Sun, auto: SunMoon };
const LABELS = { night: "Night", day: "Day", auto: "Auto Sky" };

export const ThemeToggle = () => {
  const theme = useTheme();
  const mode = theme.split(":")[0];
  const Icon = ICONS[mode] || SunMoon;

  return (
    <motion.button
      data-testid="theme-toggle"
      type="button"
      onClick={cycleTheme}
      aria-label={`Theme mode: ${LABELS[mode]}. Click to change.`}
      className="group fixed bottom-[4.75rem] right-6 z-[60] flex items-center gap-3 md:bottom-[5.5rem] md:right-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.6 }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400 transition-colors duration-300 group-hover:text-amber-200">
        {LABELS[mode]}
      </span>
      <span className="droplet relative flex h-8 w-8 items-center justify-center transition-transform duration-300 group-hover:scale-110">
        <Icon className="relative z-10 h-3.5 w-3.5 text-neutral-300" />
      </span>
    </motion.button>
  );
};
