"use client";

import { useState } from "react";
import { MediaCard } from "@/components/media";
import { Button, Reveal } from "@/components/ui";
import type { Category, Project } from "@/lib/types";

const INITIAL_COUNT = 6;

function yearOf(date: string | null) {
  return date?.slice(0, 4) ?? "Experiencia";
}

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
  const clips = visible.filter((project) => project.url);
  const notes = visible.filter((project) => !project.url);
  const index = String(category.position + 1).padStart(2, "0");

  return (
    <section id={category.slug} className="scroll-mt-16 border-t border-line py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1120px] px-5 md:px-16">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
          <div className="col-span-12 md:col-span-5">
            <p className="meta text-ink-3">{index}</p>
            <h2 className="mt-3 font-display text-[30px] leading-[1.05] font-normal tracking-[-0.02em] text-ink md:text-[48px]">
              {category.name}
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            {category.intro ? (
              <p className="max-w-[62ch] text-[17px] leading-relaxed text-ink-2">{category.intro}</p>
            ) : null}
            {category.skills.length > 0 ? (
              <ul
                className="mt-6 flex flex-wrap gap-x-4 gap-y-2"
                aria-label={`Habilidades de ${category.name}`}
              >
                {category.skills.map((skill) => (
                  <li key={skill} className="meta text-ink-3">
                    {skill}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {clips.length > 0 ? (
          <ul className="mt-12 grid grid-cols-12 gap-x-6 gap-y-12 md:mt-16">
            {clips.map((project, i) => (
              <li key={project.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Reveal delay={Math.min(i, 5) * 0.06}>
                  <MediaCard project={project} />
                </Reveal>
              </li>
            ))}
          </ul>
        ) : null}

        {notes.length > 0 ? (
          <ul className="mt-12 border-t border-line md:mt-16">
            {notes.map((project, i) => (
              <li key={project.id} className="border-b border-line">
                <Reveal delay={Math.min(i, 5) * 0.06}>
                  <article className="grid grid-cols-12 gap-x-6 gap-y-2 py-6">
                    <p className="meta col-span-12 text-ink-3 md:col-span-3">{yearOf(project.date)}</p>
                    <div className="col-span-12 md:col-span-8">
                      <h3 className="font-display text-[19px] leading-snug font-normal tracking-[-0.02em] text-ink md:text-[22px]">
                        {project.title}
                      </h3>
                      {project.description ? (
                        <p className="mt-2 max-w-[62ch] text-[17px] leading-relaxed text-ink-2">
                          {project.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : null}

        {hasMore ? (
          <div className="mt-10">
            <Button variant="outline" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
              {expanded ? "Ver menos" : `Ver más (${projects.length - INITIAL_COUNT})`}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
