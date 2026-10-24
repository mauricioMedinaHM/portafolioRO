import { buttonVariants, Reveal } from "@/components/ui";
import { WHATSAPP_MESSAGE, whatsappLink } from "@/lib/links";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

const SOCIAL_LABEL: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
};

export function Contact({ profile }: { profile: Profile }) {
  const wa = profile.whatsapp ? whatsappLink(profile.whatsapp, WHATSAPP_MESSAGE) : null;
  const socials = Object.entries(profile.socials).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );
  if (!wa && !profile.email && socials.length === 0) return null;

  return (
    <section id="contacto" className="scroll-mt-16 bg-ink text-paper">
      <div className="mx-auto grid w-full max-w-[1120px] grid-cols-12 gap-x-6 gap-y-10 px-5 py-16 md:px-16 md:py-24">
        <Reveal className="col-span-12 md:col-span-5">
          <p className="meta text-mist">Salta Capital</p>
          <h2 className="mt-4 font-display text-[30px] leading-[1.05] font-normal tracking-[-0.02em] text-paper md:text-[48px]">
            Contacto
          </h2>
          <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-mist">
            Escribime por el canal que te quede más cómodo.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="col-span-12 flex flex-col gap-3 md:col-span-6 md:col-start-7">
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "invert", size: "lg" }), "w-full")}
            >
              WhatsApp
            </a>
          ) : null}
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className={cn(buttonVariants({ variant: "invert-outline", size: "lg" }), "w-full")}
            >
              {profile.email}
            </a>
          ) : null}
          {socials.length > 0 ? (
            <ul className="mt-6 flex flex-col" aria-label="Redes sociales">
              {socials.map(([network, href]) => (
                <li key={network} className="border-t border-mist/40">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 items-center justify-between text-[15px] text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
                  >
                    <span>{SOCIAL_LABEL[network] ?? network}</span>
                    <span className="meta text-mist">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
