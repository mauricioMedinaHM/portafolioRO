import { ExternalLink, Mail, MessageCircle } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import { buttonVariants, Reveal, Section } from "@/components/ui";
import { WHATSAPP_MESSAGE, whatsappLink } from "@/lib/links";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Contact({ profile }: { profile: Profile }) {
  const wa = profile.whatsapp
    ? whatsappLink(profile.whatsapp, WHATSAPP_MESSAGE)
    : null;
  const socials = Object.entries(profile.socials).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );
  if (!wa && !profile.email && socials.length === 0) return null;

  return (
    <Section
      id="contacto"
      title="Contacto"
      intro="¿Charlamos? Escribime por el canal que te quede más cómodo."
    >
      <Reveal>
        <div className="flex w-full max-w-md flex-col gap-3">
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants(), "w-full")}
            >
              <MessageCircle className="size-5" aria-hidden />
              Escribime por WhatsApp
            </a>
          ) : null}
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            >
              <Mail className="size-5" aria-hidden />
              {profile.email}
            </a>
          ) : null}
        </div>
      </Reveal>

      {socials.length > 0 ? (
        <Reveal delay={0.05}>
          <ul className="mt-8 flex flex-wrap gap-3" aria-label="Redes sociales">
            {socials.map(([network, href]) => (
              <li key={network}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium text-foreground capitalize transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {network === "instagram" ? (
                    <InstagramIcon className="size-4" />
                  ) : (
                    <ExternalLink className="size-4" aria-hidden />
                  )}
                  {network === "x" ? "X (Twitter)" : network}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}
    </Section>
  );
}
