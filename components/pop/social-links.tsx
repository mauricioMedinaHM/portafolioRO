import { ArrowUpRight } from "lucide-react";
import type { ProjectLink, ProjectSocials } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Glifo de Instagram: cuadrado redondeado + círculo + punto. */
export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Glifo de LinkedIn: 'in' simple en cuadrado redondeado. */
export function LinkedinGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M4 3.5A2.5 2.5 0 1 0 4 8.5 2.5 2.5 0 0 0 4 3.5Z" />
      <rect x="1.9" y="9.5" width="4.2" height="11" rx="0.4" />
      <path d="M9 9.5h4v1.5c.6-1 1.8-1.8 3.4-1.8 3 0 4.1 1.9 4.1 5v6.3h-4.2v-5.6c0-1.4-.5-2.3-1.7-2.3-1 0-1.5.7-1.7 1.4-.1.2-.1.6-.1.9v5.6H9c.1-10 0-11 0-11Z" />
    </svg>
  );
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

const PILL =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-bold transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cocoa";

export function ProjectSocialLinks({
  socials,
  links = [],
  title,
  className,
  size = "sm",
}: {
  socials: ProjectSocials;
  /** Otros perfiles del proyecto: Instagram en tangerine, el resto en lila. */
  links?: ProjectLink[];
  title: string;
  className?: string;
  /** "lg" = mismo alto que los botones de sección (48px). */
  size?: "sm" | "lg";
}) {
  const pill = cn(PILL, size === "lg" && "min-h-12 px-5 text-[15px]");
  const hasInstagram = Boolean(socials.instagram);
  const hasLinkedin = Boolean(socials.linkedin);
  if (!hasInstagram && !hasLinkedin && links.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {hasInstagram ? (
        <a
          href={socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Instagram de ${title}`}
          className={cn(pill, "bg-sun text-cocoa")}
        >
          <InstagramGlyph />
          Instagram
        </a>
      ) : null}
      {hasLinkedin ? (
        <a
          href={socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`LinkedIn de ${title}`}
          className={cn(pill, "bg-cocoa text-cream")}
        >
          <LinkedinGlyph />
          LinkedIn
        </a>
      ) : null}
      {links.map((link) => {
        const isInstagram = /(^|\.)instagram\.com$/i.test(hostOf(link.url));
        return (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label} (${isInstagram ? "Instagram" : "enlace"}), de ${title}`}
            className={cn(pill, isInstagram ? "bg-sun text-cocoa" : "bg-candy text-cocoa")}
          >
            {isInstagram ? <InstagramGlyph /> : <ArrowUpRight className="size-4" aria-hidden />}
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
