"use client";

import { useEffect, useRef } from "react";

import { useLoopSlot } from "./loop-viewport";

/** Margen antes del final a partir del cual se vuelve a `start` (bucle manual). */
const LOOP_MARGIN = 0.08;

export interface CenterLoopProps {
  src: string;
  poster?: string | null;
  /** Segundo desde el que arranca y reinicia el bucle. Con 0 se usa el `loop` nativo. */
  start?: number;
}

/**
 * Clip mudo en bucle que sólo se monta cerca del centro de la pantalla.
 * La miniatura queda visible debajo hasta que el video tiene cuadros para
 * mostrar (readyState >= 3); recién ahí el video aparece con un fundido corto.
 */
export function CenterLoop({ src, poster, start = 0 }: CenterLoopProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const active = useLoopSlot(rootRef);
  const from = start > 0 ? start : 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hide = () => {
      video.style.transition = "none";
      video.style.opacity = "0";
    };
    const settle = () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      hide();
    };

    if (!active) {
      settle();
      return;
    }

    let cancelled = false;
    let raf = 0;
    let shown = false;

    const reveal = () => {
      if (cancelled || shown || video.paused || video.readyState < 3) return;
      shown = true;
      video.style.transition = "opacity 250ms ease-out";
      video.style.opacity = "1";
    };
    const seekToStart = () => {
      if (from > 0 && video.currentTime < from - 0.05) video.currentTime = from;
    };
    const tick = () => {
      if (cancelled) return;
      const end = video.duration;
      if (Number.isFinite(end) && end > from && video.currentTime >= end - LOOP_MARGIN) {
        video.currentTime = from;
      }
      raf = requestAnimationFrame(tick);
    };

    hide();
    video.muted = true;
    video.defaultMuted = true;
    video.playbackRate = 1;
    video.loop = from === 0;
    video.addEventListener("loadedmetadata", seekToStart);
    video.addEventListener("canplay", reveal);
    video.addEventListener("playing", reveal);
    // El fragmento #t= hace que el primer cuadro decodificado ya sea el bueno.
    video.src = from > 0 ? `${src}#t=${from}` : src;
    video.play().then(reveal).catch(() => {
      if (!cancelled) settle();
    });
    if (from > 0) raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", seekToStart);
      video.removeEventListener("canplay", reveal);
      video.removeEventListener("playing", reveal);
      settle();
    };
  }, [active, src, from]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      {poster ? (
        // Miniatura local del fragmento: el video sólo se monta cerca del centro.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" loading="lazy" fetchPriority="low" decoding="async" className="absolute inset-0 size-full object-cover" />
      ) : null}
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        style={{ opacity: 0 }}
        muted
        playsInline
        preload="none"
        aria-hidden
      />
    </div>
  );
}
