/*
 * ════════════════════════════════════════════════════════════════════════
 *  CONTENIDO DEL PORTAFOLIO — este es el único archivo que hay que editar.
 * ════════════════════════════════════════════════════════════════════════
 *
 *  Para sumar un trabajo: copiá un bloque { titulo, link, ... } dentro de la
 *  sección que corresponda y pegá el link. El sitio detecta solo de dónde es
 *  y arma el reproductor y la miniatura:
 *
 *    · YouTube (videos, vivos /live/, shorts, youtu.be)
 *    · Vimeo
 *    · Google Drive (el archivo tiene que estar compartido como
 *      "Cualquier persona con el enlace")
 *    · Google Fotos (abre en una pestaña nueva)
 *    · Imagen o video directo (.jpg, .png, .mp4…)
 *
 *  Campos de cada trabajo:
 *    titulo       obligatorio. "Programa — detalle": lo que va antes del
 *                 guion largo se muestra grande en "Trabajos destacados".
 *    link         opcional. Sin link se muestra como tarjeta de experiencia.
 *    descripcion  opcional, 1–2 frases.
 *    fecha        opcional, formato "AAAA-MM-DD".
 *    destacado    opcional, true = aparece primero en las tarjetas de arriba.
 *
 *  El orden en la página es el orden de este archivo.
 *  Después de editar: guardar, y en producción hacer deploy (git push).
 */

export interface Trabajo {
  titulo: string;
  link?: string;
  descripcion?: string;
  fecha?: string;
  destacado?: boolean;
}

export interface Seccion {
  /** Nombre visible de la sección. */
  nombre: string;
  /** Ancla de la URL (#conduccion). Sin espacios ni tildes. */
  ancla: string;
  intro?: string;
  habilidades?: string[];
  trabajos: Trabajo[];
}

