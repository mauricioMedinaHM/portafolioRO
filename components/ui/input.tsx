import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-base text-foreground",
        "placeholder:text-subtle/70",
        "transition-colors focus:border-accent focus:outline-2 focus:outline-accent/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
