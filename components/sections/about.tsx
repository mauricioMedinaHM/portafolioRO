import { GraduationCap } from "lucide-react";
import { Reveal, Section } from "@/components/ui";
import type { Profile } from "@/lib/types";

export function About({ profile }: { profile: Profile }) {
  const skills = profile.skills ?? [];
  const education = profile.education ?? [];
  if (!profile.bio && skills.length === 0 && education.length === 0) return null;

  return (
    <Section id="sobre-mi" title="Sobre mí">
      <div className="flex flex-col gap-8">
        {profile.bio ? (
          <Reveal>
            <p className="max-w-2xl text-lg leading-relaxed text-foreground/90">
              {profile.bio}
            </p>
          </Reveal>
        ) : null}

        {skills.length > 0 ? (
          <Reveal delay={0.05}>
            <ul className="flex flex-wrap gap-2" aria-label="Habilidades">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full bg-secondary-soft px-4 py-2 text-sm font-medium text-secondary-strong"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {education.length > 0 ? (
          <Reveal delay={0.1}>
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-display text-xl text-foreground">
                <GraduationCap className="size-5 text-accent" aria-hidden />
                Trayectoria
              </h3>
              <ol className="relative ml-2 flex flex-col gap-4 border-l-2 border-border pl-5">
                {education.map((item) => (
                  <li key={item} className="relative text-sm leading-relaxed text-foreground/90">
                    <span
                      aria-hidden
                      className="absolute top-1.5 -left-[1.65rem] size-2.5 rounded-full border-2 border-background bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}
