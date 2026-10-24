"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Star,
} from "lucide-react";
import {
  reorderProjects,
  setProjectFeatured,
  setProjectPublished,
} from "@/app/admin/actions/projects";
import { cn } from "@/lib/utils";
import type { Category, Project } from "@/lib/types";
import { ProviderBadge } from "./provider-badge";
import { Switch } from "./switch";

interface Props {
  categories: Category[];
  projects: Project[];
}

/** Listado de proyectos agrupado por categoría, ordenable con drag + ↑↓. */
export function SortableProjectList({ categories, projects }: Props) {
  const groups = useMemo(
    () =>
      categories.map((category) => ({
        category,
        projects: projects
          .filter((p) => p.categoryId === category.id)
          .sort((a, b) => a.position - b.position),
      })),
    [categories, projects],
  );

  if (projects.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-border bg-surface p-8 text-center text-subtle">
        Todavía no hay proyectos. Tocá «+ Nuevo» para cargar el primero.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {groups.map(({ category, projects: items }) => (
        <section key={category.id}>
          <h2 className="mb-3 flex items-baseline gap-2 font-display text-xl text-foreground">
            {category.name}
            <span className="text-sm font-sans font-normal text-subtle">
              {items.length}
            </span>
          </h2>
          <SortableGroup categoryId={category.id} items={items} />
        </section>
      ))}
    </div>
  );
}

function SortableGroup({
  categoryId,
  items,
}: {
  categoryId: string;
  items: Project[];
}) {
  const [order, setOrder] = useState(items);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function commit(next: Project[]) {
    const prev = order;
    setOrder(next);
    const result = await reorderProjects(
      categoryId,
      next.map((p) => p.id),
    );
    if (!result.ok) {
      setOrder(prev);
      toast.error(result.error);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = order.findIndex((p) => p.id === active.id);
    const to = order.findIndex((p) => p.id === over.id);
    if (from < 0 || to < 0) return;
    void commit(arrayMove(order, from, to));
  }

  function move(index: number, delta: -1 | 1) {
    const to = index + delta;
    if (to < 0 || to >= order.length) return;
    void commit(arrayMove(order, index, to));
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-subtle">
        Sin proyectos en esta categoría.
      </p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={order.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex flex-col gap-3">
          {order.map((project, index) => (
            <SortableRow
              key={project.id}
              project={project}
              index={index}
              total={order.length}
              onMove={move}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({
  project,
  index,
  total,
  onMove,
}: {
  project: Project;
  index: number;
  total: number;
  onMove: (index: number, delta: -1 | 1) => void;
}) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  const [published, setPublished] = useState(project.isPublished);
  const [featured, setFeatured] = useState(project.isFeatured);

  return (
    <motion.li layout layoutId={project.id}>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Translate.toString(transform), transition }}
        className={cn(
          "flex items-center gap-2 rounded-card border border-border bg-surface p-3 shadow-card",
          isDragging && "z-10 opacity-90 shadow-lift",
          !published && "opacity-75",
        )}
      >
        <button
          type="button"
          aria-label={`Arrastrar ${project.title}`}
          className="flex min-h-12 min-w-10 cursor-grab items-center justify-center rounded-lg text-subtle touch-none focus-visible:outline-2 focus-visible:outline-accent active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-5" aria-hidden />
        </button>

        <Link
          href={`/admin/proyectos/${project.id}`}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg py-1 focus-visible:outline-2 focus-visible:outline-accent"
        >
          {project.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.thumbnailUrl}
              alt=""
              className="aspect-video w-20 shrink-0 rounded-lg bg-foreground/10 object-cover"
            />
          ) : (
            <div className="flex aspect-video w-20 shrink-0 items-center justify-center rounded-lg bg-muted text-[10px] text-subtle">
              {project.provider}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">
              {project.title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <ProviderBadge provider={project.provider} />
              {project.date ? (
                <span className="text-xs text-subtle">
                  {project.date.slice(0, 4)}
                </span>
              ) : null}
              {!published ? (
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-strong">
                  Borrador
                </span>
              ) : null}
            </div>
          </div>
        </Link>

        <div className="flex shrink-0 flex-col items-center gap-0.5">
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Subir"
              disabled={index === 0}
              onClick={() => onMove(index, -1)}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-foreground/5 hover:text-foreground disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent"
            >
              <ChevronUp className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Bajar"
              disabled={index === total - 1}
              onClick={() => onMove(index, 1)}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-foreground/5 hover:text-foreground disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent"
            >
              <ChevronDown className="size-5" aria-hidden />
            </button>
          </div>
          <div className="flex items-center gap-0.5">
            <Switch
              label={published ? "Despublicar" : "Publicar"}
              checked={published}
              onChange={async (value) => {
                const prev = published;
                setPublished(value);
                const result = await setProjectPublished(project.id, value);
                if (!result.ok) {
                  setPublished(prev);
                  toast.error(result.error);
                } else {
                  toast.success(value ? "Publicado" : "Despublicado");
                  router.refresh();
                }
              }}
            />
            <button
              type="button"
              aria-label={featured ? "Quitar destacado" : "Destacar"}
              onClick={async () => {
                const prev = featured;
                setFeatured(!featured);
                const result = await setProjectFeatured(project.id, !featured);
                if (!result.ok) {
                  setFeatured(prev);
                  toast.error(result.error);
                } else {
                  router.refresh();
                }
              }}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Star
                className={cn(
                  "size-5",
                  featured ? "fill-accent text-accent" : "text-subtle",
                )}
                aria-hidden
              />
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
