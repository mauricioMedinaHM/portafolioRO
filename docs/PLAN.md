---
agent: devin-local
session: vigorous-healer
created: 2026-10-24T01:53:35Z
---
# Plan de desarrollo – Landing-portafolio audiovisual de Rosario Verónica Pittis

Landing mobile-first en Next.js + Supabase en Vercel, con panel admin para cargar proyectos por categoría, embeds de Drive, Fotos, YouTube y Vimeo con fallback, y QR para compartir, repartida en 6 workstreams paralelos para Orca.

## 0. Estado actual
El repo `/Users/mauricio/PROGRAMACION/portafolioRO` está vacío (git iniciado, sin commits). Es un proyecto desde cero.

## 1. Resumen y decisiones clave
| Decisión | Elección | Por qué | Descartado |
|---|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSR/ISR para SEO y OG, rutas `/admin` en el mismo proyecto, server actions sin armar una API aparte | Astro (el admin interactivo queda más incómodo), SPA con Vite (SEO flojo) |
| Estilos | **Tailwind CSS v4** + tokens CSS | mobile-first nativo, agentes en paralelo sin conflictos de CSS | CSS Modules, UI kits pesados |
| Datos + auth + archivos | **Supabase** (Postgres + Auth + Storage), plan free | un solo servicio para login, BD relacional (orden y categorías), subida de fotos y archivos, RLS | Firebase (NoSQL, orden y relaciones más incómodos), Vercel KV/Blob (sin auth, hay que armar todo), CMS headless tipo Sanity (otro panel distinto, más curva de aprendizaje para la clienta, y el formulario de links con preview queda menos a medida) |
| Hosting | **Vercel** (Hobby) + deploy automático desde GitHub | gratis, previews por PR | Netlify (equivalente, menos integrado con Next) |
| Refresco de contenido | ISR + `revalidatePath('/')` en cada guardado del admin | la landing es estática (rápida) y se actualiza al instante cuando ella guarda | SSR en cada request |
| QR | lib `qrcode` en cliente (canvas → PNG) | liviana, sin servidor | APIs externas de QR |

**Pros de Supabase:** gratis, SQL, RLS, Storage incluido, login por mail. **Contras:** los proyectos free se pausan tras ~7 días sin actividad → mitigación: la landing lee con ISR (sigue sirviendo el caché) + cron de Vercel semanal que hace un ping (supuesto). Además es un proveedor más.

**Supuesto:** una sola usuaria admin (la clienta), sin registro público.

## 2. Arquitectura
### Estructura de carpetas (con workstream dueño)
```
/app
  layout.tsx, globals.css                 (A)
  page.tsx                                (B)  landing, server component
  opengraph-image.tsx, sitemap.ts, robots.ts (F)
  /admin
    layout.tsx, page.tsx                  (D)  listado de proyectos
    /login/page.tsx                       (D)
    /proyectos/[id]/page.tsx, /nuevo      (D)
    /categorias/page.tsx                  (D)
    /perfil/page.tsx                      (D)
  /auth/callback/route.ts                 (D)
/components
  /ui        Button, Card, Modal, Sheet, Input, Section, Icon  (A)
  /sections  Hero, About, CategorySection, Contact, NavBar, FloatingContact (B)
  /media     MediaCard, LazyEmbed, MediaFallback               (C)
  /share     ShareModal, QrCode, ShareButtons                  (E)
  /admin     ProjectForm, SortableList, CategoryForm, LinkPreview (D)
/lib
  types.ts            (contrato, fase 0)
  /embed  parseMediaUrl.ts, thumbnails.ts, parseMediaUrl.test.ts (C)
  /data   queries.ts (lectura pública), mocks.ts (fase 0)  (D; mocks fase 0)
  /supabase server.ts, client.ts, middleware              (D)
  site.ts             config (URL pública, nombre)         (fase 0)
/supabase/migrations/*.sql, seed.sql                       (D)
middleware.ts                                              (D)
/tests/e2e (Playwright)                                    (F)
```

