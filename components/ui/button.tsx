import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 min-w-12 cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-base font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white hover:bg-accent-strong active:bg-accent-strong",
        secondary:
          "bg-secondary text-white hover:bg-secondary-strong active:bg-secondary-strong",
        ghost: "text-foreground hover:bg-foreground/8 active:bg-foreground/10",
      },
      size: {
        md: "min-h-12 px-6",
        sm: "min-h-12 px-4 text-sm",
        lg: "min-h-14 px-8 text-lg",
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
