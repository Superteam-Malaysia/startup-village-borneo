"use client";

import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/base-path";

/** Hard cap — matches trimmed hero asset length. */
const HERO_VIDEO_MAX_SECONDS = 9;

/** Full-bleed hero video from the Superteam MY launch post on X. */
export function HeroVideoBackdrop({
  src,
  poster,
  tweetUrl,
}: {
  src: string;
  poster?: string;
  tweetUrl: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = withBasePath(src);
  const posterSrc = poster ? withBasePath(poster) : undefined;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const capAtNineSeconds = () => {
      if (video.currentTime >= HERO_VIDEO_MAX_SECONDS) {
        video.currentTime = 0;
      }
    };

    const tryPlay = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      void video.play().catch(() => {
        /* autoplay blocked — poster still visible */
      });
    };

    video.addEventListener("timeupdate", capAtNineSeconds);
    video.addEventListener("loadeddata", tryPlay);
    tryPlay();

    return () => {
      video.removeEventListener("timeupdate", capAtNineSeconds);
      video.removeEventListener("loadeddata", tryPlay);
    };
  }, [videoSrc]);

  return (
    <div className="home-hero__backdrop" aria-hidden="true">
      <video
        ref={videoRef}
        className="home-hero__video"
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="home-hero__backdrop-overlay" />
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="home-hero__tweet-link sr-only"
      >
        Watch the Superteam Malaysia announcement on X
      </a>
    </div>
  );
}
