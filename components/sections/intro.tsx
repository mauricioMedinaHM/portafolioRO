import { Heart } from "lucide-react";
import { CenterLoop } from "@/components/media/CenterLoop";
import { Burst } from "@/components/pop/decor";
import { PopContainer } from "@/components/pop/heading";
import { categoryIcon } from "@/components/pop/icons";
import type { Category, Profile, Project } from "@/lib/types";

/** "Hola, soy Rosario": presentación + áreas de trabajo (anclas a cada sección). */
export function Intro({
  profile,
  categories,
  spotlight,
}: {
  profile: Profile;
  categories: Category[];
  spotlight?: Project;
}) {
  const firstName = profile.fullName.trim().split(/\s+/)[0] ?? profile.fullName;

  return (
    <section id="sobre-mi" className="scroll-mt-28 py-6 md:py-10">
      <PopContainer>
        <div className="grid grid-cols-1 gap-8 rounded-[32px] bg-white/55 p-5 ring-1 ring-seam md:grid-cols-12 md:items-center md:gap-10 md:p-8">
          {spotlight?.thumbnailUrl ? (
            <a
              href={`#${categories.find((c) => c.id === spotlight.categoryId)?.slug ?? "trabajos"}`}
              className="group relative block overflow-hidden rounded-[24px] bg-candy md:col-span-4"
            >
              <div className="relative aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03]">
                {spotlight.clipUrl ? (
                  // Clip del destacado en bucle mudo (poster = miniatura; pausa fuera del centro).
                  <CenterLoop src={spotlight.clipUrl} poster={spotlight.thumbnailUrl} start={spotlight.clipStart} />
                ) : (
                  // Miniatura externa (YouTube): fuera de los remotePatterns de next/image.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={spotlight.thumbnailUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={480}
                    height={360}
                    className="absolute inset-0 size-full object-cover"
                  />
                )}
              </div>
              <span className="absolute inset-x-3 bottom-3 rounded-2xl bg-cream/95 px-4 py-3 text-[14px] leading-snug font-semibold text-cocoa">
                {spotlight.title}
              </span>
            </a>
          ) : null}

          <div className="md:col-span-5">
            <h2 className="font-pop text-[34px] leading-[0.95] text-cocoa md:text-[44px]">
              Hola, soy {firstName}.
            </h2>
            <p className="font-pop mt-2 text-[19px] leading-tight text-sun-deep md:text-[22px]">
              Conductora, locutora &amp; comunicadora audiovisual
            </p>
            {profile.bio ? (
              <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-cocoa-2">{profile.bio}</p>
            ) : null}
            <p className="mt-4 flex items-center gap-2 text-rose-ink" aria-hidden>
              <span className="font-script text-[40px] leading-none">{firstName}</span>
              <Heart className="size-5" />
            </p>
          </div>

          <div className="relative md:col-span-3 md:border-l-2 md:border-seam md:pl-8">
            <h3 className="sr-only">Áreas de trabajo</h3>
            <ul className="flex flex-col gap-1">
              {categories.map((category) => {
                const Icon = categoryIcon(category.slug);
                return (
                  <li key={category.id}>
                    <a
                      href={`#${category.slug}`}
                      className="group flex min-h-11 items-start gap-3 rounded-full text-[15px] leading-snug font-semibold text-cocoa transition-colors hover:text-sun-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-deep"
                    >
                      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-sun text-cream transition-transform duration-150 group-hover:scale-110">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="self-center">{category.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <Burst className="absolute -right-3 -bottom-10 hidden size-16 text-rose md:block" />
          </div>
        </div>
      </PopContainer>
    </section>
  );
}
