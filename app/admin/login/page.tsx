import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { SetupNotice } from "@/components/admin/setup-notice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { SITE_NAME } from "@/lib/site";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const metadata = { title: "Ingresar · Admin" };

export default function LoginPage() {
  const configured = hasSupabaseEnv();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-5 py-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="text-center">
          <p className="font-display text-2xl text-foreground">{SITE_NAME}</p>
          <p className="text-sm text-subtle">Panel de administración</p>
        </div>

        {!configured ? <SetupNotice /> : null}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ingresar</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {configured ? (
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            ) : (
              <p className="text-sm text-subtle">
                El login se habilita cuando estén cargadas las variables de
                entorno de Supabase.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
