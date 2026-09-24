import { motion } from "framer-motion";
import { PageShell } from "../PageShell";
import { ABOUT } from "@/data/content";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12% 0px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export default function AboutView({ onBack }) {
  return (
    <PageShell
      testid="about-view"
      eyebrow="01 — Entomology"
      onBack={onBack}
      titleLines={[
        {
          text: "Entomology of an Engineer",
          className:
            "font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-100",
        },
      ]}
    >
      <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-12">
        <motion.div {...fadeUp} className="md:col-span-5">
          <div className="portrait-frame" data-testid="about-portrait">
            <img
              src="/assets/spider-cut.png"
              alt="The resident orb weaver"
              className="aspect-[4/5] w-full object-contain p-10"
            />
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            B. D. Phillips · Chicago, IL
          </p>
        </motion.div>

        <div className="md:col-span-7">
          <motion.p
            {...fadeUp}
            className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300/80"
          >
            {ABOUT.eyebrow}
          </motion.p>
          {ABOUT.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              {...fadeUp}
              className="mt-8 font-display text-lg font-light leading-relaxed text-neutral-300 sm:text-xl"
            >
              {p}
            </motion.p>
          ))}

          <div className="mt-16">
            {ABOUT.pillars.map((pillar) => (
              <motion.div
                key={pillar.n}
                {...fadeUp}
                className="grid gap-3 border-t border-white/10 py-8 sm:grid-cols-12"
                data-testid={`pillar-${pillar.n}`}
              >
                <span className="font-mono text-xs text-amber-200/70 sm:col-span-2">
                  {pillar.n}
                </span>
                <h3 className="font-display text-xl font-normal text-neutral-200 sm:col-span-4">
                  {pillar.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-neutral-400 sm:col-span-6">
                  {pillar.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
        {ABOUT.stats.map((s) => (
          <motion.div
            key={s.v}
            {...fadeUp}
            className="bg-[#050709] p-8"
            data-testid={`stat-${s.k}`}
          >
            <p className="font-mono text-3xl font-light text-neutral-100 sm:text-4xl">
              {s.k}
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
              {s.v}
            </p>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}
