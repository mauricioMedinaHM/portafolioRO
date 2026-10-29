"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { Clapperboard, Mic, MonitorPlay, Radio, Smartphone, Tv, type LucideIcon } from "lucide-react";
import { PopContainer, PopHeading } from "@/components/pop/heading";
import { ChromaCard, ImageReel, RisingDigits, type ImageReelItem } from "@/components/ui";
import { cn } from "@/lib/utils";

const SERVICES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Tv, title: "Conducción", text: "En estudio y en vivo, con escucha activa e improvisación." },
  { icon: Mic, title: "Móviles y entrevistas", text: "Trabajo en campo y coberturas de eventos masivos." },
  { icon: MonitorPlay, title: "Streaming y TV", text: "Otra Vez Sopa y Generación Tech (El10TV)." },
  { icon: Clapperboard, title: "Producción y eventos", text: "Soporte de producción en Streaming Day, organización y logística." },
  { icon: Radio, title: "Locución y capacitación", text: "Radio y proyectos de extensión universitaria (UCaSal)." },
  { icon: Smartphone, title: "Redes y contenido", text: "Gestión de redes, copys y planificación." },
];

// Bloques opacos: el reel no participa del contraste (pares en lib/contrast.test.ts).
const STAT_TONES = [
  "bg-peach text-sun-deep",
  "bg-candy text-cocoa",
  "bg-blush text-cocoa",
  "bg-amber text-cream",
] as const;

export interface Stat {
  value: string;
  label: string;
}

function ServiceGrid() {
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
            { y: ["14px", "0px"] },
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
    <ul ref={ref} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {SERVICES.map(({ icon: Icon, title, text }) => (
        <li key={title} data-service className="min-w-0">
          <ChromaCard>
            <div className="flex h-full gap-3 rounded-[24px] bg-cream p-4 ring-1 ring-sand">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-blush text-rose-deep">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[16px] font-bold text-cocoa">{title}</span>
                <span className="mt-0.5 block text-[14px] leading-snug text-cocoa-2">{text}</span>
              </span>
            </div>
          </ChromaCard>
        </li>
      ))}
    </ul>
  );
}

/** "Lo que hago" + "En números" (cifras calculadas desde el contenido real). */
export function Services({ stats, backdrop }: { stats: Stat[]; backdrop: ImageReelItem[] }) {
  return (
    <section id="servicios" className="relative scroll-mt-28 py-6 md:py-10">
      <PopContainer className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
        <div className="min-w-0 rounded-[32px] bg-peach p-5 sm:p-6 md:p-8 lg:col-span-5">
          <PopHeading className="text-[28px] text-sun-deep md:text-[36px]">Lo que hago</PopHeading>
          <ServiceGrid />
        </div>

        <div className="relative isolate flex h-full min-w-0 flex-col overflow-hidden rounded-[32px] bg-cream p-4 ring-1 ring-seam sm:p-6 md:p-8 lg:col-span-7">
          <ImageReel images={backdrop} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-cream)_58%,transparent)_0%,color-mix(in_oklab,var(--color-cream)_58%,transparent)_16%,color-mix(in_oklab,var(--color-cream)_14%,transparent)_38%,color-mix(in_oklab,var(--color-cream)_30%,transparent)_100%)]"
          />
          <div className="relative z-10">
            <PopHeading className="text-[28px] text-sun-deep md:text-[36px]">En números</PopHeading>
            <dl className="m-0 mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "@container flex min-w-0 flex-col justify-end rounded-[22px] p-3 sm:p-4 md:p-5",
                    "shadow-[0_16px_32px_-20px_color-mix(in_oklab,var(--color-ultramarine)_42%,transparent)]",
                    STAT_TONES[index % STAT_TONES.length],
                  )}
                >
                  <dd
                    className="m-0 font-pop leading-[0.8] whitespace-nowrap"
                    style={{ fontSize: "clamp(4rem, 52cqi, 10rem)" }}
                  >
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
