import { Award, BookOpen, GraduationCap, Languages, Mic, type LucideIcon } from "lucide-react";
import { PopContainer, PopHeading } from "@/components/pop/heading";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONES = ["bg-blush", "bg-peach", "bg-white/70 ring-1 ring-seam"] as const;

/** Ícono según el tipo de formación (heurística sobre el texto de contenido.ts). */
function iconFor(item: string): LucideIcon {
  if (/idioma|ingl|anglia|english/i.test(item)) return Languages;
  if (/locut/i.test(item)) return Mic;
  if (/lic\.|licenciatura|universidad|ucasal/i.test(item)) return GraduationCap;
  if (/bachiller/i.test(item)) return BookOpen;
  return Award;
}

/** "— " separa título y detalle cuando existe; si no, todo el texto es título. */
function splitItem(item: string) {
  const [head, ...rest] = item.split(/\s+—\s+/);
  return { head: head ?? item, detail: rest.join(" — ") };
}

export function Trayectoria({ profile }: { profile: Profile }) {
  const education = profile.education ?? [];
  const skills = profile.skills ?? [];
  if (education.length === 0 && skills.length === 0) return null;

  return (
    <section id="trayectoria" className="relative scroll-mt-20 py-10 md:py-16">
      <PopContainer>
        <PopHeading script="y formación">Trayectoria</PopHeading>

        {education.length > 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {education.map((item, i) => {
              const Icon = iconFor(item);
              const { head, detail } = splitItem(item);
              return (
                <li key={item} className={cn("flex gap-4 rounded-[24px] p-5", TONES[i % TONES.length])}>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sun text-white">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[16px] leading-snug font-bold text-cocoa">{head}</span>
                    {detail ? (
                      <span className="mt-1 block text-[14px] leading-snug text-cocoa-2">{detail}</span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}

        {skills.length > 0 ? (
          <div className="mt-10">
            <h3 className="font-pop text-[22px] text-sun-deep md:text-[26px]">Habilidades</h3>
            {/* Carrusel continuo: la lista se duplica (copia aria-hidden) y la
                pista se desplaza -50% → 0 para que el loop no tenga salto. */}
            <div className="pop-marquee mt-4 overflow-hidden py-1">
              <div
                className="pop-marquee-track flex w-max"
                style={{ animationDuration: `${Math.max(skills.length * 4, 20)}s` }}
              >
                {[0, 1].map((copy) => (
                  <ul
                    key={copy}
                    aria-label={copy === 0 ? "Habilidades" : undefined}
                    aria-hidden={copy === 1 ? true : undefined}
                    className="pop-marquee-group flex shrink-0 gap-2 pr-2"
                  >
                    {skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-full border-2 border-seam bg-cream px-4 py-2 text-[14px] font-semibold whitespace-nowrap text-cocoa"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </PopContainer>
    </section>
  );
}
