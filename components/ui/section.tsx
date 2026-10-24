import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends ComponentProps<"section"> {
  /** Ancla (#id) — también se usa como destino del scroll-margin. */
  id?: string;
  title?: string;
  intro?: ReactNode;
}

export function Section({
  id,
  title,
  intro,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto w-full max-w-5xl scroll-mt-20 px-5 py-10 sm:px-8 sm:py-14",
        className,
      )}
      {...props}
    >
      {title ? (
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          {title}
        </h2>
      ) : null}
      {intro ? <div className="mt-3 max-w-2xl text-subtle">{intro}</div> : null}
      <div className={cn(title || intro ? "mt-6" : undefined)}>{children}</div>
    </section>
  );
}
