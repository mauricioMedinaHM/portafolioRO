"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { QrCode, Share2 } from "lucide-react";
import { Sparkle } from "@/components/pop/decor";
import { buttonVariants, FloatingNav, Sheet } from "@/components/ui";
import { ShareModal } from "@/components/share";
import { cn } from "@/lib/utils";

export interface NavAnchor {
  href: string;
  label: string;
}

const DESKTOP_LINKS: NavAnchor[] = [
  { href: "#trabajos", label: "Trabajos" },
  { href: "#servicios", label: "Qué hago" },
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#formacion", label: "Formación" },
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
  const active = useActiveSection(anchors);
  const desktopCurrent = SECTION_LINKS.has(active) ? active : active === "#inicio" || active === "#sobre-mi" ? active : "#trabajos";

  const parts = name.trim().split(/\s+/);
  const logoTop = parts[0] ?? name;
  const logoBottom = parts.slice(1, 2).join(" ");

  return (
    <>
      <FloatingNav forceVisible={menuOpen}>
        {({ compact }) => (
          <div className="flex items-center justify-between gap-3">
            <a
              href="#inicio"
              aria-label={`${name}, inicio`}
              aria-current={active === "#inicio" ? "page" : undefined}
              className={cn(
                "font-pop flex min-h-11 shrink-0 flex-col justify-center leading-[0.9] text-cocoa focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sun-deep",
                compact ? "text-[15px]" : "text-[17px] md:text-[18px]",
              )}
            >
              <span>{logoTop}</span>
              {logoBottom ? <span>{logoBottom}</span> : null}
            </a>

            <nav aria-label="Principal" className="hidden min-w-0 lg:block">
              <ul className="flex items-center gap-1">
                {DESKTOP_LINKS.map((link) => {
                  const current = desktopCurrent === link.href;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "pop-label inline-flex min-h-11 items-center rounded-full px-3 text-cocoa transition-colors hover:text-sun-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-deep",
                          current && "bg-candy text-cocoa",
                        )}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <a
                href="#contacto"
                className={cn(buttonVariants({ variant: "pop", size: "md" }), "hidden sm:inline-flex")}
              >
                Hablemos
                <Sparkle className="size-4" />
              </a>
              <button
                type="button"
                aria-label="Mostrar QR del portafolio"
                aria-haspopup="dialog"
                onClick={() => setShareOpen(true)}
                className="inline-flex size-11 items-center justify-center rounded-full border-2 border-cocoa text-cocoa transition-colors hover:bg-cocoa hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa"
              >
                <QrCode className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-controls="menu-secciones"
                onClick={() => setMenuOpen(true)}
                className="inline-flex min-h-11 items-center rounded-full border-2 border-cocoa px-4 text-[14px] font-bold text-cocoa transition-colors hover:bg-cocoa hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa lg:hidden"
              >
                Menú
              </button>
            </div>
          </div>
        )}
      </FloatingNav>
      <div aria-hidden className="h-[5.25rem] md:h-24" />

      <Sheet open={menuOpen} onOpenChange={setMenuOpen} title="Índice" side="right" className="bg-cream">
        <nav id="menu-secciones" aria-label="Secciones" className="flex flex-col">
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
