"use client";

import { Play } from "lucide-react";
import { useState, type ReactNode } from "react";

import { ProjectSocialLinks } from "@/components/pop/social-links";
import { parseMediaUrl } from "@/lib/embed/parseMediaUrl";
import type { MediaProvider, Project } from "@/lib/types";

import { CenterLoop } from "./CenterLoop";
import { LazyEmbed } from "./LazyEmbed";
import { MediaFallback } from "./MediaFallback";

const FRAME = "relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-cocoa";

const PROVIDER_LABEL: Record<MediaProvider, string> = {
  drive: "Drive",
  gphotos: "Google Fotos",
  youtube: "YouTube",
  vimeo: "Vimeo",
  instagram: "Instagram",
  image: "la imagen",
  link: "el enlace",
};

const VIDEO_FILE = /\.(m4v|mov|mp4|ogg|webm)$/i;

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

function Still({ src, onError }: { src: string; onError?: () => void }) {
  return (
    // Archivo propio o miniatura externa: mismo recuadro 4/3 en todas las tarjetas.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      decoding="async"
      loading="lazy"
      fetchPriority="low"
      src={src}
      alt=""
      className="absolute inset-0 size-full object-cover"
      onError={onError}
    />
  );
}

function PlayButton({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="group absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cream"
      onClick={onClick}
      aria-label={`Reproducir ${title}`}
    >
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-sun text-cocoa shadow-[0_10px_30px_-10px_rgb(91_5_80/0.6)] ring-4 ring-white/70 transition-transform duration-150 group-hover:scale-105">
          <Play className="size-6 translate-x-px" fill="currentColor" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}

export function MediaCard({ project }: MediaCardProps) {
  const [thumbFailed, setThumbFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const parsed = parseMediaUrl(project.url);
  const provider = project.provider;
  const embedUrl = project.embedUrl ?? parsed.embedUrl;
  const thumbnailUrl = project.thumbnailUrl ?? parsed.thumbnailUrl;
  const clipSrc = project.clipUrl || (isVideoFile(project.url) ? project.url : null);
  const canInlineEmbed =
    !thumbFailed &&
    Boolean(embedUrl) &&
    (provider === "youtube" ||
      provider === "vimeo" ||
      provider === "instagram" ||
      (provider === "drive" && parsed.canEmbed));

  const showStill = !clipSrc && (provider === "image" || !project.url) && Boolean(thumbnailUrl) && !thumbFailed;
  let frame: ReactNode = null;
  if (open && canInlineEmbed && embedUrl) {
    frame = (
      <iframe
        className="absolute inset-0 size-full border-0"
        src={embedUrl}
        title={project.title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  } else if (clipSrc) {
    frame = (
      <>
        <CenterLoop src={clipSrc} poster={thumbFailed ? null : thumbnailUrl} start={project.clipStart} />
        {canInlineEmbed ? <PlayButton title={project.title} onClick={() => setOpen(true)} /> : null}
      </>
    );
  } else if (showStill && thumbnailUrl) {
    frame = <Still src={thumbnailUrl} onError={() => setThumbFailed(true)} />;
  }

  return (
    <article className="flex w-full flex-col">
      {frame ? (
        <div className={FRAME}>{frame}</div>
      ) : canInlineEmbed && embedUrl ? (
        <LazyEmbed
          embedUrl={embedUrl}
          aspect="4/3"
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
          aspect="4/3"
        />
      )}
      {open && project.url ? (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-[13px] text-cocoa-2 underline-offset-4 hover:text-cocoa hover:underline"
        >
          ¿No carga? Abrir en {PROVIDER_LABEL[provider]}
        </a>
      ) : null}
      <div className="mt-4 flex flex-col gap-1.5 px-1">
        {project.date ? (
          <time dateTime={project.date} className="pop-label text-sun-deep">
            {formatDate(project.date)}
          </time>
        ) : null}
        <h3 className="text-[18px] leading-snug font-bold text-balance text-cocoa md:text-[19px]">
          {project.title}
        </h3>
        {project.description ? (
          <p className="max-w-[62ch] text-[15px] leading-relaxed whitespace-pre-line text-cocoa-2">{project.description}</p>
        ) : null}
        <ProjectSocialLinks
          socials={project.socials}
          links={project.links}
          title={project.title}
          className="mt-3"
        />
      </div>
    </article>
  );
}
