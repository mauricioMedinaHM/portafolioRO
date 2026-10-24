"use server";

import { redirect } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { loginSchema, passwordSchema, recoverSchema } from "@/lib/schemas";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { ENV_MISSING, fail, type ActionResult } from "./common";

export async function signIn(input: unknown): Promise<ActionResult> {
  if (!hasSupabaseEnv()) return fail(ENV_MISSING);
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Datos inválidos");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return fail("Mail o contraseña incorrectos.");
  return { ok: true };
}

export async function sendRecovery(input: unknown): Promise<ActionResult> {
  if (!hasSupabaseEnv()) return fail(ENV_MISSING);
  const parsed = recoverSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Mail inválido");

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${SITE_URL}/auth/callback?next=/admin/perfil`,
  });
  if (error) return fail("No se pudo enviar el mail. Probá de nuevo.");
  return { ok: true };
}

export async function updatePassword(input: unknown): Promise<ActionResult> {
  if (!hasSupabaseEnv()) return fail(ENV_MISSING);
  const parsed = passwordSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Datos inválidos");

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) return fail("No se pudo actualizar la contraseña.");
  return { ok: true };
}

export async function signOut(): Promise<void> {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
