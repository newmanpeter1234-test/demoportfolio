"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import HeroScene from "@/components/three/HeroScene";
import { useAppStore } from "@/lib/store";
import { EASE, PERSONA } from "@/lib/site";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const rise = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1.15, ease: EASE } },
};
const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export default function Hero() {
  const loaded = useAppStore((s) => s.loaded);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] overflow-hidden"
      aria-label="Intro"
    >
      {/* faint column grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(242,241,234,0.045) 1px, transparent 1px)",
          backgroundSize: "16.666% 100%",
        }}
      />

      {/* 3D layer */}
      <motion.div
        style={{ y: sceneY, opacity: sceneOpacity }}
        className="absolute inset-0 md:left-[18%]"
      >
        <HeroScene className="h-full w-full" />
      </motion.div>

      {/* content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full flex-col justify-between px-4 pb-8 pt-24 md:px-8 md:pb-10 md:pt-28"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate={loaded ? "show" : "hidden"}
          className="flex items-start justify-between"
        >
          <motion.p
            variants={fade}
            className="max-w-[240px] font-mono text-[11px] uppercase leading-relaxed tracking-[0.25em] text-[#85857D] md:max-w-[280px]"
          >
            {PERSONA.role} — crafting immersive experiences for the modern web.
          </motion.p>
          <motion.div
            variants={fade}
            className="flex items-center gap-2.5 rounded-full border border-white/15 bg-black/30 px-4 py-2 backdrop-blur-sm"
          >
            <span className="pulse-dot h-2 w-2 rounded-full bg-ac" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
              {PERSONA.availability}
            </span>
          </motion.div>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate={loaded ? "show" : "hidden"}>
          <h1 className="font-display font-extrabold uppercase leading-[0.84] tracking-tight">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={rise} className="text-outline-thick block whitespace-nowrap text-[13.5vw] md:text-[13vw]">
                {PERSONA.firstName}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={rise} className="block whitespace-nowrap text-[13.5vw] text-[#F2F1EA] md:text-[13vw]">
                {PERSONA.lastName}
                <span className="align-top text-[0.3em] text-ac">®</span>
              </motion.span>
            </span>
          </h1>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={loaded ? "show" : "hidden"}
          className="flex items-end justify-between gap-6"
        >
          <motion.p variants={fade} className="max-w-sm text-base leading-relaxed text-[#85857D] md:text-lg">
            Immersive 3D worlds, motion systems &amp; interfaces people
            remember — from <span className="text-[#F2F1EA]">Bengaluru</span> to
            the browser.
          </motion.p>

          <motion.button
            variants={fade}
            type="button"
            data-cursor="SCROLL"
            aria-label="Scroll to content"
            className="group hidden flex-col items-center gap-2 md:flex"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#85857D] transition-colors group-hover:text-ac">
              Scroll
            </span>
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="h-4 w-4 text-ac" />
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* HUD corners */}
      <div className="pointer-events-none absolute bottom-6 left-4 z-10 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-[#85857D] md:left-8 lg:block">
        Creative Developer
      </div>
      <div className="pointer-events-none absolute bottom-6 right-4 z-10 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-[#85857D] md:right-8 lg:block">
        V.4.0 — ©2026
      </div>
    </section>
  );
}
