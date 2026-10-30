"use client";

import { AnimatePresence, motion } from "motion/react";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type EmbedAspect = "16/9" | "9/16" | "4/3";

const FRAME: Record<EmbedAspect, string> = {
  "16/9": "aspect-video",
  "9/16": "aspect-[9/16] max-w-[300px]",
  "4/3": "aspect-[4/3]",
};

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export interface LazyEmbedProps {
  embedUrl: string;
  title: string;
  aspect?: EmbedAspect;
  thumbnailUrl?: string | null;
  originalUrl?: string;
  providerLabel?: string;
  onThumbnailError?: () => void;
}

export function LazyEmbed({
  embedUrl,
  title,
  aspect = "16/9",
  thumbnailUrl,
  originalUrl,
  providerLabel = "el sitio",
  onThumbnailError,
}: LazyEmbedProps) {
  const [active, setActive] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const frame = FRAME[aspect];
  const openUrl = originalUrl || embedUrl;

  useEffect(() => {
    if (active) {
      iframeRef.current?.focus();
    }
  }, [active]);

  return (
    <div className={cn("flex w-full flex-col gap-2", aspect === "9/16" && "items-center")}>
      <div className={cn("relative w-full overflow-hidden rounded-[22px] bg-cocoa", frame)}>
        <AnimatePresence initial={false} mode="sync">
          {active ? (
            <motion.iframe
              key="iframe"
              ref={iframeRef}
              className="absolute inset-0 h-full w-full border-0"
              src={embedUrl}
              title={title}
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
            />
          ) : (
            <motion.button
              key="thumb"
              type="button"
              className="group absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cream"
              onClick={() => setActive(true)}
              aria-label={`Reproducir ${title}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
            >
              {thumbnailUrl ? (
                // Miniaturas externas (YouTube, Drive, Vimeo): el dominio no está en next/image.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  decoding="async"
                  loading="lazy"
                  fetchPriority="low"
                  width={480}
                  height={360}
                  src={thumbnailUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={onThumbnailError}
                />
              ) : (
                <span className="absolute inset-0 bg-ink" />
              )}
              <span className="absolute inset-0 bg-cocoa/10 transition-colors group-hover:bg-cocoa/25" />
              <span className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="flex size-16 items-center justify-center rounded-full bg-sun text-cocoa shadow-[0_10px_30px_-10px_rgb(91_5_80/0.6)] ring-4 ring-white/70"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.12, ease: EASE_OUT }}
                >
                  <Play className="size-6 translate-x-px" fill="currentColor" aria-hidden="true" />
                </motion.span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      {active ? (
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-ink-3 underline-offset-4 hover:text-ink hover:underline"
        >
          ¿No carga? Abrir en {providerLabel}
        </a>
      ) : null}
    </div>
  );
}
