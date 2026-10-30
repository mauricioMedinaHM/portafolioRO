"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import type { EmbedAspect } from "./LazyEmbed";

const FRAME: Record<EmbedAspect, string> = {
  "16/9": "aspect-video",
  "9/16": "aspect-[9/16] max-w-[300px]",
  "4/3": "aspect-[4/3]",
};

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
  const frame = FRAME[aspect];
  const showThumb = Boolean(thumbnailUrl) && !thumbFailed;

  return (
    <div className={cn("flex w-full", aspect === "9/16" && "justify-center")}>
      <div className={cn("relative flex w-full items-center justify-center overflow-hidden rounded-[22px] bg-cocoa", frame)}>
        {showThumb ? (
          // La miniatura puede venir de un og:image externo que no está en next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            decoding="async"
            loading="lazy"
            fetchPriority="low"
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
          className="relative z-10 inline-flex min-h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-cream px-5 text-[15px] font-bold text-cocoa focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        >
          {label}
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
