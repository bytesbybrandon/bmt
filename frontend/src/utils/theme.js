import { useSyncExternalStore } from "react";

const KEY = "sanctum-theme";
let mode = "auto";
try {
  mode = localStorage.getItem(KEY) || "auto";
} catch {
  /* private mode */
}

const listeners = new Set();
let phase = computePhase();
let dew = dewLevel();
let timer = null;

function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function computePhase(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60;
  return smoothstep(6, 9, h) * (1 - smoothstep(17, 20, h));
}

export function getPhase() {
  return mode === "day" ? 1 : mode === "night" ? 0 : phase;
}

export function dewLevel(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60;
  if (h >= 5 && h < 7) return 0.75 + smoothstep(5, 7, h) * 0.25;
  if (h >= 7 && h < 12) return 1 - smoothstep(7, 12, h) * 0.65;
  if (h >= 12 && h < 21) return 0.35;
  return 0.75;
}

export function getDew() {
  return mode === "night" ? 0.75 : mode === "day" ? 0.35 : dew;
}

const SOUTHERN_HINTS = [
  "australia", "sydney", "melbourne", "perth", "brisbane", "adelaide",
  "hobart", "darwin", "auckland", "wellington", "christchurch", "chatham",
  "lord_howe", "antarctica", "santiago", "sao_paulo", "argentina",
  "buenos_aires", "montevideo", "asuncion", "johannesburg", "cape_town",
  "harare", "lusaka", "maputo", "windhoek", "gaborone", "port_moresby",
  "fiji", "guadalcanal", "noumea", "tongatapu", "apia",
];

export function isSouthern() {
  try {
    const tz = (
      Intl.DateTimeFormat().resolvedOptions().timeZone || ""
    ).toLowerCase();
    return SOUTHERN_HINTS.some((r) => tz.includes(r));
  } catch {
    return false;
  }
}

export function getSeason(date = new Date()) {
  const m = date.getMonth();
  let idx = Math.floor(((m + 1) % 12) / 3);
  if (isSouthern()) idx = (idx + 2) % 4;
  const seasons = [
    { name: "Winter", tint: [150, 190, 255], strength: 0.06 },
    { name: "Spring", tint: [140, 205, 150], strength: 0.05 },
    { name: "Summer", tint: [190, 215, 120], strength: 0.05 },
    { name: "Autumn", tint: [224, 140, 60], strength: 0.07 },
  ];
  return seasons[idx];
}

export function cycleTheme() {
  mode = mode === "auto" ? "night" : mode === "night" ? "day" : "auto";
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* private mode */
  }
  apply();
  notify();
}

function mixBg(p) {
  const night = [5, 7, 9];
  const dusk = [64, 42, 34];
  const day = [234, 229, 217];
  const c =
    p < 0.5
      ? night.map((n, i) => Math.round(n + (dusk[i] - n) * (p * 2)))
      : dusk.map((n, i) => Math.round(n + (day[i] - n) * ((p - 0.5) * 2)));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function apply() {
  const p = getPhase();
  document.documentElement.dataset.theme = p > 0.5 ? "day" : "night";
  document.documentElement.style.setProperty("--day", p.toFixed(3));
  document.documentElement.style.setProperty("--dew", getDew().toFixed(3));
  document.body.style.backgroundColor = mixBg(p);
}

function notify() {
  listeners.forEach((l) => l());
}

export function initTheme() {
  phase = computePhase();
  dew = dewLevel();
  apply();
  if (!timer) {
    timer = window.setInterval(() => {
      if (mode !== "auto") return;
      const np = computePhase();
      const nd = dewLevel();
      if (Math.abs(np - phase) > 0.001 || Math.abs(nd - dew) > 0.005) {
        phase = np;
        dew = nd;
        apply();
        notify();
      }
    }, 60000);
  }
}

export function useTheme() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => `${mode}:${getPhase().toFixed(3)}:${getDew().toFixed(3)}`
  );
}
