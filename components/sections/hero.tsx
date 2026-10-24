import Image from "next/image";
import { buttonVariants, Reveal } from "@/components/ui";
import { WHATSAPP_MESSAGE, whatsappLink } from "@/lib/links";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

function nameLines(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 3) {
    return {
      mobile: [parts.slice(0, -1).join(" "), parts[parts.length - 1]],
      desktop: parts,
    };
  }
  if (parts.length === 2) {
    return { mobile: [parts[0], parts[1]], desktop: parts };
  }
  return { mobile: [fullName, ""], desktop: [fullName] };
}

export function Hero({
  profile,
  firstCategorySlug,
}: {
  profile: Profile;
  firstCategorySlug?: string;
}) {
  const wa = profile.whatsapp ? whatsappLink(profile.whatsapp, WHATSAPP_MESSAGE) : null;
  const photo = profile.photoUrl || "/rosario.png";
  const place = /salta/i.test(profile.tagline) ? profile.tagline : `${profile.tagline} · Salta`;
  const lines = nameLines(profile.fullName);

  return (
    <section id="inicio" className="scroll-mt-16">
      <div className="mx-auto grid w-full max-w-[1120px] grid-cols-1 gap-5 px-5 pt-5 pb-6 md:grid-cols-12 md:items-center md:gap-x-6 md:px-16 md:pt-16 md:pb-12">
        <div className="contents md:col-span-5 md:flex md:flex-col md:justify-center md:gap-8">
          <Reveal>
            <h1 className="font-display text-[44px] leading-[0.92] font-normal tracking-[-0.03em] text-ink md:text-[64px] md:leading-[0.86] lg:text-[80px] xl:text-[88px]">
              <span className="md:hidden">
                {lines.mobile[0]}
                {lines.mobile[1] ? (
                  <>
                    <br />
                    {lines.mobile[1]}
                  </>
                ) : null}
              </span>
              <span className="hidden md:block">
                {lines.desktop.map((line, index) => (
                  <span key={`${line}-${index}`} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="max-w-[36ch] text-[17px] leading-snug text-ink-2">{place}</p>
          </Reveal>

          <Reveal delay={0.16} className="max-md:order-2">
            <div className="flex flex-col gap-3">
              {firstCategorySlug ? (
                <a
                  href={`#${firstCategorySlug}`}
                  className={cn(buttonVariants({ size: "lg" }), "w-full")}
                >
                  Ver su trabajo
                </a>
              ) : null}
              {wa ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
                >
                  WhatsApp
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>

        <div className="max-md:order-1 md:col-span-7 md:w-full md:max-w-[520px] md:justify-self-end">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={photo}
              alt="Retrato de Rosario Tejerina Pittis"
              fill
              priority
              sizes="(min-width: 768px) 520px, 100vw"
              className="object-cover object-[center_18%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
