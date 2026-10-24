export type MediaProvider =
  | "drive"
  | "gphotos"
  | "youtube"
  | "vimeo"
  | "image"
  | "link";

export interface Profile {
  // fila única
  id: 1;
  fullName: string;
  tagline: string;
  bio: string;
  photoUrl: string | null;
  heroVideoUrl: string | null;
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
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string; // slug = ancla #conduccion
  intro: string | null; // cualidades y habilidades (markdown simple)
  skills: string[]; // chips destacados
  position: number;
  isVisible: boolean;
}

export interface Project {
  id: string;
  categoryId: string;
  title: string;
  description: string | null; // máx. ~280 caracteres
  url: string;
  provider: MediaProvider; // provider se calcula al guardar
  embedUrl: string | null;
  thumbnailUrl: string | null; // calculado o subido a mano
  date: string | null; // YYYY-MM-DD
  position: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedMedia {
  provider: MediaProvider;
  id: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  canEmbed: boolean;
  originalUrl: string;
}
