"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ClipboardPaste } from "lucide-react";
import { cn } from "@/lib/utils";

/** Botón "Pegar" que usa la Clipboard API (ideal para cargar links en el celu). */
export function PasteButton({
  onPaste,
  className,
}: {
  onPaste: (text: string) => void;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const text = await navigator.clipboard.readText();
          if (text.trim()) {
            onPaste(text.trim());
            toast.success("Link pegado");
          } else {
            toast.error("El portapapeles está vacío");
          }
        } catch {
          toast.error("No se pudo leer el portapapeles. Pegalo a mano.");
        } finally {
          setBusy(false);
        }
      }}
      className={cn(
        "inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors",
        "hover:bg-muted focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50",
        className,
      )}
    >
      <ClipboardPaste className="size-4" aria-hidden />
      Pegar
    </button>
  );
}
