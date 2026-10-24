import { afterEach, describe, expect, it, vi } from "vitest";

import type { ParsedMedia } from "@/lib/types";

import { parseMediaUrl } from "./parseMediaUrl";
import { resolveThumbnail } from "./thumbnails";

const DRIVE_FILE = "1AbC2dEf3GhI4jKl5MnO6pQr7StU8vWx9";
const DRIVE_FOLDER = "1FolderIdExample0000000000001";

function youtube(id: string, originalUrl: string, start?: number): ParsedMedia {
  const embed = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${
    start ? `&start=${start}` : ""
  }`;
  return {
    provider: "youtube",
    id,
    embedUrl: embed,
    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    canEmbed: true,
    originalUrl,
  };
}

function driveFile(originalUrl: string, id = DRIVE_FILE): ParsedMedia {
  return {
    provider: "drive",
    id,
    embedUrl: `https://drive.google.com/file/d/${id}/preview`,
    thumbnailUrl: `https://drive.google.com/thumbnail?id=${id}&sz=w800`,
    canEmbed: true,
    originalUrl,
  };
}

function driveFolder(originalUrl: string, id = DRIVE_FOLDER): ParsedMedia {
  return {
    provider: "drive",
    id,
    embedUrl: `https://drive.google.com/embeddedfolderview?id=${id}#grid`,
    thumbnailUrl: null,
    canEmbed: false,
    originalUrl,
  };
}

function vimeo(id: string, originalUrl: string, hash?: string): ParsedMedia {
  const query = hash ? `h=${hash}&autoplay=1` : "autoplay=1";
  return {
    provider: "vimeo",
    id,
    embedUrl: `https://player.vimeo.com/video/${id}?${query}`,
    thumbnailUrl: null,
    canEmbed: true,
    originalUrl,
  };
}

function photos(originalUrl: string): ParsedMedia {
  return {
    provider: "gphotos",
    id: null,
    embedUrl: null,
    thumbnailUrl: null,
    canEmbed: false,
    originalUrl,
  };
}

function image(originalUrl: string): ParsedMedia {
  return {
    provider: "image",
    id: null,
    embedUrl: null,
    thumbnailUrl: originalUrl,
    canEmbed: true,
    originalUrl,
  };
}

function externalLink(originalUrl: string): ParsedMedia {
  return {
    provider: "link",
    id: null,
    embedUrl: null,
    thumbnailUrl: null,
    canEmbed: false,
    originalUrl,
  };
}

