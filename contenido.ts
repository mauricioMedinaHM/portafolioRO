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
  miniaturaDeReferencia?: boolean;
  sticker?: { src: string; alt: string };
  grupo?: string;
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
  bio: [
    "Soy Verónica Rosario Tejerina Pittis, estudiante de Comunicación Social y Locución Nacional en UCASAL. Me apasiona contar historias, conectar con las personas y descubrir lo que hay detrás de cada proyecto, idea y experiencia.",
    "En los últimos años, fui construyendo un recorrido que abarca la producción de contenidos en sus distintas etapas: preproducción, producción y postproducción, tanto en redes sociales como en radio, televisión y streaming.",
    "A través de coberturas, entrevistas, conducción y programas en vivo, fui adquiriendo herramientas que me permiten desenvolverme frente y detrás de cámara, explorar distintos formatos y conocer el mundo de la comunicación desde diferentes áreas.",
    "Creo en el aprendizaje constante, en la curiosidad y en la posibilidad de seguir creciendo, perfeccionándome y encontrando nuevas formas de comunicar. En este espacio, los invito a conocer un poco más de mí, de mis experiencias, mis habilidades y todo lo que me apasiona hacer.",
  ].join("\n\n"),
  /**
   * Foto del hero (en /public). Si hay `heroClip`, es la imagen que se ve
   * mientras carga el clip (y la única, si el visitante prefiere menos movimiento).
   */
  foto: "/trabajos/puna-tech.jpg",
  /** Clip mudo en bucle dentro del arco del hero (en /public). Dejar "" para usar sólo la foto. */
  heroClip: "/trabajos/clips/puna-tech.mp4",
  email: "vrtejerinapittis@gmail.com",
  transmisionesEnVivo: 50,
  visualizaciones: {
    panelesDe30Dias: [8729, 30351, 60355],
    periodo: "27 de octubre al 25 de noviembre de 2026",
    reelDeReferencia: 6919,
  },
  /** WhatsApp con código de país, sin espacios. */
  whatsapp: "+5493875174774",
  redes: {
    linkedin: "https://www.linkedin.com/in/rosario-tejerina-pittis-3a7879374?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    instagram: "https://www.instagram.com/rooo_tp?knvt=MW4ybW9pb3V5aXN6Yg==",
    x: "https://x.com/Roosario_TP",
    telegram: "https://t.me/RosarioTejerina",
    github: "https://github.com/rosariotejerinap",
  },
  habilidades: [
    "Conducción y entrevistas",
    "Comunicación audiovisual",
    "Creación de contenido",
    "Edición audiovisual",
    "Trabajo en equipo",
    "Adaptabilidad e improvisación",
    "Gestión de redes sociales",
  ],
  /** "Título — detalle": el guion largo separa el título del detalle. */
  formacion: [
    "Lic. en Comunicaciones Sociales — UCaSal (2024–act.)",
    "Locutora Nacional — UCaSal (2024–act.)",
    "Bachiller Humanista Moderno — Esc. Parroquial N.S. de la Merced N.º 4400 (2010–2023)",
    "FOPEA + Google News Initiative (2024): herramientas periodísticas y verificación de información",
    "Anglia Certificate of English ESOL International — B2 (CEFR), Grade Merit 78% (2024)",
    "Barista y Bartender Profesional — GingerAle Escuela de Coctelería (2023)",
    "Idiomas — Español nativo · Inglés B2 (The Royal School of English, 2016–2022)",
    "Pronunciación en otros idiomas — Alemán, francés, portugués e italiano",
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
        link: "https://www.youtube.com/live/ENox4obi6Jg?si=yPznhl2c8V93Loy4",
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
        link: "https://www.youtube.com/live/tLWftyZeszo?si=jF7Pl7k8nG7dQ7bD",
        descripcion: "Participación en una jornada de streaming y en la producción detrás de cámara.",
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
        descripcion: "Producción de contenidos audiovisuales y participación al aire en el programa de El10TV.",
        link: "https://youtu.be/aoMs_YE_RtE",
        clip: "/trabajos/clips/generacion-tech.mp4",
        clipInicio: 0.5,
        miniatura: "/trabajos/generacion-tech.jpg",
        destacado: true,
      },
      {
        titulo: "Generación Tech — Programa 28 de septiembre",
        descripcion: "Producción para televisión y plataformas digitales en una edición dedicada a tecnología e innovación.",
        link: "https://youtu.be/N4lWIgW44AE",
        miniatura: "/trabajos/generacion-tech-perfil.jpg",
      },
      {
        titulo: "Generación Tech — Programa 24 de agosto",
        descripcion: "Participación en la producción del programa, con contenidos sobre tecnología y emprendedurismo.",
        link: "https://youtu.be/lPLNkncoVp4",
      },
      {
        titulo: "Generación Tech — Programa 10 de agosto",
        descripcion: "Asistencia de producción y coordinación de contenidos para la transmisión de El10TV.",
        link: "https://youtu.be/UDSYj-nO2e4",
      },
    ],
  },
  {
    nombre: "Mundo Scout",
    ancla: "mundo-scout",
    intro: "En mi trabajo de comunicación están muy presentes los valores scout: el compromiso con la comunidad, el servicio y el trabajo en equipo. En cada cobertura registro lo que pasa, coordino con los equipos, edito videos y creo contenido durante el evento.",
    habilidades: ["Cobertura en campo", "Trabajo en equipo", "Edición de video", "Creación de contenido en tiempo real", "Adaptabilidad"],
    trabajos: [
      {
        titulo: "Grupo Scout N.º 811 Santo Domingo Savio — Comunicación",
        sticker: {
          src: "/trabajos/grupo-scout-811.jpg",
          alt: "Escudo del Grupo Scout N.º 811 Santo Domingo Savio",
        },
        descripcion:
          "Trabajo en comunicación scout desde Salta Capital. Manejo las cuentas del grupo, la zona y el distrito. Creo y difundo contenidos digitales, cubro eventos y coordino con los equipos la comunicación de las actividades.\n\nUn proyecto que nace para impulsar nuevas iniciativas y aprovechar las herramientas del escultismo para conectar con distintas áreas de la sociedad, con un compromiso de servicio permanente y un impacto positivo y transformador en la comunidad.",
        enlaces: [
          { nombre: "Aona Yamana 811", link: "https://www.instagram.com/aonayamana811" },
          { nombre: "Zona 27 SAAC", link: "https://www.instagram.com/zona27.saac" },
          { nombre: "Distrito 4 · Zona 27", link: "https://www.instagram.com/distrito4z27.saac" },
        ],
      },
    ],
  },
  {
    nombre: "Eventos",
    ancla: "eventos",
    intro:
      "Coberturas especiales, móviles y entrevistas en campo, además de producción y logística de eventos.",
    habilidades: ["Móviles en vivo", "Coberturas", "Producción de eventos"],
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
        titulo: "Puna Tech · Argentina Space — Cobertura de evento tecnológico",
        destacado: true,
        clip: "/trabajos/clips/puna-tech.mp4",
        miniatura: "/trabajos/puna-tech.jpg",
        descripcion:
          "Prensa y marketing para la cobertura periodística y audiovisual en tiempo real: entrevistas a participantes, expositores y autoridades, contenido para redes y material institucional.",
        redes: { instagram: "", linkedin: "" },
      },
      {
        titulo: "Streaming Day — Primera Cumbre de Streaming del Norte",
        miniatura: "/trabajos/streaming-day.jpg",
        descripcion:
          "Staff del evento: soporte de producción y producción de contenidos, y organización y logística de la jornada.",
        redes: { instagram: "", linkedin: "" },
      },
      {
        titulo: "Inteligencia artificial y comunidades",
        grupo: "Eventos Tech",
        clip: "/trabajos/clips/comunidades.mp4",
        miniatura: "/trabajos/comunidades.jpg",
        descripcion: "Participación en hackatones y creación de una pieza audiovisual sobre chatbots de inteligencia artificial, desinformación y comunidades.",
        enlaces: [{ nombre: "Ver video", link: "/trabajos/clips/comunidades.mp4" }],
      },
      {
        titulo: "Jota Joti 2026",
        grupo: "Eventos scouts",
        link: "https://www.instagram.com/reel/DenJBl1CFQd/",
        miniatura: "/trabajos/jota-joti-2026.jpg",
        descripcion:
          "Comunidad Rover Aona Yamana (Grupo Scout N.º 811) en el Jota Joti 2026: creación y difusión de contenido para redes.",
        destacado: true,
      },
      {
        titulo: "Aullidos 2026",
        grupo: "Eventos scouts",
        link: "https://www.instagram.com/reel/Dec8VxRCRwB/?utm_source=ig_web_copy_link&avpt=MzRlODBiNWFlZA==",
        descripcion: "Registro en el lugar, creación de contenido durante la actividad y edición del reel para redes.",
      },
      {
        titulo: "Rally Caminantes 2026",
        grupo: "Eventos scouts",
        link: "https://www.instagram.com/reel/DgGLcsRNOX9/?utm_source=ig_web_copy_link&evlk=MzRlODBiNWFlZA==&avpt=MzRlODBiNWFlZA==",
        descripcion: "Cobertura de la jornada en equipo, selección de momentos y edición de contenido para difundir la experiencia scout.",
      },
      {
        titulo: "VII Rover Moot Nacional 2026",
        grupo: "Eventos scouts",
        descripcion:
          "Participé del encuentro de Scouts de Argentina del 17 al 24 de enero de 2026 en Necochea, Mar del Plata y Laguna de los Padres, provincia de Buenos Aires.\n\nEl encuentro reunió a más de 4.000 jóvenes Rovers de 18 a 22 años de todo el país, con delegaciones del norte argentino y el apoyo de personas voluntarias. Hubo actividades educativas, vida en la naturaleza, vivacs, proyectos comunitarios y mingas.\n\nLas cámaras de Diputados y de Senadores de la provincia de Buenos Aires lo declararon de interés legislativo.",
        enlaces: [{ nombre: "Crónica de Scouts de Argentina", link: "https://scouts.org.ar/comunicaciones/finalizo-el-vii-rover-moot-nacional-2026-una-experiencia-que-deja-huellas-en-miles-de-jovenes-y-comunidades" }],
      },
    ],
  },
  {
    nombre: "Experiencia profesional complementaria",
    ancla: "experiencia",
    intro: "Gestión de redes, coordinación de eventos, atención al público y proyectos de extensión de la Universidad Católica de Salta.",
    habilidades: ["Gestión de redes", "Eventos", "Atención al público", "Capacitación en radio y locución"],
    trabajos: [
      {
        titulo: "Productora Plastilina — Community Manager",
        enlaces: [{ nombre: "Ver reel en Instagram", link: "https://www.instagram.com/reel/DHQ2CPGAZfh/?utm_source=ig_web_copy_link&hvrq=MzRlODBiNWFlZA==&avpt=MzRlODBiNWFlZA==" }],
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
      {
        titulo: "Mi Huella Verde",
        enlaces: [{ nombre: "Ver reel en Instagram", link: "https://www.instagram.com/reel/DfFpvDaCdHU/?lqvp=MXZka2xueTN3bnR6MQ==" }],
        descripcion:
          "Diseño y dictado de capacitaciones en radiofonía y locución para estudiantes del Colegio Secundario 5051 N.S. de la Merced; asesoramiento en contenidos y acompañamiento en la salida al aire de un programa sobre concientización ambiental.",
        redes: { instagram: "", linkedin: "" },
      },
      {
        titulo: "Puentes Generacionales",
        enlaces: [{ nombre: "Ver publicación en LinkedIn", link: "https://lnkd.in/p/d7yfJRWF" }],
        descripcion:
          "Diseño de dinámicas y juegos, planificación de propuestas intergeneracionales, gestión de redes, y registro y comunicación de las jornadas.",
        redes: { instagram: "", linkedin: "" },
      },
    ],
  },
];
