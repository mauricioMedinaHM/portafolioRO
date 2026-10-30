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
 *    · Instagram: reels y posts se reproducen en la página. Instagram no
 *      deja tomar la miniatura: guardá una imagen en /public/trabajos y
 *      ponela en `miniatura`.
 *    · Imagen o video directo (.jpg, .png, .mp4…)
 *
 *  Campos de cada trabajo:
 *    titulo       obligatorio. "Programa — detalle": lo que va antes del
 *                 guion largo se muestra grande en "Trabajos destacados".
 *    link         opcional. Sin link se muestra como tarjeta de experiencia.
 *    descripcion  opcional, 1–2 frases.
 *    fecha        opcional, formato "AAAA-MM-DD".
 *    destacado    opcional, true = aparece primero en las tarjetas de arriba.
 *    redes        opcional, { instagram, linkedin } del proyecto: se muestran
 *                 como botones de color debajo de la tarjeta.
 *    enlaces      opcional, lista de { nombre, link } (otros perfiles o páginas).
 *    miniatura    opcional, imagen propia para la tarjeta ("/trabajos/foto.jpg").
 *    clip         opcional, fragmento propio ("/trabajos/clips/pieza.mp4").
 *                 Se reproduce unos segundos en bucle sólo cuando la tarjeta
 *                 está cerca del centro de la pantalla. Si además hay link,
 *                 el botón de play abre el video completo.
 *    clipInicio   opcional, segundo del clip desde el que arranca el bucle
 *                 (ej. 2.5) para que la primera imagen sea una donde se vea
 *                 bien la cara. Sin este campo arranca desde el principio.
 *    descripcion  admite un segundo párrafo separado por una línea en blanco (\n\n).
 *
 *  Campos de cada sección (además de nombre, ancla, intro, habilidades):
 *    etiqueta     opcional, cartelito de color junto al título (ej. "UCaSal").
 *    canal        opcional, { nombre, link } botón al canal de YouTube del programa.
 *    redes        opcional, { instagram, linkedin } del programa: botones de color
 *                 junto al botón del canal.
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
  redes?: RedesProyecto;
  enlaces?: { nombre: string; link: string }[];
  miniatura?: string;
  /** Fragmento corto en /public. Bucle suave cerca del centro de la pantalla. */
  clip?: string;
  /** Segundo del clip desde el que arranca (y reinicia) el bucle. */
  clipInicio?: number;
}

export interface RedesProyecto {
  instagram?: string;
  linkedin?: string;
}

export interface Seccion {
  /** Nombre visible de la sección. */
  nombre: string;
  /** Ancla de la URL (#conduccion). Sin espacios ni tildes. */
  ancla: string;
  intro?: string;
  habilidades?: string[];
  etiqueta?: string;
  canal?: { nombre: string; link: string };
  redes?: RedesProyecto;
  trabajos: Trabajo[];
}

