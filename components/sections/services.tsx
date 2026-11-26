"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { PopContainer, PopHeading } from "@/components/pop/heading";
import { RisingDigits } from "@/components/ui";
import { cn } from "@/lib/utils";

// Tintas de papel y contraste de las cifras.
const STAT_TONES = [
  "bg-peach text-sun-deep",
  "bg-candy text-cocoa",
  "bg-blush text-cocoa",
  "bg-amber text-cream",
] as const;

export interface Stat {
  value: string;
  prefix?: string;
  label: string;
}

function SkillsList({ skills }: { skills: string[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (reduce !== false) return;
    const root = ref.current;
    if (!root) return;

    let stopped = false;
    const stops: Array<() => void> = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || stopped) return;
        io.disconnect();
        root.querySelectorAll<HTMLElement>("[data-service]").forEach((node, index) => {
          const playback = animate(
            node,
            { opacity: [0.35, 1], y: ["12px", "0px"] },
            { duration: 0.58, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] },
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
  }, [reduce]);

  return (
    <ul ref={ref} className="mt-6 flex flex-wrap gap-2.5">
      {skills.map((skill) => (
        <li key={skill} data-service className="rounded-[4px] border border-cocoa/15 bg-cream px-3 py-2 text-[14px] leading-snug font-semibold text-cocoa even:bg-candy">
          {skill}
        </li>
      ))}
    </ul>
  );
}

export function Services({ stats, skills }: { stats: Stat[]; skills: string[] }) {
  return (
    <section id="servicios" className="scroll-mt-28 bg-cocoa py-9 text-cream md:py-14">
      <PopContainer className="grid grid-cols-1 items-center gap-7 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-5">
          <PopHeading tone="cream" className="text-[33px] md:text-[44px]">Cualidades</PopHeading>
          <SkillsList skills={skills} />
        </div>

        <div className="min-w-0 rounded-[12px] bg-cream p-4 text-cocoa sm:p-6 md:p-8 lg:col-span-7">
          <div className="relative z-10">
            <PopHeading className="text-[28px] text-sun-deep md:text-[36px]">En números</PopHeading>
            <dl className="m-0 mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "@container flex min-w-0 flex-col justify-end rounded-[6px] p-3 sm:p-4 md:p-5",
                    "shadow-[0_16px_32px_-20px_color-mix(in_oklab,var(--color-ultramarine)_42%,transparent)]",
                    STAT_TONES[index % STAT_TONES.length],
                  )}
                >
                  <dd
                    className="m-0 font-pop leading-[0.8] whitespace-nowrap"
                    style={{ fontSize: stat.prefix ? "clamp(2.5rem, 33cqi, 7rem)" : "clamp(3.5rem, 48cqi, 9rem)" }}
                  >
                    {stat.prefix && <span className="align-top text-[0.65em]">{stat.prefix}</span>}
                    <RisingDigits value={stat.value} delay={index * 0.09} />
                  </dd>
                  <dt className="pop-label m-0 mt-2 text-balance">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </PopContainer>
    </section>
  );
}
