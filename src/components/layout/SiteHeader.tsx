"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { CloseIcon, GitHubIcon, GmailIcon, LinkedInIcon } from "@/components/icons";
import { desktopNav, mobileNav, site } from "@/data/site";

const DESKTOP_BREAKPOINT = 992;

// ---- Small browser subscriptions (read through useSyncExternalStore) ----

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const isScrolled = () => window.scrollY > 30;

function subscribeToClock(onChange: () => void) {
  const timer = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(timer);
}

const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: site.timeZone,
});

const localTime = () => timeFormat.format(new Date());

// ---- Scroll spy: highlight the nav link of the section in the middle of the viewport ----

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0]);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[visible.length - 1].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}

const SPY_SECTIONS = ["hero", "about", "skills", "projects", "services", "education", "learning", "contact"];

export default function SiteHeader() {
  const scrolled = useSyncExternalStore(subscribeToScroll, isScrolled, () => false);
  const time = useSyncExternalStore(subscribeToClock, localTime, () => "");
  const activeSection = useActiveSection(SPY_SECTIONS);

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  // False when the drawer closes because a nav link was chosen: the browser then continues
  // keyboard navigation from that section, so focus must not jump back to the toggle
  const restoreFocus = useRef(true);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeMenuForNavigation = () => {
    restoreFocus.current = false;
    setMenuOpen(false);
  };

  // Lock page scroll, move focus into the drawer and back out again
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      if (wasOpen.current && restoreFocus.current) toggleRef.current?.focus();
      restoreFocus.current = true;
    }
    wasOpen.current = menuOpen;
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Escape closes, Tab stays inside the open drawer, and widening to desktop closes it
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onResize = () => {
      if (window.innerWidth > DESKTOP_BREAKPOINT) closeMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen, closeMenu]);

  return (
    <>
      <header className={`site-header${scrolled ? " scrolled" : ""}`} id="site-header">
        <div className="container nav-container">
          <a href="#hero" className="brand-logo" aria-label={`${site.name} - Home`}>
            <span className="brand-title">
              {site.brand}
              <span className="brand-reg">®</span>
            </span>
          </a>

          <div className="header-right-group">
            <div className="availability-meta">
              <div className="status-pill">
                <span className="pulse-dot" aria-hidden="true" />
                <span className="status-text">Available for projects</span>
              </div>
              <span className="status-timeline">CURRENTLY OPEN</span>
            </div>

            <div className="time-meta">
              <span className="time-value">
                <span className="sr-only">Local time in India: </span>
                {time || " "}
              </span>
              <span className="time-zone">({site.timeZoneLabel})</span>
            </div>

            <nav className="desktop-nav" aria-label="Main navigation">
              <ul className="nav-list">
                {desktopNav.map((item) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={`nav-link${isActive ? " active" : ""}`}
                        aria-current={isActive ? "location" : undefined}
                      >
                        {item.label.toUpperCase()}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <a href="#contact" className="btn-pill nav-cta">
              LET&apos;S TALK
            </a>

            <button
              ref={toggleRef}
              type="button"
              className={`mobile-toggle${menuOpen ? " active" : ""}`}
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="hamburger-line line-1" />
              <span className="hamburger-line line-2" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-drawer${menuOpen ? " open" : ""}`}
        id="mobile-drawer"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="mobile-drawer-backdrop" onClick={closeMenu} />
        <div
          ref={drawerRef}
          className="mobile-drawer-inner"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="mobile-drawer-header">
            <span className="brand-title">
              {site.brand}
              <span className="brand-reg">®</span>
            </span>
            <button
              ref={closeRef}
              type="button"
              className="mobile-drawer-close"
              aria-label="Close navigation menu"
              onClick={closeMenu}
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="mobile-nav" aria-label="Mobile navigation">
            <ul className="mobile-nav-list">
              {mobileNav.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`mobile-nav-link${isActive ? " active" : ""}`}
                      aria-current={isActive ? "location" : undefined}
                      onClick={closeMenuForNavigation}
                    >
                      {item.label.toUpperCase()}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mobile-drawer-footer">
            <a href="#contact" className="btn btn-primary btn-full mobile-cta" onClick={closeMenuForNavigation}>
              LET&apos;S TALK
            </a>
            <div className="mobile-socials">
              <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (opens in a new tab)">
                <GitHubIcon className="brand-icon-github" />
              </a>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in a new tab)">
                <LinkedInIcon className="brand-icon-linkedin" />
              </a>
              <a
                href={site.emailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Email ${site.name} (opens in a new tab)`}
              >
                <GmailIcon className="brand-icon-gmail" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
