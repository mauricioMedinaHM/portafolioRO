"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

/** Cliente de Supabase para componentes del navegador. Requiere env vars. */
export function createClient() {
  const { url, anonKey, ok } = getSupabaseEnv();
  if (!ok) {
    throw new Error(
      "Supabase no está configurado: faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return createBrowserClient(url!, anonKey!);
}
