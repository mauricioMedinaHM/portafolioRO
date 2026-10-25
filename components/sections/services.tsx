"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Clapperboard, Mic, MonitorPlay, Radio, Smartphone, Tv, type LucideIcon } from "lucide-react";
import { Flower } from "@/components/pop/decor";
import { PopContainer, PopHeading } from "@/components/pop/heading";
import { cn } from "@/lib/utils";

const SERVICES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Tv, title: "Conducción", text: "En estudio y en vivo, con escucha activa e improvisación." },
  { icon: Mic, title: "Móviles y entrevistas", text: "Trabajo en campo y coberturas de eventos masivos." },
  { icon: MonitorPlay, title: "Streaming y TV", text: "Otra Vez Sopa y Generación Tech (El10TV)." },
  { icon: Clapperboard, title: "Producción y eventos", text: "Soporte de producción en Streaming Day, organización y logística." },
  { icon: Radio, title: "Locución y capacitación", text: "Radio y proyectos de extensión universitaria (UCaSal)." },
  { icon: Smartphone, title: "Redes y contenido", text: "Gestión de redes, copys y planificación." },
];

// Fondo + color de cifra con contraste ≥3:1 (ver lib/contrast.test.ts).
const STAT_TONES = [
  "bg-peach [&_dd]:text-sun-deep",
  "bg-candy [&_dd]:text-cocoa",
  "bg-blush [&_dd]:text-sun-deep",
  "bg-amber [&_dd]:text-cocoa",
] as const;

export interface Stat {
  value: string;
  label: string;
}

/** "Lo que hago" + "En números" (cifras calculadas desde el contenido real). */
export function Services({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-25, 35]);

  return (
    <section id="servicios" ref={ref} className="relative scroll-mt-20 py-6 md:py-10">
      <PopContainer className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="rounded-[32px] bg-peach p-6 md:p-8 lg:col-span-7">
          <PopHeading className="text-[28px] text-sun-deep md:text-[36px]">Lo que hago</PopHeading>
          <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            {SERVICES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blush text-rose-deep">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-[16px] font-bold text-cocoa">{title}</span>
                  <span className="mt-0.5 block text-[14px] leading-snug text-cocoa-2">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-[32px] bg-cream p-6 ring-1 ring-seam md:p-8 lg:col-span-5">
          <motion.div
            aria-hidden
            style={{ rotate }}
            className="pointer-events-none absolute -top-16 -right-16 size-56 text-candy/70"
          >
            <Flower className="size-full" />
          </motion.div>
          <PopHeading className="relative text-[28px] text-rose-ink md:text-[36px]">
            En números
          </PopHeading>
          <dl className="relative mt-6 grid grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <div key={stat.label} className={cn("flex flex-col-reverse rounded-[20px] p-4 md:p-5", STAT_TONES[i % 4])}>
                <dt className="pop-label mt-1 text-cocoa">{stat.label}</dt>
                <dd className="font-pop text-[40px] leading-none md:text-[48px]">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </PopContainer>
    </section>
  );
}
