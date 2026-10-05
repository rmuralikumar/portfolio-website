import ProjectShowcase from "@/components/projects/ProjectShowcase";

export default function Projects() {
  return (
    <section className="section projects-section" id="projects" aria-labelledby="projects-heading">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-subtitle">(PORTFOLIO SHOWCASE)</span>
          <h2 className="section-title" id="projects-heading">
            SELECTED PROJECTS
          </h2>
          <div className="section-divider" />
        </div>

        <ProjectShowcase />
      </div>
    </section>
  );
}
