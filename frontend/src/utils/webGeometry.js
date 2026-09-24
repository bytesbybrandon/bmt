export const HUB = { x: 0.5, y: 0.46 };
export const SPOKES = 28;
export const RINGS = 15;

export const spokeAngle = (i) => -Math.PI / 2 + (i * Math.PI * 2) / SPOKES;

export function getWebMetrics(w, h) {
  const cx = HUB.x * w;
  const cy = HUB.y * h;
  const maxR =
    Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.02;
  const r0 = Math.max(54, Math.min(w, h) * 0.085);
  const q = Math.pow((maxR * 0.94) / r0, 1 / (RINGS - 1));
  const rings = Array.from({ length: RINGS }, (_, i) => r0 * Math.pow(q, i));
  return { w, h, cx, cy, maxR, r0, rings };
}

export const DROPS = [
  { id: "about", label: "About", angle: -135, dist: 0.48 },
  { id: "projects", label: "Projects", angle: -45, dist: 0.52 },
  { id: "timeline", label: "Timeline", angle: 35, dist: 0.5 },
  { id: "skills", label: "Skills", angle: 140, dist: 0.46 },
  { id: "contact", label: "Contact", angle: -90, dist: 0.38 },
  { id: "blog", label: "Blog", angle: 90, dist: 0.44 },
];

export function dropletPosition(metrics, angleDeg, frac) {
  const target = frac * metrics.maxR;
  let radius = metrics.rings[0];
  for (const r of metrics.rings) {
    if (Math.abs(r - target) < Math.abs(radius - target)) radius = r;
  }
  const a = (angleDeg * Math.PI) / 180;
  return {
    x: metrics.cx + Math.cos(a) * radius,
    y: metrics.cy + Math.sin(a) * radius,
  };
}

export function buildWebGeometry(metrics) {
  const { cx, cy, maxR, rings } = metrics;
  const verts = [];
  const push = (x, y, dx, dy, seed, kind, dup) => {
    const r = Math.hypot(x - cx, y - cy) / maxR;
    verts.push(x, y, dx, dy, seed, r, kind, dup);
  };
  const segment = (pA, pB, dirA, dirB, seed, kind) => {
    push(pA.x, pA.y, dirA[0], dirA[1], seed, kind, 0);
    push(pB.x, pB.y, dirB[0], dirB[1], seed, kind, 0);
    push(pA.x, pA.y, dirA[0], dirA[1], seed, kind, 1);
    push(pB.x, pB.y, dirB[0], dirB[1], seed, kind, 1);
  };
  const spokePt = (i, r) => {
    const a = spokeAngle(i);
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, a };
  };

  const steps = 26;
  for (let i = 0; i < SPOKES; i++) {
    let prev = spokePt(i, 0);
    for (let s = 1; s <= steps; s++) {
      const cur = spokePt(i, (s / steps) * maxR);
      const dir = [-Math.sin(cur.a), Math.cos(cur.a)];
      segment(prev, cur, dir, dir, i, 0);
      prev = cur;
    }
  }

  const SUB = 4;
  for (let k = 0; k < rings.length; k++) {
    const rk = rings[k];
    for (let i = 1; i <= SPOKES; i++) {
      const p1 = spokePt(i - 1, rk);
      const p2 = spokePt(i, rk);
      const am = spokeAngle(i - 0.5);
      const rm = rk * 0.962;
      const ctrl = { x: cx + Math.cos(am) * rm, y: cy + Math.sin(am) * rm };
      let prev = p1;
      for (let s = 1; s <= SUB; s++) {
        const t = s / SUB;
        const mt = 1 - t;
        const x = mt * mt * p1.x + 2 * mt * t * ctrl.x + t * t * p2.x;
        const y = mt * mt * p1.y + 2 * mt * t * ctrl.y + t * t * p2.y;
        const cur = { x, y };
        const dirOf = (p) => {
          const a = Math.atan2(p.y - cy, p.x - cx);
          return [-Math.sin(a), Math.cos(a)];
        };
        segment(prev, cur, dirOf(prev), dirOf(cur), k * 7 + i, 1);
        prev = cur;
      }
    }
  }
  return new Float32Array(verts);
}
