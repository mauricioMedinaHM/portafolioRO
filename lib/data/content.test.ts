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
    expect(profile.heroVideoUrl).toMatch(/^\/.+\.mp4$/);
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
    const customThumb = new Set(
      secciones.flatMap((seccion) =>
        seccion.trabajos.filter((trabajo) => trabajo.miniatura).map((trabajo) => trabajo.titulo),
      ),
    );
    const withLink = buildProjects().filter((p) => p.url && p.provider !== "instagram");
    expect(withLink.length).toBeGreaterThan(0);
    for (const p of withLink) {
      expect(p.provider).toBe("youtube");
      expect(p.embedUrl).toMatch(/youtube-nocookie\.com\/embed\//);
      if (customThumb.has(p.title)) expect(p.thumbnailUrl).toMatch(/^\//);
      else expect(p.thumbnailUrl).toMatch(/^https:\/\/i\.ytimg\.com\//);
    }
  });

  it("el fragmento local queda en la tarjeta y el link de YouTube sigue siendo el video completo", () => {
    const chaqueno = buildProjects().find((p) => p.title.includes("Chaqueño"));
    expect(chaqueno?.clipUrl).toBe("/trabajos/clips/chaqueno.mp4");
    expect(chaqueno?.provider).toBe("youtube");
    expect(chaqueno?.thumbnailUrl).toBe("/trabajos/chaqueno.jpg");
    expect(chaqueno?.clipStart).toBe(0);
  });

  it("clipInicio marca desde qué segundo arranca el bucle; valores raros quedan en 0", () => {
    const joseii = buildProjects().find((p) => p.title.includes("Joseii"));
    expect(joseii?.clipStart).toBe(2.5);
    const [sin, negativo, nan] = buildProjects([
      {
        nombre: "X",
        ancla: "x",
        trabajos: [
          { titulo: "Sin inicio", clip: "/trabajos/clips/a.mp4" },
          { titulo: "Negativo", clip: "/trabajos/clips/a.mp4", clipInicio: -1 },
          { titulo: "NaN", clip: "/trabajos/clips/a.mp4", clipInicio: Number.NaN },
        ],
      },
    ]);
    expect([sin.clipStart, negativo.clipStart, nan.clipStart]).toEqual([0, 0, 0]);
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
          { titulo: "Reel", link: "https://www.instagram.com/reel/DenJBl1CFQd/?vrfl=x" },
          { titulo: "Perfil de Instagram", link: "https://www.instagram.com/aonayamana811" },
          { titulo: "Sin link" },
        ],
      },
    ];
    expect(buildProjects(prueba).map((p) => p.provider)).toEqual([
      "youtube",
      "vimeo",
      "drive",
      "image",
      "instagram",
      "link",
      "link",
    ]);
    const reel = buildProjects(prueba)[4];
    expect(reel.embedUrl).toBe("https://www.instagram.com/reel/DenJBl1CFQd/embed/");
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
    for (const p of projects) {
      for (const paragraph of (p.description ?? "").split("\n\n")) {
        expect(paragraph.length).toBeLessThanOrEqual(320);
      }
    }
  });

  it("el contenido trae las 6 secciones y los videos de Generación Tech", () => {
    expect(secciones).toHaveLength(6);
    const gt = buildProjects().filter((p) => p.categoryId === "cat-generacion-tech");
    expect(gt.filter((p) => p.provider === "youtube")).toHaveLength(4);
    const cat = buildCategories().find((c) => c.slug === "generacion-tech");
    expect(cat?.channel?.url).toMatch(/youtube\.com\/@generaciontech/);
  });

  it("miniatura propia y enlaces: se limpian los parámetros de rastreo", () => {
    const [p] = buildProjects([
      {
        nombre: "X",
        ancla: "x",
        trabajos: [
          {
            titulo: "Scout",
            link: "https://www.instagram.com/reel/abc/",
            miniatura: "/trabajos/x.jpg",
            enlaces: [
              { nombre: "Zona", link: "https://www.instagram.com/zona27.saac?mdxt=ajc2" },
              { nombre: "", link: "https://x.com" },
              { nombre: "Roto", link: "no-es-link" },
            ],
          },
        ],
      },
    ]);
    expect(p.thumbnailUrl).toBe("/trabajos/x.jpg");
    expect(p.links).toEqual([{ label: "Zona", url: "https://www.instagram.com/zona27.saac" }]);
  });

  it("las redes vacías del proyecto no se muestran; las cargadas sí", () => {
    const [vacio, cargado] = buildProjects([
      {
        nombre: "X",
        ancla: "x",
        trabajos: [
          { titulo: "A", redes: { instagram: "", linkedin: "" } },
          { titulo: "B", redes: { instagram: "https://instagram.com/x", linkedin: "nope" } },
        ],
      },
    ]);
    expect(vacio.socials).toEqual({});
    expect(cargado.socials).toEqual({ instagram: "https://instagram.com/x" });
  });
});

describe("cn", () => {
  it("une clases y resuelve conflictos de tailwind", () => {
    expect(cn("px-2", "px-4", "text-sm")).toBe("px-4 text-sm");
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});
