"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ImageReelItem {
  src: string;
  alt: string;
}

const REMOTE_HOSTS = new Set(["i.ytimg.com", "drive.google.com", "lh3.googleusercontent.com"]);

const REEL_CSS = `
@keyframes image-reel-drift {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}
.image-reel-track {
  animation: image-reel-drift 32s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .image-reel-track { animation: none !important; }
}
`;

function usable(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return REMOTE_HOSTS.has(new URL(src).hostname);
  } catch {
    return false;
  }
}

function ReelFrame({ src, sizes }: { src: string; sizes: string }) {
  return (
    <div className="relative h-full w-[42vw] max-w-[200px] min-w-[120px] shrink-0 sm:w-[180px]">
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        quality={50}
        loading="lazy"
        fetchPriority="low"
        className="object-cover"
      />
    </div>
  );
}

/**
 * Galería horizontal infinita, lenta y translúcida. Pausa fuera de viewport.
 * Con prefers-reduced-motion queda una sola imagen fija. Máximo 8 fuentes;
 * a ≤480px carga 4. Inspirado en Reel Gallery / Infinite Gallery (React Bits).
 */
export function ImageReel({ images, className }: { images: ImageReelItem[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [reel, setReel] = useState(false);
  const [limit, setLimit] = useState(4);
  const [playing, setPlaying] = useState(false);
  const pool = images.filter((item) => item.src && usable(item.src)).slice(0, 8);
  const shown = pool.slice(0, limit);
  const cover = shown[0];

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrowQuery = window.matchMedia("(max-width: 480px)");
    if (reduce) {
      setLimit(1);
      setReel(false);
      return;
    }

    const applyWidth = () => setLimit(narrowQuery.matches ? 4 : 8);
    applyWidth();
    setReel(true);
    narrowQuery.addEventListener("change", applyWidth);

    const node = ref.current;
    if (!node) {
      return () => narrowQuery.removeEventListener("change", applyWidth);
    }
    const io = new IntersectionObserver(([entry]) => {
      setPlaying(Boolean(entry?.isIntersecting));
    });
    io.observe(node);

    return () => {
      io.disconnect();
      narrowQuery.removeEventListener("change", applyWidth);
    };
  }, []);

  if (!cover) return null;

  return (
    <div ref={ref} className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <style>{REEL_CSS}</style>
      <div className="absolute inset-0 opacity-[0.18]">
        {reel ? (
          <div
            className="image-reel-track flex h-full w-max"
            style={{ animationPlayState: playing ? "running" : "paused" }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex h-full shrink-0 gap-2 pr-2">
                {shown.map((item, index) => (
                  <ReelFrame key={`${item.src}-${index}`} src={item.src} sizes="(max-width: 480px) 120px, 180px" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="relative size-full">
            <Image
              src={cover.src}
              alt=""
              fill
              sizes="240px"
              quality={50}
              loading="lazy"
              fetchPriority="low"
              className="object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--color-ultramarine)_58%,var(--color-amethyst))] mix-blend-color" />
      </div>
    </div>
  );
}
