"use server";

import { revalidatePath } from "next/cache";
import { profileSchema } from "@/lib/schemas";
import { fail, requireAdmin, type ActionResult } from "./common";

const emptyToNull = (v: string | null | undefined) =>
  v && v.trim() !== "" ? v.trim() : null;

export async function updateProfile(input: unknown): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Datos inválidos");
  const auth = await requireAdmin();
  if ("error" in auth) return fail(auth.error);

  const { error } = await auth.supabase
    .from("profile")
    .upsert({
      id: 1,
      full_name: parsed.data.fullName,
      tagline: parsed.data.tagline,
      bio: parsed.data.bio,
      email: emptyToNull(parsed.data.email),
      whatsapp: emptyToNull(parsed.data.whatsapp),
      photo_url: emptyToNull(parsed.data.photoUrl),
      hero_video_url: emptyToNull(parsed.data.heroVideoUrl),
      socials: {
        instagram: emptyToNull(parsed.data.socials.instagram) ?? undefined,
        linkedin: emptyToNull(parsed.data.socials.linkedin) ?? undefined,
        tiktok: emptyToNull(parsed.data.socials.tiktok) ?? undefined,
        youtube: emptyToNull(parsed.data.socials.youtube) ?? undefined,
        x: emptyToNull(parsed.data.socials.x) ?? undefined,
      },
      skills: parsed.data.skills ?? [],
      education: parsed.data.education ?? [],
    })
    .eq("id", 1);

  if (error) return fail(error.message);
  revalidatePath("/");
  revalidatePath("/admin/perfil");
  return { ok: true };
}

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Sube la foto de perfil (ya comprimida a WebP en el cliente) al bucket media
 * y devuelve la URL pública para guardarla en el formulario.
 */
export async function uploadProfilePhoto(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return { ok: false, error: auth.error };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No llegó ningún archivo." };
  if (file.size > MAX_BYTES) return { ok: false, error: "La imagen supera los 8 MB." };
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "El archivo no es una imagen." };
  }

  const path = `profile/foto-${Date.now()}.webp`;
  const { error } = await auth.supabase.storage
    .from("media")
    .upload(path, file, { contentType: "image/webp", upsert: false });
  if (error) return { ok: false, error: `No se pudo subir: ${error.message}` };

  const {
    data: { publicUrl },
  } = auth.supabase.storage.from("media").getPublicUrl(path);
  return { ok: true, url: publicUrl };
}
