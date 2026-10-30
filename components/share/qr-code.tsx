"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/utils";

const DARK = "#5735a8";
const LIGHT = "#F6FFE9";

function isIos() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export interface QrCodeProps {
  value: string;
  /** Tamaño del canvas visible en px. */
  size?: number;
  /** Nombre del PNG descargable (1024px). Si no se pasa, no hay botón. */
  downloadName?: string;
  className?: string;
}

export function QrCode({ value, size = 220, downloadName, className }: QrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    QRCode.toCanvas(canvas, value, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: DARK, light: LIGHT },
    }).catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  async function download() {
    setBusy(true);
    try {
      const dataUrl = await QRCode.toDataURL(value, {
        width: 1024,
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: DARK, light: LIGHT },
      });
      if (isIos()) {
        window.open(dataUrl, "_blank", "noopener");
        toast.success("Mantené apretada la imagen para guardarla");
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = downloadName ?? "qr.png";
        a.click();
        toast.success("QR descargado");
      }
    } catch {
      toast.error("No se pudo generar el QR");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      {failed ? (
        <div
          className="flex items-center justify-center bg-paper-2 text-[15px] text-ink-3"
          style={{ width: size, height: size }}
        >
          No se pudo generar el QR
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          aria-label={`Código QR para ${value}`}
          role="img"
          className="rounded-xl bg-paper"
          style={{ width: size, height: size }}
        />
      )}
      {downloadName ? (
        <button
          type="button"
          onClick={download}
          disabled={busy || failed}
          className={cn(buttonVariants({ variant: "pop-outline" }), "w-full max-w-xs")}
        >
          <Download className="size-4" aria-hidden />
          {busy ? "Generando…" : "Descargar QR (PNG)"}
        </button>
      ) : null}
    </div>
  );
}
