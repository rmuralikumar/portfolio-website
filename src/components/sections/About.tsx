import { coreTechnologies } from "@/data/content";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function About() {
  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-subtitle">(PROFILE & BACKGROUND)</span>
          <h2 className="section-title">ABOUT ME</h2>
          <div className="section-divider" />
        </div>

        {/* Recruiter / ATS professional summary */}
        <div className="summary-card reveal-on-scroll">
          <div className="summary-badge">PROFESSIONAL SUMMARY</div>
          <p className="summary-text">
            Web Developer and WordPress Developer with hands-on experience building responsive, user-friendly websites
            and web apps using <strong>Next.js</strong>, <strong>React</strong>, <strong>TypeScript</strong>, semantic{" "}
            <strong>HTML5</strong>, modern <strong>CSS3</strong> (Flexbox, Grid, custom properties),{" "}
            <strong>JavaScript</strong>, <strong>WordPress</strong>, and <strong>Elementor</strong>. Skilled in the
            full WordPress workflow: CMS setup and architecture, theme customization, child themes, plugin
            configuration, custom CSS styling, and building pixel-accurate layouts with <strong>Elementor</strong>.
            Delivered {projects.length} web and WordPress projects, including bus and movie ticket booking platforms,
            a conversational AI web app, websites for cafes, a dental clinic, a tattoo studio, a photography studio and
            a gym, and digital studio, agency and SaaS landing pages. Proficient in{" "}
            <strong>layout troubleshooting</strong> and <strong>cross-browser debugging</strong>. Applies{" "}
            <strong>generative AI tools</strong> and <strong>prompt engineering</strong> in projects.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-content reveal-on-scroll">
            <h3 className="about-heading">Building clean, responsive, and purposeful web solutions.</h3>

            <p className="about-text">
              I am a Web Developer and WordPress Developer with a strong academic foundation in Computer Applications
              (B.Com CA, 2023–2026). My development work centers on creating clean, intuitive frontend interfaces and
              dependable WordPress websites.
            </p>

            <p className="about-text">
              I have practical experience building diverse website types, including booking platforms, an AI web app,
              local business websites for cafes, clinics and studios, and agency and SaaS landing pages. I specialize
              in turning design requirements into fully responsive, accessible, and standards-compliant code.
            </p>

            <p className="about-text">
              Passionate about continuous technical learning, I actively explore modern frontend practices, performance
              optimization, and AI-assisted developer workflows to deliver efficient web solutions.
            </p>

            <div className="about-highlights">
              <div className="highlight-item">
                <span className="highlight-number">{projects.length}</span>
                <span className="highlight-label">Web &amp; WordPress Projects</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-number">100%</span>
                <span className="highlight-label">Responsive Layouts</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-number">2026</span>
                <span className="highlight-label">B.Com (Computer Applications)</span>
              </div>
            </div>
          </div>

          <div className="about-visual reveal-on-scroll" data-delay="200">
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="avatar-box" aria-hidden="true">
                  <span className="avatar-initials">M</span>
                </div>
                <div className="avatar-meta">
                  <p className="avatar-name">{site.name.toUpperCase()}</p>
                  <p className="avatar-role">Web Developer | WordPress Developer</p>
                </div>
              </div>

              <div className="profile-card-body">
                <p className="profile-badge-title">Core Technologies & Stack</p>
                <ul className="tech-chip-grid">
                  {coreTechnologies.map((tech) => (
                    <li className="tech-chip" key={tech}>
                      <span className="tech-dot" aria-hidden="true" /> {tech}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="profile-card-footer">
                <div className="availability-status">
                  <span className="pulse-indicator" aria-hidden="true" />
                  <span>Available for Opportunities & Projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
