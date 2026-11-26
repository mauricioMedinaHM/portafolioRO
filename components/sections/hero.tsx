import { Mic } from "lucide-react";
import { HeroClip } from "@/components/media/HeroClip";
import { PopContainer } from "@/components/pop/heading";
import { WHATSAPP_MESSAGE, whatsappLink } from "@/lib/links";
import type { Profile } from "@/lib/types";

export function Hero({ profile }: { profile: Profile }) {
  const whatsapp = profile.whatsapp
    ? whatsappLink(profile.whatsapp, WHATSAPP_MESSAGE)
    : null;

  return (
    <section id="inicio" className="scroll-mt-28 overflow-hidden border-b border-seam bg-paper">
      <PopContainer className="grid items-center gap-6 py-10 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:gap-12 md:py-16 lg:gap-20 lg:py-20">
        <div className="min-w-0">
          <span className="pop-label inline-block border-b border-sand pb-2 text-cocoa">
            {profile.fullName} · Salta
          </span>
          <h1 className="editorial-title mt-6 text-cocoa">
            <span className="sr-only">{profile.fullName}: </span>
            <span className="block">La voz frente al aire,</span>{" "}
            <span className="block"><em>la mirada detrás de escena</em></span>
          </h1>
          <p className="mt-5 max-w-[50ch] text-base leading-relaxed text-cocoa-2 md:text-lg">
            Soy conductora, locutora y comunicadora audiovisual. Trabajo en el área de comunicaciones
            conduciendo y participando de móviles en vivo, hago entrevistas y produzco contenido
            para streaming, TV y redes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#trabajos" className="editorial-pill bg-cocoa text-cream">
              Ver mi trabajo
            </a>
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-pill bg-transparent text-cocoa hover:bg-honeydew"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>

        <figure className="editorial-portrait relative mx-auto w-full max-w-[350px] lg:max-w-[380px]">
          <div className="editorial-photo-print">
            <HeroClip
              poster={profile.photoUrl}
              src={profile.heroVideoUrl}
              alt="Retrato de Rosario Tejerina Pittis"
              sizes="(min-width: 768px) 370px, 85vw"
            />
          </div>
          <figcaption className="editorial-stamp pop-label">
            <Mic className="size-5 shrink-0" aria-hidden />
            Al aire desde Salta
          </figcaption>
        </figure>
      </PopContainer>
    </section>
  );
}
