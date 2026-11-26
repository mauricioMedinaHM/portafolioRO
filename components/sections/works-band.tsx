"use client";

import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { Burst } from "@/components/pop/decor";
import { PopContainer, PopHeading } from "@/components/pop/heading";
import { categoryIcon } from "@/components/pop/icons";
import { HorizontalRail } from "@/components/ui/horizontal-rail";
import type { Category, Project } from "@/lib/types";

export interface WorkGroup {
  category: Category;
  projects: Project[];
}

function CardArtwork({ src, Icon }: { src: string | null; Icon: LucideIcon }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" loading="lazy" decoding="async" width={480} height={360}
        onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />
    );
  }
  return (
    <span className="absolute inset-0 grid place-items-center">
      <Burst className="absolute size-[70%] text-blush" />
      <Icon className="relative size-9 text-rose-deep" aria-hidden />
    </span>
  );
}

function splitTitle(title: string) {
  const [head, ...rest] = title.split(/\s+[—–-]\s+/);
  return { head: head ?? title, sub: rest.join(" — ") };
}

export function WorksBand({ groups }: { groups: WorkGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <section id="trabajos" aria-labelledby="trabajos-titulo" className="scroll-mt-28 py-3 md:py-4">
      <PopContainer>
        <div className="rounded-[14px] border border-seam bg-paper p-4 sm:p-6 lg:p-8">
          <HorizontalRail
            id="muestra-trabajos"
            label="Muestra de contenidos"
            itemCount={groups.length}
            previousLabel="Ver trabajos anteriores"
            nextLabel="Ver más trabajos"
            className="items-stretch"
            heading={(
              <div>
                <PopHeading className="text-[32px] md:text-[44px]">
                  <span id="trabajos-titulo">Muestra de contenidos</span>
                </PopHeading>
                <p className="mt-2 max-w-xl text-sm text-cocoa-2 md:text-base">
                  Una selección de trabajos frente a cámara, detrás del micrófono y para redes.
                </p>
              </div>
            )}
          >
            {groups.map(({ category, projects }) => {
              const lead =
                projects.find((project) => project.isFeatured && project.thumbnailUrl) ??
                projects.find((project) => project.isFeatured) ??
                projects.find((project) => project.thumbnailUrl) ??
                projects[0];
              if (!lead) return null;
              const { head, sub } = splitTitle(lead.title);
              const Icon = categoryIcon(category.slug);

              return (
                <li key={category.id} className="editorial-work-card w-[clamp(12rem,67vw,15rem)]">
                  <a
                    href={"#" + category.slug}
                    className="group flex h-full flex-col rounded-[9px] text-cocoa focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa"
                  >
                    <span className="relative mx-3 block aspect-[2/1] overflow-hidden rounded-t-[5px] border border-seam bg-honeydew">
                      <CardArtwork src={lead.thumbnailUrl} key={lead.thumbnailUrl} Icon={Icon} />
                    </span>
                    <span className="editorial-folder-body flex flex-1 flex-col items-start px-3 pt-3 pb-2.5">
                      <span className="pop-label">{category.name}</span>
                      <span className="font-editorial mt-1 text-xl leading-tight font-semibold tracking-tight">{head}</span>
                      {sub && <span className="mt-1 line-clamp-2 text-sm leading-snug">{sub}</span>}
                      <span className="mt-auto pt-2 text-sm font-bold underline-offset-2 group-hover:underline">Ver proyectos</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </HorizontalRail>
        </div>
      </PopContainer>
    </section>
  );
}
