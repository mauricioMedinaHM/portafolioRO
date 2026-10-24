# Setup de Supabase (15 min)

Pasos para dejar andando el admin del portafolio.

## 1. Crear el proyecto

1. Entrá a [supabase.com](https://supabase.com) → **New project**.
2. Elegí organización, nombre (`portafolio-ro`), región cercana y una
   contraseña de base de datos (guardala, no la vas a usar seguido).
3. Esperá a que termine el provisionado.

## 2. Crear las tablas

1. En el dashboard → **SQL Editor** → **New query**.
2. Pegá el contenido de `supabase/migrations/0001_init.sql` y ejecutalo.
   Crea `profile`, `categories`, `projects`, `admin_users`, la función
   `is_admin()`, todas las políticas RLS y el bucket `media` (público).
3. En otra query, pegá `supabase/seed.sql` para cargar datos de ejemplo
   (se pueden borrar después desde el admin).

## 3. Crear la usuaria admin

1. **Authentication → Users → Add user → Create new user**: mail real de
   Rosario y una contraseña. Marcá **Auto Confirm User**.
2. **Authentication → Sign In / Providers**: deshabilitá el registro
   público (en *Signup* destildar "Allow new users to sign up").
3. En **Table Editor → admin_users** agregá una fila con el `user_id` del
   usuario creado y su `email`. Alcanza con el mail (la función `is_admin()`
   matchea por `user_id` **o** `email`).

## 4. Variables de entorno

1. **Project Settings → API**: copiá `Project URL` y la `anon public key`.
2. Creá `.env.local` en la raíz a partir de `.env.example`:

   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

3. En producción (Vercel): mismas variables + `NEXT_PUBLIC_SITE_URL` con el
   dominio real. `SUPABASE_SERVICE_ROLE_KEY` **no** se usa de momento.

## 5. Recuperación de contraseña

En **Authentication → URL Configuration** agregá a *Redirect URLs*:
`https://tu-dominio/auth/callback` (y `http://localhost:3000/auth/callback`
para desarrollo). El flujo ya está implementado en el login
(«¿Olvidaste tu contraseña?») y en `/admin/perfil` para cambiarla.

## Notas

- El plan free pausa el proyecto tras ~7 días sin uso: la landing sigue
  sirviendo el caché ISR; hay un ping semanal previsto (workstream F).
- Si falta alguna variable, `/admin` redirige al login y muestra un aviso
  claro; la landing usa los datos mock.
- Sin sesión, `/admin/**` redirige a `/admin/login` (middleware) y las
  políticas RLS bloquean cualquier escritura no-admin igualmente.
