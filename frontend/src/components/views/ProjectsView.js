import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "../PageShell";
import { PROJECTS } from "@/data/content";

export default function ProjectsView({ onBack }) {
  return (
    <PageShell
      testid="projects-view"
      eyebrow="02 — Selected Work"
      onBack={onBack}
      titleLines={[
        {
          text: "Architectural Works & Artifacts",
          className:
            "font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-100",
        },
        {
          text: "Five systems that held their shape under load.",
          className:
            "mt-5 max-w-xl text-sm sm:text-base font-light leading-relaxed text-neutral-400",
        },
      ]}
    >
      <div className="mt-16 md:mt-24">
        {PROJECTS.map((p, i) => (
          <motion.article
            key={p.id}
            data-testid={`project-card-${p.id}`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 0.7,
              delay: i * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group border-t border-white/10 py-10 transition-colors duration-500 last:border-b hover:bg-white/[0.02] md:py-12"
            tabIndex={0}
          >
            <div className="grid items-baseline gap-4 md:grid-cols-12">
              <span className="font-mono text-xs text-amber-200/70 md:col-span-1">
                {p.index}
              </span>
              <h3 className="font-display text-2xl font-light text-neutral-200 transition-[color,transform] duration-500 group-hover:translate-x-2 group-hover:text-white sm:text-3xl md:col-span-7">
                {p.title}
              </h3>
              <div className="flex items-center gap-6 md:col-span-4 md:justify-end">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                  {p.category}
                </span>
                <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-400">
                  {p.year}
                </span>
              </div>
            </div>
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <div className="grid gap-6 pt-6 md:grid-cols-12">
                  <p className="text-sm font-light leading-relaxed text-neutral-400 md:col-span-7 md:col-start-2">
                    {p.summary}
                  </p>
                  <div className="flex flex-wrap content-start gap-2 md:col-span-4">
                    {p.metrics.map((m) => (
                      <span
                        key={m}
                        className="border border-white/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-neutral-400"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 md:col-span-7 md:col-start-2">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200/60"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  {p.links && (
                    <div className="flex flex-wrap gap-6 md:col-span-7 md:col-start-2">
                      {p.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          data-testid={`project-link-${p.id}-${l.label
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="group/link flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 transition-colors duration-300 hover:text-amber-100"
                        >
                          {l.label}
                          <ArrowUpRight className="h-3 w-3 opacity-50 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </PageShell>
  );
}
