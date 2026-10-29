"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";

type CursorMode = { variant: "default" | "hover" | "label"; label: string };

const emptySubscribe = () => () => {};

/**
 * Custom cursor — a dot + trailing ring (mix-blend difference) that morphs
 * into an accent bubble with a label on elements carrying [data-cursor].
 * Only enabled for fine pointers (mouse).
 */
export default function CustomCursor() {
  const enabled = useSyncExternalStore(
    emptySubscribe,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false
  );
  const [mode, setMode] = useState<CursorMode>({ variant: "default", label: "" });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("has-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor]"
      ) as HTMLElement | null;
      if (el) {
        const v = (el.getAttribute("data-cursor") ?? "hover").trim();
        if (v === "hover" || v === "true") setMode({ variant: "hover", label: "" });
        else setMode({ variant: "label", label: v });
      } else {
        setMode({ variant: "default", label: "" });
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = mode.variant === "hover" ? 56 : mode.variant === "label" ? 84 : 34;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[130] h-1.5 w-1.5 rounded-full bg-[#F2F1EA] mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[129] flex items-center justify-center rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: mode.variant === "label" ? "normal" : "difference",
        }}
        animate={{
          width: size,
          height: size,
          backgroundColor:
            mode.variant === "label" ? "rgba(198,242,78,0.96)" : "rgba(198,242,78,0)",
          borderColor:
            mode.variant === "label" ? "rgba(198,242,78,0)" : "rgba(242,241,234,0.6)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <span
          className={`font-mono text-[10px] font-medium tracking-[0.15em] text-[#0A0A0B] transition-opacity duration-150 ${
            mode.variant === "label" ? "opacity-100" : "opacity-0"
          }`}
        >
          {mode.label}
        </span>
      </motion.div>
    </>
  );
}
