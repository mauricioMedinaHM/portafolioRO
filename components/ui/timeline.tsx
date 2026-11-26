"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  title: string;
  detail?: string;
  icon?: ReactNode;
  tone?: string;
}

/**
 * Línea vertical que se rellena con el scroll (scaleY).
 * Inspirada en Timeline (Aceternity UI).
 */
export function Timeline({ items, label, columns = false }: { items: TimelineItem[]; label?: string; columns?: boolean }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <ol ref={ref} aria-label={label} className={cn("relative m-0 list-none space-y-3 p-0", columns && "md:grid md:grid-cols-2 md:gap-3 md:space-y-0")}>
      <span aria-hidden className={cn("absolute top-3 bottom-3 left-[21px] w-px bg-seam", columns && "md:hidden")} />
      <motion.span
        aria-hidden
        style={{ scaleY }}
        className={cn("absolute top-3 bottom-3 left-[21px] w-px origin-top bg-amethyst", columns && "md:hidden")}
      />
      {items.map((item) => (
        <li key={item.id} className="relative pl-14">
          <span className="absolute top-4 left-0 z-10 grid size-11 place-items-center rounded-full bg-sun text-cream ring-4 ring-cream">
            {item.icon}
          </span>
          <div className={cn("h-full rounded-[12px] px-4 py-3.5", item.tone)}>
            <p className="text-[16px] leading-snug font-bold text-cocoa">{item.title}</p>
            {item.detail ? (
              <p className="mt-1 text-[14px] leading-snug text-cocoa-2">{item.detail}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
