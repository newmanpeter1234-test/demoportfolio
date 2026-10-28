"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import MagneticButton from "@/components/portfolio/MagneticButton";
import { useISTClock } from "@/hooks/use-ist-clock";
import { getLenis, NAV_LINKS, PERSONA, scrollToId, SOCIALS } from "@/lib/site";
import { EASE } from "@/lib/site";

export default function Footer({ visits }: { visits: number }) {
  const time = useISTClock();

  return (
    <footer className="relative z-10 mt-auto border-t border-white/10 bg-[#080809] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {/* giant name */}
      <div className="overflow-hidden px-4 pt-10 md:px-8 md:pt-14">
        <motion.h2
          initial={{ y: "40%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true, margin: "-5% 0px" }}
          transition={{ duration: 1, ease: EASE }}
          data-cursor="hover"
          className="text-outline block select-none whitespace-nowrap text-center font-display text-[10.5vw] font-extrabold uppercase leading-[0.82] tracking-tight transition-colors duration-500 hover:text-ac md:text-[14vw]"
        >
          {PERSONA.firstName} {PERSONA.lastName}
        </motion.h2>
      </div>

      <div className="grid gap-10 border-t border-white/10 px-4 py-12 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-display text-lg font-extrabold tracking-tight">
            AM<span className="text-ac">®</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#85857D]">
            {PERSONA.role}. Building the web I want to live in — one
            unreasonable detail at a time.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#85857D]">
            Sitemap
          </p>
          <ul className="space-y-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => scrollToId(l.id)}
                  data-cursor="hover"
                  className="text-sm text-[#F2F1EA]/80 transition-colors hover:text-ac"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#85857D]">
            Elsewhere
          </p>
          <ul className="space-y-2.5">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="text-sm text-[#F2F1EA]/80 transition-colors hover:text-ac"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#85857D]">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em]">
            Status
          </p>
          <p className="flex items-center gap-2.5">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ac" />
            Local time — {time} IST
          </p>
          <p className="mt-3">
            {visits.toLocaleString("en-US")} curious visitors &amp; counting
          </p>
          <p className="mt-3">{PERSONA.coords}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 px-4 py-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[#85857D] md:flex-row md:px-8">
        <p>© 2026 {PERSONA.name} — All rights reserved</p>
        <p className="hidden md:block">Designed &amp; engineered with unreasonable detail</p>
        <MagneticButton
          type="button"
          onClick={() => getLenis()?.scrollTo(0, { duration: 1.8 }) ?? window.scrollTo({ top: 0 })}
          aria-label="Back to top"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[#F2F1EA] transition-colors duration-300 hover:border-ac hover:bg-ac hover:text-[#0A0A0B]"
        >
          <ArrowUp className="h-4 w-4" />
        </MagneticButton>
      </div>
    </footer>
  );
}
