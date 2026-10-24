import type { Category, Profile, Project } from "@/lib/types";

// Datos reales de la clienta (docs/CONTENIDO.md). Misma data que supabase/seed.sql:
// sirven de fallback cuando faltan las env vars de Supabase.

const TS = "2026-10-01T12:00:00.000Z";

export const mockProfile: Profile = {
  id: 1,
  fullName: "Rosario Tejerina Pittis",
  tagline: "Conductora · Locutora · Comunicadora audiovisual",
  bio: "Soy estudiante de Comunicación Social y Locución Nacional en la Universidad Católica de Salta. Me apasiona contar historias frente a cámara y detrás del micrófono: conduje transmisiones en vivo, hice móviles y entrevistas —incluida una con el Chaqueño Palavecino—, cubrí elecciones y eventos masivos, y también produzco contenidos para redes y radio.",
  photoUrl: null,
  heroVideoUrl: null,
  email: "vrtejerinapittis@gmail.com",
  whatsapp: "+5493875174774",
  socials: {
    instagram: "https://instagram.com/rooo_tp",
  },
  skills: [
    "Comunicación oral y audiovisual",
    "Conducción en estudio y en vivo",
    "Móviles y entrevistas en campo",
    "Producción de contenidos y programas en vivo",
    "Asistencia en producción y transmisiones",
    "Operación básica de cámara y consola de radio",
    "Redacción de contenido digital",
    "Planificación de publicaciones",
    "Interacción con audiencias",
    "Trabajo en equipo interdisciplinario",
    "Adaptabilidad",
    "Edición: Canva, Premiere, CapCut, InShot",
  ],
  education: [
    "Lic. en Comunicaciones Sociales — UCaSal (2024–act.)",
    "Locutora Nacional — UCaSal (2024–act.)",
    "Bachiller Humanista Moderno — Esc. Parroquial N.S. de la Merced N° 4400",
    "FOPEA + Google News Initiative (2024): herramientas periodísticas y verificación",
    "Inglés B2 — Anglia Certificate ESOL International, Grade Merit (2024)",
    "Barista y Bartender Profesional — GingerAle Escuela de Coctelería (2023)",
  ],
  updatedAt: TS,
};

export const mockCategories: Category[] = [
  {
    id: "cat-conduccion",
    name: "Conducción",
    slug: "conduccion",
    intro:
      "Naturalidad frente a cámara, escucha activa, manejo del vivo y de la improvisación, preparación de entrevistas y calidez con el público.",
    skills: [
      "Conducción en estudio y en vivo",
      "Escucha activa",
      "Improvisación",
      "Entrevistas",
    ],
    position: 0,
    isVisible: true,
  },
  {
    id: "cat-streaming",
    name: "Streaming y entrevistas",
    slug: "streaming",
    intro:
      "«Otra Vez Sopa», el programa universitario de actualidad, cultura y entretenimiento del streaming de la Facultad de Artes y Ciencias (UCaSal).",
    skills: ["Streaming", "Entrevistas", "Actualidad y cultura"],
    position: 1,
    isVisible: true,
  },
  {
    id: "cat-moviles",
    name: "Móviles y coberturas en vivo",
    slug: "moviles",
    intro:
      "Móviles, entrevistas en campo y asistencia de producción en eventos masivos y coberturas especiales.",
    skills: ["Móviles en vivo", "Coberturas", "Trabajo en campo"],
    position: 2,
    isVisible: true,
  },
  {
    id: "cat-radio",
    name: "Radio y capacitación",
    slug: "radio",
    intro:
      "Locución, producción radial y capacitación en proyectos de extensión universitaria.",
    skills: ["Radio", "Locución", "Capacitación"],
    position: 3,
    isVisible: true,
  },
  {
    id: "cat-redes",
    name: "Redes y comunicación",
    slug: "redes",
    intro: "Experiencia laboral en contenidos, eventos y atención al público.",
    skills: ["Community management", "Contenido digital", "Eventos"],
    position: 4,
    isVisible: true,
  },
];

const yt = (id: string) => ({
  embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
  thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
});

function project(p: Partial<Project> & Pick<Project, "id" | "categoryId" | "title" | "position">): Project {
  return {
    description: null,
    url: "",
    provider: "link",
    embedUrl: null,
    thumbnailUrl: null,
    date: null,
    isPublished: false,
    isFeatured: false,
    createdAt: TS,
    updatedAt: TS,
    ...p,
  };
}

