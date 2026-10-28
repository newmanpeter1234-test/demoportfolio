"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/lib/site";

type Props = {
  index: string;
  label: string;
  title: ReactNode;
  hint?: string;
};

/** Numbered, mono-labelled section heading with a masked slide-up reveal. */
export default function SectionHeading({ index, label, title, hint }: Props) {
  return (
    <div className="mb-10 md:mb-16">
      <div className="mb-4 flex items-center justify-between gap-4 md:mb-6">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-ac"
        >
          ( {index} ) — {label}
        </motion.span>
        {hint ? (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
            className="hidden text-right font-mono text-[11px] uppercase tracking-[0.2em] text-[#85857D] sm:block"
          >
            {hint}
          </motion.span>
        ) : null}
      </div>
      <h2 className="overflow-hidden font-display text-[11.5vw] font-extrabold uppercase leading-[0.95] tracking-tight md:text-[6.2vw]">
        <motion.span
          className="block"
          initial={{ y: "112%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {title}
        </motion.span>
      </h2>
    </div>
  );
}
