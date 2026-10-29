"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Contador que corre al entrar en viewport. Inspirado en Number Ticker (Magic UI). */
export function NumberTicker({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const numeric = Number(value);
  const canCount = Number.isFinite(numeric);
  const [text, setText] = useState(value);

  useEffect(() => {
    if (!canCount || !inView || reduce !== false) {
      setText(value);
      return;
    }
    const controls = animate(0, numeric, {
      duration: 1.05,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setText(String(Math.round(latest))),
    });
    return () => controls.stop();
  }, [canCount, inView, numeric, reduce, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {text}
    </span>
  );
}
