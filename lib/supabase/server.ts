import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

/**
 * Cliente de Supabase para Server Components, Route Handlers y Server Actions.
 * Lee y persiste la sesión en cookies (patrón @supabase/ssr).
 */
export async function createClient() {
  const { url, anonKey, ok } = getSupabaseEnv();
  if (!ok) {
    throw new Error(
      "Supabase no está configurado: faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Llamado desde un Server Component (no se pueden escribir
          // cookies): lo maneja middleware.ts refrescando la sesión.
        }
      },
    },
  });
}
