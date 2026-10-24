import { expect, test } from "@playwright/test";

test.describe("admin sin sesión", () => {
  test("/admin redirige al login", async ({ page }) => {
    const response = await page.goto("/admin");
    expect(response?.url()).toContain("/admin/login");
    await expect(page.getByText("Panel de administración")).toBeVisible();
  });

  test("/admin/categorias redirige al login", async ({ page }) => {
    const response = await page.goto("/admin/categorias");
    expect(response?.url()).toContain("/admin/login");
  });
});
