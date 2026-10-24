"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaCard } from "@/components/media";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Carrusel horizontal de proyectos destacados (isFeatured). */
export function FeaturedCarousel({ projects }: { projects: Project[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    update();
    emblaApi.on("select", update).on("reInit", update);
    return () => {
      emblaApi.off("select", update).off("reInit", update);
    };
  }, [emblaApi, update]);

  if (projects.length === 0) return null;

  return (
    <section id="destacados" aria-label="Proyectos destacados" className="scroll-mt-16 border-t border-line py-16 md:py-20">
      <div className="mx-auto flex w-full max-w-[1120px] items-end justify-between gap-4 px-5 md:px-16">
        <div>
          <p className="meta text-ink-3">Selección</p>
          <h2 className="mt-3 font-display text-[30px] leading-[1.05] font-normal tracking-[-0.02em] text-ink md:text-[48px]">
            Destacados
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Anterior"
            disabled={!canPrev}
            onClick={() => emblaApi?.scrollPrev()}
            className="inline-flex min-h-12 min-w-12 items-center justify-center border border-line text-ink transition-colors hover:bg-paper-2 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            disabled={!canNext}
            onClick={() => emblaApi?.scrollNext()}
            className="inline-flex min-h-12 min-w-12 items-center justify-center border border-line text-ink transition-colors hover:bg-paper-2 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[1120px] md:mt-14 md:px-16">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-5 px-5 md:px-0">
            {projects.map((project) => (
              <div
                key={project.id}
                className={cn("min-w-0 shrink-0 basis-[88%] sm:basis-[62%] lg:basis-[48%]")}
              >
                <MediaCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
