import { Award, BookOpen, GraduationCap, Languages, Mic, type LucideIcon } from "lucide-react";
import { PopContainer, PopHeading } from "@/components/pop/heading";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONES = ["bg-blush", "bg-peach", "bg-white/70 ring-1 ring-seam"] as const;

// Chips de habilidades: fondos variados con contraste verificado (lib/contrast.test.ts).
const CHIP_TONES = [
  "bg-blush text-rose-deep",
  "bg-peach text-cocoa",
  "bg-candy text-cocoa",
  "bg-amber text-cocoa",
  "bg-cocoa text-cream",
] as const;

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
    <section id="formacion" className="relative scroll-mt-20 py-10 md:py-16">
      <PopContainer>
        <PopHeading script="y certificados">Formación</PopHeading>

        {education.length > 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {education.map((item, i) => {
              const Icon = iconFor(item);
              const { head, detail } = splitItem(item);
              return (
                <li key={item} className={cn("flex gap-4 rounded-[24px] p-5", TONES[i % TONES.length])}>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sun text-cocoa">
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
            <ul aria-label="Habilidades" className="mt-5 flex flex-wrap gap-2.5 md:gap-3">
              {skills.map((skill, i) => (
                <li
                  key={skill}
                  className={cn(
                    "rounded-full px-4 py-2.5 text-[15px] font-bold md:text-[17px]",
                    CHIP_TONES[i % CHIP_TONES.length],
                  )}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </PopContainer>
    </section>
  );
}