export const mockProjects: Project[] = [
  // 1. Conducción — Política Joven, cobertura Elecciones Legislativas 2025 (UCaSal)
  project({
    id: "prj-politica-joven-1",
    categoryId: "cat-conduccion",
    title: "Política Joven — Transmisión 1",
    description:
      "Cobertura de las Elecciones Legislativas 2025 (Salta) para UCaSal: conducción en estudio, móviles con entrevistas y segmentos intermedios.",
    url: "https://www.youtube.com/live/ZQqAU7r413U",
    provider: "youtube",
    ...yt("ZQqAU7r413U"),
    date: "2025-10-26",
    position: 0,
    isPublished: true,
    isFeatured: true,
  }),
  project({
    id: "prj-politica-joven-2",
    categoryId: "cat-conduccion",
    title: "Política Joven — Transmisión 2",
    description:
      "Segunda transmisión de la cobertura legislativa: estudio, móviles con entrevistas y análisis en vivo.",
    url: "https://www.youtube.com/live/-DNskwLeWnY",
    provider: "youtube",
    ...yt("-DNskwLeWnY"),
    date: "2025-10-26",
    position: 1,
    isPublished: true,
  }),
  project({
    id: "prj-politica-joven-3",
    categoryId: "cat-conduccion",
    title: "Política Joven — Transmisión 3",
    description:
      "Cierre de la cobertura electoral en vivo con resultados y entrevistas.",
    url: "https://www.youtube.com/live/fREdrQv32mw",
    provider: "youtube",
    ...yt("fREdrQv32mw"),
    date: "2025-10-26",
    position: 2,
    isPublished: true,
  }),

  // 2. Streaming y entrevistas — Otra Vez Sopa (UCaSal)
  project({
    id: "prj-ovs-chaqueno",
    categoryId: "cat-streaming",
    title: "Otra Vez Sopa — Entrevista al Chaqueño Palavecino",
    description:
      "Entrevista al Chaqueño Palavecino en el programa universitario de actualidad, cultura y entretenimiento.",
    url: "https://www.youtube.com/live/UL5Ri0NgGRY",
    provider: "youtube",
    ...yt("UL5Ri0NgGRY"),
    position: 0,
    isPublished: true,
    isFeatured: true,
  }),
  project({
    id: "prj-ovs-tecnologia",
    categoryId: "cat-streaming",
    title: "Otra Vez Sopa — Tecnología",
    url: "https://www.youtube.com/live/g72L8M_DA3A",
    provider: "youtube",
    ...yt("g72L8M_DA3A"),
    position: 1,
    isPublished: true,
  }),
  project({
    id: "prj-ovs-idiomas",
    categoryId: "cat-streaming",
    title: "Otra Vez Sopa — Idiomas",
    url: "https://www.youtube.com/live/JkOuXsrNots",
    provider: "youtube",
    ...yt("JkOuXsrNots"),
    position: 2,
    isPublished: true,
  }),
  project({
    id: "prj-ovs-mundial",
    categoryId: "cat-streaming",
    title: "Otra Vez Sopa — Mundial",
    url: "https://www.youtube.com/live/zGt-GaUi4fk",
    provider: "youtube",
    ...yt("zGt-GaUi4fk"),
    position: 3,
    isPublished: true,
  }),
  project({
    id: "prj-ovs-felicidad",
    categoryId: "cat-streaming",
    title: "Otra Vez Sopa — Felicidad",
    url: "https://www.youtube.com/live/VV_wBrrPa5U",
    provider: "youtube",
    ...yt("VV_wBrrPa5U"),
    position: 4,
    isPublished: true,
  }),

  // 3. Móviles y coberturas en vivo
  project({
    id: "prj-milagro-2025",
    categoryId: "cat-moviles",
    title: "Cobertura Fiesta del Milagro — UCaSal 2025",
    description:
      "Móviles y entrevistas en campo, con asistencia de producción.",
    url: "https://www.youtube.com/live/LoIprZvOCIo",
    provider: "youtube",
    ...yt("LoIprZvOCIo"),
    date: "2025-09-15",
    position: 0,
    isPublished: true,
  }),
  project({
    id: "prj-milagro-2026",
    categoryId: "cat-moviles",
    title: "Cobertura Fiesta del Milagro — UCaSal 2026",
    description:
      "Móviles y entrevistas en campo, con asistencia de producción.",
    url: "https://www.youtube.com/live/ugh4b2II018",
    provider: "youtube",
    ...yt("ugh4b2II018"),
    date: "2026-09-15",
    position: 1,
    isPublished: true,
  }),
  project({
    id: "prj-puna-tech",
    categoryId: "cat-moviles",
    title: "Puna Tech — Cobertura de evento tecnológico",
    description:
      "Prensa, entrevistas a expositores y autoridades, y contenido para redes. Se publica cuando esté el link del video.",
    position: 2,
      isPublished: true,
  }),
  project({
    id: "prj-generacion-tech",
    categoryId: "cat-moviles",
    title: "Generación Tech — El10TV",
    description:
      "Programa de TV sobre tecnología: producción, cobertura de eventos y entrevistas a emprendedores.",
    position: 3,
      isPublished: true,
  }),

  // 4. Radio y capacitación
  project({
    id: "prj-mi-huella-verde",
    categoryId: "cat-radio",
    title: "Mi Huella Verde",
    description:
      "Proyecto de extensión UCaSal: capacitación en radio y locución para alumnos del Colegio Secundario 5051 N.S. de la Merced, con producción de un programa radial ambiental y salida al aire.",
    position: 0,
      isPublished: true,
  }),
  project({
    id: "prj-puentes-generacionales",
    categoryId: "cat-radio",
    title: "Puentes Generacionales",
    description:
      "Proyecto de extensión: dinámicas intergeneracionales, contenidos para redes y registro de jornadas.",
    position: 1,
      isPublished: true,
  }),

  // 5. Redes y comunicación (experiencia laboral, sin video por ahora)
  project({
    id: "prj-productora-plastilina",
    categoryId: "cat-redes",
    title: "Productora Plastilina — Community Manager",
    description: "Contenidos, copys y coberturas de eventos.",
    position: 0,
      isPublished: true,
  }),
  project({
    id: "prj-lozainas",
    categoryId: "cat-redes",
    title: "Lozainas.makeup",
    description: "Coordinación y comercialización de eventos.",
    position: 1,
      isPublished: true,
  }),
  project({
    id: "prj-sk-promociones",
    categoryId: "cat-redes",
    title: "SK Promociones",
    description: "Promotora de marca.",
    position: 2,
      isPublished: true,
  }),
  project({
    id: "prj-alemania",
    categoryId: "cat-redes",
    title: "Alemanía Resto-Bar",
    description: "Atención al cliente.",
    position: 3,
      isPublished: true,
  }),
];
