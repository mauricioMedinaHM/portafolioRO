"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      // scroll suave hacia las anclas de las secciones (offset = nav sticky)
      anchors: { offset: -72 },
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
    <>
      {children}
      <Toaster
        position="bottom-center"
        gap={8}
        toastOptions={{
          style: {
            background: "var(--color-foreground)",
            color: "var(--color-background)",
            border: "none",
            borderRadius: "0.75rem",
          },
        }}
      />
    </>
  );
}
