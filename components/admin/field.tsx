import type { ReactNode } from "react";

export interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/** Wrapper label + input + mensaje de error para los formularios del admin. */
export function Field({ label, error, hint, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? (
        <span className="text-sm text-accent-strong">{error}</span>
      ) : hint ? (
        <span className="text-xs text-subtle">{hint}</span>
      ) : null}
    </label>
  );
}
