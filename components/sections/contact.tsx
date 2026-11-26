import type { ComponentType } from "react";
import { ArrowUpRight, Code2, Mail, MapPin, Mic, MonitorPlay, Music2, Send } from "lucide-react";
import { PopContainer } from "@/components/pop/heading";
import { InstagramGlyph, LinkedinGlyph } from "@/components/pop/social-links";
import { WHATSAPP_MESSAGE, whatsappLink } from "@/lib/links";
import type { Profile } from "@/lib/types";

type SocialIcon = ComponentType<{ className?: string }>;

const SOCIAL: Record<string, { label: string; icon: SocialIcon }> = {
  instagram: { label: "Instagram", icon: InstagramGlyph },
  linkedin: { label: "LinkedIn", icon: LinkedinGlyph },
  tiktok: { label: "TikTok", icon: Music2 },
  youtube: { label: "YouTube", icon: MonitorPlay },
  x: { label: "X", icon: ArrowUpRight },
  telegram: { label: "Telegram", icon: Send },
  github: { label: "GitHub", icon: Code2 },
};

function handleOf(href: string) {
  try {
    return new URL(href).pathname.replace(/^\/+|\/+$/g, "").replace(/^@/, "") || null;
  } catch {
    return null;
  }
}

export function Contact({ profile }: { profile: Profile }) {
  const wa = profile.whatsapp ? whatsappLink(profile.whatsapp, WHATSAPP_MESSAGE) : null;
  const socials = Object.entries(profile.socials).filter((entry): entry is [string, string] => Boolean(entry[1]));
  if (!wa && !profile.email && socials.length === 0) return null;

  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="editorial-striped scroll-mt-28 border-y border-seam py-7 md:py-10">
      <PopContainer>
        <div className="grid items-start gap-6 rounded-[14px] border border-seam bg-cream p-4 sm:p-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-8 lg:gap-12 lg:p-8">
          <div className="min-w-0">
            <h2 id="contacto-titulo" className="font-pop text-[clamp(2.75rem,6vw,5rem)] leading-[0.96] text-sun-deep">
              Hablemos
              <span className="mt-2 block text-[0.43em] leading-tight font-normal text-rose-ink italic">de nuestro próximo proyecto</span>
            </h2>
            <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-cocoa-2">
              Escribime por el canal que te quede más cómodo y armamos la propuesta.
            </p>

            <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-cocoa">
              {profile.email && (
                <li className="min-w-0">
                  <a href={"mailto:" + profile.email} className="inline-flex min-h-11 min-w-0 items-center gap-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa">
                    <Mail className="size-4 shrink-0" aria-hidden />
                    <span className="min-w-0 [overflow-wrap:anywhere]">{profile.email}</span>
                  </a>
                </li>
              )}
              <li className="inline-flex min-h-11 items-center gap-2">
                <MapPin className="size-4 shrink-0" aria-hidden />
                Salta Capital, Argentina
              </li>
            </ul>

            {socials.length > 0 && (
              <>
                <ul id="redes-sociales" className="mt-2 flex scroll-mt-28 flex-wrap items-center gap-2">
                  {socials.map(([network, href]) => {
                    const meta = SOCIAL[network] ?? { label: network, icon: ArrowUpRight };
                    const handle = network === "linkedin" ? null : handleOf(href);
                    return (
                      <li key={network} className="min-w-0 max-w-full">
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-full border border-sand bg-cream px-3 text-sm font-semibold text-cocoa transition-colors hover:border-cocoa hover:bg-blush focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa"
                        >
                          <span aria-hidden className="grid shrink-0 place-items-center text-sun-deep">
                            <meta.icon className="size-4" />
                          </span>
                          <span className="min-w-0 [overflow-wrap:anywhere]">
                            {meta.label}
                            {handle && <span className="ml-1.5 font-normal text-cocoa-2">{handle}</span>}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 text-[13px] text-cocoa-2">
                  Constantemente actualizo mi actividad a través de mis{" "}
                  <a href="#redes-sociales" className="underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2">redes sociales</a>.
                </p>
              </>
            )}
          </div>

          <aside aria-labelledby="contacto-proyecto" className="flex min-w-0 flex-col items-start gap-3 rounded-[10px] border border-seam bg-honeydew p-4 sm:p-6">
            <div className="flex w-full items-start justify-between gap-3">
              <h3 id="contacto-proyecto" className="font-pop text-2xl leading-tight text-cocoa md:text-[28px]">
                ¿Tenés un proyecto, un programa o una cobertura?
              </h3>
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-sand bg-candy text-cocoa" aria-hidden>
                <Mic className="size-5" />
              </span>
            </div>
            <p className="text-[15px] leading-relaxed text-cocoa">
              Conducción, móviles, entrevistas, locución o contenido para redes: contame la idea.
            </p>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="editorial-pill mt-1 bg-cocoa text-cream transition-colors hover:bg-sun">
                Escribime por WhatsApp
              </a>
            )}
          </aside>
        </div>
      </PopContainer>
    </section>
  );
}
