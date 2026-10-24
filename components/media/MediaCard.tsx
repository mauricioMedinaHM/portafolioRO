"use client";

import { useState } from "react";

import { parseMediaUrl } from "@/lib/embed/parseMediaUrl";
import type { MediaProvider, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

import type { EmbedAspect } from "./LazyEmbed";
import { LazyEmbed } from "./LazyEmbed";
import { MediaFallback } from "./MediaFallback";

const PROVIDER_LABEL: Record<MediaProvider, string> = {
  drive: "Drive",
  gphotos: "Google Fotos",
  youtube: "YouTube",
  vimeo: "Vimeo",
  image: "la imagen",
  link: "el enlace",
};

const VIDEO_FILE = /\.(m4v|mov|mp4|ogg|webm)$/i;

function isYouTubeShort(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    return (
      (host === "youtube.com" || host === "m.youtube.com") &&
      parsed.pathname.startsWith("/shorts/")
    );
  } catch {
    return false;
  }
}

function isVideoFile(url: string): boolean {
  try {
    return VIDEO_FILE.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function fallbackLabel(provider: MediaProvider): string {
  if (provider === "gphotos") return "Ver en Google Fotos";
  if (provider === "image") return "Ver imagen";
  return "Ver video";
}

export interface MediaCardProps {
  project: Project;
}

export function MediaCard({ project }: MediaCardProps) {
  const [thumbFailed, setThumbFailed] = useState(false);
  const parsed = parseMediaUrl(project.url);
  const provider = project.provider;
  const embedUrl = project.embedUrl ?? parsed.embedUrl;
  const thumbnailUrl = project.thumbnailUrl ?? parsed.thumbnailUrl;
  const aspect: EmbedAspect = isYouTubeShort(project.url) ? "9/16" : "16/9";
  const canInlineEmbed =
    !thumbFailed &&
    Boolean(embedUrl) &&
    (provider === "youtube" ||
      provider === "vimeo" ||
      (provider === "drive" && parsed.canEmbed));

  return (
    <article className="flex w-full flex-col">
      {provider === "image" && !thumbFailed ? (
        <div
          className={cn(
            "relative w-full overflow-hidden bg-ink",
            aspect === "9/16" ? "aspect-[9/16] max-w-sm" : "aspect-video",
          )}
        >
          {isVideoFile(project.url) ? (
            <video
              className="h-full w-full object-cover"
              src={project.url}
              controls
              playsInline
              preload="metadata"
              poster={thumbnailUrl ?? undefined}
              onError={() => setThumbFailed(true)}
            />
          ) : (
            // Archivo subido o URL de imagen arbitraria, fuera de los remotePatterns.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              decoding="async"
              src={thumbnailUrl || project.url}
              alt={project.title}
              className="h-full w-full object-cover"
              onError={() => setThumbFailed(true)}
            />
          )}
        </div>
      ) : canInlineEmbed && embedUrl ? (
        <LazyEmbed
          embedUrl={embedUrl}
          aspect={aspect}
          title={project.title}
          thumbnailUrl={thumbnailUrl}
          originalUrl={project.url}
          providerLabel={PROVIDER_LABEL[provider]}
          onThumbnailError={() => setThumbFailed(true)}
        />
      ) : (
        <MediaFallback
          href={project.url}
          label={fallbackLabel(provider)}
          thumbnailUrl={thumbFailed ? null : thumbnailUrl}
          aspect={aspect}
        />
      )}
      <div className="mt-4 flex flex-col gap-2">
        {project.date ? (
          <time dateTime={project.date} className="meta text-ink-3">
            {formatDate(project.date)}
          </time>
        ) : null}
        <h3 className="font-display text-[19px] leading-snug font-normal tracking-[-0.02em] text-ink md:text-[22px]">
          {project.title}
        </h3>
        {project.description ? (
          <p className="max-w-[62ch] text-[17px] leading-relaxed text-ink-2">{project.description}</p>
        ) : null}
      </div>
    </article>
  );
}
