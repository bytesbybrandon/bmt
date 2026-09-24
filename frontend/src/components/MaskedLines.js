import { motion } from "framer-motion";

export const MaskedLines = ({ lines, delay = 0.1, className = "" }) => (
  <div className={className}>
    {lines.map((line, i) => (
      <div key={i} className="overflow-hidden">
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          transition={{
            duration: 0.9,
            delay: delay + i * 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={line.className}
        >
          {line.text}
        </motion.div>
      </div>
    ))}
  </div>
);
