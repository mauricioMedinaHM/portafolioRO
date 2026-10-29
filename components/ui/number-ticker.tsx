"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Contador que corre al entrar en viewport. Inspirado en Number Ticker (Magic UI).
 * `onText` publica cada frame sin obligar a redibujar al padre si éste escribe el DOM.
 * `active` reemplaza el observer interno cuando el nodo visible es otro.
 */
export function NumberTicker({
  value,
  className,
  onText,
  active,
}: {
  value: string;
  className?: string;
  onText?: (text: string) => void;
  active?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const onTextRef = useRef(onText);
  onTextRef.current = onText;
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const inView = active ?? seen;
  const numeric = Number(value);
  const canCount = Number.isFinite(numeric);
  const [text, setText] = useState(value);

  useEffect(() => {
    const publish = (next: string) => {
      setText(next);
      onTextRef.current?.(next);
    };
    if (!canCount || !inView || reduce !== false) {
      publish(value);
      return;
    }
    const controls = animate(0, numeric, {
      duration: 1.05,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => publish(String(Math.round(latest))),
    });
    return () => controls.stop();
  }, [canCount, inView, numeric, reduce, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {text}
    </span>
  );
}
