"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { QrCode, Share2 } from "lucide-react";
import { Sparkle } from "@/components/pop/decor";
import { buttonVariants, Sheet } from "@/components/ui";
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
  { href: "#trayectoria", label: "Trayectoria" },
  { href: "#contacto", label: "Contacto" },
];

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
  const [scrolled, setScrolled] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 8));

  const parts = name.trim().split(/\s+/);
  const logoTop = parts[0] ?? name;
  const logoBottom = parts.slice(1, 2).join(" ");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-[background-color,box-shadow] duration-200",
          scrolled ? "bg-cream/90 shadow-[0_6px_24px_-12px_rgb(59_31_20/0.25)] backdrop-blur-md" : "bg-cream",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-6 px-5 md:h-20 md:px-10">
          <a
            href="#inicio"
            aria-label={`${name}, inicio`}
            className="font-pop flex flex-col text-[17px] leading-[0.9] text-sun focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sun-deep md:text-[20px]"
          >
            <span>{logoTop}</span>
            {logoBottom ? <span>{logoBottom}</span> : null}
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {DESKTOP_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="pop-label text-cocoa transition-colors hover:text-sun-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sun-deep"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
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
        <motion.div
          aria-hidden
          style={{ scaleX }}
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-sun"
        />
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen} title="Índice" side="right" className="bg-cream">
        <nav id="menu-secciones" aria-label="Secciones" className="flex flex-col">
          {anchors.map((anchor, i) => (
            <motion.a
              key={anchor.href}
              href={anchor.href}
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.035, duration: 0.35 }}
              className="font-pop flex min-h-14 items-center border-b-2 border-seam text-[28px] leading-none text-cocoa transition-colors hover:text-sun-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-deep"
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
