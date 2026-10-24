import {
  Clapperboard,
  Mic,
  MonitorPlay,
  Radio,
  Smartphone,
  Tv,
  type LucideIcon,
} from "lucide-react";

const BY_SLUG: Record<string, LucideIcon> = {
  conduccion: Tv,
  streaming: MonitorPlay,
  moviles: Mic,
  radio: Radio,
  redes: Smartphone,
};

/** Ícono por categoría (slug); las secciones nuevas de contenido.ts usan uno genérico. */
export function categoryIcon(slug: string): LucideIcon {
  return BY_SLUG[slug] ?? Clapperboard;
}
