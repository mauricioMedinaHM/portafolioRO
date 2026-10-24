export type MediaProvider =
  | "drive"
  | "gphotos"
  | "youtube"
  | "vimeo"
  | "image"
  | "link";

export interface Profile {
  fullName: string;
  tagline: string;
  bio: string;
  photoUrl: string;
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
  position: number;
}

export interface Project {
  id: string;
  categoryId: string;
  title: string;
  description: string | null; // máx. ~280 caracteres
  url: string;
  provider: MediaProvider; // detectado desde el link (parseMediaUrl)
  embedUrl: string | null;
  thumbnailUrl: string | null; // calculada desde el link
  date: string | null; // YYYY-MM-DD
  position: number;
  isFeatured: boolean;
}

export interface ParsedMedia {
  provider: MediaProvider;
  id: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  canEmbed: boolean;
  originalUrl: string;
}
