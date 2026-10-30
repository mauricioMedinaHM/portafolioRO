"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface HeroClipProps {
  /** Foto nítida que se ve mientras carga el clip (y siempre, si no hay clip). */
  poster: string;
  alt: string;
  /** Clip mudo en bucle. Sin él (o con "menos movimiento") queda sólo la foto. */
  src?: string | null;
  sizes: string;
  className?: string;
}

/**
 * Retrato del hero: la foto carga con prioridad y el clip se superpone cuando
 * ya tiene cuadros (readyState >= 3). Fuera de la pantalla el video se pausa.
 */
export function HeroClip({ poster, alt, src, sizes, className }: HeroClipProps) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  // El video se monta recién en el cliente: así el HTML del servidor coincide
  // aunque el visitante prefiera menos movimiento.
  const useVideo = Boolean(src) && mounted && !reduce;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !useVideo) return;

    const reveal = () => {
      if (!video.paused && video.readyState >= 3) setReady(true);
    };
    const tryPlay = () => {
      video.play().then(reveal).catch(() => {});
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) tryPlay();
        else video.pause();
      },
      { threshold: 0.15 },
    );
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else tryPlay();
    };

    video.addEventListener("playing", reveal);
    video.addEventListener("canplay", reveal);
    document.addEventListener("visibilitychange", onVisibility);
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener("playing", reveal);
      video.removeEventListener("canplay", reveal);
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause();
    };
  }, [useVideo, src]);

  return (
    <div className={cn("absolute inset-0", className)}>
      <Image src={poster} alt={alt} fill priority sizes={sizes} className="object-cover object-[center_30%]" />
      {useVideo ? (
        <video
          ref={videoRef}
          src={src ?? undefined}
          className={cn(
            "absolute inset-0 size-full object-cover object-[center_30%] transition-opacity duration-300 ease-out",
            ready ? "opacity-100" : "opacity-0",
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          tabIndex={-1}
        />
      ) : null}
    </div>
  );
}
