"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="ui-overlay fixed inset-0 z-50 bg-ink/40" />
        <Dialog.Content
          className={cn(
            "ui-modal fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
            "rounded-[28px] border-2 border-line bg-paper p-6",
            "max-h-[85dvh] overflow-y-auto",
            "focus:outline-none",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            {title ? (
              <Dialog.Title className="font-pop text-[28px] leading-none text-sun">
                {title}
              </Dialog.Title>
            ) : (
              <Dialog.Title className="sr-only">Diálogo</Dialog.Title>
            )}
            <Dialog.Close
              aria-label="Cerrar"
              className="inline-flex min-h-12 min-w-12 items-center justify-center text-ink-3 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>
          {description ? (
            <Dialog.Description className="mt-2 text-[15px] text-ink-3">
              {description}
            </Dialog.Description>
          ) : null}
          <div className="mt-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
