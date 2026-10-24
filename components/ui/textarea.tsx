import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, rows = 4, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "flex w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-foreground",
        "placeholder:text-subtle/70",
        "transition-colors focus:border-accent focus:outline-2 focus:outline-accent/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
