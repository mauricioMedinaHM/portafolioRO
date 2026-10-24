# Portafolio — Rosario Tejerina Pittis

Landing mobile-first de portafolio audiovisual + panel admin.
Next.js 15 (App Router) · TypeScript · Tailwind v4 · Supabase · Vercel.

## Setup

```bash
pnpm install
cp .env.example .env.local   # completar vars de Supabase
pnpm dev
```

Variables de entorno (`docs/SUPABASE_SETUP.md` tiene el paso a paso):

- `NEXT_PUBLIC_SITE_URL` — URL pública (OG, sitemap, QR)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Sin Supabase configurado, la landing sirve los datos de `lib/data/mocks.ts`
  y `/admin` muestra un aviso de configuración.

Base de datos: ejecutar `supabase/migrations/0001_init.sql` y luego
`supabase/seed.sql` en el SQL Editor de Supabase, crear la usuaria en
Auth y sumarla a la tabla `admin_users` (por mail alcanza).

## Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` / `pnpm start` | Build de producción |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` | ESLint / tsc / Vitest |
| `pnpm test:e2e` | Build + Playwright (360–1280px) |

## Estructura

- `app/` — landing (`page.tsx`), admin (`/admin`), auth callback, `/dev/ui`
- `components/` — `ui/` base, `sections/` landing, `media/` embeds,
  `share/` QR, `admin/` panel
- `lib/` — tipos, schemas zod, supabase clients, queries, embed parser
- `supabase/` — migración + seed (contenido real en `docs/CONTENIDO.md`)
- `tests/e2e` — Playwright

## Deploy (Vercel)

1. Importar el repo en Vercel (framework Next.js, sin config extra).
2. Cargar las env vars en Project Settings → Environment Variables.
3. El cron de `vercel.json` hace ping semanal a `/api/ping` para que el
   plan free de Supabase no se pause.
