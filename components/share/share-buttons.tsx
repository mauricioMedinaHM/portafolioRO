"use client";

import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface ShareButtonsProps {
  url: string;
  title: string;
  text?: string;
  className?: string;
}

/** «Compartir» usa navigator.share cuando existe; si no, copia el link. */
export function ShareButtons({ url, title, text, className }: ShareButtonsProps) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado");
    } catch {
      toast.error("No se pudo copiar el link");
    }
  }

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
      }
    }
    await copy();
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Button variant="pop" onClick={share} className="w-full">
        <Share2 className="size-4" aria-hidden />
        Compartir
      </Button>
      <Button variant="ghost" onClick={copy} className="w-full rounded-full">
        <Copy className="size-4" aria-hidden />
        Copiar link
      </Button>
    </div>
  );
}
