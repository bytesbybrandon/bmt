import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Download } from "lucide-react";
import { PageShell } from "../PageShell";
import { TIMELINE, EDUCATION } from "@/data/content";
import { downloadDossier } from "@/utils/generateDossierPdf";

const visitedCocoons = new Set();

function Descent() {
  const strandRef = useRef(null);
  const [h, setH] = useState(0);

  useEffect(() => {
    const el = strandRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    setH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: strandRef,
    offset: ["start 0.65", "end 0.6"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [0, Math.max(h - 60, 0)]);
  const y = useSpring(raw, { stiffness: 80, damping: 22 });
  const lineH = useTransform(y, (v) => v + 10);

  return (
    <div
      ref={strandRef}
      className="relative pl-16 md:pl-32"
      data-testid="timeline-strand-container"
    >
      <div className="absolute bottom-0 left-6 top-0 w-px bg-white/[0.07] md:left-20" />
      <motion.div
        className="absolute left-6 top-0 w-px md:left-20"
        style={{
          height: lineH,
          background:
            "linear-gradient(180deg, var(--silk-a), var(--silk-b))",
          boxShadow: "0 0 10px rgba(190,225,255,.25)",
        }}
      />
      <motion.div
        className="absolute left-6 top-0 z-10 md:left-20"
        style={{ y, x: "-50%" }}
        data-testid="timeline-spider"
      >
        <motion.img
          src="/assets/spider-cut.png"
          alt=""
          className="h-16 w-16 object-contain md:h-24 md:w-24"
          style={{ filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.7))" }}
          animate={{ rotate: [177, 183, 177] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="space-y-28 py-16 md:space-y-36">
        {TIMELINE.map((item, i) => (
          <motion.article
            key={item.company}
            data-testid={`timeline-item-${i}`}
            initial={{ opacity: 0.15, x: 24, filter: "blur(2px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ margin: "-32% 0px -32% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <motion.span
              data-testid={`timeline-cocoon-${i}`}
              className="absolute -left-10 top-0 block h-[38px] w-[26px] -translate-x-1/2 md:-left-12"
              initial={
                visitedCocoons.has(i)
                  ? { opacity: 1, scale: 1, rotate: 0, filter: "drop-shadow(0 0 9px rgba(244, 178, 102, 0.5))" }
                  : { opacity: 0.35, scale: 0.85, rotate: -2, filter: "drop-shadow(0 0 0px rgba(244, 178, 102, 0))" }
              }
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: 2,
                filter: "drop-shadow(0 0 9px rgba(244, 178, 102, 0.5))",
              }}
              viewport={{ once: true, margin: "-32% 0px -32% 0px" }}
              onViewportEnter={() => visitedCocoons.add(i)}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.svg
                viewBox="0 0 26 38"
                className="h-full w-full"
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <ellipse
                  cx="13"
                  cy="19"
                  rx="8"
                  ry="14"
                  fill="rgba(190, 215, 240, 0.07)"
                  stroke="var(--silk-cocoon)"
                  strokeWidth="0.9"
                />
                {[8, 12, 16, 20, 24, 28].map((y) => (
                  <path
                    key={y}
                    d={`M6 ${y} Q13 ${y + 3} 20 ${y}`}
                    fill="none"
                    stroke="var(--silk-cocoon)"
                    strokeWidth="0.55"
                    opacity="0.7"
                  />
                ))}
                <path
                  d="M13 2 L13 6"
                  stroke="var(--silk-cocoon)"
                  strokeWidth="0.7"
                />
              </motion.svg>
            </motion.span>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
              {item.tenure}
            </p>
            <h3 className="mt-3 font-display text-2xl font-light text-neutral-100 sm:text-3xl">
              {item.role}
            </h3>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
              {item.company}
            </p>
            <p className="mt-5 max-w-xl text-sm font-light leading-relaxed text-neutral-400 sm:text-base">
              {item.impact}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {item.stack.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200/70"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Dossier() {
  return (
    <div data-testid="timeline-dossier">
      {TIMELINE.map((item, i) => (
        <motion.div
          key={item.company}
          data-testid={`dossier-item-${i}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
          className="grid gap-2 border-t border-white/10 py-6 last:border-b md:grid-cols-12 md:items-baseline"
        >
          <span className="font-mono text-[10px] tracking-[0.25em] text-amber-200/70 md:col-span-2">
            {item.tenure}
          </span>
          <span className="font-display text-lg font-light text-neutral-200 md:col-span-4">
            {item.role}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 md:col-span-3">
            {item.company}
          </span>
          <span className="text-xs font-light leading-relaxed text-neutral-400 md:col-span-3">
            {item.impact}
          </span>
        </motion.div>
      ))}
      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
        <button
          type="button"
          data-testid="btn-download-dossier"
          onClick={downloadDossier}
          className="group flex items-center gap-3 rounded-full border border-amber-200/50 bg-amber-200/5 px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-100 transition-colors duration-300 hover:bg-amber-200/10"
        >
          <Download className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          Download PDF Dossier
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
          {EDUCATION.degree} · {EDUCATION.school} · {EDUCATION.years}
        </p>
      </div>
    </div>
  );
}

export default function TimelineView({ onBack }) {
  const [mode, setMode] = useState("descent");

  return (
    <PageShell
      testid="timeline-view"
      eyebrow="03 — Silk Timeline"
      onBack={onBack}
      titleLines={[
        {
          text: "Descending Silk",
          className:
            "font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-100",
        },
        {
          text: "Six long tenures, one unbroken thread.",
          className:
            "mt-5 max-w-xl text-sm sm:text-base font-light leading-relaxed text-neutral-400",
        },
      ]}
    >
      <div className="mb-16 mt-12 flex gap-3" data-testid="timeline-view-toggle">
        {[
          { id: "descent", label: "Silk Descent" },
          { id: "dossier", label: "Dossier" },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            data-testid={`timeline-mode-${m.id}`}
            onClick={() => setMode(m.id)}
            className={`rounded-full border px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] transition-[color,border-color,background-color] duration-300 ${
              mode === m.id
                ? "border-amber-200/50 bg-amber-200/5 text-amber-100"
                : "border-white/10 text-neutral-400 hover:border-white/25 hover:text-neutral-300"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "descent" ? <Descent /> : <Dossier />}
    </PageShell>
  );
}
