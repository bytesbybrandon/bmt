import { motion } from "framer-motion";
import { ReturnDropletButton } from "./ReturnDropletButton";
import { MaskedLines } from "./MaskedLines";

const pageVariants = {
  initial: { opacity: 0, scale: 0.985, y: 14 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    y: -12,
    transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] },
  },
};

export const PageShell = ({ eyebrow, titleLines, children, onBack, testid }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="relative z-10 min-h-screen"
    data-testid={testid}
  >
    <ReturnDropletButton onClick={onBack} />
    <div className="fixed right-6 top-8 z-40 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400 md:right-10">
      {eyebrow}
    </div>
    <main className="mx-auto w-full max-w-6xl px-6 pb-32 pt-32 md:px-10 md:pt-40">
      <MaskedLines lines={titleLines} />
      {children}
    </main>
  </motion.div>
);
