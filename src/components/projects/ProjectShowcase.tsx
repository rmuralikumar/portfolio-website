"use client";

import Image from "next/image";
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";

import { projectCategories, projectHost, projects, type Project, type ProjectCategory } from "@/data/projects";

import ProjectDetail from "./ProjectDetail";

type Filter = "all" | ProjectCategory;

const PARAM = "project";
const NAVIGATE_EVENT = "portfolio:navigate";
// Marks history entries created by opening a project, so "Back to projects" can pop them
const HISTORY_MARK = "__portfolioProject";
const MAX_CARD_TAGS = 3;

// ---- The open project lives in the URL (?project=<slug>) ----

function subscribeToUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(NAVIGATE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(NAVIGATE_EVENT, onChange);
  };
}

const slugFromUrl = () => new URLSearchParams(window.location.search).get(PARAM);

function writeProjectToUrl(slug: string | null, mode: "push" | "replace") {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set(PARAM, slug);
  else url.searchParams.delete(PARAM);
  url.hash = "";

  const target = `${url.pathname}${url.search}`;
  if (mode === "push") window.history.pushState({ [HISTORY_MARK]: true }, "", target);
  else window.history.replaceState(window.history.state, "", target);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

// Smooth scrolling, unless the visitor asked the OS for reduced motion
const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

function scrollToProjectsHeading(onlyIfOutOfView: boolean) {
  const header = document.querySelector<HTMLElement>("#projects .section-header");
  if (!header) return;
  const headerHeight =
    Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height"), 10) || 84;
  const rect = header.getBoundingClientRect();
  if (onlyIfOutOfView && rect.top >= headerHeight && rect.bottom <= window.innerHeight) return;
  window.scrollTo({ top: Math.max(0, rect.top + window.scrollY - headerHeight - 24), behavior: scrollBehavior() });
}

const filterLabels: Record<Filter, string> = {
  all: "All",
  ...Object.fromEntries(projectCategories.map((category) => [category.id, category.label])),
} as Record<Filter, string>;

const filters: Filter[] = ["all", ...projectCategories.map((category) => category.id)];

const countFor = (filter: Filter) =>
  filter === "all" ? projects.length : projects.filter((project) => project.category === filter).length;

export default function ProjectShowcase() {
  const urlSlug = useSyncExternalStore(subscribeToUrl, slugFromUrl, () => null);
  const selected = useMemo(() => projects.find((project) => project.slug === urlSlug) ?? null, [urlSlug]);

  const [filter, setFilter] = useState<Filter>("all");
  const [animateCards, setAnimateCards] = useState(false);

  const visibleProjects = useMemo(
    () => (filter === "all" ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  );

  // Previous/next inside the detail view follow the active filter. A deep-linked project that is
  // outside the filter falls back to the full list.
  const navList = selected && visibleProjects.includes(selected) ? visibleProjects : projects;

  const cardButtons = useRef(new Map<string, HTMLButtonElement>());
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previousSlug = useRef<string | null>(null);
  // What should get focus after the next project change: set by the action that caused it
  const nextFocus = useRef<"title" | "keep" | "card" | "none">("title");

  const openProject = (project: Project) => {
    nextFocus.current = "title";
    writeProjectToUrl(project.slug, "push");
  };

  const stepProject = (project: Project) => {
    nextFocus.current = "keep";
    writeProjectToUrl(project.slug, "replace");
  };

  const closeProject = (focus: "card" | "none" = "card") => {
    nextFocus.current = focus;
    if (window.history.state?.[HISTORY_MARK]) window.history.back();
    else writeProjectToUrl(null, "replace");
  };

  const changeFilter = (next: Filter) => {
    if (next === filter && !selected) return;
    setFilter(next);
    setAnimateCards(true);
    if (selected) closeProject("none");
  };

  // Drop unknown ?project= values instead of leaving a broken URL behind
  useEffect(() => {
    if (urlSlug && !selected) writeProjectToUrl(null, "replace");
  }, [urlSlug, selected]);

  // Scroll and focus whenever a project opens, changes or closes (clicks, Back button, deep links)
  useEffect(() => {
    const previous = previousSlug.current;
    previousSlug.current = selected?.slug ?? null;
    if ((selected?.slug ?? null) === previous) return;

    const focus = nextFocus.current;
    nextFocus.current = "title"; // default for browser navigation (Back/Forward, deep links)

    if (selected) {
      const switching = previous !== null;
      scrollToProjectsHeading(switching);
      // Stepping keeps focus on the Previous/Next button the visitor used, unless it just became disabled
      const active = document.activeElement;
      const keepFocus =
        focus === "keep" && active instanceof HTMLButtonElement && !active.disabled && active.isConnected;
      if (!keepFocus) titleRef.current?.focus({ preventScroll: true });
      return;
    }

    if (previous && focus !== "none") {
      const card = cardButtons.current.get(previous);
      if (card) {
        card.closest("article")?.scrollIntoView({ block: "center", behavior: scrollBehavior() });
        card.focus({ preventScroll: true });
      } else {
        scrollToProjectsHeading(true);
      }
    }
  }, [selected]);

  // Escape closes the detail view (unless something else, like the mobile menu, handled it)
  const onEscape = useEffectEvent(() => closeProject());
  const isOpen = selected !== null;
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (document.getElementById("mobile-drawer")?.classList.contains("open")) return;
      onEscape();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const index = selected ? navList.indexOf(selected) : -1;

  return (
    <>
      <div className="project-filters reveal-on-scroll" role="group" aria-label="Filter projects by category">
        {filters.map((id) => (
          <button
            key={id}
            type="button"
            className="filter-btn"
            aria-pressed={filter === id}
            onClick={() => changeFilter(id)}
          >
            {filterLabels[id]}
            <span className="filter-count" aria-hidden="true">
              {countFor(id)}
            </span>
            <span className="sr-only"> ({countFor(id)} projects)</span>
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {filter === "all"
          ? `Showing all ${visibleProjects.length} projects`
          : `Showing ${visibleProjects.length} ${filterLabels[filter]} projects`}
      </p>

      <div className="project-stage reveal-on-scroll">
        {selected ? (
          <ProjectDetail
            key="detail"
            project={selected}
            position={index + 1}
            total={navList.length}
            previous={index > 0 ? navList[index - 1] : null}
            next={index >= 0 && index < navList.length - 1 ? navList[index + 1] : null}
            titleRef={titleRef}
            onBack={() => closeProject()}
            onStep={stepProject}
          />
        ) : (
          <div className="project-grid" key={filter}>
            {visibleProjects.map((project, position) => (
              <ProjectCard
                key={project.slug}
                project={project}
                animate={animateCards}
                delay={(position % 3) * 90}
                buttonRef={(element) => {
                  if (element) cardButtons.current.set(project.slug, element);
                  else cardButtons.current.delete(project.slug);
                }}
                onOpen={() => openProject(project)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

type ProjectCardProps = {
  project: Project;
  animate: boolean;
  delay: number;
  buttonRef: (element: HTMLButtonElement | null) => void;
  onOpen: () => void;
};

function ProjectCard({ project, animate, delay, buttonRef, onOpen }: ProjectCardProps) {
  const extraTags = project.tags.length - MAX_CARD_TAGS;

  return (
    <article
      className={`project-card${animate ? " is-entering" : ""}`}
      style={animate ? ({ "--enter-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      <div className="project-card-media project-frame-box">
        <div className="project-frame-inner">
          <div className="mock-browser-bar" aria-hidden="true">
            <span className="dot-ctrl dot-r" />
            <span className="dot-ctrl dot-y" />
            <span className="dot-ctrl dot-g" />
            <span className="mock-url">{projectHost(project)}</span>
          </div>
          <div className="project-card-shot">
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(max-width: 640px) calc(100vw - 64px), (max-width: 1024px) 45vw, 360px"
              placeholder="blur"
              className="project-card-img"
            />
          </div>
        </div>
        {project.featured && <span className="project-badge-featured">Featured</span>}
      </div>

      <div className="project-card-body">
        <p className="project-card-meta">
          <span>{project.type}</span>
          <span className="sr-only">, </span>
          <span>{project.year}</span>
        </p>
        <h3 className="project-card-title">
          <button
            ref={buttonRef}
            type="button"
            className="project-card-open"
            aria-label={`View ${project.name} project details`}
            onClick={onOpen}
          >
            {project.name}
          </button>
        </h3>
        <p className="project-card-summary">{project.summary}</p>
        <ul className="project-card-tags" aria-label="Technologies">
          {project.tags.slice(0, MAX_CARD_TAGS).map((tag) => (
            <li className="tech-tag" key={tag}>
              {tag}
            </li>
          ))}
          {extraTags > 0 && (
            <li className="tech-tag" aria-label={`and ${extraTags} more`}>
              +{extraTags}
            </li>
          )}
        </ul>
        <div className="project-card-footer">
          <span className="project-card-cta" aria-hidden="true">
            View details <span className="arrow">→</span>
          </span>
          {project.liveUrl ? (
            <a
              className="project-card-live"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} live site (opens in a new tab)`}
            >
              Live site <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="project-card-private">No public demo</span>
          )}
        </div>
      </div>
    </article>
  );
}
