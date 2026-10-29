import { ArrowRight } from "lucide-react";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Botón con flecha que se desliza al hover (solo transform/opacity).
 * Inspirado en Interactive Hover Button (Magic UI).
 */
export function InteractiveButton({
  className,
  children,
  ...props
}: ComponentProps<"a">) {
  return (
    <a
      className={cn(
        buttonVariants({ variant: "pop", size: "lg" }),
        "group relative overflow-hidden",
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-2">
        <span className="transition-transform duration-300 ease-out motion-safe:group-hover:-translate-x-1">
          {children}
        </span>
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-1.5"
        />
      </span>
    </a>
  );
}
