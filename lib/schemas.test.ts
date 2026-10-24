import { describe, expect, it } from "vitest";
import { categorySchema, projectSchema, slugify } from "@/lib/schemas";

describe("slugify", () => {
  it("genera slugs válidos", () => {
    expect(slugify("Conducción")).toBe("conduccion");
    expect(slugify("Producción audiovisual")).toBe("produccion-audiovisual");
    expect(slugify("  Redes / Sociales!! ")).toBe("redes-sociales");
  });
});

describe("projectSchema", () => {
  const base = {
    title: "Test",
    categoryId: "cat-1",
    url: "https://youtu.be/abc12345678",
    isPublished: true,
    isFeatured: false,
  };

  it("acepta un proyecto válido", () => {
    expect(projectSchema.safeParse(base).success).toBe(true);
  });

  it("rechaza URLs no http y descripciones largas", () => {
    expect(
      projectSchema.safeParse({ ...base, url: "ftp://x" }).success,
    ).toBe(false);
    expect(
      projectSchema.safeParse({ ...base, description: "x".repeat(281) }).success,
    ).toBe(false);
  });
});

describe("categorySchema", () => {
  it("valida el formato del slug", () => {
    const ok = categorySchema.safeParse({
      name: "Conducción",
      slug: "conduccion",
      skills: [],
      isVisible: true,
    });
    const bad = categorySchema.safeParse({
      name: "Conducción",
      slug: "Conducción!",
      skills: [],
      isVisible: true,
    });
    expect(ok.success).toBe(true);
    expect(bad.success).toBe(false);
  });
});
