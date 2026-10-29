"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Barra fina de progreso de lectura, fija arriba. Inspirada en Scroll Progress (Motion Primitives). */
export function ScrollProgress({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 32, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    ref.current?.setAttribute("aria-valuenow", String(Math.round(value * 100)));
  });

  return (
    <motion.div
      ref={ref}
      role="progressbar"
      aria-label="Progreso de lectura"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      style={{ scaleX }}
      className={cn("pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-amethyst", className)}
    />
  );
}
