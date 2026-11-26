"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { Menu, QrCode, Share2 } from "lucide-react";
import { PopContainer } from "@/components/pop/heading";
import { buttonVariants, Sheet } from "@/components/ui";
import { ShareModal } from "@/components/share";
import { cn } from "@/lib/utils";

export interface NavAnchor {
  href: string;
  label: string;
  parentHref?: string;
}

const DESKTOP_LINKS: NavAnchor[] = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#servicios", label: "Cualidades" },
  { href: "#formacion", label: "Formación" },
  { href: "#trabajos", label: "Muestra" },
  { href: "#en-vivo", label: "En vivo" },
  { href: "#mundo-scout", label: "Mundo Scout" },
  { href: "#eventos", label: "Eventos" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#contacto", label: "Contacto" },
];

const SECTION_LINKS = new Set(DESKTOP_LINKS.map((link) => link.href));

function useActiveSection(anchors: NavAnchor[]) {
  const key = anchors.map((anchor) => anchor.href).join("|");
  const [active, setActive] = useState(anchors[0]?.href ?? "#inicio");

  useEffect(() => {
    const nodes = key
      .split("|")
      .map((href) => document.getElementById(href.slice(1)))
      .filter((node): node is HTMLElement => Boolean(node));
    if (nodes.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        if (top) setActive(`#${top[0]}`);
      },
      { rootMargin: "-18% 0px -55% 0px", threshold: [0, 0.2, 0.45, 0.7] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

/** Línea inferior de 1px (seam) y blur leve sólo después de scrollear un poco. */
function useScrolled(threshold = 8) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > threshold));
  return scrolled;
}

export function NavBar({
  name,
  anchors,
  siteUrl,
}: {
  name: string;
  anchors: NavAnchor[];
  siteUrl: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const reduce = useReducedMotion();
  const scrolled = useScrolled();
  const active = useActiveSection(anchors);
  const desktopCurrent = SECTION_LINKS.has(active)
    ? active
    : anchors.find(({ href }) => href === active)?.parentHref;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-[background-color,border-color] duration-300",
          scrolled ? "border-sand bg-candy/95 backdrop-blur-sm" : "border-transparent bg-candy",
        )}
      >
        <PopContainer className="flex h-14 items-center justify-between gap-2.5 md:h-16 xl:gap-4">
          <a
            href="#inicio"
            aria-label={`${name}, inicio`}
            aria-current={active === "#inicio" ? "page" : undefined}
            className="font-pop flex min-h-11 min-w-0 items-center text-[17px] leading-tight text-cocoa focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sun-deep md:text-[19px]"
          >
            <span className="truncate">{name}</span>
          </a>

          <nav aria-label="Principal" className="hidden shrink-0 lg:block">
            <ul className="flex items-stretch rounded-full border border-cocoa/15 bg-cream/35 p-1">
              {DESKTOP_LINKS.map((link) => {
                const current = desktopCurrent === link.href;
                return (
                  <li key={link.href} className="flex">
                    <a
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "relative inline-flex min-h-10 items-center rounded-full px-1.5 text-[13px] font-semibold whitespace-nowrap transition-colors hover:bg-cream/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sun-deep xl:px-2.5",
                        current ? "bg-cream text-cocoa" : "text-cocoa-2",
                      )}
                    >
                      {link.label}
                      {current ? (
                        <motion.span
                          aria-hidden
                          layoutId="nav-underline"
                          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38 }}
                          className="absolute inset-x-3 bottom-1 h-px bg-sun-deep"
                        />
                      ) : null}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label="Mostrar QR del portafolio"
              aria-haspopup="dialog"
              onClick={() => setShareOpen(true)}
              className="inline-flex size-11 items-center justify-center text-cocoa transition-colors hover:text-sun focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sun-deep"
            >
              <QrCode className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="menu-secciones"
              onClick={() => setMenuOpen(true)}
              className="inline-flex min-h-11 items-center gap-1.5 pr-1 pl-2 text-[14px] font-bold text-cocoa transition-colors hover:text-sun focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sun-deep lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
              Menú
            </button>
          </div>
        </PopContainer>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen} title="Índice" side="right" className="bg-cream">
        <nav id="menu-secciones" aria-label="Secciones" className="flex flex-col divide-y divide-seam">
          {anchors.map((anchor, i) => (
            <motion.a
              key={anchor.href}
              href={anchor.href}
              aria-current={active === anchor.href ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.035, duration: 0.35 }}
              className={cn(
                "font-pop flex min-h-14 items-center border-b-2 border-seam text-[28px] leading-none text-cocoa transition-colors hover:text-sun-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-deep",
                active === anchor.href && "text-sun-deep",
              )}
            >
              {anchor.label}
            </motion.a>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            setShareOpen(true);
          }}
          className={cn(buttonVariants({ variant: "pop", size: "lg" }), "mt-10 w-full")}
        >
          <Share2 className="size-4" aria-hidden />
          Compartir
        </button>
      </Sheet>

      <ShareModal open={shareOpen} onOpenChange={setShareOpen} url={siteUrl} title={name} />
    </>
  );
}
