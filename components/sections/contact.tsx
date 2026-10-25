import type { ComponentType } from "react";
import { ArrowUpRight, Mail, MapPin, Mic, MonitorPlay, Music2 } from "lucide-react";
import { Flower, Rays, Sparkle } from "@/components/pop/decor";
import { PopContainer } from "@/components/pop/heading";
import { InstagramGlyph, LinkedinGlyph } from "@/components/pop/social-links";
import { buttonVariants } from "@/components/ui";
import { WHATSAPP_MESSAGE, whatsappLink } from "@/lib/links";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

type SocialIcon = ComponentType<{ className?: string }>;

const SOCIAL: Record<string, { label: string; icon: SocialIcon }> = {
  instagram: { label: "Instagram", icon: InstagramGlyph },
  linkedin: { label: "LinkedIn", icon: LinkedinGlyph },
  tiktok: { label: "TikTok", icon: Music2 },
  youtube: { label: "YouTube", icon: MonitorPlay },
  x: { label: "X", icon: ArrowUpRight },
};

/** Usuario visible sin "@" (el único link con "@" es el mail). */
function handleOf(href: string) {
  try {
    const path = new URL(href).pathname.replace(/^\/+|\/+$/g, "");
    return path.replace(/^@/, "") || null;
  } catch {
    return null;
  }
}

export function Contact({ profile }: { profile: Profile }) {
  const wa = profile.whatsapp ? whatsappLink(profile.whatsapp, WHATSAPP_MESSAGE) : null;
  const linkedin = profile.socials.linkedin;
  const socials = Object.entries(profile.socials).filter(
    (entry): entry is [string, string] => entry[0] !== "linkedin" && Boolean(entry[1]),
  );
  if (!wa && !profile.email && !linkedin && socials.length === 0) return null;

  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="scroll-mt-20 py-10 md:py-14">
      <PopContainer>
        <div className="relative grid grid-cols-1 gap-8 overflow-hidden rounded-[36px] bg-peach p-6 md:p-10 lg:grid-cols-12 lg:items-center">
          <Flower className="pointer-events-none absolute -right-20 -bottom-24 size-72 text-blush" />

          <div className="relative lg:col-span-6">
            <h2 id="contacto-titulo" className="font-pop text-[52px] leading-[0.86] text-sun-deep sm:text-[72px] md:text-[96px]">
              Hablemos
              <span className="font-script mt-1 block -rotate-3 text-[0.44em] leading-none text-rose-ink sm:text-[0.42em]">
                de nuestro próximo proyecto
              </span>
            </h2>
            <p className="mt-6 max-w-[44ch] text-[16px] leading-relaxed text-cocoa-2">
              Escribime por el canal que te quede más cómodo y armamos la propuesta.
            </p>

            <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
              {profile.email ? (
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-cocoa underline-offset-4 hover:text-sun-deep hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-deep"
                  >
                    <Mail className="size-5 text-sun-deep" aria-hidden />
                    {profile.email}
                  </a>
                </li>
              ) : null}
              {linkedin ? (
                <li>
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cocoa px-4 text-[15px] font-bold text-cream transition-colors hover:bg-cocoa-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa"
                  >
                    <LinkedinGlyph className="size-5" />
                    LinkedIn
                  </a>
                </li>
              ) : null}
              {socials.map(([network, href]) => {
                const meta = SOCIAL[network] ?? { label: network, icon: ArrowUpRight };
                const handle = handleOf(href);
                return (
                  <li key={network}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-cocoa underline-offset-4 hover:text-sun-deep hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-deep"
                    >
                      <span aria-hidden className="text-sun-deep">
                        <meta.icon className="size-5" />
                      </span>
                      {meta.label}
                      {handle ? <span className="font-normal text-cocoa-2">{handle}</span> : null}
                    </a>
                  </li>
                );
              })}
              <li className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-cocoa">
                <MapPin className="size-5 text-sun-deep" aria-hidden />
                Salta Capital, Argentina
              </li>
            </ul>
          </div>

          {/* Sol con micrófono: la "señal" de la marca */}
          <div aria-hidden className="relative mx-auto hidden size-36 lg:col-span-2 lg:grid lg:place-items-center">
            <Rays className="pop-spin absolute inset-0 size-full text-sun" />
            <span className="relative grid size-24 place-items-center rounded-full bg-sun text-cocoa">
              <Mic className="size-10" />
            </span>
          </div>

          <div className="relative rounded-[28px] bg-candy p-6 md:p-7 lg:col-span-4">
            <Sparkle className="absolute top-5 right-5 size-6 text-cream" />
            <p className="font-pop text-[24px] leading-[0.95] text-cocoa md:text-[28px]">
              ¿Tenés un proyecto, un programa o una cobertura?
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-cocoa">
              Conducción, móviles, entrevistas, locución o contenido para redes: contame la idea.
            </p>
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "pop", size: "lg" }), "mt-6 w-full sm:w-auto")}
              >
                Escribime por WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </PopContainer>
    </section>
  );
}
