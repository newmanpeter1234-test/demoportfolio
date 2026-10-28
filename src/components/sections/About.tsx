"use client";

import { animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/portfolio/SectionHeading";
import { EASE } from "@/lib/site";

const PARAGRAPH =
  "I'm Arjun — a creative developer who treats the browser as a canvas. For seven years I've fused design, motion and code into immersive experiences people actually remember — from shader-driven storytelling to pixel-perfect product interfaces. I chase the exact point where engineering discipline meets visual craft.";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.3em] inline-block">
      {children}
    </motion.span>
  );
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-5xl font-extrabold tracking-tight md:text-6xl">
      {display}
      <span className="text-ac">{suffix}</span>
    </span>
  );
}

const STATS = [
  { value: 7, suffix: "+", label: "Years of craft" },
  { value: 60, suffix: "+", label: "Projects shipped" },
  { value: 12, suffix: "", label: "Awards & honors" },
  { value: 40, suffix: "+", label: "Happy clients" },
];

export default function About() {
  const words = PARAGRAPH.split(" ");
  const textRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 0.85", "end 0.45"],
  });

  const imgWrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: imgProgress } = useScroll({
    target: imgWrapRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(imgProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="about" className="relative px-4 py-24 md:px-8 md:py-36" aria-label="About">
      <SectionHeading
        index="01"
        label="About"
        title={
          <>
            Code is my
            <br />
            <span className="text-outline">canvas</span>
          </>
        }
        hint="EST. 2016 — BLR/IND"
      />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p
            ref={textRef}
            className="relative max-w-2xl text-2xl font-light leading-[1.35] tracking-tight md:text-[2.35rem]"
          >
            {words.map((w, i) => {
              const start = i / words.length;
              const end = (i + 1) / words.length;
              return (
                <Word key={i} progress={scrollYProgress} range={[start, end]}>
                  {w}
                </Word>
              );
            })}
          </p>

          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-10 md:mt-20 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <Counter value={s.value} suffix={s.suffix} />
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#85857D]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div ref={imgWrapRef} className="relative mx-auto max-w-sm lg:ml-auto">
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              whileInView={{ clipPath: "inset(0% 0 0 0)" }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.1, ease: EASE }}
              className="relative aspect-[3/4] rotate-2 overflow-hidden rounded-xl border border-white/10"
              data-cursor="hover"
            >
              <motion.div className="absolute inset-[-12%]" style={{ y: imgY }}>
                <Image
                  src="/images/portrait.png"
                  alt="Portrait of Arjun Mehta, creative developer"
                  fill
                  sizes="(max-width: 1024px) 80vw, 30vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#F2F1EA]/80">
                Arjun Mehta — b. 1994
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.7, ease: EASE }}
              className="absolute -bottom-5 -left-6 -rotate-3 rounded-lg border border-ac/40 bg-[#0A0A0B] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ac"
            >
              Est. 2016 — still shipping
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
