export type MediaProvider =
  | "drive"
  | "gphotos"
  | "youtube"
  | "vimeo"
  | "instagram"
  | "image"
  | "link";

export interface Profile {
  fullName: string;
  tagline: string;
  bio: string;
  photoUrl: string;
  heroVideoUrl: string | null; // clip mudo en bucle dentro del arco del hero (la foto queda de poster)
  email: string | null;
  whatsapp: string | null; // formato E.164
  socials: {
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
    x?: string;
  };
  skills?: string[]; // chips de habilidades (sección Sobre mí)
  education?: string[]; // formación y certificados ("Trayectoria")
}

export interface Category {
  id: string;
  name: string;
  slug: string; // slug = ancla #conduccion
  intro: string | null; // cualidades y habilidades (markdown simple)
  skills: string[]; // chips destacados
  badge: string | null; // etiqueta de color junto al título (ej. "UCaSal")
  channel: { label: string; url: string } | null; // botón al canal del programa
  socials: ProjectSocials; // Instagram / LinkedIn del programa
  position: number;
}

export interface Project {
  id: string;
  categoryId: string;
  title: string;
  description: string | null; // 1–2 párrafos (separados por \n\n)
  url: string;
  provider: MediaProvider; // detectado desde el link (parseMediaUrl)
  embedUrl: string | null;
  thumbnailUrl: string | null; // calculada desde el link
  clipUrl: string | null; // fragmento local que se reproduce en bucle
  clipStart: number; // segundo desde el que arranca (y reinicia) el bucle
  date: string | null; // YYYY-MM-DD
  position: number;
  isFeatured: boolean;
  socials: ProjectSocials; // vacío si el proyecto no tiene redes cargadas
  links: ProjectLink[]; // otros perfiles / enlaces del proyecto
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectSocials {
  instagram?: string;
  linkedin?: string;
}

export interface ParsedMedia {
  provider: MediaProvider;
  id: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  canEmbed: boolean;
  originalUrl: string;
}
