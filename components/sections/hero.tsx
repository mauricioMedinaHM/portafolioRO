import { MessageCircle } from "lucide-react";
import { buttonVariants, Reveal } from "@/components/ui";
import { WHATSAPP_MESSAGE, whatsappLink } from "@/lib/links";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Hero({
  profile,
  firstCategorySlug,
}: {
  profile: Profile;
  firstCategorySlug?: string;
}) {
  const wa = profile.whatsapp ? whatsappLink(profile.whatsapp, WHATSAPP_MESSAGE) : null;

  return (
    <section id="inicio" className="relative scroll-mt-20 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-accent-soft/70 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-secondary-soft/80 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[88svh] w-full max-w-5xl flex-col items-center justify-center gap-6 px-5 py-14 text-center">
        <Reveal>
          {profile.heroVideoUrl ? (
            <video
              className="aspect-video w-full max-w-md rounded-3xl border border-border bg-foreground/5 object-cover shadow-lift"
              src={profile.heroVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              poster={profile.photoUrl ?? undefined}
            />
          ) : profile.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photoUrl}
              alt={profile.fullName}
              className="size-40 rounded-full border-4 border-surface object-cover shadow-lift sm:size-48"
              fetchPriority="high"
            />
          ) : (
            <div className="flex size-40 items-center justify-center rounded-full border-4 border-surface bg-accent font-display text-5xl text-white shadow-lift sm:size-48">
              {initials(profile.fullName)}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="font-display text-4xl leading-tight text-balance text-foreground sm:text-6xl">
            {profile.fullName}
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-lg font-medium text-accent-strong sm:text-xl">
            {profile.tagline}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
            {firstCategorySlug ? (
              <a
                href={`#${firstCategorySlug}`}
                className={cn(buttonVariants(), "w-full sm:w-auto")}
              >
                Ver mi trabajo
              </a>
            ) : null}
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "w-full sm:w-auto",
                )}
              >
                <MessageCircle className="size-4" aria-hidden />
                WhatsApp
              </a>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
