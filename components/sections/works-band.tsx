"use client";

import { ArrowLeft, ArrowRight, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Burst } from "@/components/pop/decor";
import { PopContainer, PopHeading } from "@/components/pop/heading";
import { categoryIcon } from "@/components/pop/icons";
import type { Category, Project } from "@/lib/types";

export interface WorkGroup {
  category: Category;
  projects: Project[];
}

const CONTROL_STYLE = "grid size-11 place-items-center rounded-full text-cocoa hover:bg-honeydew focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa disabled:opacity-40";

function CardArtwork({ src, Icon }: { src: string | null; Icon: LucideIcon }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" loading="lazy" decoding="async" width={480} height={360}
        onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />
    );
  }
  return (
    <span className="absolute inset-0 grid place-items-center">
      <Burst className="absolute size-[70%] text-blush" />
      <Icon className="relative size-9 text-rose-deep" aria-hidden />
    </span>
  );
}

function splitTitle(title: string) {
  const [head, ...rest] = title.split(/\s+[—–-]\s+/);
  return { head: head ?? title, sub: rest.join(" — ") };
}

export function WorksBand({ groups }: { groups: WorkGroup[] }) {
  const rail = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ previous: false, next: false });

  useEffect(() => {
    const track = rail.current;
    if (!track) return;

    function update() {
      if (!track) return;
      setEdges({
        previous: track.scrollLeft > 2,
        next: track.scrollLeft < track.scrollWidth - track.clientWidth - 2,
      });
    }

    update();
    const resize = new ResizeObserver(update);
    resize.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      resize.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, [groups.length]);

  function move(direction: -1 | 1) {
    const track = rail.current;
    const first = track?.firstElementChild;
    if (!track || !first) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (first.getBoundingClientRect().width + gap),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  if (groups.length === 0) return null;

  return (
    <section id="trabajos" aria-labelledby="trabajos-titulo" className="scroll-mt-28 py-7 md:py-9">
      <PopContainer>
        <div className="mb-3 flex items-end justify-between gap-3 md:mb-4">
          <div>
            <PopHeading className="text-[32px] md:text-[44px]">
              <span id="trabajos-titulo">Muestra de contenidos</span>
            </PopHeading>
            <p className="mt-2 max-w-xl text-sm text-cocoa-2 md:text-base">
              Una selección de trabajos frente a cámara, detrás del micrófono y para redes.
            </p>
          </div>
          <div className="flex shrink-0 rounded-full border border-cocoa/25 bg-cream p-0.5">
            <button
              type="button"
              aria-label="Ver trabajos anteriores"
              aria-controls="muestra-trabajos"
              onClick={() => move(-1)}
              disabled={!edges.previous}
              className={CONTROL_STYLE}
            >
              <ArrowLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Ver más trabajos"
              aria-controls="muestra-trabajos"
              onClick={() => move(1)}
              disabled={!edges.next}
              className={CONTROL_STYLE}
            >
              <ArrowRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        <ul
          id="muestra-trabajos"
          ref={rail}
          className="flex snap-x snap-mandatory scroll-px-1 gap-2 overflow-x-auto overscroll-x-contain px-1 pt-1 pb-3 md:gap-3"
          data-lenis-prevent-horizontal
        >
          {groups.map(({ category, projects }) => {
            const lead =
              projects.find((project) => project.isFeatured && project.thumbnailUrl) ??
              projects.find((project) => project.isFeatured) ??
              projects.find((project) => project.thumbnailUrl) ??
              projects[0];
            if (!lead) return null;
            const { head, sub } = splitTitle(lead.title);
            const Icon = categoryIcon(category.slug);

            return (
              <li key={category.id} className="editorial-work-card w-[clamp(12.5rem,69vw,16rem)] shrink-0 snap-start">
                <a
                  href={"#" + category.slug}
                  className="group flex h-full flex-col rounded-[9px] text-cocoa focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa"
                >
                  <span className="relative mx-3 block aspect-[2/1] overflow-hidden rounded-t-[5px] border border-seam bg-honeydew">
                    <CardArtwork src={lead.thumbnailUrl} key={lead.thumbnailUrl} Icon={Icon} />
                  </span>
                  <span className="editorial-folder-body flex flex-1 flex-col items-start px-3 pt-3 pb-2.5">
                    <span className="pop-label text-cocoa">{category.name}</span>
                    <span className="font-editorial mt-1 text-xl leading-tight font-semibold tracking-tight">{head}</span>
                    {sub && <span className="mt-1 line-clamp-2 text-sm leading-snug">{sub}</span>}
                    <span className="mt-auto pt-2 text-sm font-semibold underline-offset-2 group-hover:underline">Ver proyectos</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </PopContainer>
    </section>
  );
}
