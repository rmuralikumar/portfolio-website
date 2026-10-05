import { learningAreas } from "@/data/content";

export default function Learning() {
  return (
    <section className="section learning-section" id="learning">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-subtitle">(CONTINUOUS GROWTH)</span>
          <h2 className="section-title">LEARNING & DEVELOPMENT</h2>
          <div className="section-divider" />
        </div>

        <div className="learning-grid">
          {learningAreas.map((area, index) => (
            <div
              className="learning-card reveal-on-scroll"
              key={area.title}
              data-delay={index > 0 ? String(index * 100) : undefined}
            >
              <div className="learning-tag">ACTIVE PURSUIT</div>
              <h3 className="learning-title">{area.title}</h3>
              <p className="learning-desc">{area.description}</p>
              <p className="learning-focus">Focus: {area.focus}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
