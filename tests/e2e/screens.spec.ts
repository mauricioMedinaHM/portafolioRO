import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

test("capturas de la landing a 390 y 1280", async ({ page }, testInfo) => {
  const project = testInfo.project.name;
  test.skip(
    project !== "mobile-390" && project !== "desktop-1280",
    "Solo se archivan 390 y 1280",
  );

  const width = project === "mobile-390" ? "390" : "1280";
  mkdirSync("docs/screens", { recursive: true });

  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("img", { name: /Retrato de Rosario/ })).toBeVisible();

  await page.screenshot({
    path: `docs/screens/hero-${width}.png`,
    fullPage: false,
  });
  await page.screenshot({
    path: `docs/screens/landing-${width}.png`,
    fullPage: true,
  });

  await page.waitForSelector("#intro-loader", { state: "detached", timeout: 12_000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `docs/screens/21st-hero-${width}.png`,
    fullPage: false,
  });
  await page.locator("#servicios").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `docs/screens/21st-servicios-${width}.png`,
    fullPage: false,
  });
  await page.locator("#formacion").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `docs/screens/21st-formacion-${width}.png`,
    fullPage: false,
  });
  await page.locator("#trabajos").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `docs/screens/21st-trabajos-${width}.png`,
    fullPage: false,
  });
});
