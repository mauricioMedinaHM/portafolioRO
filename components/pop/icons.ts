import {
  BriefcaseBusiness,
  Clapperboard,
  GraduationCap,
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
  "generacion-tech": Clapperboard,
  moviles: Mic,
  extension: GraduationCap,
  experiencia: BriefcaseBusiness,
  // Compatibilidad con slugs anteriores.
  radio: Radio,
  redes: Smartphone,
};

/** Ícono por categoría (slug); las secciones nuevas de contenido.ts usan uno genérico. */
export function categoryIcon(slug: string): LucideIcon {
  return BY_SLUG[slug] ?? Clapperboard;
}
