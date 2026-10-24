import { defineConfig } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    reducedMotion: "reduce",
  },
  webServer: {
    // Requiere `pnpm build` previo (ver script test:e2e).
    command: `pnpm start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: "mobile-360", use: { viewport: { width: 360, height: 800 }, hasTouch: true } },
    { name: "mobile-390", use: { viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: "mobile-430", use: { viewport: { width: 430, height: 932 }, hasTouch: true } },
    { name: "tablet-768", use: { viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "desktop-1280", use: { viewport: { width: 1280, height: 900 } } },
  ],
});
