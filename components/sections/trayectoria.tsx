import { Award, BookOpen, GraduationCap, Languages, Mic, type LucideIcon } from "lucide-react";
import { PopContainer, PopHeading } from "@/components/pop/heading";
import { Timeline } from "@/components/ui";
import type { Profile } from "@/lib/types";

const TONES = ["bg-blush", "bg-peach", "bg-white/70 ring-1 ring-seam"] as const;

/** Ícono según el tipo de formación (heurística sobre el texto de contenido.ts). */
function iconFor(item: string): LucideIcon {
  if (/pronunciaci|idioma|ingl|anglia|english/i.test(item)) return Languages;
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
  if (education.length === 0) return null;

  return (
    <section id="formacion" aria-labelledby="formacion-titulo" className="scroll-mt-28 py-3 md:py-4">
      <PopContainer>
        <div className="rounded-[14px] border border-seam bg-paper p-4 sm:p-6 lg:p-8">
          <PopHeading script="y certificados" className="text-[32px] md:text-[42px]"><span id="formacion-titulo">Formación</span></PopHeading>

          <div className="mt-5">
            <Timeline
              label="Formación"
              columns
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
        </div>
      </PopContainer>
    </section>
  );
}
