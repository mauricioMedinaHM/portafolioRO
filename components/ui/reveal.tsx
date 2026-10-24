import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Retraso en segundos antes de iniciar la animación. */
  delay?: number;
  /** Se conserva por compatibilidad; el desplazamiento es 12px. */
  y?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <div
      className={cn("reveal", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
