import RevealOnScroll from "@/components/layout/RevealOnScroll";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Education from "@/components/sections/Education";
import Hero from "@/components/sections/Hero";
import Learning from "@/components/sections/Learning";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Skills from "@/components/sections/Skills";
import { education } from "@/data/content";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

// Server-side check only: values are never printed
for (const name of ["TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY", "SMTP_PASSWORD"]) {
  if (!process.env[name]?.trim()) {
    console.warn(`[contact] ${name} is not set. Add it to .env (see .env.example) or to the Vercel environment variables.`);
  }
}

const personId = `${site.url}/#person`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      url: site.url,
      jobTitle: site.role,
      email: `mailto:${site.email}`,
      sameAs: [site.github, site.linkedin],
      knowsAbout: ["Next.js", "React", "TypeScript", "WordPress", "Elementor", "HTML5", "CSS3", "JavaScript"],
      alumniOf: { "@type": "CollegeOrUniversity", name: education.institution },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: `${site.name} Portfolio`,
      author: { "@id": personId },
    },
    {
      "@type": "ItemList",
      name: "Selected projects",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.name,
          description: project.description,
          url: project.liveUrl ?? `${site.url}/?project=${project.slug}`,
          keywords: project.tags.join(", "),
          creator: { "@id": personId },
        },
      })),
    },
  ],
};

export default function Home() {
  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY?.trim() ?? "";

  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
        <Education />
        <Learning />
        <Contact turnstileSiteKey={turnstileSiteKey} />
      </main>

      <SiteFooter />
      <RevealOnScroll />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
