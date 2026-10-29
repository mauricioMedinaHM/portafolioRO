import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Cinta infinita horizontal. Pausa al hover, al tap y al foco.
 * Reduced-motion deja una sola tira quieta. Inspirado en Marquee (Magic UI).
 */
export function Marquee({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn("ui-marquee group/marquee max-w-full min-w-0", className)}
      aria-label={label}
      role={label ? "region" : undefined}
    >
      <div className="ui-marquee-track flex w-max">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="ui-marquee-copy flex shrink-0 items-center" aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  );
}
