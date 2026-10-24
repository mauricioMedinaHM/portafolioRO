"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, RefreshCw } from "lucide-react";
import { uploadProfilePhoto } from "@/app/admin/actions/profile";
import { compressImage } from "./compress-image";

/** Subida de foto: comprime a WebP ≤1600px en el cliente y sube al bucket. */
export function PhotoUpload({
  value,
  onUploaded,
}: {
  value: string | null;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Foto de perfil" className="size-full object-cover" />
        ) : (
          <ImagePlus className="size-7 text-subtle" aria-hidden />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
        >
          <RefreshCw className="size-4" aria-hidden />
          {busy ? "Subiendo…" : value ? "Cambiar foto" : "Subir foto"}
        </button>
        <p className="text-xs text-subtle">
          Se comprime a WebP de máx. 1600 px antes de subir.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          try {
            const blob = await compressImage(file);
            const formData = new FormData();
            formData.append("file", new File([blob], "foto.webp", { type: "image/webp" }));
            const result = await uploadProfilePhoto(formData);
            if (result.ok) {
              onUploaded(result.url);
              toast.success("Foto subida");
            } else {
              toast.error(result.error);
            }
          } catch {
            toast.error("No se pudo procesar la imagen");
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}
