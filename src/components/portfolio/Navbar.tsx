"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getLenis, NAV_LINKS, scrollToId } from "@/lib/site";
import { useISTClock } from "@/hooks/use-ist-clock";

export default function Navbar() {
  const menuOpen = useAppStore((s) => s.menuOpen);
  const setMenuOpen = useAppStore((s) => s.setMenuOpen);
  const time = useISTClock();

  const go = (id: string) => {
    setMenuOpen(false);
    window.setTimeout(() => scrollToId(id), 420);
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[90]"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav
        className={`flex h-16 items-center justify-between px-4 transition-colors duration-500 md:h-20 md:px-8 ${
          menuOpen ? "text-[#0A0A0B]" : "text-[#F2F1EA] mix-blend-difference"
        }`}
        aria-label="Primary"
      >
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            getLenis()?.scrollTo(0, { duration: 1.6 });
          }}
          className="font-display text-lg font-extrabold tracking-tight"
          data-cursor="hover"
          aria-label="Arjun Mehta — back to top"
        >
          AM{!menuOpen && <span className="text-ac">®</span>}
        </button>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => go(l.id)}
                data-cursor="hover"
                className="group relative font-mono text-[11px] uppercase tracking-[0.25em]"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 md:gap-6">
          <span className="hidden font-mono text-[11px] tracking-[0.2em] opacity-70 sm:block">
            {time} IST
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            data-cursor="hover"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex items-center gap-2 rounded-full border border-current px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] transition-opacity hover:opacity-70"
          >
            {menuOpen ? "Close" : "Menu"}
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </motion.span>
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
