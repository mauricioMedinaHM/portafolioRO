-- Datos de ejemplo coherentes con lib/data/mocks.ts.
-- Ejecutar después de 0001_init.sql. Las categorías usan UUIDs fijos
-- para que el seed sea reproducible.

insert into public.profile (
  id, full_name, tagline, bio, photo_url, hero_video_url,
  email, whatsapp, socials
) values (
  1,
  'Rosario Verónica Pittis',
  'Conductora · Comunicadora',
  'Conductora y comunicadora con más de diez años de experiencia en medios audiovisuales. Me especializo en entrevistas, coberturas en vivo y producción de contenidos que conectan con la audiencia.',
  null,
  null,
  'hola@rosariopittis.com.ar',
  '+5491155550123',
  '{
    "instagram": "https://instagram.com/rosario.pittis",
    "linkedin": "https://linkedin.com/in/rosariopittis",
    "youtube": "https://youtube.com/@rosariopittis"
  }'::jsonb
)
on conflict (id) do nothing;

insert into public.categories (id, name, slug, intro, skills, position, is_visible)
values
  (
    'c0ffee00-0000-4000-8000-000000000001',
    'Conducción',
    'conduccion',
    'Conducción de programas de TV, streaming y eventos en vivo. Manejo de piso, improvisación y entrevistas en tiempo real.',
    array['TV en vivo', 'Streaming', 'Eventos', 'Improvisación'],
    0,
    true
  ),
  (
    'c0ffee00-0000-4000-8000-000000000002',
    'Locución',
    'locucion',
    'Voz profesional para publicidades, documentales e institucionales.',
    array['Publicidades', 'Documentales', 'Institucionales'],
    1,
    true
  ),
  (
    'c0ffee00-0000-4000-8000-000000000003',
    'Entrevistas',
    'entrevistas',
    'Conversaciones con referentes de la cultura, la política y el espectáculo.',
    array['Investigación', 'Escucha activa', 'Uno a uno'],
    2,
    true
  )
on conflict (id) do nothing;

insert into public.projects (
  id, category_id, title, description, url, provider,
  embed_url, thumbnail_url, date, position, is_published, is_featured
) values
  (
    'c0ffee00-0000-4000-8000-000000000101',
    'c0ffee00-0000-4000-8000-000000000001',
    'Ciclo de entrevistas en vivo',
    'Conducción del ciclo semanal con invitados en piso y participación de la audiencia.',
    'https://www.youtube.com/watch?v=a1b2c3d4e5f',
    'youtube',
    'https://www.youtube-nocookie.com/embed/a1b2c3d4e5f?autoplay=1&rel=0',
    'https://i.ytimg.com/vi/a1b2c3d4e5f/hqdefault.jpg',
    '2026-09-15',
    0,
    true,
    true
  ),
  (
    'c0ffee00-0000-4000-8000-000000000102',
    'c0ffee00-0000-4000-8000-000000000001',
    'Cobertura especial (completa)',
    'Transmisión completa de la cobertura especial. Video alojado en Drive.',
    'https://drive.google.com/file/d/1AbC2dEf3GhI4jKl5MnO6pQr7StU8vWx9/view?usp=sharing',
    'drive',
    'https://drive.google.com/file/d/1AbC2dEf3GhI4jKl5MnO6pQr7StU8vWx9/preview',
    'https://drive.google.com/thumbnail?id=1AbC2dEf3GhI4jKl5MnO6pQr7StU8vWx9&sz=w800',
    '2026-08-02',
    1,
    true,
    false
  ),
  (
    'c0ffee00-0000-4000-8000-000000000103',
    'c0ffee00-0000-4000-8000-000000000001',
    'Reel de conducción 2026',
    'Compilado breve con los mejores momentos del año.',
    'https://www.youtube.com/shorts/z9y8x7w6v5u',
    'youtube',
    'https://www.youtube-nocookie.com/embed/z9y8x7w6v5u?autoplay=1&rel=0',
    'https://i.ytimg.com/vi/z9y8x7w6v5u/hqdefault.jpg',
    '2026-10-10',
    2,
    true,
    true
  ),
  (
    'c0ffee00-0000-4000-8000-000000000104',
    'c0ffee00-0000-4000-8000-000000000002',
    'Spot institucional — Campaña nacional',
    'Voz oficial de la campaña institucional 2026.',
    'https://vimeo.com/112233445',
    'vimeo',
    'https://player.vimeo.com/video/112233445?autoplay=1',
    null,
    '2026-07-20',
    0,
    true,
    false
  ),
  (
    'c0ffee00-0000-4000-8000-000000000105',
    'c0ffee00-0000-4000-8000-000000000002',
    'Documental — Serie relatos del sur',
    'Narración de la serie documental en tres episodios.',
    'https://photos.app.goo.gl/aBcDeFgHiJkLmNoPq',
    'gphotos',
    null,
    null,
    '2026-06-05',
    1,
    true,
    false
  ),
  (
    'c0ffee00-0000-4000-8000-000000000106',
    'c0ffee00-0000-4000-8000-000000000002',
    'Foto de estudio — sesión 2026',
    'Material fotográfico de prensa.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200',
    'image',
    null,
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
    '2026-05-12',
    2,
    true,
    false
  ),
  (
    'c0ffee00-0000-4000-8000-000000000107',
    'c0ffee00-0000-4000-8000-000000000003',
    'Entrevista a referentes de la cultura',
    'Ciclo de conversaciones con artistas y referentes culturales.',
    'https://youtu.be/q1w2e3r4t5y?t=42',
    'youtube',
    'https://www.youtube-nocookie.com/embed/q1w2e3r4t5y?autoplay=1&rel=0&start=42',
    'https://i.ytimg.com/vi/q1w2e3r4t5y/hqdefault.jpg',
    '2026-09-28',
    0,
    true,
    false
  ),
  (
    'c0ffee00-0000-4000-8000-000000000108',
    'c0ffee00-0000-4000-8000-000000000003',
    'Nota para medio digital',
    'Entrevista publicada en prensa digital.',
    'https://www.lanacion.com.ar/espectaculos/entrevista-ejemplo-nid01012026/',
    'link',
    null,
    null,
    '2026-04-18',
    1,
    true,
    false
  )
on conflict (id) do nothing;
