"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ComponentProps, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * El botón se acerca al puntero. Solo pointer fino; reduced-motion lo deja quieto.
 * Inspirado en Magnetic (Motion Primitives).
 */
export function MagneticButton({
  className,
  shellClassName,
  children,
  ...props
}: ComponentProps<"a"> & { children: ReactNode; shellClassName?: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.22);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.28);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className={cn("inline-flex max-w-full", shellClassName)}
      style={{ x: springX, y: springY }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <a className={className} {...props}>
        {children}
      </a>
    </motion.span>
  );
}
