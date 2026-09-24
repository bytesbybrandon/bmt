import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const OrbWeaverSpider = ({
  hub,
  size,
  pounce,
  reducedMotion,
  quick = false,
  spinKey,
}) => {
  const rotateMV = useMotionValue(0);
  const rotate = useSpring(rotateMV, { stiffness: 45, damping: 16 });
  const glintX = useSpring(useMotionValue(0), { stiffness: 70, damping: 18 });
  const glintY = useSpring(useMotionValue(0), { stiffness: 70, damping: 18 });

  useEffect(() => {
    const onMove = (e) => {
      const px = pounce ? pounce.x : hub.x;
      const py = pounce ? pounce.y : hub.y;
      const rad = Math.atan2(e.clientY - py, e.clientX - px);
      let deg = (rad * 180) / Math.PI + 90;
      deg = ((deg + 540) % 360) - 180;
      rotateMV.set(Math.max(-14, Math.min(14, deg * 0.14)));
      glintX.set(Math.cos(rad) * 3.5);
      glintY.set(Math.sin(rad) * 3.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [hub, pounce, rotateMV, glintX, glintY]);

  useEffect(() => {
    if (pounce) {
      const rad = Math.atan2(pounce.y - hub.y, pounce.x - hub.x);
      let deg = (rad * 180) / Math.PI + 90;
      deg = ((deg + 540) % 360) - 180;
      rotateMV.set(deg * 0.9);
    }
  }, [pounce, hub, rotateMV]);

  useEffect(() => {
    if (spinKey) {
      rotateMV.set(rotateMV.get() + 360);
    }
  }, [spinKey, rotateMV]);

  const pos = pounce || hub;

  return (
    <motion.div
      data-testid="orb-weaver-spider"
      className="pointer-events-none absolute left-0 top-0 z-20"
      style={{ width: size, height: size }}
      initial={{ x: hub.x - size / 2, y: hub.y - size / 2, opacity: 0 }}
      animate={{
        x: pos.x - size / 2,
        y: pos.y - size / 2,
        opacity: 1,
        scale: pounce ? [1, 1.16, 1] : 1,
      }}
      transition={
        pounce
          ? { duration: 0.42, ease: [0.85, 0, 0.15, 1] }
          : {
              opacity: { duration: quick ? 0.4 : 1.4, delay: quick ? 0.1 : 0.7 },
              x: { type: "spring", stiffness: 120, damping: 22 },
              y: { type: "spring", stiffness: 120, damping: 22 },
            }
      }
    >
      <motion.div style={{ rotate }} className="relative h-full w-full">
        <motion.img
          src="/assets/spider-cut.png"
          alt="Orb weaver spider"
          draggable="false"
          className="h-full w-full select-none object-contain"
          style={{
            filter:
              "drop-shadow(0 18px 30px rgba(0,0,0,0.75)) saturate(1.05) contrast(1.06)",
          }}
          animate={reducedMotion ? {} : { scale: [1, 1.015, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          style={{ x: glintX, y: glintY }}
          className="absolute left-[47%] top-[45%] h-1.5 w-1.5 rounded-full bg-white/80 blur-[1px]"
        />
        <motion.span
          style={{ x: glintX, y: glintY }}
          className="absolute left-[52%] top-[45%] h-1 w-1 rounded-full bg-amber-200/70 blur-[1px]"
        />
      </motion.div>
    </motion.div>
  );
};
