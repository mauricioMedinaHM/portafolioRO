"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { buttonVariants, Sheet } from "@/components/ui";
import { ShareModal } from "@/components/share";
import { cn } from "@/lib/utils";

export interface NavAnchor {
  href: string;
  label: string;
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

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-paper">
        <div className="mx-auto flex h-12 w-full max-w-[1120px] items-center justify-between gap-4 px-5 md:h-14 md:px-16">
          <a
            href="#inicio"
            className="min-w-0 truncate text-[15px] text-ink-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {name}
          </a>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="menu-secciones"
            onClick={() => setMenuOpen(true)}
            className="shrink-0 text-[15px] text-ink-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Menú
          </button>
        </div>
      </header>

      <Sheet
        open={menuOpen}
        onOpenChange={setMenuOpen}
        title="Índice"
        side="right"
      >
        <nav id="menu-secciones" aria-label="Secciones" className="flex flex-col">
          {anchors.map((anchor) => (
            <a
              key={anchor.href}
              href={anchor.href}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-14 items-center border-b border-line font-display text-[32px] leading-none font-normal tracking-[-0.02em] text-ink transition-colors hover:text-ink-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {anchor.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            setShareOpen(true);
          }}
          className={cn(buttonVariants({ size: "lg" }), "mt-10 w-full")}
        >
          <Share2 className="size-4" aria-hidden />
          Compartir
        </button>
      </Sheet>

      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        url={siteUrl}
        title={name}
      />
    </>
  );
}
