"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateProfile } from "@/app/admin/actions/profile";
import { profileSchema, type ProfileInput } from "@/lib/schemas";
import type { Profile } from "@/lib/types";
import { Button, Input, Textarea } from "@/components/ui";
import { Field } from "./field";
import { PhotoUpload } from "./photo-upload";

const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [skillsText, setSkillsText] = useState((profile.skills ?? []).join("\n"));
  const [educationText, setEducationText] = useState(
    (profile.education ?? []).join("\n"),
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName,
      tagline: profile.tagline,
      bio: profile.bio,
      email: profile.email ?? "",
      whatsapp: profile.whatsapp ?? "",
      photoUrl: profile.photoUrl ?? "",
      heroVideoUrl: profile.heroVideoUrl ?? "",
      socials: {
        instagram: profile.socials.instagram ?? "",
        linkedin: profile.socials.linkedin ?? "",
        tiktok: profile.socials.tiktok ?? "",
        youtube: profile.socials.youtube ?? "",
        x: profile.socials.x ?? "",
      },
    },
  });

  async function onSubmit(values: ProfileInput) {
    setBusy(true);
    const result = await updateProfile({
      ...values,
      skills: lines(skillsText),
      education: lines(educationText),
    });
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Perfil guardado");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Field label="Foto de perfil">
        <Controller
          control={control}
          name="photoUrl"
          render={({ field }) => (
            <PhotoUpload
              value={field.value || null}
              onUploaded={(url) => field.onChange(url)}
            />
          )}
        />
      </Field>

      <Field label="Nombre completo" error={errors.fullName?.message}>
        <Input {...register("fullName")} />
      </Field>

      <Field
        label="Tagline"
        error={errors.tagline?.message}
        hint="Ej. Conductora · Comunicadora"
      >
        <Input {...register("tagline")} />
      </Field>

      <Field label="Bio" error={errors.bio?.message}>
        <Textarea rows={5} {...register("bio")} />
      </Field>

      <Field label="Mail de contacto" error={errors.email?.message}>
        <Input type="email" inputMode="email" {...register("email")} />
      </Field>

      <Field
        label="WhatsApp"
        error={errors.whatsapp?.message}
        hint="Formato internacional: +5491155550123"
      >
        <Input inputMode="tel" {...register("whatsapp")} />
      </Field>

      <Field label="Video del hero (opcional)" error={errors.heroVideoUrl?.message}>
        <Input type="url" inputMode="url" placeholder="https://…" {...register("heroVideoUrl")} />
      </Field>

      <Field
        label="Habilidades (chips)"
        hint="Una por línea. Se muestran como chips en «Sobre mí»."
      >
        <Textarea
          rows={4}
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          placeholder="Comunicación oral y audiovisual&#10;Conducción en estudio y en vivo"
        />
      </Field>

      <Field
        label="Formación y certificados"
        hint="Una por línea. Se muestra como «Trayectoria»."
      >
        <Textarea
          rows={5}
          value={educationText}
          onChange={(e) => setEducationText(e.target.value)}
          placeholder="Lic. en Comunicaciones Sociales — UCaSal (2024–act.)"
        />
      </Field>

      <fieldset className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
        <legend className="px-1 text-sm font-medium text-foreground">
          Redes sociales
        </legend>
        {(
          [
            ["instagram", "Instagram"],
            ["linkedin", "LinkedIn"],
            ["tiktok", "TikTok"],
            ["youtube", "YouTube"],
            ["x", "X (Twitter)"],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label} error={errors.socials?.[key]?.message}>
            <Input
              type="url"
              inputMode="url"
              placeholder="https://…"
              {...register(`socials.${key}`)}
            />
          </Field>
        ))}
      </fieldset>

      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Guardando…" : "Guardar perfil"}
      </Button>
    </form>
  );
}
