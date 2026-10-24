import { describe, expect, it } from "vitest";
import { mockCategories, mockProfile, mockProjects } from "@/lib/data/mocks";
import { cn } from "@/lib/utils";
import type { MediaProvider } from "@/lib/types";

describe("mocks (contrato fase 0)", () => {
  it("el perfil tiene nombre y tagline", () => {
    expect(mockProfile.id).toBe(1);
    expect(mockProfile.fullName.length).toBeGreaterThan(0);
    expect(mockProfile.tagline.length).toBeGreaterThan(0);
  });

  it("hay 3 categorías y la primera es Conducción", () => {
    expect(mockCategories).toHaveLength(3);
    expect(mockCategories[0].slug).toBe("conduccion");
    expect(
      mockCategories.every((c) => c.isVisible && c.slug.length > 0),
    ).toBe(true);
  });

  it("hay 8 proyectos y cada uno referencia una categoría existente", () => {
    expect(mockProjects).toHaveLength(8);
    const ids = new Set(mockCategories.map((c) => c.id));
    for (const p of mockProjects) {
      expect(ids.has(p.categoryId)).toBe(true);
      expect(p.url.length).toBeGreaterThan(0);
    }
  });

  it("los providers cubren las variantes principales", () => {
    const providers = new Set<MediaProvider>(
      mockProjects.map((p) => p.provider),
    );
    for (const v of ["drive", "gphotos", "youtube", "vimeo", "link"] as const) {
      expect(providers.has(v)).toBe(true);
    }
  });
});

describe("cn", () => {
  it("une clases y resuelve conflictos de tailwind", () => {
    expect(cn("px-2", "px-4", "text-sm")).toBe("px-4 text-sm");
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});