export const perfil = {
  nombre: "Rosario Tejerina Pittis",
  rol: "Conductora · Locutora · Comunicadora audiovisual",
  bio: "Soy estudiante de Comunicación Social y Locución Nacional en UCaSal y me entusiasma contar historias frente a cámara y detrás del micrófono. En coberturas, streaming y Generación Tech para El10TV conduzco, entrevisto y acompaño la producción de contenidos en vivo. También llevo esa escucha a la radio, las redes y la capacitación.",
  /** Foto del hero (en /public). */
  foto: "/rosario.png",
  email: "vrtejerinapittis@gmail.com",
  /** WhatsApp con código de país, sin espacios. */
  whatsapp: "+5493875174774",
  redes: {
    instagram: "https://instagram.com/rooo_tp",
    // linkedin: "https://www.linkedin.com/in/…",
    // tiktok: "https://www.tiktok.com/@…",
    // youtube: "https://www.youtube.com/@…",
  },
  habilidades: [
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
  /** "Título — detalle": el guion largo separa el título del detalle. */
  formacion: [
    "Lic. en Comunicaciones Sociales — UCaSal (2024–act.)",
    "Locutora Nacional — UCaSal (2024–act.)",
    "Bachiller Humanista Moderno — Esc. Parroquial N.S. de la Merced N° 4400",
    "FOPEA + Google News Initiative (2024): herramientas periodísticas y verificación de información",
    "Anglia Certificate of English ESOL International — B2 (CEFR), Grade Merit 78% (2024)",
    "Barista y Bartender Profesional — GingerAle Escuela de Coctelería (2023)",
    "Idiomas: español nativo · inglés B2 (The Royal School of English, 2016–2022)",
  ],
};

export const secciones: Seccion[] = [
  {
    nombre: "Conducción",
    ancla: "conduccion",
    intro:
      "Naturalidad frente a cámara, escucha activa, manejo del vivo y de la improvisación, preparación de entrevistas y calidez con el público.",
    habilidades: ["Conducción en estudio y en vivo", "Escucha activa", "Improvisación", "Entrevistas"],
    trabajos: [
      {
        titulo: "Política Joven — Transmisión 1",
        link: "https://www.youtube.com/live/ZQqAU7r413U",
        descripcion:
          "Cobertura de las Elecciones Legislativas 2025 (Salta) para UCaSal: conducción en estudio, móviles con entrevistas y segmentos intermedios.",
        fecha: "2025-10-26",
        destacado: true,
      },
      {
        titulo: "Política Joven — Transmisión 2",
        link: "https://www.youtube.com/live/-DNskwLeWnY",
        descripcion:
          "Segunda transmisión de la cobertura legislativa: estudio, móviles con entrevistas y análisis en vivo.",
        fecha: "2025-10-26",
      },
      {
        titulo: "Política Joven — Transmisión 3",
        link: "https://www.youtube.com/live/fREdrQv32mw",
        descripcion: "Cierre de la cobertura electoral en vivo con resultados y entrevistas.",
        fecha: "2025-10-26",
      },
    ],
  },
  {
    nombre: "Streaming y entrevistas",
    ancla: "streaming",
    intro:
      "«Otra Vez Sopa», el programa universitario de actualidad, cultura y entretenimiento del streaming de la Facultad de Artes y Ciencias (UCaSal).",
    habilidades: ["Streaming", "Entrevistas", "Actualidad y cultura"],
    trabajos: [
      {
        titulo: "Otra Vez Sopa — Entrevista al Chaqueño Palavecino",
        link: "https://www.youtube.com/live/UL5Ri0NgGRY",
        descripcion:
          "Entrevista al Chaqueño Palavecino en el programa universitario de actualidad, cultura y entretenimiento.",
        destacado: true,
      },
      {
        titulo: "Otra Vez Sopa — Tecnología",
        link: "https://www.youtube.com/live/g72L8M_DA3A",
        descripcion:
          "Edición dedicada a tecnología, con conducción de segmentos, entrevistas y producción de contenidos para el vivo.",
      },
      {
        titulo: "Otra Vez Sopa — Idiomas",
        link: "https://www.youtube.com/live/JkOuXsrNots",
        descripcion:
          "Edición dedicada a idiomas, con conducción de segmentos, entrevistas y producción de contenidos para el vivo.",
      },
      {
        titulo: "Otra Vez Sopa — Mundial",
        link: "https://www.youtube.com/live/zGt-GaUi4fk",
        descripcion:
          "Edición dedicada al Mundial, con conducción de segmentos, entrevistas y producción de contenidos para el vivo.",
      },
      {
        titulo: "Otra Vez Sopa — Felicidad",
        link: "https://www.youtube.com/live/VV_wBrrPa5U",
        descripcion:
          "Edición dedicada a la felicidad, con conducción de segmentos, entrevistas y producción de contenidos para el vivo.",
      },
    ],
  },
  {
    nombre: "Móviles y coberturas en vivo",
    ancla: "moviles",
    intro:
      "Móviles, entrevistas en campo y asistencia de producción en eventos masivos y coberturas especiales.",
    habilidades: ["Móviles en vivo", "Coberturas", "Trabajo en campo"],
    trabajos: [
      {
        titulo: "Cobertura Fiesta del Milagro — UCaSal 2025",
        link: "https://www.youtube.com/live/LoIprZvOCIo",
        descripcion:
          "Móviles y entrevistas en campo, asistencia en producción y coordinación de contenidos, y apoyo operativo durante transmisiones en vivo.",
        fecha: "2025-09-15",
      },
      {
        titulo: "Cobertura Fiesta del Milagro — UCaSal 2026",
        link: "https://www.youtube.com/live/ugh4b2II018",
        descripcion:
          "Móviles y entrevistas en campo, asistencia en producción y coordinación de contenidos, y apoyo operativo durante transmisiones en vivo.",
        fecha: "2026-09-15",
      },
      {
        titulo: "Puna Tech — Cobertura de evento tecnológico",
        descripcion:
          "Prensa y marketing para la cobertura periodística y audiovisual en tiempo real: entrevistas a participantes, expositores y autoridades, contenido para redes y material institucional.",
      },
      {
        titulo: "Generación Tech — El10TV",
        descripcion:
          "Producción de contenidos para TV y plataformas digitales; cobertura de eventos tecnológicos, entrevistas a expositores, emprendedores y referentes, y asistencia en producción y coordinación de transmisiones.",
      },
    ],
  },
  {
    nombre: "Radio y capacitación",
    ancla: "radio",
    intro: "Locución, producción radial y capacitación en proyectos de extensión universitaria.",
    habilidades: ["Radio", "Locución", "Capacitación"],
    trabajos: [
      {
        titulo: "Mi Huella Verde",
        descripcion:
          "Diseño y dictado de capacitaciones en radiofonía y locución para estudiantes del Colegio Secundario 5051 N.S. de la Merced; asesoramiento en estructura y contenidos, y acompañamiento en la salida al aire.",
      },
      {
        titulo: "Puentes Generacionales",
        descripcion:
          "Diseño de dinámicas y juegos, planificación de propuestas intergeneracionales, gestión de redes, y registro y comunicación de las jornadas.",
      },
    ],
  },
  {
    nombre: "Redes y comunicación",
    ancla: "redes",
    intro: "Experiencia laboral en contenidos, eventos y atención al público.",
    habilidades: ["Community management", "Contenido digital", "Eventos"],
    trabajos: [
      {
        titulo: "Productora Plastilina — Community Manager",
        descripcion:
          "Gestión y planificación de contenidos para redes, redacción de copys, cobertura de actividades y eventos, y coordinación con equipos de producción.",
      },
      {
        titulo: "Lozainas.makeup — Coordinación de eventos",
        descripcion:
          "Organización y seguimiento de eventos, gestión comercial y cierre de ventas, y atención personalizada a clientes.",
      },
      {
        titulo: "SK Promociones — Promotora de marca",
        descripcion:
          "Activaciones promocionales y campañas presenciales, interacción con consumidores y difusión de la identidad de marca.",
      },
      {
        titulo: "Alemanía Resto-Bar — Atención al cliente",
        descripcion:
          "Atención directa al público, manejo de caja y pedidos, y trabajo en equipo en entornos de alta demanda.",
      },
    ],
  },
];
