"use client";

import { Play } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type EmbedAspect = "16/9" | "9/16";

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
  const frame = aspect === "9/16" ? "aspect-[9/16] max-w-sm" : "aspect-video";
  const openUrl = originalUrl || embedUrl;

  return (
    <div className={cn("flex w-full flex-col gap-2", aspect === "9/16" && "items-center")}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl bg-neutral-900",
          frame,
        )}
      >
        {active ? (
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={embedUrl}
            title={title}
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture"
          />
        ) : (
          <motion.button
            type="button"
            className="group absolute inset-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={() => setActive(true)}
            aria-label={`Reproducir ${title}`}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
          >
            {thumbnailUrl ? (
              // Miniaturas externas (YouTube, Drive, Vimeo): el dominio no está en next/image.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                decoding="async"
                src={thumbnailUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={onThumbnailError}
              />
            ) : (
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,#3f3834,#161311)]" />
            )}
            <span className="absolute inset-0 bg-black/25" />
            <span className="absolute left-1/2 top-1/2 flex h-14 min-h-[56px] w-14 min-w-[56px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-950 shadow-lg transition-transform group-hover:scale-105 motion-reduce:transform-none">
              <Play className="size-7 translate-x-px" fill="currentColor" aria-hidden="true" />
            </span>
          </motion.button>
        )}
      </div>
      {active ? (
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-foreground/70 underline-offset-2 hover:underline"
        >
          ¿No carga? Abrir en {providerLabel}
        </a>
      ) : null}
    </div>
  );
}
