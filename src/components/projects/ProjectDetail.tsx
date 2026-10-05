"use client";

import type { RefObject } from "react";

import { projectHost, type Project } from "@/data/projects";

import ProjectPreview from "./ProjectPreview";

type ProjectDetailProps = {
  project: Project;
  position: number;
  total: number;
  previous: Project | null;
  next: Project | null;
  titleRef: RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onStep: (project: Project) => void;
};

const pad = (value: number) => String(value).padStart(2, "0");

export default function ProjectDetail({
  project,
  position,
  total,
  previous,
  next,
  titleRef,
  onBack,
  onStep,
}: ProjectDetailProps) {
  const titleId = `project-title-${project.slug}`;

  return (
    <div className="project-detail is-entering">
      <div className="project-detail-topbar">
        <button type="button" className="project-nav-btn" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to projects
        </button>
        <span className="project-detail-position">
          <span className="sr-only">Project </span>
          {pad(position)} / {pad(total)}
        </span>
      </div>

      {/* Keyed by project so it fades in again when stepping to another project */}
      <article key={project.slug} className="nakula-project-block is-swapping" aria-labelledby={titleId}>
        <div className="nakula-project-header">
          <div className="project-title-col">
            {project.featured && <div className="project-badge-featured">FEATURED PROJECT</div>}
            <h3 className="nakula-project-title" id={titleId} ref={titleRef} tabIndex={-1}>
              {project.name}
            </h3>
            <p className="nakula-project-desc">{project.description}</p>
            <ul className="project-tech-tags" aria-label="Technologies used">
              {project.tags.map((tag) => (
                <li className="tech-tag" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <dl className="nakula-project-meta">
            <div className="meta-row">
              <dt className="meta-tag">(TYPE)</dt>
              <dd className="meta-val">{project.type}</dd>
            </div>
            <div className="meta-row">
              <dt className="meta-tag">(YEAR)</dt>
              <dd className="meta-val">{project.year}</dd>
            </div>
            <div className="meta-row">
              <dt className="meta-tag">(STATUS)</dt>
              <dd className="meta-val">{project.status}</dd>
            </div>
            <div className="meta-row">
              <dt className="meta-tag">(LINK)</dt>
              <dd className="meta-val">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="live-action-link"
                    aria-label={`Live demo of ${project.name} (opens in a new tab)`}
                  >
                    <span>Live Demo</span>
                    <span className="arrow-up-right" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ) : (
                  <span className="meta-val-muted">No public demo</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="project-frame-box">
          <div className="project-frame-inner">
            <div className="mock-browser-bar" aria-hidden="true">
              <span className="dot-ctrl dot-r" />
              <span className="dot-ctrl dot-y" />
              <span className="dot-ctrl dot-g" />
              <span className="mock-url">{projectHost(project)}</span>
            </div>
            <ProjectPreview project={project} />
          </div>
        </div>
      </article>

      <nav className="project-detail-nav" aria-label="More projects">
        <button
          type="button"
          className="project-step project-step-prev"
          disabled={!previous}
          aria-label={previous ? `Previous project: ${previous.name}` : "No previous project"}
          onClick={() => previous && onStep(previous)}
        >
          <span className="project-step-label">
            <span className="arrow" aria-hidden="true">
              ←
            </span>{" "}
            Previous
          </span>
          <span className="project-step-name">{previous ? previous.name : "Start of list"}</span>
        </button>
        <button
          type="button"
          className="project-step project-step-next"
          disabled={!next}
          aria-label={next ? `Next project: ${next.name}` : "No next project"}
          onClick={() => next && onStep(next)}
        >
          <span className="project-step-label">
            Next{" "}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </span>
          <span className="project-step-name">{next ? next.name : "End of list"}</span>
        </button>
      </nav>

      {/* Second way back for visitors who scrolled to the bottom of a long project */}
      <div className="project-detail-footer">
        <button type="button" className="project-nav-btn" onClick={onBack}>
          View all projects
        </button>
      </div>
    </div>
  );
}
