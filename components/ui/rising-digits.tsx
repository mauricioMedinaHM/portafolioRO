"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

/**
 * Cada dígito sube recortado con clip-path, en stagger, mientras NumberTicker
 * cuenta. El HTML inicial muestra la cifra final (reduced-motion y SSR).
 * Inspirado en Rising Ink y Staggered Text (React Bits).
 */
export function RisingDigits({
  value,
  className,
  delay = 0,
}: {
  value: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const scope = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const slots = Math.max(value.length, 1);
  const chars = value.padStart(slots, "0").slice(-slots).split("");

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    let stopped = false;
    const stops: Array<() => void> = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || stopped) return;
        io.disconnect();
        setActive(true);
        if (reduce !== false) return;
        root.querySelectorAll<HTMLElement>("[data-digit]").forEach((node, index) => {
          const playback = animate(
            node,
            {
              y: ["115%", "0%"],
              clipPath: ["inset(110% -8% -30% -8%)", "inset(-30% -8% -30% -8%)"],
            },
            {
              duration: 0.74,
              delay: delay + index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            },
          );
          stops.push(() => playback.stop());
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(root);

    return () => {
      stopped = true;
      io.disconnect();
      stops.forEach((stop) => stop());
    };
  }, [delay, reduce]);

  const paint = (next: string) => {
    const root = scope.current;
    if (!root) return;
    const nodes = root.querySelectorAll<HTMLElement>("[data-digit]");
    const padded = next.padStart(nodes.length, "0").slice(-nodes.length).split("");
    nodes.forEach((node, index) => {
      const char = padded[index] ?? "";
      if (node.textContent !== char) node.textContent = char;
    });
  };

  return (
    <span ref={scope} className={cn("relative inline-flex max-w-full", className)}>
      <NumberTicker value={value} active={active} onText={paint} className="sr-only" />
      <span aria-hidden className="inline-flex">
        {chars.map((char, index) => (
          <span key={index} className="inline-block overflow-hidden pb-[0.06em]">
            <span data-digit className="inline-block">
              {char}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
