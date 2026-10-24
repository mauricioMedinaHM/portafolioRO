"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Drawer } from "vaul";
import { cn } from "@/lib/utils";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  /** Lado desde el que entra el panel. En mobile-first el default es bottom. */
  side?: "bottom" | "right";
  children: ReactNode;
  className?: string;
}

export function Sheet({
  open,
  onOpenChange,
  title,
  side = "bottom",
  children,
  className,
}: SheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction={side}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Drawer.Content
          className={cn(
            "fixed z-50 flex flex-col border-line bg-paper focus:outline-none",
            side === "bottom" && "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-[28px] border-t",
            side === "right" && "inset-y-0 right-0 h-full w-full border-l sm:max-w-md",
            className,
          )}
        >
          {side === "bottom" ? (
            <div className="mx-auto mt-3 h-px w-10 shrink-0 bg-line" />
          ) : null}
          <div className="flex items-center justify-between gap-4 px-5 pt-5">
            {title ? (
              <Drawer.Title className="font-pop text-[26px] leading-none text-sun">
                {title}
              </Drawer.Title>
            ) : (
              <Drawer.Title className="sr-only">Panel</Drawer.Title>
            )}
            <Drawer.Close
              aria-label="Cerrar"
              className="inline-flex min-h-12 min-w-12 items-center justify-center text-ink-3 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <X className="size-5" aria-hidden />
            </Drawer.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
