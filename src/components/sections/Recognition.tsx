"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import SectionHeading from "@/components/portfolio/SectionHeading";
import { EASE } from "@/lib/site";

const AWARDS = [
  { year: "2026", title: "Site of the Day", project: "NEBULA", org: "Awwwards" },
  { year: "2025", title: "FWA of the Day", project: "AURORA", org: "The FWA" },
  { year: "2025", title: "Website of the Year — Nominee", project: "Portfolio", org: "CSSDA" },
  { year: "2024", title: "Site of the Week", project: "PULSE", org: "GSAP" },
  { year: "2024", title: "Developer Award", project: "TERRA", org: "Awwwards" },
];

export default function Recognition() {
  return (
    <section id="recognition" className="relative px-4 py-24 md:px-8 md:py-36" aria-label="Recognition">
      <SectionHeading
        index="04"
        label="Recognition"
        title={
          <>
            Proof it <span className="text-outline">works</span>
          </>
        }
        hint="SELECTED HONORS"
      />

      <ul className="border-b border-white/10">
        {AWARDS.map((a, i) => (
          <motion.li
            key={`${a.year}-${a.title}`}
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
            className="group border-t border-white/10"
          >
            <div
              data-cursor="hover"
              className="grid grid-cols-[64px_1fr_auto] items-center gap-4 py-5 transition-all duration-400 group-hover:pl-4 md:grid-cols-[90px_1fr_auto_auto] md:gap-8 md:py-6 md:group-hover:pl-8"
            >
              <span className="font-mono text-sm text-ac">{a.year}</span>
              <div className="flex min-w-0 items-center gap-3">
                <Award className="hidden h-4 w-4 shrink-0 text-[#85857D] transition-colors duration-300 group-hover:text-ac sm:block" />
                <span className="truncate font-display text-lg font-bold uppercase tracking-tight transition-colors duration-300 group-hover:text-ac md:text-2xl">
                  {a.title}
                </span>
              </div>
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-[#85857D] md:block">
                {a.project}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#85857D]">
                {a.org}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-[#85857D]"
      >
        + 7 more honorable mentions across the web
      </motion.p>
    </section>
  );
}
