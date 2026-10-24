# Portafolio — Rosario Tejerina Pittis

Landing mobile-first de portafolio audiovisual.
Next.js 15 (App Router) · TypeScript · Tailwind v4 · Motion · Vercel. Sin base de datos ni panel admin.

## Cómo cargar trabajos

Todo el contenido está en **`contenido.ts`** (raíz del repo): perfil, formación, habilidades y las secciones con sus trabajos.

Para sumar un video, copiá un bloque dentro de la sección y pegá el link:

```ts
{
  titulo: "Programa — detalle",
  link: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  descripcion: "Una o dos frases.", // opcional
  fecha: "2026-10-24",              // opcional
  destacado: true,                   // opcional
},
```

El sitio detecta el tipo de link y arma el reproductor y la miniatura: YouTube (videos, vivos, shorts, youtu.be), Vimeo, Google Drive (compartido como "cualquier persona con el enlace"), Google Fotos, e imágenes/videos directos. Cualquier otro link se muestra como botón "Ver video". Sin link, el trabajo aparece como tarjeta de experiencia.

Guardar y hacer `git push`: Vercel redeploya solo.

## Setup

```bash
pnpm install
cp .env.example .env.local   # NEXT_PUBLIC_SITE_URL (OG, sitemap, QR)
pnpm dev
```

## Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` / `pnpm start` | Build de producción |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` | ESLint / tsc / Vitest |
| `pnpm test:e2e` | Build + Playwright (360–1280px) |

## Estructura

- `contenido.ts` — el contenido (lo único que hay que editar)
- `app/` — landing (`page.tsx`), OG, sitemap, robots
- `components/` — `sections/` landing, `pop/` decoración y títulos, `media/` embeds, `share/` QR, `ui/` base
- `lib/` — tipos, parser de links (`embed/`), armado de datos (`data/content.ts`)
- `docs/DISENO.md` — dirección visual y motion
- `tests/e2e` — Playwright

## Deploy (Vercel)

Importar el repo en Vercel (framework Next.js, sin config extra) y cargar `NEXT_PUBLIC_SITE_URL` en Environment Variables.
