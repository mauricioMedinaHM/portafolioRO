"use client";

import { AnimatePresence, motion } from "motion/react";
import { GraduationCap, MonitorPlay, Tv } from "lucide-react";
import { useState, type ReactNode } from "react";
import { MediaCard } from "@/components/media";
import { PopContainer, PopHeading } from "@/components/pop/heading";
import { categoryIcon } from "@/components/pop/icons";
import { ProjectSocialLinks } from "@/components/pop/social-links";
import { Button, buttonVariants, SpotlightCard } from "@/components/ui";
import type { Category, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

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
        <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed whitespace-pre-line text-cocoa-2">
          {project.description}
        </p>
      ) : null}
      <ProjectSocialLinks
        socials={project.socials}
        links={project.links}
        title={project.title}
        className="mt-auto pt-4"
      />
    </article>
  );
}

function VideoRail({ carousel, children }: { carousel: boolean; children: ReactNode }) {
  return (
    <ul
      className={cn(
        "mt-10 md:mt-12",
        carousel
          ? "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
          : "grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-3",
      )}
    >
      {children}
    </ul>
  );
}

function VideoItem({
  carousel,
  children,
  animated = false,
  index = 0,
}: {
  carousel: boolean;
  children: ReactNode;
  animated?: boolean;
  index?: number;
}) {
  const className = cn(carousel ? "w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-auto lg:shrink" : "min-w-0");
  if (!animated) return <li className={className}>{children}</li>;
  return (
    <motion.li
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.li>
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
  const clipsCarousel = initialClips.length + (expanded ? additionalClips.length : 0) > 2;
  const Icon = categoryIcon(category.slug);
  const isUniversity = category.badge
    ? /ucasal|universi/i.test(category.badge)
    : false;
  const BadgeIcon = isUniversity ? GraduationCap : Tv;

  return (
    <section id={category.slug} className="scroll-mt-28 py-10 md:py-16">
      <PopContainer>
        <div className="grid grid-cols-12 gap-y-5 md:gap-x-8">
          <div className="col-span-12 flex items-start gap-4 md:col-span-6">
            <span className="mt-1 grid size-12 shrink-0 place-items-center rounded-full bg-sun text-cocoa md:size-14">
              <Icon className="size-6" aria-hidden />
            </span>
            <div className="flex min-w-0 flex-col gap-3">
              <PopHeading className="text-[27px] [overflow-wrap:anywhere] hyphens-auto sm:text-[32px] md:text-[48px]">{category.name}</PopHeading>
              {category.badge ? (
                <span className="pop-label inline-flex w-fit items-center gap-1.5 rounded-full bg-candy px-3 py-1.5 text-cocoa">
                  <BadgeIcon className="size-4" aria-hidden />
                  {category.badge}
                </span>
              ) : null}
            </div>
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
            {category.channel || Object.keys(category.socials).length > 0 ? (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {category.channel ? (
                  <a
                    href={category.channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "pop-outline", size: "md" })}
                  >
                    <MonitorPlay className="size-5" aria-hidden />
                    {category.channel.label}
                  </a>
                ) : null}
                <ProjectSocialLinks socials={category.socials} title={category.name} size="lg" />
              </div>
            ) : null}
          </div>
        </div>

        {initialClips.length > 0 || additionalClips.length > 0 ? (
          <VideoRail carousel={clipsCarousel}>
            {initialClips.map((project) => (
              <VideoItem key={project.id} carousel={clipsCarousel}>
                <SpotlightCard>
                  <MediaCard project={project} />
                </SpotlightCard>
              </VideoItem>
            ))}
            <AnimatePresence initial={false}>
              {expanded
                ? additionalClips.map((project, index) => (
                    <VideoItem
                      key={project.id}
                      carousel={clipsCarousel}
                      animated
                      index={index}
                    >
                      <SpotlightCard>
                        <MediaCard project={project} />
                      </SpotlightCard>
                    </VideoItem>
                  ))
                : null}
            </AnimatePresence>
          </VideoRail>
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
