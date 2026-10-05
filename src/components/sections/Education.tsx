import { GraduationIcon } from "@/components/icons";
import { education } from "@/data/content";

export default function Education() {
  return (
    <section className="section education-section" id="education">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-subtitle">(ACADEMICS)</span>
          <h2 className="section-title">EDUCATION</h2>
          <div className="section-divider" />
        </div>

        <div className="education-grid">
          <div className="education-card reveal-on-scroll">
            <div className="education-icon-box">
              <GraduationIcon />
            </div>

            <div className="education-details">
              <div className="education-duration">
                <span>({education.years})</span>
              </div>
              <h3 className="education-degree">{education.degree}</h3>
              <p className="education-institution">{education.institution}</p>
              <p className="education-affiliation">
                Affiliated to <strong>{education.university}</strong>
              </p>
              <p className="education-notes">{education.notes}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
