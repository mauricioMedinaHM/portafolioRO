"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";

export type LogoCloudClient = {
  name: string;
  slug?: string;
  text?: boolean;
  className?: string;
  nameClassName?: string;
  invertDark?: boolean;
};

export interface CinematicLogoCloudProps {
  clients: LogoCloudClient[];
  variant?: "grid" | "marquee" | "marquee-named" | "ribbon";
  className?: string;
  eyebrow?: string;
  description?: string;
  label?: string;
}

/** Nube de texto o logos con una entrada progresiva al recorrer la página. */
export function CinematicLogoCloud({
  clients,
  variant = "grid",
  className,
  eyebrow,
  description,
  label = "Habilidades",
}: CinematicLogoCloudProps) {
  const reduceMotion = useReducedMotion();

  const renderClient = (client: LogoCloudClient) => {
    if (client.text || !client.slug) {
      return <span className={cn(client.className, client.nameClassName)}>{client.name}</span>;
    }
    return (
      <>
        {/* Simple Icons tiene dimensiones variables; se conserva la proporción original. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://cdn.simpleicons.org/${encodeURIComponent(client.slug)}`}
          alt={variant === "marquee-named" ? "" : client.name}
          className={cn("h-6 max-w-full w-auto", client.invertDark && "dark:invert")}
          loading="lazy"
        />
        {variant === "marquee-named" ? <span className={client.nameClassName}>{client.name}</span> : null}
      </>
    );
  };

  return (
    <div className={cn("w-full min-w-0", className)}>
      {eyebrow ? <p className="mb-3 font-pop text-xl text-cocoa">{eyebrow}</p> : null}
      {description ? <p className="mb-5 text-sm text-cocoa-2">{description}</p> : null}

      {variant === "ribbon" ? (
        <SkillRibbon clients={clients} label={label} />
      ) : variant === "grid" ? (
        <ul aria-label={label} className="flex flex-wrap items-center gap-x-6 gap-y-4 md:gap-x-9 md:gap-y-5">
          {clients.map((client, index) => (
            <motion.li
              key={client.name}
              initial={false}
              whileInView={reduceMotion ? undefined : {
                opacity: [0, 1],
                y: [16, 0],
                color: ["var(--color-amethyst)", "var(--color-cocoa)"],
              }}
              viewport={{ once: true, amount: 0.7, margin: "0px 0px -32px 0px" }}
              transition={{
                duration: 0.6,
                delay: Math.min(index * 0.055, 0.35),
                ease: [0.16, 1, 0.3, 1],
              }}
              className="max-w-full text-[18px] leading-snug font-semibold break-words text-cocoa md:text-[22px]"
            >
              {renderClient(client)}
            </motion.li>
          ))}
        </ul>
      ) : (
        <Marquee label={label}>
          {clients.map((client) => (
            <div key={client.name} className="mx-2 flex shrink-0 items-center gap-2.5 rounded-2xl border border-sand bg-blush px-5 py-3 font-semibold text-cocoa">
              {renderClient(client)}
            </div>
          ))}
        </Marquee>
      )}
    </div>
  );
}

/**
 * Cinta infinita de habilidades. La que cruza el centro se enciende.
 * Fuera de pantalla se detiene. Sin movimiento, queda la lista en varias líneas.
 */
function SkillRibbon({ clients, label }: { clients: LogoCloudClient[]; label: string }) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let live = false;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const paint = () => {
      const bounds = root.getBoundingClientRect();
      const mid = bounds.left + bounds.width / 2;
      const reach = Math.min(160, bounds.width * 0.24);
      const items = root.querySelectorAll<HTMLElement>("[data-skill]");
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      for (const el of items) {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = el;
        }
      }
      const hovering = canHover && root.matches(":hover");
      for (const el of items) {
        if (!hovering && el === best && bestDist <= reach) el.dataset.spot = "true";
        else delete el.dataset.spot;
      }
    };

    const loop = () => {
      paint();
      frame = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        live = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        root.toggleAttribute("data-off", !live);
        if (live && !frame) frame = requestAnimationFrame(loop);
        if (!live && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: [0, 0.25, 0.6] },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion, clients]);

  const row = (copy: "live" | "ghost") => (
    <ul
      aria-label={copy === "live" ? label : undefined}
      aria-hidden={copy === "ghost" ? true : undefined}
      inert={copy === "ghost" ? true : undefined}
      className={cn("flex shrink-0 items-center", copy === "ghost" && "skill-ribbon-copy")}
    >
      {clients.map((client) => (
        <li key={`${copy}-${client.name}`} data-skill className="skill-ribbon-word">
          <span className="skill-lamp" aria-hidden />
          <span className="relative">{client.name}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={rootRef} className="skill-ribbon">
      <div className="skill-ribbon-track">
        {row("live")}
        {row("ghost")}
      </div>
    </div>
  );
}

export default CinematicLogoCloud;
