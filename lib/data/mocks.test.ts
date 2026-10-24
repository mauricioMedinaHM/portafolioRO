import { describe, expect, it } from "vitest";
import { mockCategories, mockProfile, mockProjects } from "@/lib/data/mocks";
import { cn } from "@/lib/utils";

describe("mocks (contenido real de la clienta)", () => {
  it("el perfil tiene nombre, tagline, contacto y trayectoria", () => {
    expect(mockProfile.id).toBe(1);
    expect(mockProfile.fullName.length).toBeGreaterThan(0);
    expect(mockProfile.tagline.length).toBeGreaterThan(0);
    expect(mockProfile.whatsapp).toMatch(/^\+/);
    expect((mockProfile.education ?? []).length).toBeGreaterThan(0);
    expect((mockProfile.skills ?? []).length).toBeGreaterThan(0);
  });

  it("hay 5 categorías y la primera es Conducción", () => {
    expect(mockCategories).toHaveLength(5);
    expect(mockCategories[0].slug).toBe("conduccion");
    expect(
      mockCategories.every((c) => c.isVisible && c.slug.length > 0),
    ).toBe(true);
  });

  it("cada proyecto referencia una categoría existente", () => {
    const ids = new Set(mockCategories.map((c) => c.id));
    for (const p of mockProjects) {
      expect(ids.has(p.categoryId)).toBe(true);
    }
  });

  it("los que tienen video llevan link http; los de experiencia van sin URL", () => {
    for (const p of mockProjects) {
      if (p.provider === "youtube") {
        expect(p.url).toMatch(/^https?:\/\//);
        expect(p.isPublished).toBe(true);
      } else {
        // items de experiencia / próximos videos: publicados como tarjeta de texto
        expect(p.provider).toBe("link");
        expect(p.url).toBe("");
        expect(p.isPublished).toBe(true);
      }
    }
  });

  it("hay destacados para la sección opcional", () => {
    expect(mockProjects.some((p) => p.isFeatured)).toBe(true);
  });
});

describe("cn", () => {
  it("une clases y resuelve conflictos de tailwind", () => {
    expect(cn("px-2", "px-4", "text-sm")).toBe("px-4 text-sm");
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});
