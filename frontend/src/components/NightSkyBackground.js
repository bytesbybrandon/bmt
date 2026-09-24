import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { getPhase, getSeason, useTheme } from "@/utils/theme";
import { getWebMetrics } from "@/utils/webGeometry";

export const NightSkyBackground = () => {
  const dustRef = useRef(null);
  const theme = useTheme();
  const phase = parseFloat(theme.split(":")[1]);
  const mx = useSpring(useMotionValue(0), { stiffness: 28, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 28, damping: 20 });

  useEffect(() => {
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 26);
      my.set((e.clientY / window.innerHeight - 0.5) * 18);
    };
    window.addEventListener("mousemove", onMove);

    const canvas = dustRef.current;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1;
    const motes = [];
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 42; i++) {
      motes.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.4 + Math.random() * 1.1,
        p: Math.random() * Math.PI * 2,
        s: 0.00003 + Math.random() * 0.00008,
        dx: (Math.random() - 0.5) * 0.00002,
      });
    }
    const season = getSeason().name;
    let metricsCache = null;
    const webM = () => {
      if (!metricsCache || metricsCache.w !== w || metricsCache.h !== h) {
        metricsCache = getWebMetrics(w, h);
      }
      return metricsCache;
    };
    const flakes = [];
    const flakeCount = season === "Summer" ? 14 : 20;
    const assignCatch = (f) => {
      f.willCatch = season === "Autumn" && Math.random() < 0.25;
      if (f.willCatch) {
        const m = webM();
        const a = Math.random() * Math.PI * 2;
        const rk =
          m.rings[Math.floor((0.3 + Math.random() * 0.45) * m.rings.length)];
        f.tx = (m.cx + Math.cos(a) * rk) / w;
        f.ty = (m.cy + Math.sin(a) * rk) / h;
        if (f.ty < f.y + 0.08) f.willCatch = false;
      }
    };
    for (let i = 0; i < flakeCount; i++) {
      const f = {
        x: Math.random(),
        y: Math.random(),
        r: 1 + Math.random() * 2.2,
        vy: 0.00012 + Math.random() * 0.00025,
        sway: 0.6 + Math.random() * 1.4,
        p: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.03,
      };
      assignCatch(f);
      flakes.push(f);
    }

    let raf;
    const draw = (t) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const p = getPhase();
      const cr = Math.round(215 - 175 * p);
      const cg = Math.round(232 - 182 * p);
      const cb = Math.round(255 - 185 * p);
      for (const mote of motes) {
        mote.x += mote.dx;
        mote.y -= mote.s;
        if (mote.y < -0.02) mote.y = 1.02;
        if (mote.x < -0.02) mote.x = 1.02;
        if (mote.x > 1.02) mote.x = -0.02;
        const a = 0.1 + 0.3 * (0.5 + 0.5 * Math.sin(t * 0.0009 + mote.p));
        ctx.beginPath();
        ctx.arc(mote.x * w, mote.y * h, mote.r, 0, 7);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${a * 0.5})`;
        ctx.fill();
      }

      const dim = 1 - p * 0.45;
      for (const f of flakes) {
        const fx = f.x * w;
        const fy = f.y * h;
        if (season === "Winter") {
          f.y += f.vy;
          f.x += Math.sin(t * 0.0008 * f.sway + f.p) * 0.0003;
          if (f.y > 1.02) { f.y = -0.02; f.x = Math.random(); }
          ctx.beginPath();
          ctx.arc(fx, fy, f.r * 0.8, 0, 7);
          ctx.fillStyle = `rgba(235, 243, 255, ${(0.35 + 0.3 * (0.5 + 0.5 * Math.sin(t * 0.001 + f.p))) * dim})`;
          ctx.fill();
        } else if (season === "Autumn") {
          if (f.state === "stuck") {
            const age = (t - f.stuckAt) / 1000;
            f.rot = f.baseRot + Math.sin(t * 0.03) * 0.35;
            if (age > f.stuckFor) {
              f.state = "fall";
              f.willCatch = false;
            }
          } else {
            f.y += f.vy * 1.2;
            f.rot += f.vr;
            if (f.willCatch && f.tx !== undefined) {
              const dy = f.ty - f.y;
              if (dy < 0.15 && dy > 0) f.x += (f.tx - f.x) * 0.035;
              if (f.y >= f.ty) {
                f.state = "stuck";
                f.stuckAt = t;
                f.stuckFor = 1.6 + Math.random() * 1.8;
                f.x = f.tx;
                f.y = f.ty;
                f.baseRot = f.rot;
                window.dispatchEvent(
                  new CustomEvent("leaf-land", {
                    detail: { x: f.tx * w, y: f.ty * h },
                  })
                );
              }
            } else {
              f.x += Math.sin(t * 0.0011 * f.sway + f.p) * 0.0006;
            }
            if (f.y > 1.04) {
              f.y = -0.04;
              f.x = Math.random();
              assignCatch(f);
            }
          }
          const tremble =
            f.state === "stuck" ? Math.sin(t * 0.025 + f.p) * 0.0012 : 0;
          ctx.save();
          ctx.translate(f.x * w, (f.y + tremble) * h);
          ctx.rotate(f.rot);
          ctx.beginPath();
          ctx.ellipse(0, 0, f.r * 1.7, f.r * 0.9, 0, 0, 7);
          ctx.fillStyle = `rgba(${f.p > Math.PI ? "224, 140, 60" : "168, 96, 40"}, ${0.4 * dim})`;
          ctx.fill();
          ctx.restore();
        } else if (season === "Spring") {
          f.y -= f.vy * 0.35;
          f.x += 0.0002 * Math.sin(t * 0.0009 + f.p) + 0.00008;
          if (f.y < -0.02) { f.y = 1.02; f.x = Math.random(); }
          if (f.x > 1.02) f.x = -0.02;
          ctx.beginPath();
          ctx.arc(fx, fy, f.r * 0.45, 0, 7);
          ctx.fillStyle = `rgba(205, 232, 170, ${(0.3 + 0.3 * (0.5 + 0.5 * Math.sin(t * 0.0014 + f.p))) * dim})`;
          ctx.fill();
        } else {
          f.x += Math.sin(t * 0.0004 * f.sway + f.p) * 0.0005;
          f.y += Math.cos(t * 0.0003 * f.sway + f.p) * 0.0004;
          if (f.x < -0.02) f.x = 1.02;
          if (f.x > 1.02) f.x = -0.02;
          if (f.y < -0.02) f.y = 1.02;
          if (f.y > 1.02) f.y = -0.02;
          const blink = Math.max(0, Math.sin(t * 0.002 + f.p)) ** 2;
          ctx.beginPath();
          ctx.arc(fx, fy, f.r * 0.6, 0, 7);
          ctx.fillStyle = `rgba(255, 200, 110, ${blink * 0.75 * (1 - p * 0.75)})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [mx, my]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" data-testid="night-sky">
      <motion.img
        src="/assets/night-bg.png"
        alt=""
        style={{ x: mx, y: my, scale: 1.08, opacity: 0.7 - phase * 0.4 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <motion.img
        src="/assets/day-bg.png"
        alt=""
        style={{ x: mx, y: my, scale: 1.08, opacity: phase * 0.95 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: 1 - phase,
          background:
            "radial-gradient(120% 90% at 78% 12%, rgba(190, 215, 255, 0.07) 0%, transparent 45%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: phase,
          background:
            "radial-gradient(120% 90% at 78% 10%, rgba(255, 244, 214, 0.35) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: Math.sin(phase * Math.PI),
          background:
            "radial-gradient(110% 85% at 78% 18%, rgba(255, 170, 92, 0.3) 0%, transparent 55%), linear-gradient(rgba(255, 150, 80, 0.06), rgba(255, 150, 80, 0.06))",
        }}
      />
      <div
        className="absolute inset-0"
        data-testid="season-cast"
        style={{
          opacity: getSeason().strength * (1 - phase * 0.4),
          background: `rgba(${getSeason().tint.join(", ")}, 1)`,
        }}
      />
      <canvas ref={dustRef} className="absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          opacity: 1 - phase * 0.75,
          background:
            "radial-gradient(130% 130% at 50% 45%, transparent 52%, rgba(2, 4, 7, 0.72) 100%)",
        }}
      />
    </div>
  );
};
