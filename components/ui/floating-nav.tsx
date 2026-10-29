"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Píldora flotante: se compacta al scrollear y se oculta al bajar.
 * Inspirada en Morphing Scroll Navbar (Kiki) y Hide On Scroll (Özer).
 */
export function FloatingNav({
  children,
  forceVisible = false,
  className,
}: {
  children: ReactNode | ((state: { compact: boolean }) => ReactNode);
  forceVisible?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const hiddenRef = useRef(false);
  const compactRef = useRef(false);
  const forceRef = useRef(forceVisible);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);

  forceRef.current = forceVisible;

  useEffect(() => {
    if (!forceVisible) return;
    hiddenRef.current = false;
    setHidden(false);
  }, [forceVisible]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;
    const nextCompact = y > 20;
    if (nextCompact !== compactRef.current) {
      compactRef.current = nextCompact;
      setCompact(nextCompact);
    }

    const wantHidden = !forceRef.current && y > 96 && delta > 6;
    const wantShown = forceRef.current || y < 64 || delta < -6;
    if (wantHidden && !hiddenRef.current) {
      hiddenRef.current = true;
      setHidden(true);
    } else if (wantShown && hiddenRef.current) {
      hiddenRef.current = false;
      setHidden(false);
    }

    lastY.current = y;
  });

  const offscreen = hidden && !forceVisible;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 px-2.5 sm:px-4">
      <motion.div
        initial={false}
        animate={{ y: offscreen ? "-130%" : "0%", opacity: offscreen ? 0 : 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden={offscreen || undefined}
        inert={offscreen || undefined}
        className={cn(
          "pointer-events-auto mx-auto w-full max-w-[1120px] rounded-full border border-sand bg-cream shadow-[0_14px_32px_-18px_color-mix(in_oklab,var(--color-ultramarine)_42%,transparent)]",
          offscreen && "pointer-events-none",
          compact ? "mt-2" : "mt-3",
          className,
        )}
      >
        <div className={cn("px-3 md:px-4", compact ? "py-1.5" : "py-2 md:py-2.5")}>
          {typeof children === "function" ? children({ compact }) : children}
        </div>
      </motion.div>
    </div>
  );
}
