import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Contenedor de la landing pop: ancho máximo y márgenes laterales. */
export function PopContainer({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-5 md:px-10", className)}>{children}</div>;
}

/**
 * Título de sección: grotesca extra negrita en mayúsculas + palabra manuscrita
 * opcional (rosa). La palabra script es parte del h2 para lectores de pantalla.
 */
export function PopHeading({
  children,
  script,
  as: Tag = "h2",
  tone = "sun",
  className,
}: {
  children: ReactNode;
  script?: string;
  as?: "h2" | "h3";
  tone?: "sun" | "cream" | "cocoa";
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "font-pop text-[34px] md:text-[52px]",
        tone === "sun" && "text-cocoa",
        tone === "cream" && "text-cream",
        tone === "cocoa" && "text-cocoa",
        className,
        // Va al final: tailwind-merge descarta el leading si después se pisa el tamaño.
        "leading-[0.92]",
      )}
    >
      {children}
      {script ? (
        <>
          {" "}
          <span
            className={cn(
              "font-script inline-block -rotate-3 text-[1.05em] leading-none",
              tone === "cream" ? "text-cream" : "text-rose-ink",
            )}
          >
            {script}
          </span>
        </>
      ) : null}
    </Tag>
  );
}
