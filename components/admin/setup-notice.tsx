import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { AlertTriangle } from "lucide-react";

/**
 * Aviso visible cuando faltan las variables de entorno de Supabase.
 * Se muestra en el login y en todo /admin a 360px.
 */
export function SetupNotice() {
  return (
    <Card className="border-accent/40 bg-accent-soft/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="size-5 text-accent-strong" aria-hidden />
          Supabase no está configurado
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm text-foreground">
        <p>
          Faltan las variables{" "}
          <code className="rounded bg-foreground/8 px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          y{" "}
          <code className="rounded bg-foreground/8 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
          .
        </p>
        <p className="text-subtle">
          Creá <code className="rounded bg-foreground/8 px-1">.env.local</code> a
          partir de <code className="rounded bg-foreground/8 px-1">.env.example</code>{" "}
          y seguí los pasos de{" "}
          <code className="rounded bg-foreground/8 px-1">docs/SUPABASE_SETUP.md</code>.
          Reiniciá el servidor después.
        </p>
      </CardContent>
    </Card>
  );
}
