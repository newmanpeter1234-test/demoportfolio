"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Asterisk } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {
  items: string[];
  className?: string;
  baseVelocity?: number;
};

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/**
 * Infinite marquee that reacts to scroll velocity — speed and direction
 * surge with the user's scrolling, and the whole strip skews with momentum.
 */
export default function MarqueeStrip({ items, className, baseVelocity = -2.2 }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const half = useRef(0);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4.5], {
    clamp: false,
  });
  const skew = useTransform(smoothVelocity, [-1600, 0, 1600], [-5, 0, 5]);

  useEffect(() => {
    const measure = () => {
      half.current = (trackRef.current?.scrollWidth ?? 0) / 2;
    };
    measure();
    const t = window.setTimeout(measure, 800); // re-measure after fonts settle
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1;
    else if (vf > 0) direction.current = 1;
    moveBy += direction.current * moveBy * Math.abs(vf);
    if (half.current > 0) x.set(wrap(-half.current, 0, x.get() + moveBy));
  });

  return (
    <div className={`relative overflow-hidden py-5 md:py-7 ${className ?? ""}`}>
      <motion.div
        ref={trackRef}
        style={{ x, skewX: skew }}
        className="flex w-max whitespace-nowrap will-change-transform"
      >
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex items-center">
            {items.map((it, i) => (
              <span
                key={`${copy}-${i}`}
                className={`flex items-center gap-5 pr-5 font-display text-[8.5vw] font-extrabold uppercase leading-none tracking-tight md:gap-8 md:pr-8 md:text-[4.6vw] ${
                  i % 2 === 1 ? "text-outline" : "text-[#F2F1EA]"
                }`}
              >
                {it}
                <Asterisk className="h-[0.45em] w-[0.45em] shrink-0 text-ac" strokeWidth={2.5} />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
