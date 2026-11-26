import { Award, Clapperboard, GraduationCap, Heart } from "lucide-react";
import { CenterLoop } from "@/components/media/CenterLoop";
import { PopContainer } from "@/components/pop/heading";
import type { Category, Profile, Project } from "@/lib/types";

const SPOTLIGHT_FOCUS = "center 80%";

export const ABOUT_LINKS = [
  { href: "#servicios", label: "Cualidades", icon: Award },
  { href: "#formacion", label: "Formación", icon: GraduationCap },
  { href: "#trabajos", label: "Muestra de contenidos", icon: Clapperboard },
] as const;

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
  const [opening, ...paragraphs] = profile.bio.split(/\n\n+/).filter(Boolean);
  const namedOpening = opening?.match(/^Soy ([^,]+)(,.*)$/);

  return (
    <PopContainer className="pt-6 pb-2 md:pt-9 md:pb-3">
      <div className="grid items-start gap-5 rounded-[14px] border border-seam bg-paper p-4 sm:p-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-x-9 lg:p-8">
        <div className="min-w-0">
          <h2 id="sobre-mi-titulo" className="font-pop text-[34px] leading-[0.95] text-cocoa md:text-[48px]">
            Sobre mí
          </h2>
          {opening && (
            <div className="mt-4 max-w-[64ch] space-y-3 text-base leading-relaxed text-cocoa-2">
              <p>
                {namedOpening ? <>Soy <strong className="text-cocoa">{namedOpening[1]}</strong>{namedOpening[2]}</> : opening}
              </p>
              {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          )}
          <p className="mt-3 flex items-center gap-2 text-rose-ink" aria-hidden>
            <span className="font-script text-[36px] leading-none">{firstName}</span>
            <Heart className="size-4" />
          </p>

          <nav aria-label="Apartados de Sobre mí" className="mt-5">
            <ul className="flex flex-wrap gap-1.5 rounded-[10px] border border-seam bg-honeydew/60 p-1.5">
              {ABOUT_LINKS.map(({ href, label, icon: Icon }) => (
                <li className="min-w-0" key={href}>
                  <a
                    href={href}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-[7px] border border-seam bg-cream px-2.5 text-sm font-semibold text-cocoa transition-colors hover:bg-candy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa"
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {spotlight?.thumbnailUrl && (
          <a
            href={"#" + (categories.find((category) => category.id === spotlight.categoryId)?.slug ?? "trabajos")}
            className="group block min-w-0 self-center rounded-[9px] border border-seam bg-cream p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-[4px] bg-candy">
              {spotlight.clipUrl ? (
                <CenterLoop
                  src={spotlight.clipUrl}
                  poster={spotlight.thumbnailUrl}
                  start={spotlight.clipStart}
                  objectPosition={SPOTLIGHT_FOCUS}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={spotlight.thumbnailUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={480}
                  height={270}
                  className="absolute inset-0 size-full object-cover"
                  style={{ objectPosition: SPOTLIGHT_FOCUS }}
                />
              )}
            </div>
            <span className="mt-2 block px-1 text-sm leading-snug font-semibold text-cocoa md:text-base">{spotlight.title}</span>
            <span className="block px-1 pt-1 text-sm text-sun-deep group-hover:underline">Ver entrevista</span>
          </a>
        )}
      </div>
    </PopContainer>
  );
}
