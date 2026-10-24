"use client";

import { Play } from "lucide-react";
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
      <div className={cn("relative w-full overflow-hidden bg-ink", frame)}>
        {active ? (
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={embedUrl}
            title={title}
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="group absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
            onClick={() => setActive(true)}
            aria-label={`Reproducir ${title}`}
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
              <span className="absolute inset-0 bg-ink" />
            )}
            <span className="absolute inset-0 bg-ink/15 transition-colors group-hover:bg-ink/25" />
            <span className="absolute top-1/2 left-1/2 flex size-14 min-h-14 min-w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-paper text-ink">
              <Play className="size-6 translate-x-px" fill="currentColor" aria-hidden="true" />
            </span>
          </button>
        )}
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
