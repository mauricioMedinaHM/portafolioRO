"use client";

import { useState } from "react";
import { Menu, Share2 } from "lucide-react";
import { Sheet } from "@/components/ui";
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
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-5">
          <a
            href="#inicio"
            className="min-w-0 truncate font-display text-lg font-medium text-foreground focus-visible:outline-2 focus-visible:outline-accent"
          >
            {name}
          </a>
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              aria-label="Compartir portafolio"
              onClick={() => setShareOpen(true)}
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full text-subtle transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Share2 className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Menu className="size-6" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <Sheet
        open={menuOpen}
        onOpenChange={setMenuOpen}
        title={name}
        side="right"
        className="w-full sm:max-w-sm"
      >
        <nav aria-label="Secciones" className="flex flex-col">
          {anchors.map((anchor, i) => (
            <a
              key={anchor.href}
              href={anchor.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex min-h-14 items-center border-b border-border/60 px-2 font-display text-2xl text-foreground transition-colors hover:text-accent-strong focus-visible:outline-2 focus-visible:outline-accent",
                i === 0 && "border-t border-border/60",
              )}
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
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 font-medium text-white transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Share2 className="size-4" aria-hidden />
          Compartir portafolio
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
