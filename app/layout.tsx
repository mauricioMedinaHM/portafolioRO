import type { Metadata, Viewport } from "next";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource/mr-dafoe/latin-400.css";
import { Providers } from "@/components/providers";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

const DESCRIPTION =
  "Portafolio de Rosario Tejerina Pittis: conducción en vivo, streaming, móviles y coberturas, radio y comunicación audiovisual desde Salta, Argentina.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "conductora",
    "locutora",
    "comunicadora audiovisual",
    "Salta",
    "Argentina",
    "streaming",
    "televisión",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f6ffe9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body className="min-h-svh bg-paper font-sans text-ink antialiased">
        <a
          href="#contenido"
          className="sr-only z-50 bg-ink px-5 py-3 font-medium text-paper focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:outline-2 focus:outline-offset-2 focus:outline-paper"
        >
          Saltar al contenido
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
