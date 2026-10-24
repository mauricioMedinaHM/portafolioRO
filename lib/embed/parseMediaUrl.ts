import type { ParsedMedia } from "@/lib/types";

const YOUTUBE_ID = "[A-Za-z0-9_-]{11}";

function link(originalUrl: string): ParsedMedia {
  return {
    provider: "link",
    id: null,
    embedUrl: null,
    thumbnailUrl: null,
    canEmbed: false,
    originalUrl,
  };
}

function parseTimestamp(value: string | null): number | null {
  if (!value) return null;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return null;
  if (/^\d+$/.test(trimmed)) {
    const seconds = Number(trimmed);
    return seconds > 0 ? seconds : null;
  }
  const match = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(trimmed);
  if (!match || (!match[1] && !match[2] && !match[3])) return null;
  const seconds =
    Number(match[1] ?? 0) * 3600 +
    Number(match[2] ?? 0) * 60 +
    Number(match[3] ?? 0);
  return seconds > 0 ? seconds : null;
}

function readStart(url: URL): number | null {
  const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
  return (
    parseTimestamp(url.searchParams.get("start")) ??
    parseTimestamp(url.searchParams.get("t")) ??
    parseTimestamp(hash.get("start")) ??
    parseTimestamp(hash.get("t"))
  );
}

function youtubeEmbed(id: string, start: number | null): string {
  const base = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  return start ? `${base}&start=${start}` : base;
}

function parseYouTube(url: URL, host: string, originalUrl: string): ParsedMedia | null {
  const isYouTube =
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com" ||
    host === "youtube-nocookie.com" ||
    host === "youtu.be";
  if (!isYouTube) return null;

  let id: string | null = null;
  if (host === "youtu.be") {
    const slug = url.pathname.split("/").filter(Boolean)[0] ?? "";
    if (new RegExp(`^${YOUTUBE_ID}$`).test(slug)) id = slug;
  } else {
    const fromQuery = url.searchParams.get("v") ?? "";
    if (new RegExp(`^${YOUTUBE_ID}$`).test(fromQuery)) {
      id = fromQuery;
    } else {
      const match = url.pathname.match(
        new RegExp(`^/(?:embed|shorts|live|v)/(${YOUTUBE_ID})(?:/|$)`),
      );
      id = match?.[1] ?? null;
    }
  }

  if (!id) return link(originalUrl);

  return {
    provider: "youtube",
    id,
    embedUrl: youtubeEmbed(id, readStart(url)),
    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    canEmbed: true,
    originalUrl,
  };
}

function parseVimeo(url: URL, host: string, originalUrl: string): ParsedMedia | null {
  if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;

  let id: string | null = null;
  let hash: string | null = null;

  if (host === "player.vimeo.com") {
    const match = url.pathname.match(/^\/video\/(\d+)/);
    id = match?.[1] ?? null;
    hash = url.searchParams.get("h");
  } else {
    const root = url.pathname.match(/^\/(\d+)(?:\/([A-Za-z0-9]+))?\/?$/);
    const channel = url.pathname.match(/^\/channels\/[^/]+\/(\d+)\/?$/);
    const group = url.pathname.match(/^\/groups\/[^/]+\/videos\/(\d+)\/?$/);
    if (root) {
      id = root[1] ?? null;
      hash = root[2] ?? null;
    } else if (channel) {
      id = channel[1] ?? null;
    } else if (group) {
      id = group[1] ?? null;
    }
    hash = hash || url.searchParams.get("h");
  }

  if (!id) return link(originalUrl);

  const params = new URLSearchParams();
  if (hash) params.set("h", hash);
  params.set("autoplay", "1");

  return {
    provider: "vimeo",
    id,
    embedUrl: `https://player.vimeo.com/video/${id}?${params.toString()}`,
    thumbnailUrl: null,
    canEmbed: true,
    originalUrl,
  };
}

function parseDrive(url: URL, host: string, originalUrl: string): ParsedMedia | null {
  if (host !== "drive.google.com") return null;

  const folder = url.pathname.match(/\/folders\/([A-Za-z0-9_-]+)/);
  if (folder?.[1]) {
    const id = folder[1];
    return {
      provider: "drive",
      id,
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(id)}#grid`,
      thumbnailUrl: null,
      // La grilla embebida no se usa en el celular: la tarjeta abre el link.
      canEmbed: false,
      originalUrl,
    };
  }

  const fromPath = url.pathname.match(/\/file\/d\/([A-Za-z0-9_-]+)/)?.[1];
  const fromQuery = url.searchParams.get("id");
  const id =
    fromPath ??
    (fromQuery && /^[A-Za-z0-9_-]{10,}$/.test(fromQuery) ? fromQuery : null);
  if (!id) return link(originalUrl);

  return {
    provider: "drive",
    id,
    embedUrl: `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`,
    thumbnailUrl: `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w800`,
    canEmbed: true,
    originalUrl,
  };
}

function parsePhotos(host: string, originalUrl: string): ParsedMedia | null {
  if (host !== "photos.google.com" && host !== "photos.app.goo.gl") return null;
  return {
    provider: "gphotos",
    id: null,
    embedUrl: null,
    thumbnailUrl: null,
    canEmbed: false,
    originalUrl,
  };
}

const IMAGE_EXT = /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i;
const VIDEO_EXT = /\.(m4v|mov|mp4|ogg|webm)$/i;

function parseImage(url: URL, originalUrl: string): ParsedMedia | null {
  const host = url.hostname.toLowerCase();
  const isSupabase = host.endsWith(".supabase.co") && url.pathname.includes("/storage/");
  const isUnsplash = host === "images.unsplash.com" || host === "plus.unsplash.com";
  const isFile = IMAGE_EXT.test(url.pathname) || VIDEO_EXT.test(url.pathname);
  if (!isSupabase && !isUnsplash && !isFile) return null;

  return {
    provider: "image",
    id: null,
    embedUrl: null,
    thumbnailUrl: originalUrl,
    canEmbed: true,
    originalUrl,
  };
}

export function parseMediaUrl(url: string): ParsedMedia {
  const originalUrl = url.trim();
  if (!originalUrl) return link(originalUrl);

  let parsed: URL;
  try {
    parsed = new URL(originalUrl);
  } catch {
    return link(originalUrl);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return link(originalUrl);
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  return (
    parseYouTube(parsed, host, originalUrl) ??
    parseVimeo(parsed, host, originalUrl) ??
    parseDrive(parsed, host, originalUrl) ??
    parsePhotos(host, originalUrl) ??
    parseImage(parsed, originalUrl) ??
    link(originalUrl)
  );
}
