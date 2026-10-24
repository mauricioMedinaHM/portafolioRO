import { About } from "@/components/sections/about";
import { CategorySection } from "@/components/sections/category-section";
import { Contact } from "@/components/sections/contact";
import { FeaturedCarousel } from "@/components/sections/featured-carousel";
import { FloatingContact } from "@/components/sections/floating-contact";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { NavBar, type NavAnchor } from "@/components/sections/nav-bar";
import { ShareSection } from "@/components/sections/share-section";
import { getLandingData } from "@/lib/data/queries";
import { SITE_URL } from "@/lib/site";

// ISR: se sirve estática y se actualiza al guardar desde el admin
// (revalidatePath) o cada 5 minutos como respaldo.
export const revalidate = 300;

export default async function Home() {
  const { profile, categories, projects } = await getLandingData();

  const visibleCategories = [...categories]
    .filter((c) => c.isVisible)
    .sort((a, b) => a.position - b.position);
  const published = [...projects]
    .filter((p) => p.isPublished)
    .sort((a, b) => a.position - b.position);
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
    ...(featured.length > 0
      ? [{ href: "#destacados", label: "Destacados" }]
      : []),
    ...withProjects.map(({ category }) => ({
      href: `#${category.slug}`,
      label: category.name,
    })),
    { href: "#compartir", label: "Compartir" },
    { href: "#contacto", label: "Contacto" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    description: profile.tagline,
    email: profile.email ?? undefined,
    image: profile.photoUrl ?? undefined,
    url: SITE_URL,
    jobTitle: "Conductora y comunicadora audiovisual",
    sameAs: Object.values(profile.socials).filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavBar name={profile.fullName} anchors={anchors} siteUrl={SITE_URL} />
      <main id="contenido">
        <Hero
          profile={profile}
          firstCategorySlug={withProjects[0]?.category.slug}
        />
        <About profile={profile} />
        {featured.length > 0 ? (
          <FeaturedCarousel projects={featured} />
        ) : null}
        {withProjects.map(({ category, projects: list }) => (
          <CategorySection
            key={category.id}
            category={category}
            projects={list}
          />
        ))}
        <ShareSection url={SITE_URL} title={profile.fullName} />
        <Contact profile={profile} />
      </main>
      <FloatingContact whatsapp={profile.whatsapp} />
      <Footer name={profile.fullName} />
    </>
  );
}
