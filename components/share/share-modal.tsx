"use client";

import dynamic from "next/dynamic";
import { Modal } from "@/components/ui";

// El placeholder replica el alto real (QR 224 + botones) para que el modal
// no cambie de tamaño ni se mueva cuando termina de cargar el chunk.
const ShareContent = dynamic(() => import("./share-content"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[424px] w-full flex-col items-center gap-5" aria-hidden>
      <div className="size-56 animate-pulse rounded-xl bg-peach" />
    </div>
  ),
});

export interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title: string;
}

export function ShareModal({ open, onOpenChange, url, title }: ShareModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Compartí mi portafolio"
      description="Escaneá el QR con la cámara del celu o mandá el link por WhatsApp."
      className="max-w-md rounded-[28px] border-0 bg-cream [&_h2]:font-pop [&_h2]:text-rose-deep [&_p]:text-cocoa"
    >
      {open ? <ShareContent url={url} title={title} /> : null}
    </Modal>
  );
}