const cases: Array<{ name: string; input: string; expected: ParsedMedia }> = [
  {
    name: "youtube watch",
    input: "https://www.youtube.com/watch?v=a1b2c3d4e5f",
    expected: youtube("a1b2c3d4e5f", "https://www.youtube.com/watch?v=a1b2c3d4e5f"),
  },
  {
    name: "youtube watch con t en segundos",
    input: "https://www.youtube.com/watch?v=q1w2e3r4t5y&t=42",
    expected: youtube("q1w2e3r4t5y", "https://www.youtube.com/watch?v=q1w2e3r4t5y&t=42", 42),
  },
  {
    name: "youtube watch con t=1m30s",
    input: "https://www.youtube.com/watch?v=a1b2c3d4e5f&t=1m30s",
    expected: youtube("a1b2c3d4e5f", "https://www.youtube.com/watch?v=a1b2c3d4e5f&t=1m30s", 90),
  },
  {
    name: "youtube watch con t=1h2m3s",
    input: "https://m.youtube.com/watch?v=a1b2c3d4e5f&t=1h2m3s",
    expected: youtube("a1b2c3d4e5f", "https://m.youtube.com/watch?v=a1b2c3d4e5f&t=1h2m3s", 3723),
  },
  {
    name: "youtu.be",
    input: "https://youtu.be/z9y8x7w6v5u",
    expected: youtube("z9y8x7w6v5u", "https://youtu.be/z9y8x7w6v5u"),
  },
  {
    name: "youtu.be con t",
    input: "https://youtu.be/q1w2e3r4t5y?t=42",
    expected: youtube("q1w2e3r4t5y", "https://youtu.be/q1w2e3r4t5y?t=42", 42),
  },
  {
    name: "youtu.be con hash t",
    input: "https://youtu.be/q1w2e3r4t5y#t=30s",
    expected: youtube("q1w2e3r4t5y", "https://youtu.be/q1w2e3r4t5y#t=30s", 30),
  },
  {
    name: "youtube shorts",
    input: "https://www.youtube.com/shorts/z9y8x7w6v5u",
    expected: youtube("z9y8x7w6v5u", "https://www.youtube.com/shorts/z9y8x7w6v5u"),
  },
  {
    name: "youtube shorts con query",
    input: "https://www.youtube.com/shorts/z9y8x7w6v5u?feature=share",
    expected: youtube("z9y8x7w6v5u", "https://www.youtube.com/shorts/z9y8x7w6v5u?feature=share"),
  },
  {
    name: "youtube live",
    input: "https://www.youtube.com/live/a1b2c3d4e5f",
    expected: youtube("a1b2c3d4e5f", "https://www.youtube.com/live/a1b2c3d4e5f"),
  },
  {
    name: "youtube embed",
    input: "https://www.youtube.com/embed/a1b2c3d4e5f",
    expected: youtube("a1b2c3d4e5f", "https://www.youtube.com/embed/a1b2c3d4e5f"),
  },
  {
    name: "youtube embed con start",
    input: "https://www.youtube.com/embed/a1b2c3d4e5f?start=15",
    expected: youtube("a1b2c3d4e5f", "https://www.youtube.com/embed/a1b2c3d4e5f?start=15", 15),
  },
  {
    name: "youtube http",
    input: "http://www.youtube.com/watch?v=a1b2c3d4e5f",
    expected: youtube("a1b2c3d4e5f", "http://www.youtube.com/watch?v=a1b2c3d4e5f"),
  },
  {
    name: "youtube con espacios",
    input: "  https://youtu.be/q1w2e3r4t5y?t=42  ",
    expected: youtube("q1w2e3r4t5y", "https://youtu.be/q1w2e3r4t5y?t=42", 42),
  },
  {
    name: "youtube music",
    input: "https://music.youtube.com/watch?v=q1w2e3r4t5y",
    expected: youtube("q1w2e3r4t5y", "https://music.youtube.com/watch?v=q1w2e3r4t5y"),
  },
  {
    name: "youtube nocookie embed",
    input: "https://www.youtube-nocookie.com/embed/q1w2e3r4t5y",
    expected: youtube("q1w2e3r4t5y", "https://www.youtube-nocookie.com/embed/q1w2e3r4t5y"),
  },
  {
    name: "youtube watch con parametros extra",
    input: "https://www.youtube.com/watch?v=a1b2c3d4e5f&list=PL123&index=2",
    expected: youtube(
      "a1b2c3d4e5f",
      "https://www.youtube.com/watch?v=a1b2c3d4e5f&list=PL123&index=2",
    ),
  },
  {
    name: "drive archivo con usp=sharing",
    input: `https://drive.google.com/file/d/${DRIVE_FILE}/view?usp=sharing`,
    expected: driveFile(`https://drive.google.com/file/d/${DRIVE_FILE}/view?usp=sharing`),
  },
  {
    name: "drive open?id",
    input: `https://drive.google.com/open?id=${DRIVE_FILE}`,
    expected: driveFile(`https://drive.google.com/open?id=${DRIVE_FILE}`),
  },
  {
    name: "drive uc?id",
    input: `https://drive.google.com/uc?id=${DRIVE_FILE}&export=download`,
    expected: driveFile(`https://drive.google.com/uc?id=${DRIVE_FILE}&export=download`),
  },
  {
    name: "drive archivo http",
    input: `http://drive.google.com/file/d/${DRIVE_FILE}/view`,
    expected: driveFile(`http://drive.google.com/file/d/${DRIVE_FILE}/view`),
  },
  {
    name: "drive archivo con espacios",
    input: `  https://drive.google.com/file/d/${DRIVE_FILE}/view?usp=sharing  `,
    expected: driveFile(`https://drive.google.com/file/d/${DRIVE_FILE}/view?usp=sharing`),
  },
  {
    name: "drive preview",
    input: `https://drive.google.com/file/d/${DRIVE_FILE}/preview`,
    expected: driveFile(`https://drive.google.com/file/d/${DRIVE_FILE}/preview`),
  },
  {
    name: "drive carpeta con usp=sharing",
    input: `https://drive.google.com/drive/folders/${DRIVE_FOLDER}?usp=sharing`,
    expected: driveFolder(`https://drive.google.com/drive/folders/${DRIVE_FOLDER}?usp=sharing`),
  },
  {
    name: "drive carpeta u/0",
    input: `https://drive.google.com/drive/u/0/folders/${DRIVE_FOLDER}`,
    expected: driveFolder(`https://drive.google.com/drive/u/0/folders/${DRIVE_FOLDER}`),
  },
  {
    name: "google fotos corto",
    input: "https://photos.app.goo.gl/aBcDeFgHiJkLmNoPq",
    expected: photos("https://photos.app.goo.gl/aBcDeFgHiJkLmNoPq"),
  },
  {
    name: "google fotos share",
    input: "https://photos.google.com/share/AF1QipMockShareId/photo/AF1QipMockPhotoId?key=ABC",
    expected: photos(
      "https://photos.google.com/share/AF1QipMockShareId/photo/AF1QipMockPhotoId?key=ABC",
    ),
  },
  {
    name: "google fotos photo",
    input: "https://photos.google.com/photo/AF1QipMockPhotoId",
    expected: photos("https://photos.google.com/photo/AF1QipMockPhotoId"),
  },
  {
    name: "vimeo id",
    input: "https://vimeo.com/112233445",
    expected: vimeo("112233445", "https://vimeo.com/112233445"),
  },
  {
    name: "vimeo id con hash",
    input: "https://vimeo.com/112233445/ab12cd34",
    expected: vimeo("112233445", "https://vimeo.com/112233445/ab12cd34", "ab12cd34"),
  },
  {
    name: "player vimeo",
    input: "https://player.vimeo.com/video/112233445",
    expected: vimeo("112233445", "https://player.vimeo.com/video/112233445"),
  },
  {
    name: "player vimeo con hash",
    input: "https://player.vimeo.com/video/112233445?h=ab12cd34",
    expected: vimeo("112233445", "https://player.vimeo.com/video/112233445?h=ab12cd34", "ab12cd34"),
  },
  {
    name: "vimeo http",
    input: "http://vimeo.com/112233445",
    expected: vimeo("112233445", "http://vimeo.com/112233445"),
  },
  {
    name: "vimeo canal",
    input: "https://vimeo.com/channels/staffpicks/112233445",
    expected: vimeo("112233445", "https://vimeo.com/channels/staffpicks/112233445"),
  },
  {
    name: "imagen en un storage (jpg)",
    input: "https://cdn.example.com/media/retrato.jpg",
    expected: image("https://cdn.example.com/media/retrato.jpg"),
  },
  {
    name: "imagen png http",
    input: "http://example.com/foto.png",
    expected: image("http://example.com/foto.png"),
  },
  {
    name: "imagen unsplash",
    input: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200",
    expected: image("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200"),
  },
  {
    name: "video subido mp4",
    input: "https://cdn.example.com/media/reel.mp4",
    expected: image("https://cdn.example.com/media/reel.mp4"),
  },
  {
    name: "imagen webp con query",
    input: "https://cdn.example.com/a.webp?w=800",
    expected: image("https://cdn.example.com/a.webp?w=800"),
  },
  {
    name: "link generico",
    input: "https://www.lanacion.com.ar/espectaculos/entrevista-ejemplo-nid01012026/",
    expected: externalLink(
      "https://www.lanacion.com.ar/espectaculos/entrevista-ejemplo-nid01012026/",
    ),
  },
  {
    name: "texto invalido",
    input: "hola esto no es un link",
    expected: externalLink("hola esto no es un link"),
  },
  {
    name: "vacio",
    input: "   ",
    expected: externalLink(""),
  },
  {
    name: "playlist de youtube sin video",
    input: "https://www.youtube.com/playlist?list=PL123",
    expected: externalLink("https://www.youtube.com/playlist?list=PL123"),
  },
  {
    name: "ftp no es embed",
    input: "ftp://example.com/foto.jpg",
    expected: externalLink("ftp://example.com/foto.jpg"),
  },
];

