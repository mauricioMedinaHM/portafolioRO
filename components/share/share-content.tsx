import { QrCode } from "./qr-code";
import { ShareButtons } from "./share-buttons";

/**
 * Bloque de compartir: QR + botones. Se carga con dynamic import
 * (incluye la lib `qrcode`) desde el modal y la sección.
 */
export default function ShareContent({
  url,
  title,
  downloadName = "qr-rosario-pittis.png",
}: {
  url: string;
  title: string;
  downloadName?: string;
}) {
  const qrValue = `${url}/?utm_source=qr`;
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <QrCode value={qrValue} size={224} downloadName={downloadName} />
      <ShareButtons
        url={qrValue}
        title={title}
        text={`Portafolio de ${title}`}
        className="w-full max-w-xs"
      />
    </div>
  );
}
