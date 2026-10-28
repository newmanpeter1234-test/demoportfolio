"use client";

import { AnimatePresence, animate, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { EASE_POWER, getLenis } from "@/lib/site";

const WORDS = ["DESIGN", "MOTION", "CODE", "EMOTION"];

/**
 * Cinematic preloader — 0→100 counter, rotating display words,
 * exits with a full-page slide. Unlocks hero intro when done.
 */
export default function Preloader() {
  const loaded = useAppStore((s) => s.loaded);
  const setLoaded = useAppStore((s) => s.setLoaded);
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (loaded || started.current) return;
    started.current = true;
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    const controls = animate(0, 100, {
      duration: 2.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setExiting(true),
    });
    return () => controls.stop();
  }, [loaded]);

  if (gone) return null;

  const wordIndex = Math.min(WORDS.length - 1, Math.floor(count / (100 / WORDS.length)));

  return (
    <motion.div
      className="fixed inset-0 z-[140] flex flex-col justify-between overflow-hidden bg-[#0A0A0B] p-4 md:p-8"
      initial={false}
      animate={exiting ? { y: "-100%" } : { y: "0%" }}
      transition={{ duration: 0.9, ease: EASE_POWER }}
      onAnimationComplete={() => {
        if (exiting) {
          setLoaded(true);
          setGone(true);
          document.documentElement.style.overflow = "";
          getLenis()?.start();
        }
      }}
    >
      {/* top row */}
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.3em] text-[#85857D]">
        <span className="font-display text-base font-extrabold tracking-tight text-[#F2F1EA]">
          AM<span className="text-ac">®</span>
        </span>
        <span className="hidden sm:block">PORTFOLIO ©2026</span>
        <span className="text-ac">LOADING</span>
      </div>

      {/* center rotating word */}
      <div className="flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ y: "45%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-45%", opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_POWER }}
            className="text-outline-thick font-display text-[16vw] font-extrabold uppercase leading-none tracking-tight md:text-[8vw]"
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* bottom row */}
      <div className="flex items-end justify-between">
        <span className="font-display text-[20vw] font-extrabold leading-[0.8] tracking-tight text-[#F2F1EA] md:text-[10vw]">
          {String(count).padStart(3, "0")}
        </span>
        <span className="mb-2 text-right font-mono text-[11px] leading-relaxed tracking-[0.25em] text-[#85857D]">
          ARJUN MEHTA
          <br />
          BLR / INDIA
        </span>
      </div>

      {/* progress hairline */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/10">
        <div
          className="h-full bg-ac transition-[width] duration-100 ease-linear"
          style={{ width: `${count}%` }}
        />
      </div>
    </motion.div>
  );
}
