"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signIn, sendRecovery } from "@/app/admin/actions/auth";
import { loginSchema, recoverSchema, type LoginInput } from "@/lib/schemas";
import { Button, Input } from "@/components/ui";
import { Field } from "./field";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"login" | "recover">("login");
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setBusy(true);
    const result =
      mode === "login"
        ? await signIn(values)
        : await sendRecovery(recoverSchema.parse({ email: values.email }));
    setBusy(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    if (mode === "login") {
      toast.success("Bienvenida");
      router.replace(params.get("next") ?? "/admin");
      router.refresh();
    } else {
      toast.success("Te mandamos un mail para recuperar la contraseña");
      setMode("login");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <Field label="Mail" error={errors.email?.message}>
        <Input
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="tu@mail.com"
          {...register("email")}
        />
      </Field>

      {mode === "login" ? (
        <Field label="Contraseña" error={errors.password?.message}>
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
          />
        </Field>
      ) : null}

      <Button type="submit" disabled={busy} className="w-full">
        {busy
          ? "Un momento…"
          : mode === "login"
            ? "Ingresar"
            : "Enviar mail de recuperación"}
      </Button>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "recover" : "login")}
        className="min-h-12 text-sm font-medium text-secondary-strong underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-accent"
      >
        {mode === "login"
          ? "¿Olvidaste tu contraseña?"
          : "Volver a ingresar"}
      </button>
    </form>
  );
}
