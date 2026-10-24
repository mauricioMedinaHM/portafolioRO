"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import type { EmbedAspect } from "./LazyEmbed";

export interface MediaFallbackProps {
  href: string;
  label?: string;
  thumbnailUrl?: string | null;
  aspect?: EmbedAspect;
}

export function MediaFallback({
  href,
  label = "Ver video",
  thumbnailUrl,
  aspect = "16/9",
}: MediaFallbackProps) {
  const [thumbFailed, setThumbFailed] = useState(false);
  const frame = aspect === "9/16" ? "aspect-[9/16] max-w-sm" : "aspect-video";
  const showThumb = Boolean(thumbnailUrl) && !thumbFailed;

  return (
    <div className={cn("flex w-full", aspect === "9/16" && "justify-center")}>
      <div className={cn("relative flex w-full items-center justify-center overflow-hidden bg-ink", frame)}>
        {showThumb ? (
          // La miniatura puede venir de un og:image externo que no está en next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            decoding="async"
            src={thumbnailUrl ?? undefined}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setThumbFailed(true)}
          />
        ) : null}
        {showThumb ? <span className="absolute inset-0 bg-ink/25" /> : null}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex min-h-14 min-w-14 items-center justify-center gap-2 bg-paper px-5 text-[15px] font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        >
          {label}
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
