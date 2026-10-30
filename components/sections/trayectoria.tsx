import { Award, BookOpen, GraduationCap, Languages, Mic, type LucideIcon } from "lucide-react";
import { PopContainer, PopHeading } from "@/components/pop/heading";
import { Timeline } from "@/components/ui";
import { CinematicLogoCloud } from "@/components/ui/cinematic-logo-cloud";
import type { Profile } from "@/lib/types";

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
    <section id="formacion" className="relative scroll-mt-28 py-10 md:py-16">
      <PopContainer>
        <PopHeading script="y certificados">Formación</PopHeading>

        {education.length > 0 ? (
          <div className="mt-8">
            <Timeline
              label="Formación"
              items={education.map((item, i) => {
                const Icon = iconFor(item);
                const { head, detail } = splitItem(item);
                return {
                  id: `${i}-${head}`,
                  title: head,
                  detail: detail || undefined,
                  tone: TONES[i % TONES.length],
                  icon: <Icon className="size-5" aria-hidden />,
                };
              })}
            />
          </div>
        ) : null}

        {skills.length > 0 ? (
          <div className="mt-10">
            <h3 className="font-pop text-[22px] text-sun-deep md:text-[26px]">Habilidades</h3>
            <CinematicLogoCloud
              clients={skills.map((name) => ({ name, text: true }))}
              variant="ribbon"
              className="mt-5"
            />
          </div>
        ) : null}
      </PopContainer>
    </section>
  );
}
