"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MediaCard } from "@/components/media";
import { PopContainer, PopHeading } from "@/components/pop/heading";
import { categoryIcon } from "@/components/pop/icons";
import { Button } from "@/components/ui";
import type { Category, Project } from "@/lib/types";

const INITIAL_COUNT = 6;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

function yearOf(date: string | null) {
  return date?.slice(0, 4) ?? "Experiencia";
}

function NoteCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col rounded-[24px] bg-peach p-5 md:p-6">
      <p className="pop-label self-start rounded-full bg-cream px-3 py-1.5 text-sun-deep">
        {yearOf(project.date)}
      </p>
      <h3 className="mt-4 text-[18px] leading-snug font-bold text-cocoa md:text-[19px]">
        {project.title}
      </h3>
      {project.description ? (
        <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-cocoa-2">
          {project.description}
        </p>
      ) : null}
    </article>
  );
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

  const initialProjects = projects.slice(0, INITIAL_COUNT);
  const additionalProjects = projects.slice(INITIAL_COUNT);
  const initialClips = initialProjects.filter((project) => project.url);
  const additionalClips = additionalProjects.filter((project) => project.url);
  const initialNotes = initialProjects.filter((project) => !project.url);
  const additionalNotes = additionalProjects.filter((project) => !project.url);
  const hasMore = additionalProjects.length > 0;
  const Icon = categoryIcon(category.slug);

  return (
    <section id={category.slug} className="scroll-mt-20 py-10 md:py-16">
      <PopContainer>
        <div className="grid grid-cols-12 gap-y-5 md:gap-x-8">
          <div className="col-span-12 flex items-start gap-4 md:col-span-6">
            <span className="mt-1 grid size-12 shrink-0 place-items-center rounded-full bg-sun text-white md:size-14">
              <Icon className="size-6" aria-hidden />
            </span>
            <PopHeading className="text-[32px] md:text-[48px]">{category.name}</PopHeading>
          </div>
          <div className="col-span-12 md:col-span-6">
            {category.intro ? (
              <p className="max-w-[62ch] text-[16px] leading-relaxed text-cocoa-2 md:text-[17px]">
                {category.intro}
              </p>
            ) : null}
            {category.skills.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Habilidades de ${category.name}`}>
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-blush px-3.5 py-1.5 text-[13px] font-semibold text-rose-deep"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {initialClips.length > 0 || additionalClips.length > 0 ? (
          <ul className="mt-10 grid grid-cols-12 gap-y-10 sm:gap-x-5 md:mt-12">
            {initialClips.map((project) => (
              <li key={project.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
                <MediaCard project={project} />
              </li>
            ))}
            <AnimatePresence initial={false}>
              {expanded
                ? additionalClips.map((project, index) => (
                    <motion.li
                      key={project.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.3, delay: index * 0.04, ease: EASE_OUT_EXPO }}
                      className="col-span-12 sm:col-span-6 lg:col-span-4"
                    >
                      <MediaCard project={project} />
                    </motion.li>
                  ))
                : null}
            </AnimatePresence>
          </ul>
        ) : null}

        {initialNotes.length > 0 || additionalNotes.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
            {initialNotes.map((project) => (
              <li key={project.id}>
                <NoteCard project={project} />
              </li>
            ))}
            <AnimatePresence initial={false}>
              {expanded
                ? additionalNotes.map((project, index) => (
                    <motion.li
                      key={project.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.3, delay: index * 0.04, ease: EASE_OUT_EXPO }}
                    >
                      <NoteCard project={project} />
                    </motion.li>
                  ))
                : null}
            </AnimatePresence>
          </ul>
        ) : null}

        {hasMore ? (
          <div className="mt-10">
            <Button variant="pop-outline" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
              {expanded ? "Ver menos" : `Ver más (${additionalProjects.length})`}
            </Button>
          </div>
        ) : null}
      </PopContainer>
    </section>
  );
}
