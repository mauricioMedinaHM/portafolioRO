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
        <Dialog.Overlay className="ui-overlay fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            "ui-modal fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
            "rounded-card border border-border bg-surface p-6 shadow-lift",
            "max-h-[85dvh] overflow-y-auto",
            "focus:outline-none",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            {title ? (
              <Dialog.Title className="font-display text-2xl text-foreground">
                {title}
              </Dialog.Title>
            ) : (
              <Dialog.Title className="sr-only">Diálogo</Dialog.Title>
            )}
            <Dialog.Close
              aria-label="Cerrar"
              className="inline-flex min-h-12 min-w-12 -translate-y-2 translate-x-2 items-center justify-center rounded-full text-subtle transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>
          {description ? (
            <Dialog.Description className="mt-1 text-sm text-subtle">
              {description}
            </Dialog.Description>
          ) : null}
          <div className="mt-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
