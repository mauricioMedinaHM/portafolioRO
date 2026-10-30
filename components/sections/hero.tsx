"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Mic } from "lucide-react";
import { HeroClip } from "@/components/media/HeroClip";
import { Burst, Flower, OnAirBadge, Rays, Sparkle, Squiggle } from "@/components/pop/decor";
import { PopContainer } from "@/components/pop/heading";
import { buttonVariants, InteractiveButton, TextReveal } from "@/components/ui";
import { WHATSAPP_MESSAGE, whatsappLink } from "@/lib/links";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Hero({ profile }: { profile: Profile; firstCategorySlug?: string }) {
  const heroRef = useRef<HTMLElement>(null);
  const wa = profile.whatsapp ? whatsappLink(profile.whatsapp, WHATSAPP_MESSAGE) : null;
  const photo = profile.photoUrl;

  // Parallax sutil: la foto y las formas se separan al scrollear (estado inicial visible).
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const shapeY = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const spin = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section id="inicio" ref={heroRef} className="relative scroll-mt-28 overflow-hidden">
      {/* Forma orgánica de fondo */}
      <Flower className="pointer-events-none absolute -bottom-56 -left-40 size-[420px] text-peach md:-left-24 md:size-[560px]" />

      <PopContainer className="relative grid grid-cols-1 gap-8 pt-6 pb-14 md:grid-cols-12 md:items-center md:gap-x-8 md:pt-10 md:pb-20">
        <div className="relative md:col-span-6">
          <Burst
            className="pop-burst absolute -top-2 -left-1 size-10 text-rose md:-top-6 md:-left-10 md:size-14"
            style={{ animationDelay: "650ms" }}
          />

          <h1 className="font-pop relative pt-8 text-[52px] leading-[0.86] text-cocoa sm:text-[72px] md:pt-6 lg:text-[112px]">
            <span className="sr-only">{profile.fullName}: </span>
            <TextReveal text="Contar" className="block" startIndex={0} />
            <TextReveal text="lo que" className="block" startIndex={1} />
            <span className="-my-[0.06em] block overflow-hidden py-[0.12em]">
              <TextReveal text="pasa" startIndex={3} />
              <TextReveal
                text="en vivo"
                startIndex={4}
                className="font-script ml-3 inline-block -rotate-6 align-[0.08em] text-[0.62em] text-rose-ink"
              />
            </span>
          </h1>

          <p className="mt-6 max-w-[42ch] text-[17px] leading-relaxed text-cocoa-2 md:mt-8 md:text-[18px]">
            Soy <strong className="font-semibold text-cocoa">{profile.fullName}</strong>,
            conductora, locutora y comunicadora audiovisual en Salta. Conduzco estudio y móviles
            en vivo, hago entrevistas y produzco contenido para streaming, TV y redes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <InteractiveButton href="#trabajos">Ver mi trabajo</InteractiveButton>
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "pop-outline", size: "lg" }))}
              >
                WhatsApp
              </a>
            ) : null}
          </div>

          <Squiggle className="mt-8 hidden w-28 text-rose md:block" />
        </div>

        {/* Composición: arco rosa, medio sol naranja, rayos y foto en ventana de arco */}
        <div className="relative mx-auto aspect-[5/6] w-full max-w-[540px] md:col-span-6">
          <motion.div
            style={{ y: shapeY }}
            className="absolute top-0 right-0 h-[92%] w-[84%] rounded-t-full rounded-b-[40px] bg-rose"
          />
          <motion.div
            style={{ y: shapeY }}
            className="absolute bottom-[4%] left-0 aspect-[2/1] w-[46%] rounded-t-full bg-sun"
          />
          <Rays
            className="pop-burst absolute top-[2%] right-[2%] size-[34%] text-cream"
            style={{ animationDelay: "500ms" }}
          />
          <Sparkle
            className="pop-burst absolute top-[30%] left-[4%] size-7 text-sun md:size-9"
            style={{ animationDelay: "800ms" }}
          />

          <div className="pop-arch absolute right-[9%] bottom-0 h-[86%] w-[64%] overflow-hidden rounded-t-full rounded-b-[32px] border-[6px] border-cream bg-peach">
            <motion.div className="absolute inset-[-6%]" style={{ y: photoY }}>
              <HeroClip
                poster={photo}
                src={profile.heroVideoUrl}
                alt="Retrato de Rosario Tejerina Pittis"
                sizes="(min-width: 768px) 360px, 64vw"
              />
            </motion.div>
          </div>

          <motion.div style={{ rotate: spin }} className="absolute bottom-[10%] left-[3%] md:left-[1%]">
            <OnAirBadge
              text="Al aire · desde Salta · "
              label="Al aire desde Salta"
              className="pop-burst size-[104px] shadow-[0_10px_30px_-12px_rgb(91_5_80/0.45)] md:size-[128px]"
            >
              <Mic className="size-7 md:size-8" />
            </OnAirBadge>
          </motion.div>
        </div>
      </PopContainer>
    </section>
  );
}
