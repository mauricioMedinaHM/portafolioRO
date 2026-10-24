import { Card, CardContent } from "@/components/ui";
import { ProjectForm } from "@/components/admin/project-form";
import { getAdminData } from "@/lib/data/queries";

export const metadata = { title: "Nuevo proyecto · Admin" };
export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const data = await getAdminData();

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
      <h1 className="font-display text-3xl text-foreground">Nuevo proyecto</h1>
      {data.categories.length === 0 ? (
        <Card>
          <CardContent className="pt-5 text-sm text-subtle">
            Primero creá una categoría desde la pestaña «Categorías».
          </CardContent>
        </Card>
      ) : (
        <ProjectForm project={null} categories={data.categories} />
      )}
    </div>
  );
}
