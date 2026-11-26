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
        "mt-6 md:mt-8",
        carousel
          ? "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
          : "grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 md:gap-y-8 lg:grid-cols-3",
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
  overview,
  relatedLink,
  asSubsection = false,
  showAll = false,
}: {
  category: Category;
  projects: Project[];
  overview?: Project;
  relatedLink?: { href: string; label: string };
  asSubsection?: boolean;
  showAll?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  if (projects.length === 0 && !overview) return null;

  const grouped = new Map<string, Project[]>();
  const mainProjects = projects.filter((project) => {
    if (!project.group) return true;
    const entries = grouped.get(project.group) ?? [];
    entries.push(project);
    grouped.set(project.group, entries);
    return false;
  });
  const initialProjects = showAll ? mainProjects : mainProjects.slice(0, INITIAL_COUNT);
  const additionalProjects = showAll ? [] : mainProjects.slice(INITIAL_COUNT);
  const hasPicture = (project: Project) =>
    Boolean(project.url || project.clipUrl || project.thumbnailUrl);
  const initialClips = initialProjects.filter(hasPicture);
  const additionalClips = additionalProjects.filter(hasPicture);
  const initialNotes = initialProjects.filter((project) => !hasPicture(project));
  const additionalNotes = additionalProjects.filter((project) => !hasPicture(project));
  const hasMore = additionalProjects.length > 0;
  const clipsCarousel = !showAll && initialClips.length + (expanded ? additionalClips.length : 0) > 2;
  const Icon = categoryIcon(category.slug);
  const isUniversity = category.badge
    ? /ucasal|universi/i.test(category.badge)
    : false;
  const BadgeIcon = isUniversity ? GraduationCap : Tv;
  const hasFeature = Boolean(overview);

  return (
    <section id={category.slug} aria-labelledby={category.slug + "-titulo"} className="scroll-mt-28 py-7 md:py-10">
      <PopContainer>
        <div className={cn("grid grid-cols-12 content-start items-start gap-y-4 md:gap-x-7", hasFeature && "md:grid-rows-[auto_1fr]")}>
          <div className="col-span-12 flex items-start gap-4 md:col-span-6">
            <span className="mt-1 grid size-12 shrink-0 place-items-center rounded-full bg-blush text-cocoa md:size-14">
              <Icon className="size-6" aria-hidden />
            </span>
            <div className="flex min-w-0 flex-col gap-3">
              <PopHeading as={asSubsection ? "h3" : "h2"} className="text-[27px] [overflow-wrap:anywhere] hyphens-auto sm:text-[32px] md:text-[48px]">
                <span id={category.slug + "-titulo"}>{category.name}</span>
              </PopHeading>
              {category.badge ? (
                <span className="pop-label inline-flex w-fit items-center gap-1.5 rounded-full bg-candy px-3 py-1.5 text-cocoa">
                  <BadgeIcon className="size-4" aria-hidden />
                  {category.badge}
                </span>
              ) : null}
            </div>
          </div>
          <div className={cn("col-span-12 md:col-span-6", hasFeature && "md:col-start-1 md:row-start-2")}>
            {category.intro ? (
              <p className="max-w-[62ch] text-[16px] leading-relaxed text-cocoa-2 md:text-[17px]">
                {category.intro}
              </p>
            ) : null}
            {category.skills.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Habilidades de ${category.name}`}>
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
            {relatedLink || category.channel || Object.keys(category.socials).length > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-3">
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
                {relatedLink && (
                  <a href={relatedLink.href} className={buttonVariants({ variant: "pop-outline", size: "md" })}>
                    {relatedLink.label}
                  </a>
                )}
                <ProjectSocialLinks socials={category.socials} title={category.name} size="lg" />
              </div>
            ) : null}
          </div>
          {overview && (
            <div className="col-span-12 md:col-span-6 md:col-start-7 md:row-span-2 md:row-start-1">
              {hasPicture(overview) ? <MediaCard project={overview} /> : <NoteCard project={overview} />}
            </div>
          )}
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
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-8 lg:grid-cols-3">
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

        {Array.from(grouped, ([name, entries]) => {
          const id = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return (
            <section key={name} id={id} aria-labelledby={id + "-titulo"} className="mt-7 scroll-mt-28 border-t border-seam pt-6 md:mt-9">
              <h4 id={id + "-titulo"} className="font-pop text-3xl text-cocoa md:text-4xl">{name}</h4>
              <VideoRail carousel={false}>
                {entries.map((project) => (
                  <VideoItem key={project.id} carousel={false}>
                    {hasPicture(project) ? (
                      <SpotlightCard><MediaCard project={project} /></SpotlightCard>
                    ) : <NoteCard project={project} />}
                  </VideoItem>
                ))}
              </VideoRail>
            </section>
          );
        })}

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
