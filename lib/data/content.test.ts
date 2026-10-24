import { describe, expect, it } from "vitest";
import { secciones, type Seccion } from "@/contenido";
import { buildCategories, buildProfile, buildProjects } from "@/lib/data/content";
import { cn } from "@/lib/utils";

describe("contenido.ts → datos de la landing", () => {
  it("el perfil tiene nombre, rol, contacto y trayectoria", () => {
    const profile = buildProfile();
    expect(profile.fullName.length).toBeGreaterThan(0);
    expect(profile.tagline.length).toBeGreaterThan(0);
    expect(profile.whatsapp).toMatch(/^\+\d+$/);
    expect(profile.photoUrl).toMatch(/^\//);
    expect((profile.education ?? []).length).toBeGreaterThan(0);
    expect((profile.skills ?? []).length).toBeGreaterThan(0);
  });

  it("las anclas de las secciones son únicas y válidas", () => {
    const slugs = buildCategories().map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
    expect(slugs[0]).toBe("conduccion");
  });

  it("los ids de los trabajos son únicos y referencian su sección", () => {
    const ids = new Set(buildCategories().map((c) => c.id));
    const projects = buildProjects();
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
    for (const p of projects) expect(ids.has(p.categoryId)).toBe(true);
  });

  it("un link de YouTube se convierte en embed + miniatura sin tocar nada más", () => {
    const projects = buildProjects();
    const withLink = projects.filter((p) => p.url);
    expect(withLink.length).toBeGreaterThan(0);
    for (const p of withLink) {
      expect(p.provider).toBe("youtube");
      expect(p.embedUrl).toMatch(/youtube-nocookie\.com\/embed\//);
      expect(p.thumbnailUrl).toMatch(/^https:\/\/i\.ytimg\.com\//);
    }
  });

  it("detecta cada tipo de link pegado", () => {
    const prueba: Seccion[] = [
      {
        nombre: "Prueba",
        ancla: "prueba",
        trabajos: [
          { titulo: "YouTube corto", link: "https://youtu.be/ZQqAU7r413U" },
          { titulo: "Vimeo", link: "https://vimeo.com/76979871" },
          { titulo: "Drive", link: "https://drive.google.com/file/d/1AbCdEfGhIjKlMn/view?usp=sharing" },
          { titulo: "Imagen", link: "https://example.com/foto.jpg" },
          { titulo: "Otro sitio", link: "https://www.instagram.com/p/abc/" },
          { titulo: "Sin link" },
        ],
      },
    ];
    expect(buildProjects(prueba).map((p) => p.provider)).toEqual([
      "youtube",
      "vimeo",
      "drive",
      "image",
      "link",
      "link",
    ]);
  });

  it("sin link queda como tarjeta de experiencia; fechas inválidas se ignoran", () => {
    const [nota, mala] = buildProjects([
      {
        nombre: "X",
        ancla: "x",
        trabajos: [{ titulo: "Nota" }, { titulo: "Fecha rara", fecha: "octubre" }],
      },
    ]);
    expect(nota.url).toBe("");
    expect(nota.embedUrl).toBeNull();
    expect(mala.date).toBeNull();
  });

  it("hay destacados y las descripciones son breves", () => {
    const projects = buildProjects();
    expect(projects.some((p) => p.isFeatured)).toBe(true);
    for (const p of projects) expect((p.description ?? "").length).toBeLessThanOrEqual(280);
  });

  it("el contenido trae las 5 secciones del CV", () => {
    expect(secciones).toHaveLength(5);
  });
});

describe("cn", () => {
  it("une clases y resuelve conflictos de tailwind", () => {
    expect(cn("px-2", "px-4", "text-sm")).toBe("px-4 text-sm");
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});
