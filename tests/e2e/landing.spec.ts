import { expect, test } from "@playwright/test";

test.describe("landing", () => {
  test("no hay scroll horizontal", async ({ page }) => {
    await page.goto("/");
    const { scrollW, clientW } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    expect(scrollW).toBeLessThanOrEqual(clientW);
  });

  test("hero muestra nombre y CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Rosario");
    await expect(page.getByRole("link", { name: "Ver su trabajo" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "WhatsApp" }).first(),
    ).toBeVisible();
  });

  test("el menú muestra anclas y navega", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menú" }).click();
    const menu = page.getByRole("dialog");
    await expect(menu.getByRole("link", { name: "Contacto" })).toBeVisible();
    await menu.getByRole("link", { name: "Conducción" }).click();
    await expect(page).toHaveURL(/#conduccion$/);
    await expect(menu).not.toBeVisible();
  });

  test("las categorías con contenido tienen ancla", async ({ page }) => {
    await page.goto("/");
    for (const id of ["conduccion", "streaming", "moviles", "compartir", "contacto"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test("los iframes solo cargan después del tap (facade)", async ({ page }) => {
    await page.goto("/");
    expect(await page.locator("iframe").count()).toBe(0);
    await page
      .locator("#conduccion button[aria-label^='Reproducir']")
      .first()
      .click();
    await expect(page.locator("iframe").first()).toHaveAttribute(
      "src",
      /youtube-nocookie\.com\/embed\//,
    );
  });

  test("el QR se renderiza y ofrece descarga", async ({ page }) => {
    await page.goto("/#compartir");
    await expect(page.locator("#compartir canvas")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Descargar QR/ }),
    ).toBeVisible();
  });

  test("los ítems de experiencia se ven como tarjetas de texto", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Mi Huella Verde" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "SK Promociones" }),
    ).toBeVisible();
  });

  test("contacto tiene WhatsApp y mail", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#contacto");
    await expect(
      section.getByRole("link", { name: /WhatsApp/ }),
    ).toHaveAttribute("href", /wa\.me\/\d+\?text=/);
    await expect(
      section.getByRole("link", { name: /@/ }),
    ).toHaveAttribute("href", /mailto:/);
  });
});
