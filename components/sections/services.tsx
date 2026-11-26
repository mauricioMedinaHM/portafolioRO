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

interface Reach {
  average: string;
  sampleSize: number;
  period: string;
  reel: string;
}

export function Services({ stats, skills, reach }: { stats: Stat[]; skills: string[]; reach: Reach }) {
  return (
    <section id="servicios" aria-labelledby="cualidades-titulo" className="scroll-mt-28 py-3 md:py-4">
      <PopContainer>
        <div className="grid items-center gap-5 rounded-[14px] bg-cocoa p-4 text-cream sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-9 lg:p-8">
          <div className="min-w-0">
            <PopHeading tone="cream" className="text-[33px] md:text-[44px]">
              <span id="cualidades-titulo">Cualidades</span>
            </PopHeading>
            <SkillsList skills={skills} />
          </div>

          <div className="min-w-0 rounded-[12px] bg-cream p-4 text-cocoa sm:p-6">
            <PopHeading className="text-[28px] text-sun-deep md:text-[36px]">En números</PopHeading>
            <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn("flex min-w-0 flex-col justify-end rounded-[8px] p-3", index === stats.length - 1 && "col-span-2 sm:col-span-1", STAT_TONES[index % STAT_TONES.length])}
                >
                  <dt className="order-2 mt-1 text-sm leading-snug font-semibold">{stat.label}</dt>
                  <dd className="font-pop order-1 text-[2.5rem] leading-none sm:text-[2.85rem]">
                    {stat.prefix && <span className="align-top text-[0.65em]">{stat.prefix}</span>}
                    <RisingDigits value={stat.value} delay={index * 0.09} />
                  </dd>
                </div>
              ))}
              <div className="col-span-full grid items-center gap-2 rounded-[10px] border border-sand bg-honeydew p-3 min-[430px]:grid-cols-[auto_minmax(0,1fr)] sm:gap-4 sm:p-4">
                <dt className="text-base leading-tight font-bold min-[430px]:col-start-2 min-[430px]:row-start-1">Promedio de vistas en 30 días</dt>
                <dd className="font-pop text-[clamp(2.65rem,8vw,4.5rem)] leading-none tabular-nums min-[430px]:col-start-1 min-[430px]:row-span-2 min-[430px]:row-start-1">{reach.average}</dd>
                <dd className="min-w-0 min-[430px]:col-start-2 min-[430px]:row-start-2">
                  <span className="mt-1 block text-sm leading-snug text-cocoa-2">{reach.sampleSize} paneles · {reach.period}</span>
                  <span className="mt-1 block text-sm font-semibold">{reach.reel} vistas en un reel de referencia</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </PopContainer>
    </section>
  );
}
