"use client";

import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

/** Interruptor accesible (role=switch) con área táctil amplia. */
export function Switch({ checked, onChange, label, disabled, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex min-h-12 min-w-12 items-center justify-center rounded-full",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <span
        className={cn(
          "relative h-8 w-14 rounded-full transition-colors",
          checked ? "bg-secondary" : "bg-border",
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 size-6 rounded-full bg-surface shadow transition-transform",
            checked && "translate-x-6",
          )}
        />
      </span>
    </button>
  );
}
