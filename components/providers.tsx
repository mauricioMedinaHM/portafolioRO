"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";
import { Toaster } from "sonner";

import { LoopViewportProvider } from "@/components/media/loop-viewport";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      // scroll suave hacia las anclas de las secciones (offset = nav sticky)
      anchors: { offset: window.innerWidth >= 768 ? -64 : -56 },
    });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      <LoopViewportProvider>{children}</LoopViewportProvider>
      <Toaster
        position="bottom-center"
        gap={8}
        toastOptions={{
          style: {
            background: "var(--color-ink)",
            color: "var(--color-paper)",
            border: "none",
            borderRadius: "0",
          },
        }}
      />
    </MotionConfig>
  );
}
