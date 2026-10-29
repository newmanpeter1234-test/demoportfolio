"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import SectionHeading from "@/components/portfolio/SectionHeading";
import { EASE } from "@/lib/site";

const SERVICES = [
  {
    id: "01",
    title: "Creative Development",
    desc: "WebGL scenes, custom GLSL shaders, generative canvases and 3D interfaces — engineered to run silky on every device that opens them.",
    tags: ["Three.js", "GLSL", "R3F", "Canvas"],
    img: "/images/projects/nebula.png",
  },
  {
    id: "02",
    title: "Motion & Interaction",
    desc: "Scroll choreography, page transitions and micro-interactions that make products feel alive — never decorative, always intentional.",
    tags: ["Framer Motion", "GSAP", "Lenis"],
    img: "/images/projects/pulse.png",
  },
  {
    id: "03",
    title: "Product Engineering",
    desc: "Full-stack product builds with pragmatic architecture — typed APIs, real databases, obsessive performance budgets and tests that pass.",
    tags: ["Next.js", "TypeScript", "Prisma", "APIs"],
    img: "/images/projects/helix.png",
  },
  {
    id: "04",
    title: "Art Direction",
    desc: "Typography systems, layout grids and visual identity — a distinctive point of view, applied consistently across every single pixel.",
    tags: ["Typography", "Layout", "Identity"],
    img: "/images/projects/monolith.png",
  },
];

export default function Services() {
  const [active, setActive] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.5 });
  const py = useSpring(my, { stiffness: 180, damping: 22, mass: 0.5 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX + 28);
      my.set(e.clientY - 120);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  const activeService = SERVICES.find((s) => s.id === active);

  return (
    <section
      id="services"
      className="relative px-4 py-24 md:px-8 md:py-36"
      aria-label="Services"
    >
      <SectionHeading
        index="03"
        label="Services"
        title={
          <>
            What I do <span className="text-outline">best</span>
          </>
        }
        hint="HOVER / TAP A ROW"
      />

      {/* floating preview — follows cursor on desktop */}
      <AnimatePresence>
        {activeService && (
          <motion.div
            key={activeService.id}
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            exit={{ opacity: 0, scale: 0.85, rotate: 4 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ x: px, y: py }}
            className="pointer-events-none fixed left-0 top-0 z-40 hidden aspect-[4/3] w-72 overflow-hidden rounded-xl border border-white/15 md:block"
            aria-hidden
          >
            <Image
              src={activeService.img}
              alt=""
              fill
              sizes="288px"
              className="object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="border-b border-white/10">
        {SERVICES.map((s, i) => {
          const isOpen = expanded === s.id;
          return (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              className="border-t border-white/10"
            >
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                data-cursor="hover"
                onMouseEnter={() => setActive(s.id)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setExpanded(isOpen ? null : s.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpanded(isOpen ? null : s.id);
                  }
                }}
                className="group grid grid-cols-[52px_1fr_auto] items-start gap-4 py-7 transition-colors duration-500 hover:bg-ac md:grid-cols-[90px_1fr_minmax(0,340px)_48px] md:items-center md:gap-8 md:py-9"
              >
                <span className="font-mono text-sm text-ac transition-colors duration-500 group-hover:text-[#0A0A0B]">
                  /{s.id}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-extrabold uppercase leading-tight tracking-tight transition-all duration-500 group-hover:translate-x-2 group-hover:text-[#0A0A0B] md:text-4xl">
                    {s.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 md:hidden">
                    {s.tags.map((t) => (
                      <span key={t} className="font-mono text-[10px] text-[#85857D]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm leading-relaxed text-[#85857D] transition-colors duration-500 group-hover:text-[#0A0A0B]/70">
                    {s.desc}
                  </p>
                </div>
                <ArrowUpRight
                  className="h-6 w-6 -translate-x-1 translate-y-1 text-[#85857D] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[#0A0A0B] group-hover:opacity-100 md:h-8 md:w-8"
                />
              </div>

              {/* mobile expansion */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="overflow-hidden md:hidden"
                  >
                    <p className="pb-6 pl-[68px] pr-4 text-sm leading-relaxed text-[#85857D]">
                      {s.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
