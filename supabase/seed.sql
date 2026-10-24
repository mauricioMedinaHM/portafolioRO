-- Contenido real de la clienta (docs/CONTENIDO.md, deduplicado, sin DNI/CUIL).
-- Misma data que lib/data/mocks.ts. Ejecutar después de 0001_init.sql.
-- Proyectos sin link quedan en is_published = false con url = ''.

insert into public.profile (
  id, full_name, tagline, bio, photo_url, hero_video_url,
  email, whatsapp, socials, skills, education
) values (
  1,
  'Rosario Tejerina Pittis',
  'Conductora · Locutora · Comunicadora audiovisual',
  'Soy estudiante de Comunicación Social y Locución Nacional en la Universidad Católica de Salta. Me apasiona contar historias frente a cámara y detrás del micrófono: conduje transmisiones en vivo, hice móviles y entrevistas —incluida una con el Chaqueño Palavecino—, cubrí elecciones y eventos masivos, y también produzco contenidos para redes y radio.',
  null,
  null,
  'vrtejerinapittis@gmail.com',
  '+5493875174774',
  '{"instagram": "https://instagram.com/rooo_tp"}'::jsonb,
  array[
    'Comunicación oral y audiovisual',
    'Conducción en estudio y en vivo',
    'Móviles y entrevistas en campo',
    'Producción de contenidos y programas en vivo',
    'Asistencia en producción y transmisiones',
    'Operación básica de cámara y consola de radio',
    'Redacción de contenido digital',
    'Planificación de publicaciones',
    'Interacción con audiencias',
    'Trabajo en equipo interdisciplinario',
    'Adaptabilidad',
    'Edición: Canva, Premiere, CapCut, InShot'
  ],
  array[
    'Lic. en Comunicaciones Sociales — UCaSal (2024–act.)',
    'Locutora Nacional — UCaSal (2024–act.)',
    'Bachiller Humanista Moderno — Esc. Parroquial N.S. de la Merced N° 4400',
    'FOPEA + Google News Initiative (2024): herramientas periodísticas y verificación',
    'Inglés B2 — Anglia Certificate ESOL International, Grade Merit (2024)',
    'Barista y Bartender Profesional — GingerAle Escuela de Coctelería (2023)'
  ]
)
on conflict (id) do nothing;

insert into public.categories (id, name, slug, intro, skills, position, is_visible)
values
  (
    'c0ffee00-0000-4000-8000-000000000001',
    'Conducción',
    'conduccion',
    'Naturalidad frente a cámara, escucha activa, manejo del vivo y de la improvisación, preparación de entrevistas y calidez con el público.',
    array['Conducción en estudio y en vivo', 'Escucha activa', 'Improvisación', 'Entrevistas'],
    0,
    true
  ),
  (
    'c0ffee00-0000-4000-8000-000000000002',
    'Streaming y entrevistas',
    'streaming',
    '«Otra Vez Sopa», el programa universitario de actualidad, cultura y entretenimiento del streaming de la Facultad de Artes y Ciencias (UCaSal).',
    array['Streaming', 'Entrevistas', 'Actualidad y cultura'],
    1,
    true
  ),
  (
    'c0ffee00-0000-4000-8000-000000000003',
    'Móviles y coberturas en vivo',
    'moviles',
    'Móviles, entrevistas en campo y asistencia de producción en eventos masivos y coberturas especiales.',
    array['Móviles en vivo', 'Coberturas', 'Trabajo en campo'],
    2,
    true
  ),
  (
    'c0ffee00-0000-4000-8000-000000000004',
    'Radio y capacitación',
    'radio',
    'Locución, producción radial y capacitación en proyectos de extensión universitaria.',
    array['Radio', 'Locución', 'Capacitación'],
    3,
    true
  ),
  (
    'c0ffee00-0000-4000-8000-000000000005',
    'Redes y comunicación',
    'redes',
    'Experiencia laboral en contenidos, eventos y atención al público.',
    array['Community management', 'Contenido digital', 'Eventos'],
    4,
    true
  )
on conflict (id) do nothing;

