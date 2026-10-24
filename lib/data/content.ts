import { perfil, secciones, type Seccion } from "@/contenido";
import { parseMediaUrl } from "@/lib/embed/parseMediaUrl";
import { resolveThumbnail } from "@/lib/embed/thumbnails";
import type { Category, Profile, Project } from "@/lib/types";

/*
 * Convierte `contenido.ts` (lo que se edita a mano) en los tipos que usa la
 * landing. El proveedor, el embed y la miniatura salen del link.
 */

export interface LandingData {
  profile: Profile;
  categories: Category[];
  projects: Project[];
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildProfile(): Profile {
  return {
    fullName: perfil.nombre,
    tagline: perfil.rol,
    bio: perfil.bio,
    photoUrl: perfil.foto,
    email: perfil.email || null,
    whatsapp: perfil.whatsapp || null,
    socials: perfil.redes,
    skills: perfil.habilidades,
    education: perfil.formacion,
  };
}

export function buildCategories(source: Seccion[] = secciones): Category[] {
  return source.map((seccion, position) => ({
    id: `cat-${slug(seccion.ancla || seccion.nombre)}`,
    name: seccion.nombre,
    slug: slug(seccion.ancla || seccion.nombre),
    intro: seccion.intro ?? null,
    skills: seccion.habilidades ?? [],
    position,
  }));
}

export function buildProjects(source: Seccion[] = secciones): Project[] {
  const categories = buildCategories(source);
  return source.flatMap((seccion, ci) =>
    seccion.trabajos.map((trabajo, position) => {
      const url = trabajo.link?.trim() ?? "";
      const parsed = parseMediaUrl(url);
      return {
        id: `${categories[ci].id}-${position}-${slug(trabajo.titulo)}`,
        categoryId: categories[ci].id,
        title: trabajo.titulo,
        description: trabajo.descripcion?.trim() || null,
        url,
        provider: parsed.provider,
        embedUrl: parsed.embedUrl,
        thumbnailUrl: parsed.thumbnailUrl,
        date: trabajo.fecha && DATE.test(trabajo.fecha) ? trabajo.fecha : null,
        position,
        isFeatured: Boolean(trabajo.destacado),
      };
    }),
  );
}

/**
 * Datos de la landing. En el build se buscan las miniaturas que no salen del
 * link (Vimeo, Google Fotos); si falla la red, la tarjeta usa su fallback.
 */
export async function getLandingData(): Promise<LandingData> {
  const projects = await Promise.all(
    buildProjects().map(async (project) => {
      if (project.thumbnailUrl || (project.provider !== "vimeo" && project.provider !== "gphotos")) {
        return project;
      }
      const thumbnailUrl = await resolveThumbnail(parseMediaUrl(project.url));
      return { ...project, thumbnailUrl };
    }),
  );
  return { profile: buildProfile(), categories: buildCategories(), projects };
}
