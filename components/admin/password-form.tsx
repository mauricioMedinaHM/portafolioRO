"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updatePassword } from "@/app/admin/actions/auth";
import { passwordSchema, type PasswordInput } from "@/lib/schemas";
import { Button, Input } from "@/components/ui";
import { Field } from "./field";

export function PasswordForm() {
  const [busy, setBusy] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  async function onSubmit(values: PasswordInput) {
    setBusy(true);
    const result = await updatePassword(values);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Contraseña actualizada");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Field label="Nueva contraseña" error={errors.password?.message}>
        <Input
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
      </Field>
      <Field label="Repetir contraseña" error={errors.confirm?.message}>
        <Input
          type="password"
          autoComplete="new-password"
          {...register("confirm")}
        />
      </Field>
      <Button type="submit" variant="secondary" disabled={busy} className="w-full">
        {busy ? "Guardando…" : "Cambiar contraseña"}
      </Button>
    </form>
  );
}
