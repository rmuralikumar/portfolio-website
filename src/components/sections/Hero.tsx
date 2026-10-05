import { site } from "@/data/site";

export default function Hero() {
  return (
    <section className="hero-section" id="hero">
      <div className="container">
        <div className="nakula-hero-header reveal-on-scroll">
          <div className="nakula-title-col">
            <h1 className="nakula-huge-title">
              {site.brand}
              <span className="sr-only"> - {site.name}, {site.role}</span>
            </h1>
            <p className="nakula-hero-role-headline">{site.role}</p>
            <p className="nakula-hero-subtitle">
              I build responsive, high-performance websites and custom WordPress experiences with clean interfaces,
              modern frontend technologies, and a focus on usability.
            </p>

            <div className="hero-cta-group">
              <a href="#projects" className="btn btn-primary hero-btn">
                VIEW MY WORK
              </a>
              <a href="#contact" className="btn btn-secondary hero-btn">
                LET&apos;S CONNECT
              </a>
            </div>
          </div>

          <div className="nakula-meta-col">
            <div className="meta-row">
              <span className="meta-tag">(YEAR)</span>
              <span className="meta-val">2026</span>
            </div>
            <div className="meta-row">
              <span className="meta-tag">(ROLE)</span>
              <span className="meta-val">Web Developer • WordPress</span>
            </div>
            <div className="meta-row">
              <span className="meta-tag">(CORE TECH)</span>
              <span className="meta-val">Next.js • React • WordPress</span>
            </div>
            <div className="meta-row">
              <span className="meta-tag">(CONNECT)</span>
              <div className="hero-social-links">
                <a href={site.github} target="_blank" rel="noopener noreferrer" className="hero-social-link">
                  GitHub <span aria-hidden="true">↗</span>
                </a>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="hero-social-link">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
                <a href={site.emailComposeUrl} target="_blank" rel="noopener noreferrer" className="hero-social-link">
                  Email <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
