import { useEffect, useRef } from "react";
import { getWebMetrics, SPOKES, spokeAngle } from "@/utils/webGeometry";
import { getPhase } from "@/utils/theme";

export const SpiderWebCanvas = ({
  cursorRef,
  joltRef,
  onMetrics,
  reducedMotion,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const metricsRef = { current: null };
    let w = 0, h = 0, dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      metricsRef.current = getWebMetrics(w, h);
      onMetrics?.(metricsRef.current);
    };
    resize();
    window.addEventListener("resize", resize);

    const swayAmp = reducedMotion ? 0.9 : 3.2;

    const threadOffset = (t, seed, r, maxR, boost) => {
      const base = Math.sin(t * 0.0012 + seed * 0.63 + r * 0.004) * swayAmp * (r / maxR);
      const joltAge = joltRef.current ? (t - joltRef.current) / 1000 : 99;
      const elastic = Math.exp(-3 * joltAge) * Math.cos(12 * joltAge);
      const j = elastic * 14 * (r / maxR) * Math.sin(seed * 2 + r * 0.02);
      const vib = reducedMotion
        ? 0
        : Math.sin(t * 0.055 + seed * 3.1 + r * 0.05) * 2.4 * boost;
      return base + j + vib;
    };

    let raf;
    const draw = (t) => {
      const m = metricsRef.current;
      if (m) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        const { cx, cy, maxR, rings } = m;
        const cursor = cursorRef.current || { x: -9999, y: -9999 };
        const cd = Math.hypot(cursor.x - cx, cursor.y - cy);
        const dp = getPhase();
        const thread = (a) =>
          dp > 0.5
            ? `rgba(38, 46, 60, ${Math.min(1, a * 1.9)})`
            : `rgba(225, 238, 255, ${a})`;

        ctx.lineWidth = 1;
        const steps = 26;
        for (let i = 0; i < SPOKES; i++) {
          const a = spokeAngle(i);
          const cos = Math.cos(a);
          const sin = Math.sin(a);
          ctx.beginPath();
          for (let s = 0; s <= steps; s++) {
            const r = (s / steps) * maxR;
            const pxs = cx + cos * r;
            const pys = cy + sin * r;
            const pd = Math.hypot(cursor.x - pxs, cursor.y - pys);
            const boost = Math.max(0, 1 - pd / 150);
            const off = threadOffset(t, i, r, maxR, boost);
            const ox = -sin * off;
            const oy = cos * off;
            if (s === 0) ctx.moveTo(pxs, pys);
            else ctx.lineTo(pxs + ox, pys + oy);
          }
          ctx.strokeStyle = thread(0.1);
          ctx.stroke();
        }

        for (let k = 0; k < rings.length; k++) {
          const rk = rings[k];
          const ringBoost = Math.max(0, 1 - Math.abs(cd - rk) / 140);
          ctx.beginPath();
          for (let i = 0; i <= SPOKES; i++) {
            const a1 = spokeAngle(i);
            const off1 = threadOffset(t, k * 7 + i, rk, maxR, ringBoost);
            const p1x = cx + Math.cos(a1) * rk - Math.sin(a1) * off1;
            const p1y = cy + Math.sin(a1) * rk + Math.cos(a1) * off1;
            if (i === 0) {
              ctx.moveTo(p1x, p1y);
              continue;
            }
            const am = spokeAngle(i - 0.5);
            const rm = rk * 0.962;
            const offm = threadOffset(t, k * 7 + i - 0.5, rm, maxR, ringBoost);
            const cmx = cx + Math.cos(am) * rm - Math.sin(am) * offm;
            const cmy = cy + Math.sin(am) * rm + Math.cos(am) * offm;
            ctx.quadraticCurveTo(cmx, cmy, p1x, p1y);
          }
          const near = 1 - rk / maxR;
          ctx.strokeStyle = thread(0.065 + near * 0.085 + ringBoost * 0.14);
          ctx.lineWidth = ringBoost > 0.25 ? 1.15 : 0.8;
          ctx.stroke();
        }

        if (dp <= 0.5) {
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
          g.addColorStop(0, "rgba(200, 225, 255, 0.05)");
          g.addColorStop(1, "rgba(200, 225, 255, 0)");
          ctx.fillStyle = g;
          ctx.fillRect(cx - 90, cy - 90, 180, 180);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [cursorRef, joltRef, onMetrics, reducedMotion]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0" data-testid="web-canvas" />
  );
};
