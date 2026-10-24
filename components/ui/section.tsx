import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends ComponentProps<"section"> {
  /** Ancla (#id) — también se usa como destino del scroll-margin. */
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: ReactNode;
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-16 border-t border-line py-16 md:py-20", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 md:px-16">
        {eyebrow ? <p className="meta text-ink-3">{eyebrow}</p> : null}
        {title ? (
          <h2
            className={cn(
              "font-display text-[30px] leading-[1.05] font-normal tracking-[-0.02em] text-ink md:text-[48px]",
              eyebrow && "mt-4",
            )}
          >
            {title}
          </h2>
        ) : null}
        {intro ? (
          <div className="mt-4 max-w-[62ch] text-[17px] leading-relaxed text-ink-2">{intro}</div>
        ) : null}
        <div className={cn(title || intro || eyebrow ? "mt-10 md:mt-14" : undefined)}>
          {children}
        </div>
      </div>
    </section>
  );
}