### Modelo de datos (contrato en `lib/types.ts` y SQL)
```ts
type MediaProvider = 'drive' | 'gphotos' | 'youtube' | 'vimeo' | 'image' | 'link';

interface Profile {            // fila única
  id: 1; fullName: string; tagline: string; bio: string;
  photoUrl: string | null; heroVideoUrl: string | null;
  email: string | null; whatsapp: string | null;      // formato E.164
  socials: { instagram?: string; linkedin?: string; tiktok?: string; youtube?: string; x?: string };
  updatedAt: string;
}
interface Category {
  id: string; name: string; slug: string;            // slug = ancla #conduccion
  intro: string | null;                              // cualidades y habilidades (markdown simple)
  skills: string[];                                  // chips destacados
  position: number; isVisible: boolean;
}
interface Project {
  id: string; categoryId: string; title: string;
  description: string | null;                        // máx. ~280 caracteres
  url: string; provider: MediaProvider;              // provider se calcula al guardar
  embedUrl: string | null; thumbnailUrl: string | null; // calculado o subido a mano
  date: string | null;                               // YYYY-MM-DD
  position: number; isPublished: boolean; isFeatured: boolean;
  createdAt: string; updatedAt: string;
}
interface ParsedMedia { provider: MediaProvider; id: string | null; embedUrl: string | null;
  thumbnailUrl: string | null; canEmbed: boolean; originalUrl: string; }
```
- Tablas `profile`, `categories`, `projects` (FK `category_id` con `on delete restrict`: no se puede borrar una categoría con proyectos sin moverlos antes; la UI lo ofrece).
- RLS: `select` público solo si `is_published` / `is_visible`; `insert/update/delete` solo para `auth.uid()` que coincida con el `ADMIN_USER_ID` (o lista blanca de mails).
- Storage bucket `media` (público para lectura): foto de perfil, miniaturas manuales e imágenes/archivos subidos (supuesto: hasta 50 MB por archivo en el plan free; los videos se cargan como link, no como archivo).

### Flujo de login
1. `/admin/login`: mail + contraseña (más simple que magic link en el celu; magic link como alternativa).
2. Supabase Auth guarda la sesión en cookies (`@supabase/ssr`); `middleware.ts` protege `/admin/**` y redirige al login.
3. El registro público está deshabilitado en Supabase; la usuaria se crea a mano. Hay recuperación de contraseña por mail.

### Flujo de carga de contenido
1. Pega el link en "Nuevo proyecto" → `parseMediaUrl` en el cliente muestra la preview al momento y avisa ("Este link de Drive tiene que estar compartido como *Cualquier persona con el enlace*").
2. Completa título, categoría (select), descripción, fecha y publicado.
3. Server action: valida con zod, vuelve a parsear del lado del servidor, guarda provider/embedUrl/thumbnailUrl y llama a `revalidatePath('/')`.
4. Para ordenar: drag & drop con `@dnd-kit` + botones ↑↓ (más confiables con el dedo) → acción `reorder(ids[])`.

