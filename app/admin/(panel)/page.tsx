import { Suspense } from "react";
import { FabNew } from "@/components/admin/fab";
import { SortableProjectList } from "@/components/admin/sortable-project-list";
import { Card, CardContent } from "@/components/ui";
import { getAdminData, type LandingData } from "@/lib/data/queries";

export const metadata = { title: "Proyectos · Admin" };
export const dynamic = "force-dynamic";

async function load(): Promise<{ data: LandingData | null; error?: string }> {
  try {
    return { data: await getAdminData() };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export default async function AdminPage() {
  const { data, error } = await load();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-3xl text-foreground">Proyectos</h1>
        <p className="text-sm text-subtle">
          Arrastrá o usá las flechas para ordenar. Tocá una tarjeta para editar.
        </p>
      </div>

      {data ? (
        <SortableProjectList
          categories={data.categories}
          projects={data.projects}
        />
      ) : (
        <Card className="border-ink/40">
          <CardContent className="flex flex-col gap-2 pt-5 text-sm">
            <p className="font-medium text-foreground">
              No se pudo leer la base de datos.
            </p>
            <p className="text-subtle">
              ¿Corriste la migración <code>supabase/migrations/0001_init.sql</code>{" "}
              y el seed? ¿Tu usuario está en <code>admin_users</code>?
            </p>
            <p className="text-xs text-subtle">{error}</p>
          </CardContent>
        </Card>
      )}

      <Suspense fallback={null}>
        <FabNew />
      </Suspense>
    </div>
  );
}
