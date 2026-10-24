import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, rows = 4, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "flex w-full rounded-none border border-line bg-paper px-4 py-3 text-base text-ink",
        "placeholder:text-ink-3",
        "transition-colors focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
