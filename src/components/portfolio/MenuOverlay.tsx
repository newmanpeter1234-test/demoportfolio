"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { EASE_POWER, getLenis, NAV_LINKS, PERSONA, scrollToId, SOCIALS } from "@/lib/site";

export default function MenuOverlay() {
  const menuOpen = useAppStore((s) => s.menuOpen);
  const setMenuOpen = useAppStore((s) => s.setMenuOpen);

  useEffect(() => {
    if (menuOpen) getLenis()?.stop();
    else getLenis()?.start();
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    window.setTimeout(() => scrollToId(id), 420);
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col bg-ac text-[#0A0A0B]"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: EASE_POWER }}
        >
          <div className="flex flex-1 flex-col justify-between px-4 pb-6 pt-24 md:px-8 md:pt-32">
            <nav aria-label="Menu">
              <ul>
                {NAV_LINKS.map((l, i) => (
                  <li key={l.id} className="overflow-hidden border-b border-black/15">
                    <motion.button
                      type="button"
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%", transition: { duration: 0.4, ease: EASE_POWER } }}
                      transition={{
                        delay: 0.22 + i * 0.06,
                        duration: 0.7,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => go(l.id)}
                      data-cursor="hover"
                      className="group flex w-full items-baseline gap-4 py-2 text-left md:gap-8"
                    >
                      <span className="font-mono text-xs md:text-sm">0{i + 1}</span>
                      <span className="font-display text-[11vw] font-extrabold uppercase leading-[1.02] tracking-tight transition-transform duration-300 ease-out group-hover:translate-x-4 md:text-[6vw]">
                        {l.label}
                      </span>
                      <ArrowUpRight
                        className="ml-auto h-[0.6em] w-[0.6em] shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        strokeWidth={2.5}
                      />
                    </motion.button>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-[0.2em] md:flex-row md:items-end md:justify-between"
            >
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="underline-offset-4 hover:underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-1 md:text-right">
                <span>{PERSONA.email}</span>
                <span className="opacity-60">
                  {PERSONA.location} — {PERSONA.coords}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