insert into public.projects (
  id, category_id, title, description, url, provider,
  embed_url, thumbnail_url, date, position, is_published, is_featured
) values
  -- Conducción
  ('c0ffee00-0000-4000-8000-000000000101', 'c0ffee00-0000-4000-8000-000000000001',
   'Política Joven — Transmisión 1',
   'Cobertura de las Elecciones Legislativas 2025 (Salta) para UCaSal: conducción en estudio, móviles con entrevistas y segmentos intermedios.',
   'https://www.youtube.com/live/ZQqAU7r413U', 'youtube',
   'https://www.youtube-nocookie.com/embed/ZQqAU7r413U?autoplay=1&rel=0',
   'https://i.ytimg.com/vi/ZQqAU7r413U/hqdefault.jpg',
   '2025-10-26', 0, true, true),
  ('c0ffee00-0000-4000-8000-000000000102', 'c0ffee00-0000-4000-8000-000000000001',
   'Política Joven — Transmisión 2',
   'Segunda transmisión de la cobertura legislativa: estudio, móviles con entrevistas y análisis en vivo.',
   'https://www.youtube.com/live/-DNskwLeWnY', 'youtube',
   'https://www.youtube-nocookie.com/embed/-DNskwLeWnY?autoplay=1&rel=0',
   'https://i.ytimg.com/vi/-DNskwLeWnY/hqdefault.jpg',
   '2025-10-26', 1, true, false),
  ('c0ffee00-0000-4000-8000-000000000103', 'c0ffee00-0000-4000-8000-000000000001',
   'Política Joven — Transmisión 3',
   'Cierre de la cobertura electoral en vivo con resultados y entrevistas.',
   'https://www.youtube.com/live/fREdrQv32mw', 'youtube',
   'https://www.youtube-nocookie.com/embed/fREdrQv32mw?autoplay=1&rel=0',
   'https://i.ytimg.com/vi/fREdrQv32mw/hqdefault.jpg',
   '2025-10-26', 2, true, false),

  -- Streaming y entrevistas
  ('c0ffee00-0000-4000-8000-000000000104', 'c0ffee00-0000-4000-8000-000000000002',
   'Otra Vez Sopa — Entrevista al Chaqueño Palavecino',
   'Entrevista al Chaqueño Palavecino en el programa universitario de actualidad, cultura y entretenimiento.',
   'https://www.youtube.com/live/UL5Ri0NgGRY', 'youtube',
   'https://www.youtube-nocookie.com/embed/UL5Ri0NgGRY?autoplay=1&rel=0',
   'https://i.ytimg.com/vi/UL5Ri0NgGRY/hqdefault.jpg',
   null, 0, true, true),
  ('c0ffee00-0000-4000-8000-000000000105', 'c0ffee00-0000-4000-8000-000000000002',
   'Otra Vez Sopa — Tecnología', null,
   'https://www.youtube.com/live/g72L8M_DA3A', 'youtube',
   'https://www.youtube-nocookie.com/embed/g72L8M_DA3A?autoplay=1&rel=0',
   'https://i.ytimg.com/vi/g72L8M_DA3A/hqdefault.jpg',
   null, 1, true, false),
  ('c0ffee00-0000-4000-8000-000000000106', 'c0ffee00-0000-4000-8000-000000000002',
   'Otra Vez Sopa — Idiomas', null,
   'https://www.youtube.com/live/JkOuXsrNots', 'youtube',
   'https://www.youtube-nocookie.com/embed/JkOuXsrNots?autoplay=1&rel=0',
   'https://i.ytimg.com/vi/JkOuXsrNots/hqdefault.jpg',
   null, 2, true, false),
  ('c0ffee00-0000-4000-8000-000000000107', 'c0ffee00-0000-4000-8000-000000000002',
   'Otra Vez Sopa — Mundial', null,
   'https://www.youtube.com/live/zGt-GaUi4fk', 'youtube',
   'https://www.youtube-nocookie.com/embed/zGt-GaUi4fk?autoplay=1&rel=0',
   'https://i.ytimg.com/vi/zGt-GaUi4fk/hqdefault.jpg',
   null, 3, true, false),
  ('c0ffee00-0000-4000-8000-000000000108', 'c0ffee00-0000-4000-8000-000000000002',
   'Otra Vez Sopa — Felicidad', null,
   'https://www.youtube.com/live/VV_wBrrPa5U', 'youtube',
   'https://www.youtube-nocookie.com/embed/VV_wBrrPa5U?autoplay=1&rel=0',
   'https://i.ytimg.com/vi/VV_wBrrPa5U/hqdefault.jpg',
   null, 4, true, false),

  -- Móviles y coberturas
  ('c0ffee00-0000-4000-8000-000000000109', 'c0ffee00-0000-4000-8000-000000000003',
   'Cobertura Fiesta del Milagro — UCaSal 2025',
   'Móviles y entrevistas en campo, con asistencia de producción.',
   'https://www.youtube.com/live/LoIprZvOCIo', 'youtube',
   'https://www.youtube-nocookie.com/embed/LoIprZvOCIo?autoplay=1&rel=0',
   'https://i.ytimg.com/vi/LoIprZvOCIo/hqdefault.jpg',
   '2025-09-15', 0, true, false),
  ('c0ffee00-0000-4000-8000-000000000110', 'c0ffee00-0000-4000-8000-000000000003',
   'Cobertura Fiesta del Milagro — UCaSal 2026',
   'Móviles y entrevistas en campo, con asistencia de producción.',
   'https://www.youtube.com/live/ugh4b2II018', 'youtube',
   'https://www.youtube-nocookie.com/embed/ugh4b2II018?autoplay=1&rel=0',
   'https://i.ytimg.com/vi/ugh4b2II018/hqdefault.jpg',
   '2026-09-15', 1, true, false),
  ('c0ffee00-0000-4000-8000-000000000111', 'c0ffee00-0000-4000-8000-000000000003',
   'Puna Tech — Cobertura de evento tecnológico',
   'Prensa, entrevistas a expositores y autoridades, y contenido para redes. Se publica cuando esté el link del video.',
   '', 'link', null, null, null, 2, true, false),
  ('c0ffee00-0000-4000-8000-000000000112', 'c0ffee00-0000-4000-8000-000000000003',
   'Generación Tech — El10TV',
   'Programa de TV sobre tecnología: producción, cobertura de eventos y entrevistas a emprendedores.',
   '', 'link', null, null, null, 3, true, false),

  -- Radio y capacitación
  ('c0ffee00-0000-4000-8000-000000000113', 'c0ffee00-0000-4000-8000-000000000004',
   'Mi Huella Verde',
   'Proyecto de extensión UCaSal: capacitación en radio y locución para alumnos del Colegio Secundario 5051 N.S. de la Merced, con producción de un programa radial ambiental y salida al aire.',
   '', 'link', null, null, null, 0, true, false),
  ('c0ffee00-0000-4000-8000-000000000114', 'c0ffee00-0000-4000-8000-000000000004',
   'Puentes Generacionales',
   'Proyecto de extensión: dinámicas intergeneracionales, contenidos para redes y registro de jornadas.',
   '', 'link', null, null, null, 1, true, false),

  -- Redes y comunicación (experiencia laboral)
  ('c0ffee00-0000-4000-8000-000000000115', 'c0ffee00-0000-4000-8000-000000000005',
   'Productora Plastilina — Community Manager',
   'Contenidos, copys y coberturas de eventos.',
   '', 'link', null, null, null, 0, true, false),
  ('c0ffee00-0000-4000-8000-000000000116', 'c0ffee00-0000-4000-8000-000000000005',
   'Lozainas.makeup',
   'Coordinación y comercialización de eventos.',
   '', 'link', null, null, null, 1, true, false),
  ('c0ffee00-0000-4000-8000-000000000117', 'c0ffee00-0000-4000-8000-000000000005',
   'SK Promociones',
   'Promotora de marca.',
   '', 'link', null, null, null, 2, true, false),
  ('c0ffee00-0000-4000-8000-000000000118', 'c0ffee00-0000-4000-8000-000000000005',
   'Alemanía Resto-Bar',
   'Atención al cliente.',
   '', 'link', null, null, null, 3, true, false)
on conflict (id) do nothing;
