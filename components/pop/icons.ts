import {
  BriefcaseBusiness,
  CalendarDays,
  Clapperboard,
  GraduationCap,
  MonitorPlay,
  Radio,
  Smartphone,
  Tv,
  Tent,
  type LucideIcon,
} from "lucide-react";

const BY_SLUG: Record<string, LucideIcon> = {
  conduccion: Tv,
  streaming: MonitorPlay,
  "generacion-tech": Clapperboard,
  eventos: CalendarDays,
  extension: GraduationCap,
  experiencia: BriefcaseBusiness,
  "mundo-scout": Tent,
  // Compatibilidad con slugs anteriores.
  radio: Radio,
  redes: Smartphone,
};

/** Ícono por categoría (slug); las secciones nuevas de contenido.ts usan uno genérico. */
export function categoryIcon(slug: string): LucideIcon {
  return BY_SLUG[slug] ?? Clapperboard;
}
