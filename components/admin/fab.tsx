import Link from "next/link";
import { Plus } from "lucide-react";

/** Botón flotante «+ Nuevo» (queda por encima del nav inferior). */
export function FabNew() {
  return (
    <Link
      href="/admin/proyectos/nuevo"
      aria-label="Nuevo proyecto"
      className="fixed right-5 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 inline-flex min-h-14 min-w-14 items-center justify-center gap-2 bg-ink px-5 font-medium text-paper transition-colors hover:bg-ink-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
    >
      <Plus className="size-5" aria-hidden />
      Nuevo
    </Link>
  );
}