describe("parseMediaUrl", () => {
  it("cubre al menos 25 URLs", () => {
    expect(cases.length).toBeGreaterThanOrEqual(25);
  });

  it.each(cases)("$name", ({ input, expected }) => {
    expect(parseMediaUrl(input)).toEqual(expected);
  });
});

describe("resolveThumbnail", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("devuelve la miniatura de YouTube sin red", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const parsed = parseMediaUrl("https://www.youtube.com/watch?v=a1b2c3d4e5f");
    await expect(resolveThumbnail(parsed)).resolves.toBe(parsed.thumbnailUrl);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("lee el thumbnail de oEmbed de Vimeo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        expect(String(input)).toContain("https://vimeo.com/api/oembed.json?url=");
        expect(String(input)).toContain(encodeURIComponent("https://vimeo.com/112233445/ab12cd34"));
        return new Response(
          JSON.stringify({ thumbnail_url: "https://i.vimeocdn.com/video/123.jpg" }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }),
    );
    const parsed = parseMediaUrl("https://vimeo.com/112233445/ab12cd34");
    await expect(resolveThumbnail(parsed)).resolves.toBe("https://i.vimeocdn.com/video/123.jpg");
  });

  it("lee og:image de Google Fotos", async () => {
    const html =
      '<html><head><meta property="og:image" content="https://lh3.googleusercontent.com/abc?size=800&amp;x=1"></head></html>';
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(html, {
            status: 200,
            headers: { "content-type": "text/html; charset=utf-8" },
          }),
      ),
    );
    const parsed = parseMediaUrl("https://photos.app.goo.gl/aBcDeFgHiJkLmNoPq");
    await expect(resolveThumbnail(parsed)).resolves.toBe(
      "https://lh3.googleusercontent.com/abc?size=800&x=1",
    );
  });

  it("devuelve null si oEmbed o la pagina fallan", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("timeout");
      }),
    );
    const vimeo = parseMediaUrl("https://vimeo.com/112233445");
    const photos = parseMediaUrl("https://photos.google.com/photo/AF1QipMockPhotoId");
    await expect(resolveThumbnail(vimeo)).resolves.toBeNull();
    await expect(resolveThumbnail(photos)).resolves.toBeNull();
  });
});