## 3. Mapa de la landing (mobile, 360–430 px)
1. **NavBar sticky**: nombre/logo + botón hamburguesa → sheet a pantalla completa con anclas (generadas desde las categorías) y un botón "Compartir". Scroll suave con `scroll-margin-top`.
2. **Hero (#inicio)**: foto o video corto en loop (sin audio, poster), nombre, tagline ("Conductora · Comunicadora"), CTA "Ver mi trabajo" y botón de WhatsApp. El LCP es la foto (`next/image priority`).
3. **Sobre mí (#sobre-mi)**: bio corta, chips de habilidades y foto secundaria.
4. **Destacados (opcional, MVP+)**: carrusel horizontal con scroll-snap de los proyectos `isFeatured`.
5. **CategorySection × N (#slug)**, en el orden de `position`. Conducción va primera por defecto:
   - título y `intro` (cualidades y habilidades) + chips de `skills`
   - abajo, lista de `MediaCard` en 1 columna (2 en tablet, 3 en desktop): miniatura 16:9, botón de play grande (≥56 px), título, fecha y descripción. Si hay más de 6, botón "Ver más".
6. **Compartir (#compartir)**: QR visible + "Descargar QR" + "Compartir link" (también se abre desde el nav como modal).
7. **Contacto (#contacto)**: botones grandes de WhatsApp (`https://wa.me/<num>?text=...`) y mail (`mailto:`), íconos de redes.
8. **FloatingContact**: botón flotante de WhatsApp abajo a la derecha (respetando `safe-area-inset`).
9. **Footer**: © y un link discreto "Admin".

Categorías sugeridas para el seed (las puede editar, renombrar, ordenar y borrar): **Conducción**, Locución, Entrevistas, Producción audiovisual, Redes sociales y contenidos, Prensa/Medios gráficos, Eventos y moderación.

## 4. Lógica de embeds (`lib/embed/parseMediaUrl.ts`)
| Tipo | Patrones de link | Embed | Miniatura | Notas y limitaciones reales |
|---|---|---|---|---|
| Google Drive (archivo) | `drive.google.com/file/d/{ID}/view…`, `open?id={ID}`, `uc?id={ID}` | `https://drive.google.com/file/d/{ID}/preview` | `https://drive.google.com/thumbnail?id={ID}&sz=w800` | Tiene que estar compartido como "Cualquier persona con el enlace" (si no, el iframe muestra "Necesitás acceso"). Los videos recién subidos muestran "se está procesando". Hay límite de cuota de reproducciones o descargas en archivos muy vistos. En Safari iOS, con cookies de terceros bloqueadas, a veces pide login o no reproduce. No hay control de autoplay. No se puede detectar el error desde el iframe (es cross-origin). |
| Drive carpeta | `drive.google.com/drive/folders/{ID}` | `https://drive.google.com/embeddedfolderview?id={ID}#grid` (MVP: fallback) | — | Poco amigable en el celular → fallback de tarjeta con link. |
| Google Fotos | `photos.app.goo.gl/…`, `photos.google.com/share/…`, `/photo/…` | **No se puede embeber** | og:image obtenida en el servidor (best-effort) o miniatura subida a mano | Google Fotos no tiene un embed oficial y responde con `X-Frame-Options`, así que el iframe se bloquea. Los links cortos redirigen. El URL directo `lh3.googleusercontent.com` del og:image puede vencer. → Siempre fallback: tarjeta con miniatura y "Ver en Google Fotos". Recomendación para la clienta: subir los videos clave a YouTube (oculto) o Drive. |
| YouTube | `youtube.com/watch?v=`, `youtu.be/`, `/shorts/`, `/live/`, `/embed/` | `https://www.youtube-nocookie.com/embed/{ID}?autoplay=1&rel=0` (+`start` si viene `t=`) | `https://i.ytimg.com/vi/{ID}/hqdefault.jpg` | El video tiene que ser público u oculto y tener permitido el embed. Los Shorts se muestran en 9:16. |
| Vimeo | `vimeo.com/{ID}`, `vimeo.com/{ID}/{hash}`, `player.vimeo.com/video/{ID}` | `https://player.vimeo.com/video/{ID}?h={hash}&autoplay=1` | oEmbed `vimeo.com/api/oembed.json?url=` (se resuelve en el servidor al guardar) | Si es privado, la privacidad de embed tiene que permitir el dominio. |
| Imagen / archivo subido | URL del bucket de Supabase | `<img>` / `<video>` nativo | la misma imagen | — |
| Otro | cualquier URL | — | miniatura manual o placeholder con el ícono del dominio | Fallback. |

**Patrón facade (carga diferida):** `MediaCard` renderiza solo la miniatura + botón de play. Al tocarlo, `LazyEmbed` monta el `<iframe loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen>` en un contenedor `aspect-video`. Así no carga ningún iframe hasta la interacción.
**Fallback:** si `canEmbed=false`, o si la miniatura falla (`onError`), se muestra `MediaFallback` con un botón "Ver video ↗" (`target=_blank rel=noopener`). Dentro del embed siempre hay un link chico "¿No carga? Abrir en {proveedor}", porque los errores del iframe no se pueden detectar.

## 5. Workstreams para Orca
### Fase 0 (en serie, una sola persona/agente, chica): "Contratos"
- Scaffold de Next + TS + Tailwind + ESLint/Prettier + Vitest, `lib/types.ts`, `lib/site.ts`, `lib/data/mocks.ts` (perfil, 3 categorías y 8 proyectos de cada proveedor), firma de `parseMediaUrl` (stub), SQL de la migración inicial y `.env.example`.
- Salida: rama `main` con el build en verde. **Todos los workstreams arrancan desde acá.** Regla: `types.ts` solo cambia con un PR coordinado.

### A — Setup de diseño y componentes base
- **Dueño de:** `app/layout.tsx`, `app/globals.css`, `components/ui/**`, fuentes y tokens.
- **Entradas:** la dirección de estilo elegida (sección 9). **Salidas:** tokens (colores, tipografía, espaciados, radios), `Button` (variantes primary/secondary/ghost, tamaño mínimo de 48 px), `Card`, `Modal`, `Sheet`, `Input/Textarea/Select`, `Section`, `Icon`, `/dev/ui` con una vista de muestra (se borra antes de producción).
- **Depende de:** fase 0.
- **Aceptación:** contraste AA, foco visible, `prefers-reduced-motion` respetado, fuentes con `next/font` (sin CLS) y componentes documentados con props tipadas.

### B — Landing y secciones
- **Dueño de:** `app/page.tsx`, `components/sections/**`.
- **Entradas:** `Profile`, `Category[]`, `Project[]` (al principio desde mocks; después desde `lib/data/queries.ts`), `MediaCard` de C y `ShareModal` de E (mientras tanto, placeholders con la misma interfaz).
- **Salidas:** la landing completa de la sección 3, anclas dinámicas y estados vacíos (categorías sin proyectos se ocultan).
- **Depende de:** fase 0. Arranca con stubs de A, C y E.
- **Aceptación:** se ve bien a 360 px sin scroll horizontal, la navegación por anclas no queda tapada por el nav, y el orden refleja `position`.

### C — Embeds y tarjetas de video
- **Dueño de:** `lib/embed/**`, `components/media/**`.
- **Interfaz:** `parseMediaUrl(url: string): ParsedMedia`; `resolveThumbnail(parsed): Promise<string|null>` (solo servidor: oEmbed de Vimeo, og:image de Fotos); `<MediaCard project={Project} />`; `<LazyEmbed embedUrl aspect="16/9"|"9/16" title />`.
- **Depende de:** fase 0.
- **Aceptación:** tests unitarios con ≥25 URLs reales (todas las variantes de la tabla, links con `?usp=sharing`, espacios y `http`), ningún iframe en el DOM antes del tap, y fallback probado con un link de Fotos y uno inválido.

### D — Panel admin y base de datos (prioridad máxima)
- **Dueño de:** `app/admin/**`, `app/auth/**`, `components/admin/**`, `lib/supabase/**`, `lib/data/queries.ts`, `middleware.ts`, `supabase/**`.
- **Salidas:** migraciones + RLS + seed, login/logout/recuperar contraseña, CRUD de proyectos (form con preview usando `parseMediaUrl` de C), CRUD de categorías (nombre, slug automático, intro, skills, visibilidad), orden con drag + ↑↓, edición de perfil con subida de foto (comprimida en el cliente a ≤1600 px WebP), `queries.ts` (`getLandingData()` con la misma forma que los mocks) y revalidación.
- **UX en el celular:** la lista como tarjetas grandes, un botón flotante "+ Nuevo", formularios de una columna con inputs de 16 px (para que iOS no haga zoom), un botón "Pegar" que usa el Clipboard API, toasts de confirmación, confirmar antes de borrar y un switch de "Publicado".
- **Depende de:** fase 0. Usa `parseMediaUrl` de C (hasta que esté, un stub).
- **Aceptación:** sin sesión no se puede leer ni escribir nada del admin (probado también con la API directa de Supabase y la anon key), un proyecto nuevo aparece en la landing en menos de 5 s después de guardar, y todo el flujo se puede hacer en un iPhone y en un Android con una mano.

### E — QR y compartir
- **Dueño de:** `components/share/**`.
- **Interfaz:** `<ShareModal open onClose />`, `<QrCode value={SITE_URL} size />`, `<ShareButtons url title />`.
- **Salidas:** QR generado con `qrcode` (con los colores de la marca y margen para que se pueda leer), "Descargar PNG" (1024 px, nombre `qr-rosario-pittis.png`), "Compartir" con `navigator.share` y si no existe "Copiar link" (Clipboard API + toast), y `?utm_source=qr` en el valor del QR.
- **Depende de:** fase 0 + `Modal` de A (puede arrancar con un `<dialog>` nativo).
- **Aceptación:** el QR se escanea bien con la cámara de iOS y Android, la descarga funciona en iOS Safari (fallback: abrir la imagen en una pestaña nueva para mantener apretado y guardar) y el código se carga de forma diferida (dynamic import).

### F — QA mobile, SEO y deploy
- **Dueño de:** `app/opengraph-image.tsx`, `sitemap.ts`, `robots.ts`, `metadata` (coordinado con A en `layout.tsx` vía `lib/site.ts`), `tests/e2e/**`, `vercel.json`, CI (`.github/workflows`).
- **Salidas:** proyecto en Vercel conectado al repo, variables de entorno, previews por PR, metadatos OG/Twitter, JSON-LD `Person`, `robots` con `/admin` en noindex, Playwright con viewports de 360, 390, 430, 768 y 1280, Lighthouse CI y el cron de ping a Supabase.
- **Depende de:** se monta en paralelo desde el día 1 (CI y deploy); la QA final necesita B, C, D y E.
- **Aceptación:** Lighthouse mobile ≥90 en Performance y ≥95 en Accesibilidad, SEO y Buenas prácticas; LCP <2,5 s en 4G simulada; CLS <0,1; la preview de WhatsApp muestra la imagen y el título.

## 6. Orden de ejecución
1. **Fase 0** (en serie): contratos, scaffold, migración SQL y mocks.
2. **Fase 1** (en paralelo): A, C, D, E y F (infra) en simultáneo; B arranca con mocks y stubs.
3. **Fase 2 (integración):** B reemplaza los stubs por los componentes reales de A, C y E; B cambia los mocks por `getLandingData()` de D; D integra el `parseMediaUrl` real.
4. **Fase 3:** F hace la QA completa, se cargan los contenidos reales con la clienta y se ajusta.
5. **Post-MVP:** destacados, filtros por año, analytics (Vercel Analytics), subida de archivos de video, dominio propio, modo "vista previa" en el admin y multi-idioma.

Merge: un PR por workstream, rebases diarios sobre `main` y CI obligatorio (lint, typecheck, unit tests, build).

## 7. Riesgos y preguntas abiertas
**Riesgos**
- Google Fotos no se puede embeber → hay que educar a la clienta y tener el fallback.
- Drive en iOS Safari, con permisos o cuotas → aviso en el admin + link "abrir en Drive"; recomendar YouTube oculto para los videos principales.
- Pausa del proyecto free de Supabase → caché ISR + ping semanal.
- Que la clienta se olvide de la contraseña → recuperación por mail; documentar en una guía de 1 página.
- Conflictos entre agentes → dueños de carpetas estrictos y `types.ts` congelado.

**Preguntas para la clienta**
1. ¿Dominio propio (ej. `rosariopittis.com.ar`) o alcanza con `*.vercel.app` al principio?
2. Textos: tagline, bio y el texto de cualidades de Conducción.
3. Fotos profesionales (hero + secundaria) y ¿tiene un video corto para el hero?
4. Redes sociales (cuáles y links), número de WhatsApp y mail de contacto.
5. ¿Con qué categorías arrancamos y en qué orden?
6. ¿Dónde tiene hoy los videos? (Drive, Fotos o YouTube) y ¿acepta subirlos a YouTube como ocultos?
7. ¿Tiene preferencia de colores o una identidad visual existente?
8. ¿Quiere un CV en PDF descargable?

## 8. Direcciones de estilo
1. **"Estudio cálido" (recomendada):** fondo crema `#F7F1EA`, texto `#1F1A17`, acento terracota `#C2553A`, secundario oliva suave `#6B7A5A`. Títulos en *Fraunces* (serif con carácter) y cuerpo en *Inter*. Tono cercano, profesional y humano; las miniaturas de video resaltan sobre el fondo claro. Encaja con "cálida y con personalidad".
2. **"Set de TV" (oscuro):** fondo `#0F0F12`, texto `#F2F2F2`, acento amarillo "on air" `#FFC23C`. *Space Grotesk* + *Inter*. Cinematográfico, los videos lucen mucho, pero es más frío.
3. **"Revista editorial":** blanco `#FFFFFF`, negro, acento fucsia `#D6246E`. *Playfair Display* + *DM Sans*. Elegante y llamativo, pero con riesgo de verse genérico.

## 9. Checklist final de aceptación
- [ ] Se ve y anda bien en 360, 390 y 430 px (iPhone SE/13/Pro Max, Android de gama media), y después en 768 y 1280.
- [ ] Probado en el celular real: iOS Safari y Chrome Android, en 4G.
- [ ] Botones de ≥48 px; no hay scroll horizontal; las anclas funcionan y el menú se cierra al tocar.
- [ ] Los videos de Drive, YouTube y Vimeo se reproducen al tocar; ningún iframe carga antes; el fallback de Fotos y de links inválidos funciona.
- [ ] Admin: login, crear, editar, ordenar, publicar/despublicar y borrar proyectos y categorías desde el celular; cambios visibles en la landing en menos de 5 s.
- [ ] Sin login no hay acceso al admin ni se puede escribir en la BD (RLS verificado).
- [ ] QR: se escanea, se descarga y "Compartir/Copiar link" funciona en iOS y Android.
- [ ] WhatsApp abre con un mensaje precargado; el mail abre la app de correo; las redes abren correctamente.
- [ ] Lighthouse mobile ≥90/95/95/95; LCP <2,5 s; CLS <0,1.
- [ ] La preview OG se ve bien en WhatsApp, LinkedIn e Instagram DM; `/admin` está en noindex.
- [ ] Deploy automático desde `main` en Vercel; las variables de entorno no están en el repo.
- [ ] Guía de uso de 1 página para la clienta (cómo compartir un Drive como "cualquiera con el link", cómo cargar un proyecto).

## Supuestos marcados
- Una sola admin; login con mail y contraseña.
- Los videos se cargan como links (no se suben archivos de video) en el MVP.
- Idioma solo español.
- Dominio `*.vercel.app` hasta que la clienta defina uno.
- Las categorías vacías no se muestran en la landing.
