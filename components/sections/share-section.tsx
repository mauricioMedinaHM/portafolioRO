"use client";

import dynamic from "next/dynamic";
import { Reveal, Section } from "@/components/ui";

const ShareContent = dynamic(() => import("@/components/share/share-content"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto h-80 w-full max-w-xs animate-pulse rounded-2xl bg-muted" />
  ),
});

/** Sección #compartir: QR visible + descarga + compartir/copiar. */
export function ShareSection({ url, title }: { url: string; title: string }) {
  return (
    <Section
      id="compartir"
      title="Compartí el portafolio"
      intro="Escaneá el QR con la cámara del celu o mandá el link por WhatsApp."
    >
      <Reveal>
        <div className="rounded-card border border-border bg-surface p-6 shadow-card">
          <ShareContent url={url} title={title} />
        </div>
      </Reveal>
    </Section>
  );
}
