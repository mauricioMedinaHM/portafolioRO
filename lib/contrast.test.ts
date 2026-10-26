import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");

function channel(hex: string, index: number) {
  const value = parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const [r, g, b] = [0, 1, 2].map((index) => channel(hex, index));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Relación WCAG 2.x entre un color de texto y su fondo. */
export function contrastRatio(foreground: string, background: string) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function token(css: string, name: string) {
  if (name === "white") return "#FFFFFF";
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Falta --color-${name} en app/globals.css`);
  return match[1].toUpperCase();
}

/**
 * Cada par es una combinación de texto/fondo que la UI usa de verdad.
 * El texto normal (menos de 18pt) pide al menos 4.5:1.
 */
const USED_PAIRS = [
  ["ink / paper", "ink", "paper"],
  ["ink-2 / paper", "ink-2", "paper"],
  ["ink-3 / paper", "ink-3", "paper"],
  ["ink / paper-2", "ink", "paper-2"],
  ["ink-3 / paper-2", "ink-3", "paper-2"],
  ["paper / ink", "paper", "ink"],
  ["mist / ink", "mist", "ink"],
  ["paper / ink-hover", "paper", "ink-hover"],
  // Paleta Honeydew / Vanilla / Periwinkle / Amethyst / Ultramarine
  ["cocoa(ultramarine) / cream(honeydew)", "cocoa", "cream"],
  ["cocoa / peach(vanilla)", "cocoa", "peach"],
  ["cocoa / blush", "cocoa", "blush"],
  ["cocoa / candy(periwinkle)", "cocoa", "candy"],
  ["cocoa-2 / cream", "cocoa-2", "cream"],
  ["cocoa-2 / peach", "cocoa-2", "peach"],
  ["cocoa-2 / blush", "cocoa-2", "blush"],
  ["cocoa-2 / candy", "cocoa-2", "candy"],
  ["sun-deep(ultramarine) / cream", "sun-deep", "cream"],
  ["sun-deep / peach", "sun-deep", "peach"],
  ["sun-deep / candy", "sun-deep", "candy"],
  ["rose-deep / blush", "rose-deep", "blush"],
  ["cream / sun-deep (botones)", "cream", "sun-deep"],
  ["cream / sun-hover", "cream", "sun-hover"],
  ["cream / cocoa (banda de trabajos)", "cream", "cocoa"],
  ["white / sun-deep (FAB)", "white", "sun-deep"],
  // Texto claro sobre rellenos Amethyst (sun/amber): siempre Honeydew/cream
  ["cream / sun (píldoras e íconos)", "cream", "sun"],
  ["cream / amber (cifras)", "cream", "amber"],
  ["cocoa / candy (píldoras de enlaces)", "cocoa", "candy"],
] as const;

/** Texto grande (≥24px o ≥18.66px bold): alcanza 3:1. Titulares pop y script. */
const LARGE_PAIRS = [
  ["rose-ink(amethyst) / cream (script)", "rose-ink", "cream"],
  ["rose-ink / peach (script)", "rose-ink", "peach"],
  ["rose-ink / blush (script)", "rose-ink", "blush"],
  // Nombres de marca grandes: ultramarine siempre pasa, amethyst solo sobre claro
  ["cocoa / peach (titulares)", "cocoa", "peach"],
  ["sun-deep / blush (titulares)", "sun-deep", "blush"],
] as const;

function walk(dir: string, acc: string[] = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path, acc);
    else if (/\.(tsx|css)$/.test(entry)) acc.push(path);
  }
  return acc;
}

describe("contraste del texto", () => {
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");

  it.each(USED_PAIRS)("%s alcanza 4.5:1", (_label, fgName, bgName) => {
    const ratio = contrastRatio(token(css, fgName), token(css, bgName));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it.each(LARGE_PAIRS)("%s alcanza 3:1 (texto grande)", (_label, fgName, bgName) => {
    const ratio = contrastRatio(token(css, fgName), token(css, bgName));
    expect(ratio).toBeGreaterThanOrEqual(3);
  });

  it("no quedan nombres de la paleta anterior", () => {
    const forbidden = new RegExp(
      ["pl", "um"].join("") + "|" + ["lil", "ac"].join("") + "|" + ["tang", "erine"].join("") + "|" + ["but", "ter"].join(""),
      "i",
    );
    const hits: string[] = [];
    for (const file of [...walk(join(ROOT, "app")), ...walk(join(ROOT, "components"))]) {
      const source = readFileSync(file, "utf8");
      if (forbidden.test(source)) hits.push(relative(ROOT, file));
    }
    expect(hits).toEqual([]);
  });
});
