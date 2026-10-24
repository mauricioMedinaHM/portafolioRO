import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-w-12 cursor-pointer items-center justify-center gap-2 rounded-none px-5 text-[15px] font-medium tracking-wide transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink text-paper hover:bg-ink-hover focus-visible:outline-ink",
        outline:
          "border border-ink bg-transparent text-ink hover:bg-paper-2 focus-visible:outline-ink",
        ghost: "bg-transparent text-ink hover:bg-paper-2 focus-visible:outline-ink",
        invert: "bg-paper text-ink hover:bg-paper-2 focus-visible:outline-paper",
        "invert-outline":
          "border border-mist bg-transparent text-paper hover:bg-ink-hover focus-visible:outline-paper",
        // Landing "Pop al aire": píldoras naranja/rosa.
        pop: "rounded-full bg-sun-deep font-bold text-white hover:bg-sun-hover focus-visible:outline-sun-deep",
        "pop-outline":
          "rounded-full border-2 border-cocoa bg-transparent font-bold text-cocoa hover:bg-cocoa hover:text-cream focus-visible:outline-cocoa",
        "pop-cream":
          "rounded-full bg-cream font-bold text-cocoa hover:bg-white focus-visible:outline-cream",
      },
      size: {
        md: "min-h-12 px-5",
        sm: "min-h-12 px-4 text-[13px]",
        lg: "min-h-[52px] px-6",
        icon: "min-h-12 w-12 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
