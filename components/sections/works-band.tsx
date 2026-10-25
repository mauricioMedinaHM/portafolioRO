"use client";

import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Burst } from "@/components/pop/decor";
import { PopContainer, PopHeading } from "@/components/pop/heading";
import { categoryIcon } from "@/components/pop/icons";
import type { Category, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface WorkGroup {
  category: Category;
  projects: Project[];
}

const GRID_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-3", // 2 filas de 3
};

/** "Título — subtítulo" → partes; el título va grande, el resto como bajada. */
function splitTitle(title: string) {
  const [head, ...rest] = title.split(/\s+[—–-]\s+/);
  return { head: head ?? title, sub: rest.join(" — ") };
}

/** Banda naranja: una tarjeta por área, con la pieza más representativa. */
export function WorksBand({ groups }: { groups: WorkGroup[] }) {
  if (groups.length === 0) return null;
  const cols = GRID_COLS[Math.min(groups.length, 6)];

  return (
    <section id="trabajos" aria-labelledby="trabajos-titulo" className="scroll-mt-20 py-6 md:py-10">
      <PopContainer>
        <div className="relative overflow-hidden rounded-[36px] bg-cocoa px-5 py-8 md:px-8 md:py-10">
          <Burst className="pointer-events-none absolute -top-8 -right-8 size-32 text-sun/40" />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <PopHeading tone="cream" className="text-[30px] md:text-[40px]">
              <span id="trabajos-titulo">Trabajos destacados</span>
            </PopHeading>
            <a
              href={`#${groups[0].category.slug}`}
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-5 text-[14px] font-bold text-sun-deep transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
            >
              Ver todo
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
          </div>

          <ul
            className={cn(
              "relative -mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:px-0 lg:grid lg:overflow-visible",
              cols,
            )}
          >
            {groups.map(({ category, projects }) => {
              const lead =
                projects.find((p) => p.isFeatured && p.thumbnailUrl) ??
                projects.find((p) => p.isFeatured) ??
                projects.find((p) => p.thumbnailUrl) ??
                projects[0];
              const { head, sub } = splitTitle(lead.title);
              const Icon = categoryIcon(category.slug);
              return (
                <li key={category.id} className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-auto">
                  <motion.a
                    href={`#${category.slug}`}
                    initial={false}
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    variants={{ hover: { y: -6 } }}
                    transition={{ duration: 0.2 }}
                    className="flex h-full flex-col rounded-[24px] bg-cream p-4 text-cocoa focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cream"
                  >
                    <span className="pop-label line-clamp-2 text-sun-deep">{category.name}</span>
                    <span className="font-pop mt-2 text-[22px] leading-[0.95] text-cocoa md:text-[24px]">
                      {head}
                    </span>
                    {sub ? (
                      <span className="mt-1 line-clamp-2 text-[14px] leading-snug font-medium text-cocoa-2">
                        {sub}
                      </span>
                    ) : null}

                    <span className="relative mt-4 block aspect-[4/3] overflow-hidden rounded-[18px] bg-candy">
                      {lead.thumbnailUrl ? (
                        // Miniatura externa (YouTube): fuera de los remotePatterns de next/image.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={lead.thumbnailUrl}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          width={480}
                          height={360}
                          className="absolute inset-0 size-full object-cover"
                        />
                      ) : (
                        <span className="absolute inset-0 grid place-items-center">
                          <Burst className="absolute size-[70%] text-blush" />
                          <Icon className="relative size-12 text-rose-deep" aria-hidden />
                        </span>
                      )}
                      <motion.span
                        variants={{ hover: { rotate: 45, scale: 1.08 } }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-sun text-cocoa"
                      >
                        <ArrowUpRight className="size-5" aria-hidden />
                      </motion.span>
                    </span>
                    <span className="sr-only">Ir a {category.name}</span>
                  </motion.a>
                </li>
              );
            })}
          </ul>
        </div>
      </PopContainer>
    </section>
  );
}
