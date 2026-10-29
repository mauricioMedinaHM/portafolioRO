"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Revela el texto palabra por palabra (translate, stagger).
 * El estado inicial es visible: reduced-motion y el HTML de servidor no lo ocultan.
 * Inspirado en Text Reveal (Özer / interior.dev) y Word Pull Up (Magic UI).
 */
export function TextReveal({
  text,
  className,
  startIndex = 0,
}: {
  text: string;
  className?: string;
  startIndex?: number;
}) {
  const reduce = useReducedMotion();
  const scope = useRef<HTMLSpanElement>(null);
  const words = text.trim().split(/\s+/).filter(Boolean);

  useEffect(() => {
    if (reduce !== false) return;
    const root = scope.current;
    if (!root) return;

    let stopped = false;
    const stops: Array<() => void> = [];

    const run = () => {
      if (stopped) return;
      root.querySelectorAll<HTMLElement>("[data-word]").forEach((node, index) => {
        const playback = animate(
          node,
          { y: ["110%", "0%"] },
          { duration: 0.72, delay: (startIndex + index) * 0.07, ease: [0.16, 1, 0.3, 1] },
        );
        stops.push(() => playback.stop());
      });
    };

    const loader = document.getElementById("intro-loader");
    if (!loader || loader.getAttribute("data-state") !== "loading") {
      run();
      return () => {
        stopped = true;
        stops.forEach((stop) => stop());
      };
    }

    const observer = new MutationObserver(() => {
      if (loader.getAttribute("data-state") !== "loading") {
        observer.disconnect();
        run();
      }
    });
    observer.observe(loader, { attributes: true, attributeFilter: ["data-state"] });

    return () => {
      stopped = true;
      observer.disconnect();
      stops.forEach((stop) => stop());
    };
  }, [reduce, startIndex]);

  return (
    <span ref={scope} className={cn("align-bottom", className)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden px-[0.03em] pt-[0.08em] pb-[0.12em] align-bottom">
          <span data-word className="inline-block">
            {index > 0 ? "\u00A0" : ""}
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
