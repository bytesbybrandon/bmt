import { getPhase } from "@/utils/theme";

let ctx = null;
let master = null;
let droneNodes = null;
let delayNode = null;
let enabled = false;

const CHIME_FREQS = [660, 587.33, 880, 783.99, 1046.5];

function duskWarmth() {
  const p = getPhase();
  const dusk = 1 - Math.abs(1 - 2 * p);
  return { mult: 1 - dusk * 0.16, stretch: dusk * 0.5, soften: dusk * 0.03 };
}

function ensureCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noiseBuffer(c, seconds = 2) {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buf;
}

function startDrone() {
  const c = ensureCtx();
  const droneGain = c.createGain();
  droneGain.gain.value = 0.5;
  droneGain.connect(master);

  const mk = (freq, gainV) => {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = c.createGain();
    g.gain.value = gainV;
    osc.connect(g).connect(droneGain);
    osc.start();
    return osc;
  };
  const o1 = mk(54, 0.05);
  const o2 = mk(81.4, 0.035);
  const o3 = mk(108.7, 0.018);

  const swellLfo = c.createOscillator();
  swellLfo.frequency.value = 0.07;
  const swellDepth = c.createGain();
  swellDepth.gain.value = 0.02;
  swellLfo.connect(swellDepth).connect(droneGain.gain);
  swellLfo.start();

  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c);
  noise.loop = true;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 320;
  lp.Q.value = 0.4;
  const ng = c.createGain();
  ng.gain.value = 0.016;
  noise.connect(lp).connect(ng).connect(droneGain);
  noise.start();

  const windLfo = c.createOscillator();
  windLfo.frequency.value = 0.05;
  const windDepth = c.createGain();
  windDepth.gain.value = 0.008;
  windLfo.connect(windDepth).connect(ng.gain);
  windLfo.start();

  droneNodes = { o1, o2, o3, swellLfo, noise, windLfo, droneGain };
}

function stopDrone() {
  if (!droneNodes || !ctx) return;
  const nodes = droneNodes;
  droneNodes = null;
  nodes.droneGain.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
  window.setTimeout(() => {
    try {
      ["o1", "o2", "o3", "swellLfo", "noise", "windLfo"].forEach((k) =>
        nodes[k].stop()
      );
      nodes.droneGain.disconnect();
    } catch {
      /* already stopped */
    }
  }, 2200);
}

export function setSoundEnabled(on) {
  enabled = on;
  try {
    localStorage.setItem("sanctum-sound", on ? "1" : "0");
  } catch {
    /* private mode */
  }
  const c = ensureCtx();
  if (on) {
    if (!droneNodes) startDrone();
    master.gain.setTargetAtTime(1, c.currentTime, 0.8);
  } else {
    master.gain.setTargetAtTime(0, c.currentTime, 0.4);
  }
}

export function getSoundPreference() {
  try {
    return localStorage.getItem("sanctum-sound") === "1";
  } catch {
    return false;
  }
}

function getDelay(c) {
  if (!delayNode) {
    delayNode = c.createDelay(1);
    delayNode.delayTime.value = 0.28;
    const fb = c.createGain();
    fb.gain.value = 0.32;
    const wet = c.createGain();
    wet.gain.value = 0.35;
    delayNode.connect(fb).connect(delayNode);
    delayNode.connect(wet).connect(master);
  }
  return delayNode;
}

export function playChime(index = 0) {
  if (!enabled || !ctx) return;
  const c = ctx;
  const t = c.currentTime;
  const { mult, stretch, soften } = duskWarmth();
  const freq = CHIME_FREQS[index % CHIME_FREQS.length] * mult;
  const decay = 1.4 + stretch;
  [1, 2.01].forEach((m, i) => {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq * m;
    const g = c.createGain();
    const peak = (i === 0 ? 0.14 : 0.05) - soften;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0004, t + decay);
    osc.connect(g);
    g.connect(master);
    g.connect(getDelay(c));
    osc.start(t);
    osc.stop(t + decay + 0.1);
  });
}

export function playTick() {
  if (!enabled || !ctx) return;
  const c = ctx;
  const t = c.currentTime;
  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 1320 + Math.random() * 240;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.035, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0005, t + 0.22);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + 0.25);
}

export function playWhoosh() {
  if (!enabled || !ctx) return;
  const c = ctx;
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, 1);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 1.2;
  bp.frequency.setValueAtTime(380, t);
  bp.frequency.exponentialRampToValueAtTime(1900, t + 0.34);
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.16, t + 0.06);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
  src.connect(bp).connect(g).connect(master);
  src.start(t);
  src.stop(t + 0.5);
}
