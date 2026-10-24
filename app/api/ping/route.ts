import { NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient as createAnonClient } from "@supabase/supabase-js";

/**
 * Ping liviano para el cron de Vercel (vercel.json): evita que el
 * proyecto free de Supabase se pause por inactividad.
 */
export async function GET() {
  const env = getSupabaseEnv();
  if (!env.ok) {
    return NextResponse.json({ ok: false, reason: "no-env" }, { status: 200 });
  }
  try {
    const supabase = createAnonClient(env.url!, env.anonKey!, {
      auth: { persistSession: false },
    });
    const { error } = await supabase
      .from("profile")
      .select("id", { count: "exact", head: true });
    return NextResponse.json({ ok: !error });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
