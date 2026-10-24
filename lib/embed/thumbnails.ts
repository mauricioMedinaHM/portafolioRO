import type { ParsedMedia } from "@/lib/types";

const THUMBNAIL_TIMEOUT_MS = 4000;
const HTML_SCAN_LIMIT = 250_000;

function assertServerOnly(): void {
  if (typeof window !== "undefined") {
    throw new Error("resolveThumbnail solo puede ejecutarse en el servidor");
  }
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function toHttpUrl(value: string, base: string): string | null {
  try {
    const url = new URL(decodeHtml(value).trim(), base);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function extractOgImage(html: string, pageUrl: string): string | null {
  const sample = html.slice(0, HTML_SCAN_LIMIT);
  const patterns = [
    /<meta\b[^>]*\bproperty\s*=\s*["']og:image(?::secure_url|:url)?["'][^>]*\bcontent\s*=\s*["']([^"']+)["'][^>]*>/i,
    /<meta\b[^>]*\bcontent\s*=\s*["']([^"']+)["'][^>]*\bproperty\s*=\s*["']og:image(?::secure_url|:url)?["'][^>]*>/i,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(sample);
    if (!match?.[1]) continue;
    const resolved = toHttpUrl(match[1], pageUrl);
    if (resolved) return resolved;
  }
  return null;
}

async function fetchVimeoThumbnail(pageUrl: string): Promise<string | null> {
  const endpoint = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(pageUrl)}`;
  const response = await fetch(endpoint, {
    headers: { accept: "application/json" },
    redirect: "follow",
    signal: AbortSignal.timeout(THUMBNAIL_TIMEOUT_MS),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { thumbnail_url?: unknown };
  return typeof data.thumbnail_url === "string" && data.thumbnail_url
    ? toHttpUrl(data.thumbnail_url, pageUrl)
    : null;
}

async function fetchPhotosThumbnail(pageUrl: string): Promise<string | null> {
  const response = await fetch(pageUrl, {
    headers: {
      accept: "text/html",
      "user-agent":
        "Mozilla/5.0 (compatible; PortafolioRO/1.0; +https://portafolio.local)",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(THUMBNAIL_TIMEOUT_MS),
  });
  if (!response.ok) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType && !/html|xml/i.test(contentType)) return null;
  return extractOgImage(await response.text(), response.url || pageUrl);
}

export async function resolveThumbnail(parsed: ParsedMedia): Promise<string | null> {
  assertServerOnly();

  try {
    if (parsed.provider === "vimeo") return await fetchVimeoThumbnail(parsed.originalUrl);
    if (parsed.provider === "gphotos") return await fetchPhotosThumbnail(parsed.originalUrl);
  } catch {
    return null;
  }

  return parsed.thumbnailUrl;
}
