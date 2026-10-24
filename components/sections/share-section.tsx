"use client";

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui";

const ShareContent = dynamic(() => import("@/components/share/share-content"), {
  ssr: false,
  loading: () => <div className="mx-auto h-80 w-full max-w-xs animate-pulse bg-paper-2" />,
});

/** Sección #compartir: QR visible + descarga + compartir/copiar. */
export function ShareSection({ url, title }: { url: string; title: string }) {
  return (
    <section id="compartir" className="scroll-mt-16 border-t border-line py-16 md:py-20">
      <div className="mx-auto grid w-full max-w-[1120px] grid-cols-12 items-center gap-x-6 gap-y-10 px-5 md:px-16">
        <Reveal className="col-span-12 md:col-span-5">
          <p className="meta text-ink-3">Link</p>
          <h2 className="mt-4 font-display text-[30px] leading-[1.05] font-normal tracking-[-0.02em] text-ink md:text-[48px]">
            Compartir
          </h2>
          <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-ink-2">
            Escaneá el QR con la cámara del celu o mandá el link por WhatsApp.
          </p>
        </Reveal>
        <Reveal delay={0.08} className="col-span-12 md:col-span-6 md:col-start-7">
          <div className="border border-line bg-paper px-6 py-8">
            <ShareContent url={url} title={title} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
