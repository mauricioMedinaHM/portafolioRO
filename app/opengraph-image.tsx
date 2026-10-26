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
          background: "#F6FFE9",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#290087",
            fontWeight: 700,
          }}
        >
          Al aire desde Salta · Argentina
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 96,
            lineHeight: 0.9,
            fontWeight: 900,
            textTransform: "uppercase",
            color: "#290087",
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 28,
            width: 140,
            height: 14,
            borderRadius: 999,
            background: "#A230A4",
          }}
        />
        <div
          style={{
            marginTop: 22,
            fontSize: 28,
            color: "#4B2FBE",
          }}
        >
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    { ...size },
  );
}
