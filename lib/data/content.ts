import { perfil, secciones, type Seccion } from "@/contenido";
import { parseMediaUrl } from "@/lib/embed/parseMediaUrl";
import { resolveThumbnail } from "@/lib/embed/thumbnails";
import type { Category, Profile, Project, ProjectLink, ProjectSocials } from "@/lib/types";

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

/** Sólo links http(s) no vacíos; los placeholders "" se descartan. */
function httpOrUndefined(value?: string) {
  const v = value?.trim();
  return v && /^https?:\/\//i.test(v) ? v : undefined;
}

/** Saca los parámetros de rastreo (?igsh=, ?srtk=…) de los links pegados. */
function stripTracking(value: string) {
  try {
    const url = new URL(value);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return value;
  }
}

function cleanLinks(enlaces?: { nombre: string; link: string }[]): ProjectLink[] {
  return (enlaces ?? []).flatMap(({ nombre, link }) => {
    const url = httpOrUndefined(link);
    return url && nombre?.trim() ? [{ label: nombre.trim(), url: stripTracking(url) }] : [];
  });
}

function cleanSocials(redes?: { instagram?: string; linkedin?: string }): ProjectSocials {
  const out: ProjectSocials = {};
  const instagram = httpOrUndefined(redes?.instagram);
  const linkedin = httpOrUndefined(redes?.linkedin);
  if (instagram) out.instagram = instagram;
  if (linkedin) out.linkedin = linkedin;
  return out;
}

/** Segundo de arranque del bucle; valores ausentes, negativos o no numéricos → 0. */
function clipStart(value?: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}

/** Ruta local a un archivo de video (en /public). */
function localVideoOrNull(value?: string) {
  const v = value?.trim();
  return v && /^\/.+\.(m4v|mov|mp4|webm)$/i.test(v) ? v : null;
}

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
    heroVideoUrl: localVideoOrNull(perfil.heroClip),
    email: perfil.email || null,
    whatsapp: perfil.whatsapp || null,
    // Redes del perfil: se omiten las vacías ("" o comentadas).
    socials: Object.fromEntries(
      Object.entries(perfil.redes as Record<string, string | undefined>).flatMap(([k, v]) => {
        const url = httpOrUndefined(v);
        return url ? [[k, url]] : [];
      }),
    ) as Profile["socials"],
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
    badge: seccion.etiqueta?.trim() || null,
    channel:
      seccion.canal && httpOrUndefined(seccion.canal.link)
        ? { label: seccion.canal.nombre, url: seccion.canal.link.trim() }
        : null,
    socials: cleanSocials(seccion.redes),
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
        thumbnailUrl: trabajo.miniatura?.trim() || parsed.thumbnailUrl,
        clipUrl: trabajo.clip?.trim() || null,
        clipStart: clipStart(trabajo.clipInicio),
        date: trabajo.fecha && DATE.test(trabajo.fecha) ? trabajo.fecha : null,
        position,
        isFeatured: Boolean(trabajo.destacado),
        socials: cleanSocials(trabajo.redes),
        links: cleanLinks(trabajo.enlaces),
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
