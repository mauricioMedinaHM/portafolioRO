"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MediaCard } from "@/components/media";
import { Button, Reveal, Section } from "@/components/ui";
import type { Category, Project } from "@/lib/types";

const INITIAL_COUNT = 6;

export function CategorySection({
  category,
  projects,
}: {
  category: Category;
  projects: Project[];
}) {
  const [expanded, setExpanded] = useState(false);
  if (projects.length === 0) return null;

  const visible = expanded ? projects : projects.slice(0, INITIAL_COUNT);
  const hasMore = projects.length > INITIAL_COUNT;

  return (
    <Section
      id={category.slug}
      title={category.name}
      intro={category.intro ?? undefined}
    >
      {category.skills.length > 0 ? (
        <ul className="mb-6 flex flex-wrap gap-2" aria-label={`Habilidades de ${category.name}`}>
          {category.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-subtle"
            >
              {skill}
            </li>
          ))}
        </ul>
      ) : null}

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => (
          <li key={project.id}>
            <Reveal delay={Math.min(i, 5) * 0.05}>
              {project.url ? (
                <MediaCard project={project} />
              ) : (
                <article className="flex h-full flex-col gap-1 rounded-card border border-border bg-surface p-5 shadow-card">
                  <h3 className="font-display text-lg text-foreground">
                    {project.title}
                  </h3>
                  {project.date ? (
                    <time className="text-xs text-subtle" dateTime={project.date}>
                      {project.date.slice(0, 4)}
                    </time>
                  ) : null}
                  {project.description ? (
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {project.description}
                    </p>
                  ) : null}
                </article>
              )}
            </Reveal>
          </li>
        ))}
      </ul>

      {hasMore ? (
        <div className="mt-8 flex justify-center">
          <Button
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            {expanded ? (
              <>
                Ver menos <ChevronUp className="size-4" aria-hidden />
              </>
            ) : (
              <>
                Ver más ({projects.length - INITIAL_COUNT}){" "}
                <ChevronDown className="size-4" aria-hidden />
              </>
            )}
          </Button>
        </div>
      ) : null}
    </Section>
  );
}
