import ContactForm from "@/components/contact/ContactForm";
import { GitHubIcon, GmailIcon, LinkedInIcon, PhoneIcon } from "@/components/icons";
import { site } from "@/data/site";

export default function Contact({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="contact-cta-banner reveal-on-scroll">
          <span className="banner-badge">(GET IN TOUCH)</span>
          <h2 className="banner-title">LET&apos;S BUILD SOMETHING TOGETHER</h2>
          <p className="banner-text">
            Have a project, opportunity, or role in mind? I&apos;d be happy to connect and discuss how I can
            contribute.
          </p>
        </div>

        <div className="contact-layout">
          <div className="contact-info-col reveal-on-scroll">
            <h3 className="contact-subheading">CONTACT INFORMATION</h3>
            <p className="contact-info-desc">
              Feel free to reach out via phone, email, or direct social message. I am actively open to discussing
              developer roles, freelance projects, and collaborations.
            </p>

            <div className="contact-card-list">
              <a className="contact-method-card" href={site.phone.href}>
                <div className="method-icon-box">
                  <PhoneIcon size={22} className="brand-icon-phone" />
                </div>
                <div className="method-content">
                  <span className="method-label">Phone</span>
                  <span className="method-value">{site.phone.display}</span>
                </div>
              </a>

              <a
                className="contact-method-card"
                href={site.emailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Email ${site.email} (opens in a new tab)`}
              >
                <div className="method-icon-box">
                  <GmailIcon size={22} className="brand-icon-gmail" />
                </div>
                <div className="method-content">
                  <span className="method-label">Email</span>
                  <span className="method-value">{site.email}</span>
                </div>
              </a>
            </div>

            <div className="contact-social-buttons">
              <a
                href={site.emailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm contact-social-btn"
              >
                <GmailIcon size={18} className="brand-icon-gmail" />
                <span>Email Me</span>
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm contact-social-btn"
              >
                <LinkedInIcon size={18} className="brand-icon-linkedin" />
                <span>LinkedIn</span>
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm contact-social-btn"
              >
                <GitHubIcon size={18} className="brand-icon-github" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          <div className="contact-form-col reveal-on-scroll" data-delay="200">
            <div className="form-wrapper">
              <h3 className="form-title">SEND A MESSAGE</h3>
              <p className="form-subtitle">Fill in your details below and I will respond as soon as possible.</p>
              <ContactForm siteKey={turnstileSiteKey} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
