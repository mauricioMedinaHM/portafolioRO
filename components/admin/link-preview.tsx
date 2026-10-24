"use client";

import { useMemo } from "react";
import { parseMediaUrl } from "@/lib/embed/parseMediaUrl";
import { cn } from "@/lib/utils";
import { ProviderBadge } from "./provider-badge";

const notes: Record<string, string | null> = {
  drive:
    "Asegurate de compartir el archivo como «Cualquier persona con el enlace» en Drive.",
  gphotos:
    "Google Fotos no se puede embeber: en la landing se muestra como tarjeta con link.",
  link: "Este link no se puede embeber: se muestra como tarjeta con link.",
};

/** Preview en vivo del link pegado (usa el mismo parser que el servidor). */
export function LinkPreview({ url }: { url: string }) {
  const media = useMemo(() => {
    if (!url || !/^https?:\/\/.+\..+/.test(url.trim())) return null;
    try {
      return parseMediaUrl(url);
    } catch {
      return null;
    }
  }, [url]);

  if (!media) return null;

  const note = notes[media.provider] ?? null;

  return (
    <div className="flex gap-3 rounded-xl border border-border bg-muted/60 p-3">
      {media.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media.thumbnailUrl}
          alt=""
          className="aspect-video w-24 shrink-0 rounded-lg bg-foreground/10 object-cover"
        />
      ) : (
        <div className="flex aspect-video w-24 shrink-0 items-center justify-center rounded-lg bg-foreground/10 text-xs text-subtle">
          Sin miniatura
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-1">
        <ProviderBadge provider={media.provider} className="self-start" />
        <p
          className={cn(
            "text-xs",
            media.canEmbed ? "text-secondary-strong" : "text-subtle",
          )}
        >
          {media.canEmbed ? "Se reproduce dentro de la landing." : "Abre en una pestaña nueva."}
        </p>
        {note ? <p className="text-xs text-accent-strong">{note}</p> : null}
      </div>
    </div>
  );
}
