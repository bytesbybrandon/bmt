import { motion } from "framer-motion";
import { PageShell } from "../PageShell";
import { SKILLS } from "@/data/content";

export default function SkillsView({ onBack }) {
  return (
    <PageShell
      testid="skills-view"
      eyebrow="04 — Arsenal"
      onBack={onBack}
      titleLines={[
        {
          text: "The Full-Stack Arsenal",
          className:
            "font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-100",
        },
        {
          text: "Every strand tuned for tension.",
          className:
            "mt-5 max-w-xl text-sm sm:text-base font-light leading-relaxed text-neutral-400",
        },
      ]}
    >
      <div className="mt-16 grid gap-x-20 gap-y-16 md:mt-24 md:grid-cols-2">
        {SKILLS.map((group, gi) => (
          <div key={group.group} data-testid={`skill-group-${gi}`}>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300/80">
              {group.group}
            </p>
            <div className="mt-8 space-y-7">
              {group.items.map((skill, si) => (
                <div key={skill.name} data-testid={`skill-${gi}-${si}`}>
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="font-mono text-xs tracking-[0.15em] text-neutral-300">
                      {skill.name}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400">
                      {skill.level}
                    </span>
                  </div>
                  <div className="silk-gauge-track">
                    <motion.div
                      className="silk-gauge-fill"
                      style={{ width: `${skill.level}%`, transformOrigin: "left" }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: "-10% 0px" }}
                      transition={{
                        duration: 1.2,
                        delay: si * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
