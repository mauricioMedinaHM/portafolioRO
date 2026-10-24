"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";
import { toast } from "sonner";
import { GripVertical, Pencil, Plus } from "lucide-react";
import {
  deleteCategory,
  reorderCategories,
  saveCategory,
  setCategoryVisible,
} from "@/app/admin/actions/categories";
import { categorySchema, slugify, type CategoryInput } from "@/lib/schemas";
import type { Category } from "@/lib/types";
import { Button, Input, Modal, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ConfirmDelete } from "./confirm-delete";
import { Field } from "./field";
import { Switch } from "./switch";

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [order, setOrder] = useState(categories);
  const [editing, setEditing] = useState<Category | "new" | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function commit(next: Category[]) {
    const prev = order;
    setOrder(next);
    const result = await reorderCategories(next.map((c) => c.id));
    if (!result.ok) {
      setOrder(prev);
      toast.error(result.error);
    } else {
      router.refresh();
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = order.findIndex((c) => c.id === active.id);
    const to = order.findIndex((c) => c.id === over.id);
    if (from < 0 || to < 0) return;
    void commit(arrayMove(order, from, to));
  }

  return (
    <div className="flex flex-col gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={order.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-3">
            {order.map((category) => (
              <SortableCategoryRow
                key={category.id}
                category={category}
                onEdit={() => setEditing(category)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <Button variant="secondary" onClick={() => setEditing("new")}>
        <Plus className="size-4" aria-hidden />
        Nueva categoría
      </Button>

      <Modal
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing === "new" ? "Nueva categoría" : "Editar categoría"}
      >
        {editing !== null ? (
          <CategoryForm
            category={editing === "new" ? null : editing}
            onDone={() => {
              setEditing(null);
              router.refresh();
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
}

function SortableCategoryRow({
  category,
  onEdit,
}: {
  category: Category;
  onEdit: () => void;
}) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: category.id });
  const [visible, setVisible] = useState(category.isVisible);

  return (
    <motion.li layout layoutId={category.id}>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Translate.toString(transform), transition }}
        className={cn(
          "flex items-center gap-2 rounded-card border border-border bg-surface p-3 shadow-card",
          isDragging && "z-10 opacity-90 shadow-lift",
        )}
      >
        <button
          type="button"
          aria-label={`Arrastrar ${category.name}`}
          className="flex min-h-12 min-w-10 cursor-grab items-center justify-center rounded-lg text-subtle touch-none focus-visible:outline-2 focus-visible:outline-accent active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-5" aria-hidden />
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="min-w-0 flex-1 rounded-lg py-1 text-left focus-visible:outline-2 focus-visible:outline-accent"
        >
          <p className="truncate font-medium text-foreground">{category.name}</p>
          <p className="truncate text-xs text-subtle">
            #{category.slug} · {category.skills.length} habilidades
            {!visible ? " · oculta" : ""}
          </p>
        </button>

        <Switch
          label={visible ? "Ocultar categoría" : "Mostrar categoría"}
          checked={visible}
          onChange={async (value) => {
            const prev = visible;
            setVisible(value);
            const result = await setCategoryVisible(category.id, value);
            if (!result.ok) {
              setVisible(prev);
              toast.error(result.error);
            } else {
              toast.success(value ? "Categoría visible" : "Categoría oculta");
              router.refresh();
            }
          }}
        />

        <button
          type="button"
          aria-label={`Editar ${category.name}`}
          onClick={onEdit}
          className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
        >
          <Pencil className="size-5" aria-hidden />
        </button>
      </div>
    </motion.li>
  );
}

function CategoryForm({
  category,
  onDone,
}: {
  category: Category | null;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [intro, setIntro] = useState(category?.intro ?? "");
  const [skillsText, setSkillsText] = useState(
    category?.skills.join(", ") ?? "",
  );
  const [isVisible, setIsVisible] = useState(category?.isVisible ?? true);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const input: CategoryInput = {
      name,
      slug: slugTouched ? slug : slugify(name),
      intro: intro || null,
      skills: skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      isVisible,
    };
    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }
    setBusy(true);
    const result = await saveCategory(category?.id ?? null, parsed.data);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast.success(category ? "Categoría actualizada" : "Categoría creada");
    onDone();
  }

  return (
    <div className="flex flex-col gap-4">
      <Field label="Nombre">
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          placeholder="Ej. Conducción"
        />
      </Field>

      <Field
        label="Slug (ancla #)"
        hint="Se usa para el link de la sección en la landing."
      >
        <Input
          value={slugTouched ? slug : slugify(name)}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          placeholder="conduccion"
        />
      </Field>

      <Field label="Intro (cualidades y habilidades)">
        <Textarea
          rows={3}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="Texto breve de presentación"
        />
      </Field>

      <Field label="Skills" hint="Separadas por coma.">
        <Input
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          placeholder="TV en vivo, Streaming, Eventos"
        />
      </Field>

      <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-1">
        <span className="text-sm font-medium text-foreground">Visible</span>
        <Switch label="Visible" checked={isVisible} onChange={setIsVisible} />
      </div>

      {error ? <p className="text-sm text-accent-strong">{error}</p> : null}

      <Button onClick={submit} disabled={busy} className="w-full">
        {busy ? "Guardando…" : "Guardar categoría"}
      </Button>

      {category ? (
        <ConfirmDelete
          label="Borrar categoría"
          message={`«${category.name}» se borra para siempre. Solo se puede borrar si no tiene proyectos.`}
          onConfirm={() => deleteCategory(category.id)}
          onDeleted={onDone}
        />
      ) : null}
    </div>
  );
}
