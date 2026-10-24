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
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#F7F1EA",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "#F3DDD4",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: -100,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "#E4E8DC",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "#C2553A",
            color: "#FFFFFF",
            fontSize: 84,
            fontWeight: 700,
            marginBottom: 44,
          }}
        >
          RT
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#1F1A17",
            letterSpacing: "-0.02em",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 34,
            color: "#C2553A",
            fontWeight: 500,
          }}
        >
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    { ...size },
  );
}
