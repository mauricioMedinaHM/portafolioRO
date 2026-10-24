"use client";

import dynamic from "next/dynamic";
import { Modal } from "@/components/ui";

const ShareContent = dynamic(() => import("./share-content"), {
  ssr: false,
  loading: () => <div className="mx-auto h-72 w-full max-w-xs animate-pulse bg-paper-2" />,
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
      title="Compartir"
      description="Escaneá el QR o mandá el link directo."
    >
      {open ? <ShareContent url={url} title={title} /> : null}
    </Modal>
  );
}
