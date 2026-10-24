import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui";
import { ProjectForm } from "@/components/admin/project-form";
import { getAdminData } from "@/lib/data/queries";

export const metadata = { title: "Editar proyecto · Admin" };
export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getAdminData();
  const project = data.projects.find((p) => p.id === id);

  if (!project) notFound();

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
      <h1 className="font-display text-3xl text-foreground">Editar proyecto</h1>
      {data.categories.length === 0 ? (
        <Card>
          <CardContent className="pt-5 text-sm text-subtle">
            Primero creá una categoría desde la pestaña «Categorías».
          </CardContent>
        </Card>
      ) : (
        <ProjectForm project={project} categories={data.categories} />
      )}
    </div>
  );
}
