import { services } from "@/data/content";

export default function Services() {
  return (
    <section className="section services-section" id="services">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-subtitle">(CAPABILITIES)</span>
          <h2 className="section-title">WHAT I CAN DO</h2>
          <div className="section-divider" />
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div
              className="service-card reveal-on-scroll"
              key={service.title}
              data-delay={index > 0 ? String(index * 100) : undefined}
            >
              <div className="service-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
