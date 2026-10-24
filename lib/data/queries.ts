import { createClient as createAnonClient } from "@supabase/supabase-js";
import { mockCategories, mockProfile, mockProjects } from "@/lib/data/mocks";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Category, Profile, Project } from "@/lib/types";

export interface LandingData {
  profile: Profile;
  categories: Category[];
  projects: Project[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function toProfile(row: any): Profile {
  return {
    id: 1,
    fullName: row.full_name,
    tagline: row.tagline,
    bio: row.bio,
    photoUrl: row.photo_url,
    heroVideoUrl: row.hero_video_url,
    email: row.email,
    whatsapp: row.whatsapp,
    socials: row.socials ?? {},
    skills: row.skills ?? [],
    education: row.education ?? [],
    updatedAt: row.updated_at,
  };
}

function toCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    intro: row.intro,
    skills: row.skills ?? [],
    position: row.position,
    isVisible: row.is_visible,
  };
}

function toProject(row: any): Project {
  return {
    id: row.id,
    categoryId: row.category_id,
    title: row.title,
    description: row.description,
    url: row.url,
    provider: row.provider,
    embedUrl: row.embed_url,
    thumbnailUrl: row.thumbnail_url,
    date: row.date,
    position: row.position,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mockLandingData(): LandingData {
  return {
    profile: mockProfile,
    categories: mockCategories,
    projects: mockProjects,
  };
}

/**
 * Datos públicos de la landing. Lee con la anon key (RLS filtra lo
 * publicado/visible) y cae a los mocks si faltan env vars o hay error.
 */
export async function getLandingData(): Promise<LandingData> {
  const env = getSupabaseEnv();
  if (!env.ok) return mockLandingData();

  try {
    const supabase = createAnonClient(env.url!, env.anonKey!, {
      auth: { persistSession: false },
    });
    const [profile, categories, projects] = await Promise.all([
      supabase.from("profile").select("*").eq("id", 1).maybeSingle(),
      supabase
        .from("categories")
        .select("*")
        .eq("is_visible", true)
        .order("position", { ascending: true }),
      supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("position", { ascending: true }),
    ]);

    if (categories.error || projects.error) throw categories.error ?? projects.error;
    if (!profile.data) return { ...mockLandingData(), categories: categories.data.map(toCategory), projects: projects.data.map(toProject) };

    return {
      profile: toProfile(profile.data),
      categories: categories.data.map(toCategory),
      projects: projects.data.map(toProject),
    };
  } catch (error) {
    console.warn("getLandingData: error leyendo Supabase, usando mocks", error);
    return mockLandingData();
  }
}

/** Datos completos para el admin (requiere sesión; RLS deja ver todo al admin). */
export async function getAdminData(): Promise<LandingData> {
  const supabase = await createServerClient();
  const [profile, categories, projects] = await Promise.all([
    supabase.from("profile").select("*").eq("id", 1).maybeSingle(),
    supabase
      .from("categories")
      .select("*")
      .order("position", { ascending: true }),
    supabase
      .from("projects")
      .select("*")
      .order("position", { ascending: true }),
  ]);

  if (categories.error) throw new Error(categories.error.message);
  if (projects.error) throw new Error(projects.error.message);

  return {
    profile: profile.data ? toProfile(profile.data) : mockProfile,
    categories: categories.data.map(toCategory),
    projects: projects.data.map(toProject),
  };
}
