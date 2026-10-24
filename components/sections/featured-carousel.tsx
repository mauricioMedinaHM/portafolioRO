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
    <section
      id="destacados"
      aria-label="Proyectos destacados"
      className="scroll-mt-20 py-2"
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 sm:px-8">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          Destacados
        </h2>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Anterior"
            disabled={!canPrev}
            onClick={() => emblaApi?.scrollPrev()}
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            disabled={!canNext}
            onClick={() => emblaApi?.scrollNext()}
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <ChevronRight className="size-6" aria-hidden />
          </button>
        </div>
      </div>

      <div ref={emblaRef} className="mt-6 overflow-hidden">
        <div className="flex gap-5 px-5 sm:px-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className={cn(
                "min-w-0 shrink-0 basis-[82%] sm:basis-[55%] lg:basis-[38%]",
              )}
            >
              <MediaCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
