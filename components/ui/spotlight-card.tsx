"use client";

import { useReducedMotion } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Spotlight + tilt suave. Solo pointer fino y sin reduced-motion; en touch no se mueve.
 * Inspirado en Spotlight y Tilt (Motion Primitives).
 */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.setProperty("--spot-opacity", "0");
  };

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 4).toFixed(2)}deg)`;
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    el.style.setProperty("--spot-opacity", "1");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={cn("relative h-full", className)}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[22px] opacity-[var(--spot-opacity,0)] transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(340px circle at var(--spot-x, 50%) var(--spot-y, 40%), color-mix(in oklab, var(--color-vanilla) 42%, transparent), transparent 68%)",
        }}
      />
    </div>
  );
}
