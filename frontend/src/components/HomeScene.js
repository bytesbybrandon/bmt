import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { SpiderWebGL } from "./SpiderWebGL";
import { OrbWeaverSpider } from "./OrbWeaverSpider";
import { DewdropNav } from "./DewdropNav";
import { MaskedLines } from "./MaskedLines";
import { playChime, playTick, playWhoosh } from "@/audio/soundscape";
import { getSeason } from "@/utils/theme";

export const HomeScene = ({ onNavigate, quick = false }) => {
  const [metrics, setMetrics] = useState(null);
  const [pounce, setPounce] = useState(null);
  const [burst, setBurst] = useState(null);
  const [wrap, setWrap] = useState(null);
  const cursorRef = useRef({ x: -9999, y: -9999 });
  const joltRef = useRef(0);
  const reduced = useReducedMotion();

  const px = useSpring(useMotionValue(0), { stiffness: 34, damping: 20 });
  const py = useSpring(useMotionValue(0), { stiffness: 34, damping: 20 });

  useEffect(() => {
    const onMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      px.set((e.clientX / window.innerWidth - 0.5) * -12);
      py.set((e.clientY / window.innerHeight - 0.5) * -8);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [px, py]);

  const handleMetrics = useCallback((m) => setMetrics(m), []);

  const timers = useRef([]);
  useEffect(
    () => () => timers.current.forEach((t) => window.clearTimeout(t)),
    []
  );
  const later = (fn, ms) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const handleSelect = (drop) => {
    if (pounce) return;
    if (reduced) {
      onNavigate(drop.id);
      return;
    }
    playChime(drop.index ?? 0);
    playWhoosh();
    setPounce(drop);
    later(() => {
      joltRef.current = performance.now();
      setWrap({ x: drop.x, y: drop.y, t: performance.now() });
      later(() => setBurst({ x: drop.x, y: drop.y }), 640);
      later(() => onNavigate(drop.id), 1020);
    }, 430);
  };

  const size = metrics
    ? Math.min(380, Math.max(200, Math.min(metrics.w, metrics.h) * 0.34))
    : 0;

  return (
    <motion.div
      data-testid="spider-web-stage"
      className="fixed inset-0 z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.55 } }}
    >
      <motion.div style={{ x: px, y: py }} className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: quick ? 0.5 : 1.8 }}
          className="absolute inset-0"
        >
          <SpiderWebGL
            cursorRef={cursorRef}
            joltRef={joltRef}
            onMetrics={handleMetrics}
            reducedMotion={reduced}
          />
        </motion.div>
        {metrics && (
          <>
            <OrbWeaverSpider
              hub={{ x: metrics.cx, y: metrics.cy }}
              size={size}
              pounce={pounce}
              reducedMotion={reduced}
              quick={quick}
              spinKey={wrap?.t}
            />
            <DewdropNav
              metrics={metrics}
              onSelect={handleSelect}
              onHover={playTick}
              struckId={pounce?.id}
              disabled={!!pounce}
              quick={quick}
            />
          </>
        )}
      </motion.div>

      {wrap && (
        <motion.svg
          key="silk-wrap"
          data-testid="silk-wrap"
          className="pointer-events-none absolute z-30"
          style={{ left: wrap.x - 40, top: wrap.y - 40 }}
          width="80"
          height="80"
          viewBox="0 0 80 80"
        >
          <motion.path
            d="M40 40 m0 -5 a5 5 0 1 1 -0.1 0 M40 40 m0 -12 a12 12 0 1 1 -0.1 0 M40 40 m0 -20 a20 20 0 1 1 -0.1 0 M40 40 m0 -29 a29 29 0 1 1 -0.1 0"
            fill="none"
            stroke="rgba(230, 242, 255, 0.8)"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 4px rgba(190, 230, 255, 0.6))" }}
            initial={{ pathLength: 0, opacity: 0.9 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.58, ease: "easeInOut" }}
          />
        </motion.svg>
      )}

      {burst && (
        <motion.span
          key="burst"
          data-testid="droplet-burst"
          className="pointer-events-none absolute z-40 rounded-full border"
          style={{
            left: burst.x,
            top: burst.y,
            x: "-50%",
            y: "-50%",
            borderColor: "rgba(190, 230, 255, 0.7)",
            boxShadow: "0 0 40px rgba(165, 230, 255, 0.35)",
          }}
          initial={{ width: 12, height: 12, opacity: 0.9 }}
          animate={{ width: 260, height: 260, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 z-50 flex flex-col justify-between p-6 md:p-10">
        <div className="flex items-start justify-between">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-[10px] uppercase tracking-[0.35em] text-amber-200/70"
          >
            The Weaver's Sanctum · {getSeason().name}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400"
          >
            Index / 05
          </motion.p>
        </div>
        <div className="flex items-end justify-between gap-6">
          <div>
            <MaskedLines
              delay={quick ? 0.15 : 0.9}
              lines={[
                {
                  text: "Brandon D. Phillips",
                  className:
                    "font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-100",
                },
              ]}
            />
            <MaskedLines
              delay={quick ? 0.3 : 1.15}
              lines={[
                {
                  text: "SYSTEMS ENGINEER · AI ARCHITECT · SIX TENURES · EST. 2008",
                  className:
                    "mt-3 font-mono text-[10px] sm:text-xs tracking-[0.3em] text-neutral-400",
                },
              ]}
            />
          </div>
          <motion.p
            data-testid="home-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: quick ? 0.5 : 1.8 }}
            className="mb-32 hidden max-w-[220px] text-right font-mono text-[10px] leading-relaxed tracking-[0.2em] text-neutral-400 md:block"
          >
            THE WEB HEARS EVERYTHING.
            <br />
            SELECT A DROPLET.
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};
