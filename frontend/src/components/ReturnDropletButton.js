import { motion } from "framer-motion";

export const ReturnDropletButton = ({ onClick }) => (
  <motion.button
    data-testid="btn-return-to-web"
    type="button"
    onClick={onClick}
    className="group fixed left-6 top-6 z-50 flex items-center gap-3 md:left-10 md:top-8"
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4, duration: 0.5 }}
  >
    <span className="droplet block h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-150" />
    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400 transition-colors duration-300 group-hover:text-amber-200">
      Return to Web
    </span>
  </motion.button>
);
