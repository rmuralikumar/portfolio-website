import { footerNav, site } from "@/data/site";

import CurrentYear from "./CurrentYear";

const BUILD_YEAR = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#hero" className="brand-logo" aria-label={`${site.name} - Home`}>
              <span className="brand-title">
                {site.brand}
                <span className="brand-reg">®</span>
              </span>
            </a>
            <p className="footer-tagline">Web Developer | WordPress Developer</p>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            <ul className="footer-links">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; <CurrentYear buildYear={BUILD_YEAR} /> {site.name}. All rights reserved.
          </p>

          <div className="footer-socials">
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <span className="footer-dot" aria-hidden="true">
              •
            </span>
            <a href={site.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <span className="footer-dot" aria-hidden="true">
              •
            </span>
            <a href={site.emailComposeUrl} target="_blank" rel="noopener noreferrer">
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
