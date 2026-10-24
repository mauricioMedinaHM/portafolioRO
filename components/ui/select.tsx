import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex min-h-12 w-full appearance-none items-center rounded-none border border-line bg-paper px-4 pr-10 text-base text-ink",
          "transition-colors focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-ink-3"
      />
    </div>
  );
}
