import { PopContainer, PopHeading } from "@/components/pop/heading";
import { perfil } from "@/contenido";
import { IntroLoader } from "@/components/pop/intro-loader";
import { ScrollProgress } from "@/components/ui";
import { CategorySection } from "@/components/sections/category-section";
import { Contact } from "@/components/sections/contact";
import { FloatingContact } from "@/components/sections/floating-contact";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { ABOUT_LINKS, Intro } from "@/components/sections/intro";
import { NavBar, type NavAnchor } from "@/components/sections/nav-bar";
import { Services, type Stat } from "@/components/sections/services";
import { Trayectoria } from "@/components/sections/trayectoria";
import { WorksBand } from "@/components/sections/works-band";
import { getLandingData } from "@/lib/data/content";
import { SITE_URL } from "@/lib/site";

const LIVE_SLUGS = new Set(["conduccion", "streaming", "generacion-tech"]);

export default async function Home() {
  const { profile, categories, projects } = await getLandingData();

  const featured = projects.filter((project) => project.isFeatured);

  const withProjects = categories
    .map((category) => ({
      category,
      projects: projects.filter((p) => p.categoryId === category.id),
    }))
    .filter((group) => group.projects.length > 0);

  const liveGroups = withProjects.filter(({ category }) => LIVE_SLUGS.has(category.slug));
  const otherGroups = withProjects.filter(({ category }) => !LIVE_SLUGS.has(category.slug));

  const anchors: NavAnchor[] = [
    { href: "#inicio", label: "Inicio" },
    { href: "#sobre-mi", label: "Sobre mí" },
    ...ABOUT_LINKS.map(({ href, label }) => ({ href, label, parentHref: "#sobre-mi" })),
    { href: "#en-vivo", label: "Trabajos en vivo" },
    ...liveGroups.map(({ category }) => ({
      href: "#" + category.slug,
      label: category.name,
      parentHref: "#en-vivo",
    })),
    ...otherGroups.map(({ category }) => ({
      href: "#" + category.slug,
      label: category.name,
    })),
    { href: "#contacto", label: "Contacto" },
  ];

  const coverageYears = new Set(withProjects.flatMap(({ category, projects: entries }) => {
    if (!LIVE_SLUGS.has(category.slug) && category.slug !== "eventos") return [];
    return entries.flatMap(({ date }) => date ? [date.slice(0, 4)] : []);
  }));
  const stats: Stat[] = [
    { value: String(perfil.transmisionesEnVivo), prefix: "+", label: "Transmisiones en vivo" },
    { value: String(projects.length), label: "Trabajos publicados" },
    { value: String(coverageYears.size), label: "Años con coberturas publicadas" },
  ];
  const { panelesDe30Dias, periodo, reelDeReferencia } = perfil.visualizaciones;
  const formatNumber = new Intl.NumberFormat("es-AR");
  const averageViews = Math.round(panelesDe30Dias.reduce((total, views) => total + views, 0) / panelesDe30Dias.length);
  const reach = {
    average: formatNumber.format(averageViews),
    sampleSize: panelesDe30Dias.length,
    period: periodo,
    reel: formatNumber.format(reelDeReferencia),
  };
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
        <div className="editorial-strip">
          <p>Conducción en vivo <span aria-hidden>·</span> Streaming <span aria-hidden>·</span> Entrevistas y coberturas</p>
        </div>
        <section id="sobre-mi" aria-labelledby="sobre-mi-titulo" className="scroll-mt-28 bg-honeydew/25 pb-3 md:pb-5">
          <Intro
            profile={profile}
            categories={withProjects.map(({ category }) => category)}
            spotlight={featured.find((project) => project.clipUrl) ?? featured[0]}
          />
          <Services stats={stats} skills={profile.skills ?? []} reach={reach} />
          <Trayectoria profile={profile} />
          <WorksBand groups={withProjects} />
        </section>
        {liveGroups.length > 0 && (
          <section id="en-vivo" aria-labelledby="en-vivo-titulo" className="scroll-mt-28 border-t border-seam bg-honeydew/50 pt-7 md:pt-10">
            <PopContainer className="text-center">
              <PopHeading><span id="en-vivo-titulo">Trabajos en vivo</span></PopHeading>
              <p className="mx-auto mt-3 max-w-xl text-cocoa-2">Conducción en estudio, transmisiones, entrevistas en campo y coberturas especiales.</p>
              <nav aria-label="Categorías de trabajos en vivo" className="mt-4 flex flex-wrap justify-center gap-1.5">
                {liveGroups.map(({ category }) => (
                  <a className="editorial-pill bg-cream text-cocoa" key={category.id} href={"#" + category.slug}>
                    {category.name}
                  </a>
                ))}
              </nav>
            </PopContainer>
            {liveGroups.map(({ category, projects: list }) => (
              <CategorySection
                key={category.id}
                category={category}
                projects={list}
                relatedLink={category.slug === "generacion-tech" ? { href: "#eventos-tech", label: "Ver Eventos Tech" } : undefined}
                asSubsection
              />
            ))}
          </section>
        )}
        {otherGroups.map(({ category, projects: list }) => {
          if (category.slug === "mundo-scout") {
            const [overview] = list;
            return (
              <div key={category.id} className="border-t border-seam bg-honeydew/50">
                <CategorySection
                  category={category}
                  overview={overview}
                  projects={[]}
                  relatedLink={{ href: "#eventos-scouts", label: "Ver Eventos scouts" }}
                />
              </div>
            );
          }
          if (category.slug === "eventos") {
            return (
              <div key={category.id} id="moviles" className="scroll-mt-28 border-y border-seam bg-honeydew/50">
                <CategorySection category={category} projects={list} />
              </div>
            );
          }
          return (
            <div key={category.id} id={category.slug === "experiencia" ? "extension" : undefined} className="scroll-mt-28">
              <CategorySection category={category} projects={list} />
            </div>
          );
        })}
        <Contact profile={profile} />
      </main>
      <FloatingContact whatsapp={profile.whatsapp} />
      <Footer name={profile.fullName} />
    </div>
  );
}
