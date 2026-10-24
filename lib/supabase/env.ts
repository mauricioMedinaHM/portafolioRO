export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return {
    url,
    anonKey,
    ok: Boolean(url && anonKey),
  } as const;
}

export function hasSupabaseEnv(): boolean {
  return getSupabaseEnv().ok;
}
