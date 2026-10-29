import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Borde luminoso en hover: un gradiente cónico gira y la máscara lo deja
 * sólo en el anillo. Sin WebGL. Inspirado en Chroma Card (React Bits).
 */
export function ChromaCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("group relative h-full rounded-[24px]", className)}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] p-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        style={{
          mask: "linear-gradient(black 0 0) content-box, linear-gradient(black 0 0)",
          WebkitMask: "linear-gradient(black 0 0) content-box, linear-gradient(black 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      >
        <div className="absolute top-1/2 left-1/2 aspect-square w-[220%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(var(--color-ultramarine),var(--color-amethyst),var(--color-vanilla),var(--color-periwinkle),var(--color-ultramarine))] motion-safe:group-hover:animate-[spin_5s_linear_infinite] motion-reduce:animate-none" />
      </div>
    </div>
  );
}
