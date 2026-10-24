"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { deleteProject, saveProject } from "@/app/admin/actions/projects";
import { projectSchema, type ProjectInput } from "@/lib/schemas";
import type { Category, Project } from "@/lib/types";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { ConfirmDelete } from "./confirm-delete";
import { Field } from "./field";
import { LinkPreview } from "./link-preview";
import { PasteButton } from "./paste-button";
import { Switch } from "./switch";

export function ProjectForm({
  project,
  categories,
}: {
  project: Project | null;
  categories: Category[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      categoryId: project?.categoryId ?? categories[0]?.id ?? "",
      url: project?.url ?? "",
      description: project?.description ?? "",
      date: project?.date ?? "",
      isPublished: project?.isPublished ?? true,
      isFeatured: project?.isFeatured ?? false,
    },
  });

  const url = watch("url");
  const description = watch("description") ?? "";
  const isPublished = watch("isPublished");
  const isFeatured = watch("isFeatured");

  async function onSubmit(values: ProjectInput) {
    setBusy(true);
    const result = await saveProject(project?.id ?? null, {
      ...values,
      description: values.description || null,
      date: values.date || null,
    });
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(project ? "Proyecto actualizado" : "Proyecto creado");
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Field
        label="Link del video o contenido"
        error={errors.url?.message}
        hint="Pegá el link de Drive, YouTube, Vimeo o Google Fotos. Si es experiencia sin video, dejalo vacío."
      >
        <div className="flex gap-2">
          <Input
            type="url"
            inputMode="url"
            placeholder="https://… (opcional)"
            className="flex-1"
            {...register("url")}
          />
          <PasteButton
            onPaste={(text) =>
              setValue("url", text, { shouldValidate: true, shouldDirty: true })
            }
          />
        </div>
      </Field>

      <LinkPreview url={url} />

      <Field label="Título" error={errors.title?.message}>
        <Input placeholder="Ej. Ciclo de entrevistas" {...register("title")} />
      </Field>

      <Field label="Categoría" error={errors.categoryId?.message}>
        <Select {...register("categoryId")}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Descripción"
        error={errors.description?.message}
        hint={`${description.length}/280`}
      >
        <Textarea
          rows={3}
          placeholder="Breve descripción del proyecto"
          {...register("description")}
        />
      </Field>

      <Field label="Fecha" error={errors.date?.message}>
        <Input type="date" {...register("date")} />
      </Field>

      <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-2">
        <div className="flex items-center justify-between gap-3 px-2">
          <span className="text-sm font-medium text-foreground">Publicado</span>
          <Switch
            label="Publicado"
            checked={isPublished}
            onChange={(v) => setValue("isPublished", v, { shouldDirty: true })}
          />
        </div>
        <div className="flex items-center justify-between gap-3 px-2">
          <span className="text-sm font-medium text-foreground">Destacado</span>
          <Switch
            label="Destacado"
            checked={isFeatured}
            onChange={(v) => setValue("isFeatured", v, { shouldDirty: true })}
          />
        </div>
      </div>

      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Guardando…" : project ? "Guardar cambios" : "Crear proyecto"}
      </Button>

      {project ? (
        <ConfirmDelete
          label="Borrar proyecto"
          message={`«${project.title}» se borra para siempre. Esta acción no se puede deshacer.`}
          onConfirm={() => deleteProject(project.id)}
          onDeleted={() => {
            router.push("/admin");
            router.refresh();
          }}
        />
      ) : null}
    </form>
  );
}
