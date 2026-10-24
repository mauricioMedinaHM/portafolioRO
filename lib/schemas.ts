import { z } from "zod";

const urlHttp = z
  .string()
  .trim()
  .url("Tiene que ser una URL válida")
  .refine(
    (u) => u.startsWith("http://") || u.startsWith("https://"),
    "Solo links http/https",
  );

// El link es opcional: los items de experiencia sin video van sin URL.
const urlOrEmpty = z.union([z.literal(""), urlHttp]);

export const loginSchema = z.object({
  email: z.string().trim().email("Mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const recoverSchema = z.object({
  email: z.string().trim().email("Mail inválido"),
});
export type RecoverInput = z.infer<typeof recoverSchema>;

export const passwordSchema = z
  .object({
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, "Las contraseñas no coinciden");
export type PasswordInput = z.infer<typeof passwordSchema>;

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Falta el título").max(140),
  categoryId: z.string().min(1, "Elegí una categoría"),
  url: urlOrEmpty,
  description: z
    .string()
    .trim()
    .max(280, "Máximo 280 caracteres")
    .nullable()
    .optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato AAAA-MM-DD")
    .nullable()
    .optional(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Falta el nombre").max(80),
  slug: z
    .string()
    .trim()
    .min(1, "Falta el slug")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
  intro: z.string().trim().max(600).nullable().optional(),
  skills: z.array(z.string().trim().min(1).max(40)).max(12),
  isVisible: z.boolean(),
});
export type CategoryInput = z.infer<typeof categorySchema>;

const optionalUrl = z
  .string()
  .trim()
  .url("URL inválida")
  .nullable()
  .optional()
  .or(z.literal(""));

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Falta el nombre").max(120),
  tagline: z.string().trim().max(160),
  bio: z.string().trim().max(2000),
  email: z.string().trim().email("Mail inválido").nullable().optional().or(z.literal("")),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{6,20}$/, "Usá formato internacional, ej. +54911...")
    .nullable()
    .optional()
    .or(z.literal("")),
  heroVideoUrl: optionalUrl,
  photoUrl: optionalUrl,
  socials: z.object({
    instagram: optionalUrl,
    linkedin: optionalUrl,
    tiktok: optionalUrl,
    youtube: optionalUrl,
    x: optionalUrl,
  }),
  skills: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
  education: z.array(z.string().trim().min(1).max(160)).max(20).optional(),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
