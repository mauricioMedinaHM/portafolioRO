import type { SupabaseClient, User } from "@supabase/supabase-js";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type AdminAuth =
  | { error: string }
  | { supabase: SupabaseClient; user: User };

export function fail(error: string): ActionResult {
  return { ok: false, error };
}

export const ENV_MISSING =
  "Supabase no está configurado. Revisá docs/SUPABASE_SETUP.md.";

/**
 * Devuelve el cliente + usuario autenticado, o un error listo para la UI.
 * La RLS de Postgres sigue siendo la barrera real: acá solo mejoramos el mensaje.
 */
export async function requireAdmin(): Promise<AdminAuth> {
  if (!hasSupabaseEnv()) return { error: ENV_MISSING };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada. Volvé a ingresar." };
  return { supabase, user };
}