export const perfil = {
  nombre: "Rosario Tejerina Pittis",
  rol: "Conductora · Locutora · Comunicadora audiovisual",
  bio: "Soy estudiante de Comunicación Social y Locución Nacional en UCaSal y me entusiasma contar historias frente a cámara y detrás del micrófono. En coberturas, streaming y Generación Tech para El10TV conduzco, entrevisto y acompaño la producción de contenidos en vivo. También llevo esa escucha a la radio, las redes y la capacitación.",
  /**
   * Foto del hero (en /public). Si hay `heroClip`, es la imagen que se ve
   * mientras carga el clip (y la única, si el visitante prefiere menos movimiento).
   */
  foto: "/trabajos/puna-tech.jpg",
  /** Clip mudo en bucle dentro del arco del hero (en /public). Dejar "" para usar sólo la foto. */
  heroClip: "/trabajos/clips/puna-tech.mp4",
  email: "tejerinarosario4@gmail.com",
  /** WhatsApp con código de país, sin espacios. */
  whatsapp: "+5493875174774",
  redes: {
    instagram: "https://instagram.com/rooo_tp",
    // TODO: pegar la URL de LinkedIn de Rosario (ej. "https://www.linkedin.com/in/usuario").
    linkedin: "",
    // tiktok: "https://www.tiktok.com/@…",
    // youtube: "https://www.youtube.com/@…",
  },
  habilidades: [
    "Comunicación",
    "Conducción",
    "Producción audiovisual",
    "Creatividad",
    "Trabajo en equipo",
    "Improvisación",
    "Adaptabilidad",
    "Gestión de contenidos",
    "Organización",
    "Resolución de problemas",
    "Entrevistas y móviles",
    "Comunicación digital",
    "Planificación estratégica",
    "Edición audiovisual",
    "Gestión de redes sociales",
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
      {
        titulo: "Conducción — Mesa al aire",
        miniatura: "/trabajos/conduccion-mesa.jpg",
        descripcion: "Conducción con auriculares y micrófono en una salida al aire.",
      },
      {
        titulo: "Conducción — En cámara",
        miniatura: "/trabajos/conduccion-camara.jpg",
        descripcion: "La misma salida al aire, de frente al micrófono.",
      },
      {
        titulo: "Conducción — Joseii",
        clip: "/trabajos/clips/joseii.mp4",
        clipInicio: 2.5,
        miniatura: "/trabajos/joseii.jpg",
        descripcion: "Conducción de un encuentro sobre inteligencia artificial.",
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
        clip: "/trabajos/clips/chaqueno.mp4",
        miniatura: "/trabajos/chaqueno.jpg",
        descripcion:
          "Entrevista al Chaqueño Palavecino en el programa universitario de actualidad, cultura y entretenimiento.",
        destacado: true,
      },
      {
        titulo: "Otra Vez Sopa — Entrevista a Valentina Raposo",
        miniatura: "/trabajos/valentina-raposo.jpg",
        descripcion:
          "Entrevista a Valentina Raposo, campeona del mundo de hockey, en Otra Vez Sopa.",
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
        titulo: "Participación en streamings",
        clip: "/trabajos/clips/streamings.mp4",
        miniatura: "/trabajos/streamings.jpg",
        descripcion: "Detrás de cámara en una jornada de streaming.",
      },
      {
        titulo: "Streaming Day — Primera Cumbre de Streaming del Norte",
        clip: "/trabajos/clips/cumbre-noa.mp4",
        miniatura: "/trabajos/streaming-day.jpg",
        descripcion:
          "Staff del evento: soporte de producción y producción de contenidos, y organización y logística de la jornada.",
        redes: { instagram: "", linkedin: "" },
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
    nombre: "Generación Tech",
    ancla: "generacion-tech",
    intro:
      "Programa de televisión sobre tecnología, innovación y emprendedurismo (El10TV): producción de contenidos para TV y plataformas digitales, cobertura de eventos tecnológicos y entrevistas a expositores, emprendedores y referentes.",
    habilidades: ["Producción de TV", "Entrevistas", "Tecnología e innovación"],
    etiqueta: "El10TV",
    canal: { nombre: "Canal de YouTube", link: "https://youtube.com/@generaciontech-sl" },
    redes: { instagram: "https://www.instagram.com/generacion.tech/" },
    trabajos: [
      {
        titulo: "Generación Tech — Programa 19 de octubre",
        link: "https://youtu.be/aoMs_YE_RtE",
        clip: "/trabajos/clips/generacion-tech.mp4",
        clipInicio: 0.5,
        miniatura: "/trabajos/generacion-tech.jpg",
        destacado: true,
      },
      {
        titulo: "Generación Tech — Programa 28 de septiembre",
        link: "https://youtu.be/N4lWIgW44AE",
        miniatura: "/trabajos/generacion-tech-perfil.jpg",
      },
      {
        titulo: "Generación Tech — Programa 24 de agosto",
        link: "https://youtu.be/lPLNkncoVp4",
      },
      {
        titulo: "Generación Tech — Programa 10 de agosto",
        link: "https://youtu.be/UDSYj-nO2e4",
      },
      {
        titulo: "Inteligencia artificial y comunidades",
        clip: "/trabajos/clips/comunidades.mp4",
        miniatura: "/trabajos/comunidades.jpg",
        descripcion: "Pieza sobre chatbots de inteligencia artificial, desinformación y comunidades.",
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
        clip: "/trabajos/clips/puna-tech.mp4",
        miniatura: "/trabajos/puna-tech.jpg",
        descripcion:
          "Prensa y marketing para la cobertura periodística y audiovisual en tiempo real: entrevistas a participantes, expositores y autoridades, contenido para redes y material institucional.",
        redes: { instagram: "", linkedin: "" },
      },
    ],
  },
  {
    nombre: "Capacitaciones y proyectos de extensión universitaria",
    ancla: "extension",
    intro:
      "Proyectos de extensión de la Universidad Católica de Salta: capacitación en radio y locución, producción radial y comunicación de jornadas.",
    habilidades: ["Radio", "Locución", "Capacitación"],
    etiqueta: "UCaSal · Extensión universitaria",
    trabajos: [
      {
        titulo: "Mi Huella Verde",
        descripcion:
          "Diseño y dictado de capacitaciones en radiofonía y locución para estudiantes del Colegio Secundario 5051 N.S. de la Merced; asesoramiento en estructura y contenidos, y acompañamiento en la salida al aire.",
        redes: { instagram: "", linkedin: "" },
      },
      {
        titulo: "Puentes Generacionales",
        descripcion:
          "Diseño de dinámicas y juegos, planificación de propuestas intergeneracionales, gestión de redes, y registro y comunicación de las jornadas.",
        redes: { instagram: "", linkedin: "" },
      },
    ],
  },
  {
    nombre: "Experiencia profesional complementaria",
    ancla: "experiencia",
    intro: "Experiencia laboral en contenidos para redes, eventos y atención al público.",
    habilidades: ["Community management", "Contenido digital", "Eventos"],
    trabajos: [
      {
        titulo: "Proyectos y eventos — Jota Joti 2026",
        link: "https://www.instagram.com/reel/DenJBl1CFQd/",
        miniatura: "/trabajos/jota-joti-2026.jpg",
        descripcion:
          "Comunidad Rover Aona Yamana (Grupo Scout N.º 811) en el Jota Joti 2026: creación y difusión de contenido para redes.",
        destacado: true,
      },
      {
        titulo: "Grupo Scout N.º 811 Santo Domingo Savio — Comunicación",
        descripcion:
          "Salta Capital. Equipos de comunicación a nivel de grupo, distrito y zona: creación y difusión de contenidos digitales, cobertura y comunicación de actividades y eventos scouts, y trabajo colaborativo en la comunicación institucional y comunitaria.\n\nUn proyecto que nace para impulsar nuevas iniciativas y aprovechar las herramientas del escultismo para conectar con distintas áreas de la sociedad, con un compromiso de servicio permanente y un impacto positivo y transformador en la comunidad.",
        enlaces: [
          { nombre: "Aona Yamana 811", link: "https://www.instagram.com/aonayamana811" },
          { nombre: "Zona 27 SAAC", link: "https://www.instagram.com/zona27.saac" },
          { nombre: "Distrito 4 · Zona 27", link: "https://www.instagram.com/distrito4z27.saac" },
        ],
      },
      {
        titulo: "Productora Plastilina — Community Manager",
        clip: "/trabajos/clips/creacion.mp4",
        clipInicio: 2,
        miniatura: "/trabajos/creacion.jpg",
        descripcion:
          "Gestión y planificación de contenidos para redes, redacción de copys, cobertura de actividades y eventos, y coordinación con equipos de producción.",
        redes: { instagram: "", linkedin: "" },
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
