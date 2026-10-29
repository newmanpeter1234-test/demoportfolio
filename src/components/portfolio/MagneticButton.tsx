"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  strength?: number;
};

/** Magnetic wrapper — element gravitates toward the pointer. */
export default function MagneticButton({
  children,
  strength = 0.35,
  className,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 160, damping: 14, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 160, damping: 14, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      data-cursor="hover"
      {...rest}
    >
      {children}
    </motion.button>
  );
}
