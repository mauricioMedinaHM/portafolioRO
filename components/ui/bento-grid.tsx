import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Grilla asimétrica para cifras. Inspirada en Bento Grid (Magic UI). */
export function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <dl className={cn("grid grid-cols-2 gap-3", className)}>{children}</dl>;
}

export function BentoCard({
  children,
  className,
  featured = false,
}: {
  children: ReactNode;
  className?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-transparent p-4 transition-[border-color,box-shadow] duration-300 md:p-5",
        "hover:border-amethyst hover:shadow-[0_12px_28px_-14px_color-mix(in_oklab,var(--color-amethyst)_55%,transparent)]",
        featured && "col-span-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
