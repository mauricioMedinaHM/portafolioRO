"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const CONTROL = "grid size-11 place-items-center rounded-full text-cocoa hover:bg-honeydew focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa disabled:opacity-40";

export function HorizontalRail({
  id,
  label,
  itemCount,
  heading,
  previousLabel = "Ver anteriores: " + label,
  nextLabel = "Ver más: " + label,
  className,
  children,
}: {
  id: string;
  label: string;
  itemCount: number;
  heading?: ReactNode;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
  children: ReactNode;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ previous: false, next: false });

  useEffect(() => {
    const track = rail.current;
    if (!track) return;

    const update = () => {
      const previous = track.scrollLeft > 2;
      const next = track.scrollLeft < track.scrollWidth - track.clientWidth - 2;
      setEdges((current) => current.previous === previous && current.next === next ? current : { previous, next });
    };

    update();
    const resize = new ResizeObserver(update);
    resize.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      resize.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, [itemCount]);

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

  const canScroll = edges.previous || edges.next;

  return (
    <>
      {(heading || canScroll) && (
        <div className={cn("flex items-end gap-3", heading ? "mb-3 justify-between" : "mb-1 justify-end")}>
          {heading}
          {canScroll && (
            <div className="flex shrink-0 rounded-full border border-cocoa/25 bg-cream p-0.5">
              <button type="button" aria-label={previousLabel} aria-controls={id} onClick={() => move(-1)} disabled={!edges.previous} className={CONTROL}>
                <ArrowLeft className="size-5" aria-hidden />
              </button>
              <button type="button" aria-label={nextLabel} aria-controls={id} onClick={() => move(1)} disabled={!edges.next} className={CONTROL}>
                <ArrowRight className="size-5" aria-hidden />
              </button>
            </div>
          )}
        </div>
      )}
      <ul
        id={id}
        ref={rail}
        aria-label={label}
        className={cn("flex snap-x snap-mandatory scroll-px-1 items-start gap-2 overflow-x-auto overscroll-x-contain px-1 pt-1 pb-2 md:gap-3 [&>li]:shrink-0 [&>li]:snap-start", className)}
        data-lenis-prevent-horizontal
      >
        {children}
      </ul>
    </>
  );
}
