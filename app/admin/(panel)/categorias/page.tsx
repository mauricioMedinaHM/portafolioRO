import { Card, CardContent } from "@/components/ui";
import { CategoryManager } from "@/components/admin/category-manager";
import { getAdminData } from "@/lib/data/queries";

export const metadata = { title: "Categorías · Admin" };
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let categories = null;
  let error: string | undefined;
  try {
    categories = (await getAdminData()).categories;
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido";
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-3xl text-foreground">Categorías</h1>
        <p className="text-sm text-subtle">
          Orden, visibilidad y datos de cada sección de la landing.
        </p>
      </div>
      {categories ? (
        <CategoryManager categories={categories} />
      ) : (
        <Card className="border-accent/40">
          <CardContent className="pt-5 text-sm text-subtle">
            No se pudo leer la base de datos. {error}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
