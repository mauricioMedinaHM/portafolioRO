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
    await expect(page.getByRole("link", { name: "Ver mi trabajo" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "WhatsApp" }).first(),
    ).toBeVisible();
  });

  test("el menú muestra anclas y navega", async ({ page, viewport }) => {
    await page.goto("/");
    if ((viewport?.width ?? 0) >= 1024) {
      // Desktop: navegación principal visible en el header (sin botón Menú).
      const nav = page.getByRole("navigation", { name: "Principal" });
      await nav.getByRole("link", { name: "Trayectoria" }).click();
      await expect(page).toHaveURL(/#trayectoria$/);
      return;
    }
    await page.getByRole("button", { name: "Menú" }).click();
    const menu = page.getByRole("dialog");
    await expect(menu.getByRole("link", { name: "Contacto" })).toBeVisible();
    await menu.getByRole("link", { name: "Conducción" }).click();
    await expect(page).toHaveURL(/#conduccion$/);
    await expect(menu).not.toBeVisible();
  });

  test("las categorías con contenido tienen ancla", async ({ page }) => {
    await page.goto("/");
    for (const id of ["conduccion", "streaming", "moviles", "trabajos", "servicios", "trayectoria", "contacto"]) {
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

  test("el botón QR del header abre el pop-up con QR y descarga", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mostrar QR del portafolio" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator("canvas")).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: /Descargar QR/ }),
    ).toBeVisible();
  });

  test("los ítems de experiencia se ven como tarjetas de texto", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Mi Huella Verde" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /SK Promociones/ }),
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

  test("con reduced motion el hero queda visible", async ({ page }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(page.getByRole("img", { name: /Retrato de Rosario/ })).toBeVisible();
    const opacity = await h1.evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
  });

  test("la banda de trabajos enlaza a cada área", async ({ page }) => {
    await page.goto("/");
    const band = page.locator("#trabajos");
    await expect(band.getByRole("heading", { name: /Trabajos destacados/i })).toBeVisible();
    await expect(band.locator('a[href="#conduccion"]').first()).toBeAttached();
  });

  test("el botón Menú tiene área táctil >= 44px", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) >= 1024, "En desktop se usa la navegación principal");
    await page.goto("/");
    const box = await page.getByRole("button", { name: "Menú" }).boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  });
});
