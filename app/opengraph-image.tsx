import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const runtime = "edge";
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          background: "#FAFAF8",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#6B6A64",
          }}
        >
          Salta · Argentina
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 84,
            lineHeight: 0.92,
            color: "#161616",
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 28,
            width: 96,
            height: 2,
            background: "#161616",
          }}
        />
        <div
          style={{
            marginTop: 22,
            fontSize: 28,
            color: "#55544F",
          }}
        >
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    { ...size },
  );
}
