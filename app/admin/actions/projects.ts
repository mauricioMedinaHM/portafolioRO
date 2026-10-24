"use server";

import { revalidatePath } from "next/cache";
import { parseMediaUrl } from "@/lib/embed/parseMediaUrl";
import { resolveThumbnail } from "@/lib/embed/thumbnails";
import type { SupabaseClient } from "@supabase/supabase-js";
import { projectSchema } from "@/lib/schemas";
import { fail, requireAdmin, type ActionResult } from "./common";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin");
}

/**
 * Crea o actualiza un proyecto. El provider/embedUrl/thumbnailUrl se
 * recalculan del lado del servidor a partir de la URL (no confiamos en el cliente).
 */
export async function saveProject(
  id: string | null,
  input: unknown,
): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Datos inválidos");
  const auth = await requireAdmin();
  if ("error" in auth) return fail(auth.error);

  const media = parseMediaUrl(parsed.data.url);
  let thumbnailUrl = media.thumbnailUrl;
  if (!thumbnailUrl) {
    thumbnailUrl = await resolveThumbnail(media).catch(() => null);
  }

  const row = {
    category_id: parsed.data.categoryId,
    title: parsed.data.title,
    description: parsed.data.description || null,
    url: parsed.data.url,
    provider: media.provider,
    embed_url: media.embedUrl,
    thumbnail_url: thumbnailUrl,
    date: parsed.data.date || null,
    is_published: parsed.data.isPublished,
    is_featured: parsed.data.isFeatured,
  };

  const query = id
    ? auth.supabase.from("projects").update(row).eq("id", id)
    : auth.supabase.from("projects").insert({
        ...row,
        position: await nextPosition(auth.supabase, parsed.data.categoryId),
      });

  const { error } = await query;
  if (error) return fail(friendly(error.message));
  revalidate();
  return { ok: true };
}

async function nextPosition(supabase: SupabaseClient, categoryId: string) {
  const { data } = await supabase
    .from("projects")
    .select("position")
    .eq("category_id", categoryId)
    .order("position", { ascending: false })
    .limit(1);
  return ((data?.[0]?.position as number | undefined) ?? -1) + 1;
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return fail(auth.error);
  const { error } = await auth.supabase.from("projects").delete().eq("id", id);
  if (error) return fail(friendly(error.message));
  revalidate();
  return { ok: true };
}

export async function reorderProjects(
  categoryId: string,
  orderedIds: string[],
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return fail(auth.error);

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      auth.supabase
        .from("projects")
        .update({ position: index })
        .eq("id", id)
        .eq("category_id", categoryId),
    ),
  );
  const error = results.find((r) => r.error)?.error;
  if (error) return fail(friendly(error.message));
  revalidate();
  return { ok: true };
}

export async function setProjectPublished(
  id: string,
  isPublished: boolean,
): Promise<ActionResult> {
  return setProjectFlag(id, { is_published: isPublished });
}

export async function setProjectFeatured(
  id: string,
  isFeatured: boolean,
): Promise<ActionResult> {
  return setProjectFlag(id, { is_featured: isFeatured });
}

async function setProjectFlag(
  id: string,
  patch: { is_published?: boolean; is_featured?: boolean },
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return fail(auth.error);
  const { error } = await auth.supabase.from("projects").update(patch).eq("id", id);
  if (error) return fail(friendly(error.message));
  revalidate();
  return { ok: true };
}

function friendly(message: string): string {
  if (message.includes("row-level security")) {
    return "Tu usuario no tiene permiso de admin. Revisá la tabla admin_users.";
  }
  return message;
}
