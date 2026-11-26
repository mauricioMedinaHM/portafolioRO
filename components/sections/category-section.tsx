import Image from "next/image";
import { GraduationCap, MonitorPlay, Tv } from "lucide-react";
import { MediaCard } from "@/components/media";
import { PopContainer, PopHeading } from "@/components/pop/heading";
import { categoryIcon } from "@/components/pop/icons";
import { ProjectSocialLinks } from "@/components/pop/social-links";
import { buttonVariants } from "@/components/ui";
import { HorizontalRail } from "@/components/ui/horizontal-rail";
import type { Category, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const SLIDING_MINIMUM = 4;

function yearOf(date: string | null) {
  return date?.slice(0, 4) ?? "Experiencia";
}

function NoteCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  const [first, ...rest] = project.description?.split("\n\n") ?? [];
  const description = compact ? first : project.description;
  return (
    <article className={cn("flex h-full flex-col bg-peach", compact ? "rounded-[12px] p-3.5" : "rounded-[18px] p-5 md:p-6")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="pop-label inline-block rounded-full bg-cream px-3 py-1.5 text-sun-deep">
            {yearOf(project.date)}
          </p>
          <h3 className={cn("leading-snug font-bold text-cocoa", compact ? "mt-2 text-base" : "mt-4 text-[18px] md:text-[19px]")}>
            {project.title}
          </h3>
        </div>
        {project.sticker && (
          <Image
            src={project.sticker.src}
            alt={project.sticker.alt}
            width={104}
            height={104}
            sizes="(min-width: 640px) 96px, 64px"
            className="size-16 shrink-0 rotate-6 rounded-full border-[3px] border-white bg-white object-cover shadow-[2px_4px_10px_rgb(76_12_41/0.26)] sm:size-24"
          />
        )}
      </div>
      {description && (
        <p className={cn("mt-2 max-w-[62ch] leading-relaxed whitespace-pre-line text-cocoa-2", compact ? "text-sm" : "text-[15px]")}>
          {description}
        </p>
      )}
      {compact && rest.length > 0 && (
        <details className="mt-2 text-sm text-cocoa-2">
          <summary className="min-h-10 cursor-pointer py-2 font-semibold underline underline-offset-2">Leer más</summary>
          <p className="mt-1 leading-relaxed whitespace-pre-line">{rest.join("\n\n")}</p>
        </details>
      )}
      <ProjectSocialLinks
        socials={project.socials}
        links={project.links}
        title={project.title}
        className={cn("mt-auto", compact ? "pt-2" : "pt-4")}
      />
    </article>
  );
}

function hasPicture(project: Project) {
  return Boolean(project.url || project.clipUrl || project.thumbnailUrl);
}

function ProjectList({ projects, id, label }: { projects: Project[]; id: string; label: string }) {
  if (projects.length === 0) return null;
  const cards = projects.map((project) => (
    <li key={project.id} className="min-w-0">
      {hasPicture(project) ? (
        <div className="rounded-[12px] border border-seam bg-paper p-2.5">
          <MediaCard project={project} compact />
        </div>
      ) : <NoteCard project={project} compact />}
    </li>
  ));

  return (
    <div className="mt-4 md:mt-6">
      {projects.length >= SLIDING_MINIMUM ? (
        <HorizontalRail
          id={id}
          label={label}
          itemCount={projects.length}
          className="[&>li]:w-[clamp(12.5rem,70vw,16rem)]"
        >
          {cards}
        </HorizontalRail>
      ) : (
        <ul aria-label={label} className="grid max-w-[54rem] grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards}
        </ul>
      )}
    </div>
  );
}

export function CategorySection({
  category,
  projects,
  overview,
  relatedLink,
  asSubsection = false,
}: {
  category: Category;
  projects: Project[];
  overview?: Project;
  relatedLink?: { href: string; label: string };
  asSubsection?: boolean;
}) {
  if (projects.length === 0 && !overview) return null;

  const grouped = new Map<string, Project[]>();
  const mainProjects = projects.filter((project) => {
    if (!project.group) return true;
    const entries = grouped.get(project.group) ?? [];
    entries.push(project);
    grouped.set(project.group, entries);
    return false;
  });
  const Icon = categoryIcon(category.slug);
  const isUniversity = category.badge
    ? /ucasal|universi/i.test(category.badge)
    : false;
  const BadgeIcon = isUniversity ? GraduationCap : Tv;
  const hasFeature = Boolean(overview);

  return (
    <section id={category.slug} aria-labelledby={category.slug + "-titulo"} className="scroll-mt-28 py-5 md:py-8">
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


        <ProjectList projects={mainProjects} id={category.slug + "-proyectos"} label={"Trabajos de " + category.name} />

        {Array.from(grouped, ([name, entries]) => {
          const id = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return (
            <section key={name} id={id} aria-labelledby={id + "-titulo"} className="mt-5 scroll-mt-28 border-t border-seam pt-4 md:mt-7 md:pt-5">
              <h4 id={id + "-titulo"} className="font-pop text-3xl text-cocoa md:text-4xl">{name}</h4>
              <ProjectList projects={entries} id={id + "-proyectos"} label={name} />
            </section>
          );
        })}

      </PopContainer>
    </section>
  );
}
