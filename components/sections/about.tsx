import { Reveal } from "@/components/ui";
import type { Profile } from "@/lib/types";

export function About({ profile }: { profile: Profile }) {
  const skills = profile.skills ?? [];
  const education = profile.education ?? [];
  if (!profile.bio && skills.length === 0 && education.length === 0) return null;

  return (
    <section id="sobre-mi" className="scroll-mt-16 bg-paper-2 py-16 md:py-20">
      <div className="mx-auto grid w-full max-w-[1120px] grid-cols-12 gap-x-6 gap-y-14 px-5 md:px-16">
        <Reveal className="col-span-12 md:col-span-5">
          <p className="meta text-ink-3">Perfil</p>
          <h2 className="mt-4 font-display text-[30px] leading-[1.05] font-normal tracking-[-0.02em] text-ink md:text-[48px]">
            Sobre mí
          </h2>
          {profile.bio ? (
            <p className="mt-6 max-w-[62ch] text-[17px] leading-[1.65] text-ink">{profile.bio}</p>
          ) : null}
        </Reveal>

        {education.length > 0 ? (
          <Reveal delay={0.08} className="col-span-12 md:col-span-6 md:col-start-7">
            <p className="meta text-ink-3">Trayectoria</p>
            <ul className="mt-4 border-t border-line">
              {education.map((item) => (
                <li
                  key={item}
                  className="border-b border-line py-4 text-[17px] leading-relaxed text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {skills.length > 0 ? (
          <Reveal delay={0.12} className="col-span-12">
            <p className="meta text-ink-3">Habilidades</p>
            <ul
              className="mt-4 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-3"
              aria-label="Habilidades"
            >
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="border-b border-line py-3.5 text-[17px] leading-snug text-ink"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
