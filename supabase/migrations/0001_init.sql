-- Migración inicial: profile, categories, projects + RLS + bucket "media".

create extension if not exists pgcrypto;

-- Perfil (fila única)
create table if not exists public.profile (
  id smallint primary key default 1 check (id = 1),
  full_name text not null,
  tagline text not null default '',
  bio text not null default '',
  photo_url text,
  hero_video_url text,
  email text,
  whatsapp text, -- formato E.164
  socials jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique, -- ancla #slug
  intro text,
  skills text[] not null default '{}',
  position integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  title text not null,
  description text check (char_length(description) <= 280),
  url text not null,
  provider text not null check (provider in ('drive', 'gphotos', 'youtube', 'vimeo', 'image', 'link')),
  embed_url text,
  thumbnail_url text,
  date date,
  position integer not null default 0,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_category_position_idx
  on public.projects (category_id, position);

-- Lista blanca de admins (la usuaria se crea a mano en Supabase Auth y
-- se agrega su user_id acá).
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace trigger profile_set_updated_at
  before update on public.profile
  for each row execute function public.set_updated_at();

create or replace trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create or replace trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- RLS ---------------------------------------------------------------------

alter table public.profile enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.admin_users enable row level security;

-- Lectura pública: solo lo visible/publicado.
create policy "profile: lectura pública"
  on public.profile for select
  to anon, authenticated
  using (true);

create policy "categories: lectura pública de visibles"
  on public.categories for select
  to anon, authenticated
  using (is_visible or public.is_admin());

create policy "projects: lectura pública de publicados"
  on public.projects for select
  to anon, authenticated
  using (is_published or public.is_admin());

-- Escritura: solo admins.
create policy "profile: escritura admin"
  on public.profile for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "categories: escritura admin"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "projects: escritura admin"
  on public.projects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Cada admin solo puede verse a sí mismo en la lista blanca.
create policy "admin_users: lectura propia"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

-- Storage: bucket "media" público para lectura, escritura solo admin.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media: lectura pública"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "media: escritura admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

create policy "media: actualización admin"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "media: borrado admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());
