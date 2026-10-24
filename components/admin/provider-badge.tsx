import { cn } from "@/lib/utils";
import type { MediaProvider } from "@/lib/types";

const styles: Record<MediaProvider, { label: string; className: string }> = {
  youtube: { label: "YouTube", className: "bg-paper-2 text-ink" },
  drive: { label: "Drive", className: "bg-paper-2 text-ink" },
  gphotos: { label: "Google Fotos", className: "bg-muted text-subtle" },
  vimeo: { label: "Vimeo", className: "bg-muted text-foreground" },
  image: { label: "Imagen", className: "bg-muted text-foreground" },
  link: { label: "Link", className: "bg-muted text-subtle" },
};

export function ProviderBadge({
  provider,
  className,
}: {
  provider: MediaProvider;
  className?: string;
}) {
  const s = styles[provider] ?? styles.link;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        s.className,
        className,
      )}
    >
      {s.label}
    </span>
  );
}
