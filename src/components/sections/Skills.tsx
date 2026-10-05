import { SkillGlyph } from "@/components/icons";
import { skillGroups } from "@/data/content";

const delays = ["", "100", "200"];

export default function Skills() {
  return (
    <section className="section skills-section" id="skills">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-subtitle">(CORE COMPETENCIES)</span>
          <h2 className="section-title">TECHNICAL SKILLS</h2>
          <div className="section-divider" />
        </div>

        <div className="skills-grid">
          {skillGroups.map((group, index) => (
            <div
              className="skill-card reveal-on-scroll"
              key={group.title}
              data-delay={delays[index % delays.length] || undefined}
            >
              <div className="skill-card-icon">
                <SkillGlyph icon={group.icon} />
              </div>
              <h3 className="skill-card-title">{group.title}</h3>
              <ul className="skill-list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
