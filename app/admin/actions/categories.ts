"use server";

import { revalidatePath } from "next/cache";
import { categorySchema } from "@/lib/schemas";
import { fail, requireAdmin, type ActionResult } from "./common";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/categorias");
}

export async function saveCategory(
  id: string | null,
  input: unknown,
): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Datos inválidos");
  const auth = await requireAdmin();
  if ("error" in auth) return fail(auth.error);

  const row = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    intro: parsed.data.intro || null,
    skills: parsed.data.skills,
    is_visible: parsed.data.isVisible,
  };

  if (id) {
    const { error } = await auth.supabase.from("categories").update(row).eq("id", id);
    if (error) return fail(friendly(error.message));
  } else {
    const { data: last } = await auth.supabase
      .from("categories")
      .select("position")
      .order("position", { ascending: false })
      .limit(1);
    const position = ((last?.[0]?.position as number | undefined) ?? -1) + 1;
    const { error } = await auth.supabase
      .from("categories")
      .insert({ ...row, position });
    if (error) return fail(friendly(error.message));
  }
  revalidate();
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return fail(auth.error);
  const { error } = await auth.supabase.from("categories").delete().eq("id", id);
  if (error) {
    if (error.message.includes("foreign key") || error.code === "23503") {
      return fail(
        "Esta categoría tiene proyectos. Movélos o borralos primero.",
      );
    }
    return fail(friendly(error.message));
  }
  revalidate();
  return { ok: true };
}

export async function reorderCategories(
  orderedIds: string[],
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return fail(auth.error);
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      auth.supabase.from("categories").update({ position: index }).eq("id", id),
    ),
  );
  const error = results.find((r) => r.error)?.error;
  if (error) return fail(friendly(error.message));
  revalidate();
  return { ok: true };
}

export async function setCategoryVisible(
  id: string,
  isVisible: boolean,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return fail(auth.error);
  const { error } = await auth.supabase
    .from("categories")
    .update({ is_visible: isVisible })
    .eq("id", id);
  if (error) return fail(friendly(error.message));
  revalidate();
  return { ok: true };
}

function friendly(message: string): string {
  if (message.includes("row-level security")) {
    return "Tu usuario no tiene permiso de admin. Revisá la tabla admin_users.";
  }
  if (message.includes("duplicate") || message.includes("unique")) {
    return "Ya existe una categoría con ese slug.";
  }
  return message;
}
