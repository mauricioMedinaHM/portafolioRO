import { IntroLoader } from "@/components/pop/intro-loader";
import { ScrollProgress } from "@/components/ui";
import { CategorySection } from "@/components/sections/category-section";
import { Contact } from "@/components/sections/contact";
import { FloatingContact } from "@/components/sections/floating-contact";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Intro } from "@/components/sections/intro";
import { NavBar, type NavAnchor } from "@/components/sections/nav-bar";
import { Services, type Stat } from "@/components/sections/services";
import { Trayectoria } from "@/components/sections/trayectoria";
import { WorksBand } from "@/components/sections/works-band";
import { getLandingData } from "@/lib/data/content";
import { SITE_URL } from "@/lib/site";

// Página estática: el contenido sale de `contenido.ts` en cada build/deploy.

export default async function Home() {
  const { profile, categories, projects } = await getLandingData();

  const visibleCategories = categories;
  const published = projects;
  const featured = published.filter((p) => p.isFeatured);

  const withProjects = visibleCategories
    .map((category) => ({
      category,
      projects: published.filter((p) => p.categoryId === category.id),
    }))
    .filter((group) => group.projects.length > 0);

  const anchors: NavAnchor[] = [
    { href: "#inicio", label: "Inicio" },
    { href: "#sobre-mi", label: "Sobre mí" },
    { href: "#trabajos", label: "Trabajos" },
    { href: "#servicios", label: "Qué hago" },
    ...withProjects.map(({ category }) => ({
      href: `#${category.slug}`,
      label: category.name,
    })),
    { href: "#formacion", label: "Formación" },
    { href: "#contacto", label: "Contacto" },
  ];

  // Cifras calculadas desde el contenido publicado (sin números inventados).
  const videos = published.filter((p) => p.url);
  const experiences = published.filter((p) => !p.url);
  const stats: Stat[] = [
    { value: String(videos.length), label: "Videos y vivos" },
    { value: String(withProjects.length), label: "Áreas de trabajo" },
    { value: String(experiences.length), label: "Proyectos y experiencias" },
    { value: String(new Set(published.map((p) => p.date?.slice(0, 4)).filter(Boolean)).size || 1), label: "Años de coberturas" },
  ];
  const spotlight = featured.find((p) => p.thumbnailUrl) ?? videos[0];
  const backdrop = published
    .flatMap((project) =>
      project.thumbnailUrl ? [{ src: project.thumbnailUrl, alt: project.title }] : [],
    )
    .slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    description: profile.tagline,
    email: profile.email ?? undefined,
    image: new URL(profile.photoUrl, SITE_URL).toString(),
    url: SITE_URL,
    jobTitle: "Conductora y comunicadora audiovisual",
    sameAs: Object.values(profile.socials).filter(Boolean),
  };

  return (
    <div data-theme="pop" className="bg-cream text-cocoa">
      <ScrollProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IntroLoader name={profile.fullName} />
      <NavBar name={profile.fullName} anchors={anchors} siteUrl={SITE_URL} />
      <main id="contenido">
        <Hero profile={profile} />
        <Intro
          profile={profile}
          categories={withProjects.map(({ category }) => category)}
          spotlight={featured[1] ?? spotlight}
        />
        <WorksBand groups={withProjects} />
        <Services stats={stats} backdrop={backdrop} />
        {withProjects.map(({ category, projects: list }) => (
          <CategorySection
            key={category.id}
            category={category}
            projects={list}
          />
        ))}
        <Trayectoria profile={profile} />
        <Contact profile={profile} />
      </main>
      <FloatingContact whatsapp={profile.whatsapp} />
      <Footer name={profile.fullName} />
    </div>
  );
}
