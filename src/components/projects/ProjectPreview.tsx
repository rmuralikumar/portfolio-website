"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { MutedIcon, PauseIcon, PlayIcon, VolumeIcon } from "@/components/icons";
import type { Project } from "@/data/projects";

const PLAY_THRESHOLD = 0.5;

export default function ProjectPreview({ project }: { project: Project }) {
  const image = (
    <Image
      src={project.image}
      alt={project.imageAlt}
      sizes="(max-width: 900px) 100vw, 820px"
      placeholder="blur"
      className="project-real-img"
    />
  );

  return (
    <div className="project-image-box">
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the ${project.name} live site (opens in a new tab)`}
        >
          {image}
        </a>
      ) : (
        image
      )}
      {project.video && (
        <DemoVideo
          key={project.video}
          src={project.video}
          // Optimized WebP of the screenshot, not the original PNG
          poster={getImageProps({ src: project.image, alt: "", width: 820 }).props.src}
        />
      )}
    </div>
  );
}

/**
 * Muted, looping demo layered over the screenshot. The file is only requested once the
 * project is opened, plays while at least half visible, pauses (and re-mutes) when it
 * scrolls away or the tab is hidden, never autoplays with reduced motion, and removes
 * itself if the file fails to load so the screenshot stays.
 */
function DemoVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const visible = useRef(false);
  const userPaused = useRef(false);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);

  const autoplay = () => {
    const video = videoRef.current;
    if (!video || userPaused.current || !visible.current || document.hidden) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.muted = true; // autoplay is always silent
    video.play().catch(() => {
      // Autoplay can be refused (power saving, browser policy); the play button still works
    });
  };

  const pauseSilently = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.muted = true;
  };

  const onIntersection = useEffectEvent((isVisible: boolean) => {
    visible.current = isVisible;
    if (isVisible) autoplay();
    else pauseSilently();
  });

  const onTabVisibilityChange = useEffectEvent(() => {
    if (document.hidden) pauseSilently();
    else autoplay();
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => onIntersection(entry.isIntersecting && entry.intersectionRatio >= PLAY_THRESHOLD),
      { threshold: [0, PLAY_THRESHOLD] },
    );
    observer.observe(video);

    const onVisibilityChange = () => onTabVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      video.pause();
    };
  }, []);

  if (failed) return null;

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => setPaused(true));
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  };

  return (
    <>
      <video
        ref={videoRef}
        className={`project-video${ready ? " is-ready" : ""}`}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onLoadedMetadata={() => {
          setReady(true);
          autoplay();
        }}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
        onError={() => setFailed(true)}
      />
      {ready && (
        <div className="project-video-controls">
          <button
            type="button"
            className="project-video-btn"
            aria-label={paused ? "Play video" : "Pause video"}
            onClick={togglePlay}
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
          <button
            type="button"
            className="project-video-btn"
            aria-label={muted ? "Unmute video" : "Mute video"}
            onClick={toggleMute}
          >
            {muted ? <MutedIcon /> : <VolumeIcon />}
          </button>
        </div>
      )}
    </>
  );
}
