import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "../PageShell";
import { PROFILE, SOCIALS } from "@/data/content";

export default function ContactView({ onBack }) {
  return (
    <PageShell
      testid="contact-view"
      eyebrow="05 — Signals"
      onBack={onBack}
      titleLines={[
        {
          text: "Signals & Inquiries",
          className:
            "font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-100",
        },
        {
          text: "Pluck a strand. The web answers.",
          className:
            "mt-5 max-w-xl text-sm sm:text-base font-light leading-relaxed text-neutral-400",
        },
      ]}
    >
      <div className="mt-16 md:mt-24">
        {SOCIALS.map((s, i) => (
          <motion.a
            key={s.id}
            href={s.href}
            target={s.id === "email" ? undefined : "_blank"}
            rel="noreferrer"
            data-testid={`contact-link-${s.id}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.07 }}
            className="group flex items-center justify-between border-t border-white/10 py-7 transition-colors duration-300 last:border-b hover:bg-white/[0.02] md:py-8"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-8">
              <span className="w-28 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-200/80">
                {s.label}
              </span>
              <span className="font-display text-xl font-light text-neutral-200 transition-colors duration-300 group-hover:text-white sm:text-2xl">
                {s.handle}
              </span>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-600 transition-[color,transform] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-amber-200" />
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-20 border border-white/10 p-8 md:p-10"
        data-testid="contact-identity"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400">
          Availability
        </p>
        <p className="mt-4 font-mono text-xs leading-relaxed tracking-[0.15em] text-neutral-400">
          {PROFILE.availability}
        </p>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
          {PROFILE.location} · replies within one night cycle
        </p>
      </motion.div>
    </PageShell>
  );
}
