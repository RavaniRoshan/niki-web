"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./sections.module.css";

type PlaybackState = "paused" | "playing" | "unavailable";

const STATE_LABEL: Record<PlaybackState, string> = {
  paused: "Paused",
  playing: "Playing",
  unavailable: "Video unavailable",
};

export default function PipelineVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const unavailableRef = useRef(false);
  const resumeAfterInterruptionRef = useRef(false);
  const userPausedRef = useRef(false);
  const mountedRef = useRef(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("paused");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    mountedRef.current = true;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let inViewport = false;
    let documentVisible = !document.hidden;
    let loadWatchdog: number | undefined;

    const markUnavailable = () => {
      unavailableRef.current = true;
      resumeAfterInterruptionRef.current = false;
      video.pause();
      setPlaybackState("unavailable");
    };

    const mediaSources = Array.from(video.querySelectorAll("source"));
    const failedSources = new Set<EventTarget>();
    const handleSourceError = (event: Event) => {
      const source = event.currentTarget;
      if (!source) return;
      failedSources.add(source);
      if (failedSources.size === mediaSources.length) markUnavailable();
    };

    const stopLoadWatchdog = () => {
      if (loadWatchdog === undefined) return;
      window.clearTimeout(loadWatchdog);
      loadWatchdog = undefined;
    };

    const watchForLoadedMedia = () => {
      if (disposed || unavailableRef.current) {
        stopLoadWatchdog();
        return;
      }
      if (video.readyState >= video.HAVE_METADATA) {
        stopLoadWatchdog();
        return;
      }
      if (video.networkState === video.NETWORK_NO_SOURCE) {
        stopLoadWatchdog();
        markUnavailable();
        return;
      }
      loadWatchdog = window.setTimeout(watchForLoadedMedia, 500);
    };

    const attemptAutomaticPlayback = () => {
      if (
        disposed ||
        unavailableRef.current ||
        userPausedRef.current ||
        motionQuery.matches ||
        !inViewport ||
        !documentVisible
      ) {
        return;
      }

      resumeAfterInterruptionRef.current = false;
      void video
        .play()
        .then(() => {
          if (disposed || !mountedRef.current) {
            video.pause();
            return;
          }
          if (userPausedRef.current || motionQuery.matches || !inViewport || !documentVisible) {
            resumeAfterInterruptionRef.current = !userPausedRef.current;
            video.pause();
            return;
          }
          setPlaybackState("playing");
        })
        .catch(() => {
          if (disposed || !mountedRef.current) return;
          if (video.error) {
            markUnavailable();
            return;
          }
          setPlaybackState(video.paused ? "paused" : "playing");
        });
    };

    const pauseForInterruption = () => {
      if (video.paused) return;
      resumeAfterInterruptionRef.current = true;
      video.pause();
    };

    const syncMotionPreference = () => {
      const reduceMotion = motionQuery.matches;
      video.autoplay = !reduceMotion;
      video.loop = !reduceMotion;

      if (reduceMotion) {
        resumeAfterInterruptionRef.current = false;
        if (!video.paused) video.pause();
        if (!unavailableRef.current) setPlaybackState("paused");
        return;
      }

      if (!userPausedRef.current) {
        attemptAutomaticPlayback();
      }
    };

    const handleVisibilityChange = () => {
      documentVisible = document.visibilityState === "visible";
      if (!documentVisible) {
        pauseForInterruption();
        return;
      }
      if (resumeAfterInterruptionRef.current && !userPausedRef.current) {
        attemptAutomaticPlayback();
      }
    };

    const handleLoadedMetadata = () => {
      stopLoadWatchdog();
    };

    const handleLoadedData = () => {
      stopLoadWatchdog();
      if (!motionQuery.matches) attemptAutomaticPlayback();
    };

    const handlePlay = () => {
      if (!unavailableRef.current) setPlaybackState("playing");
    };

    const handlePause = () => {
      if (!unavailableRef.current) setPlaybackState("paused");
    };

    const handleEnded = () => {
      if (!motionQuery.matches) return;
      setPlaybackState("paused");
    };

    for (const source of mediaSources) {
      source.addEventListener("error", handleSourceError);
    }
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", markUnavailable);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener("change", syncMotionPreference);

    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              inViewport = entry.isIntersecting;
              if (!inViewport) {
                pauseForInterruption();
                return;
              }
              if (!userPausedRef.current) {
                attemptAutomaticPlayback();
              }
            },
            { threshold: 0.25 }
          )
        : null;

    if (observer) {
      observer.observe(video);
    } else {
      inViewport = true;
    }

    syncMotionPreference();
    watchForLoadedMedia();

    return () => {
      disposed = true;
      mountedRef.current = false;
      stopLoadWatchdog();
      observer?.disconnect();
      motionQuery.removeEventListener("change", syncMotionPreference);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      for (const source of mediaSources) {
        source.removeEventListener("error", handleSourceError);
      }
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", markUnavailable);
      if (!video.paused) video.pause();
    };
  }, []);

  const play = async () => {
    const video = videoRef.current;
    if (!video || !mountedRef.current || unavailableRef.current || userPausedRef.current) return;

    userPausedRef.current = false;
    resumeAfterInterruptionRef.current = false;
    try {
      await video.play();
      if (!mountedRef.current) {
        video.pause();
        return;
      }
    } catch {
      if (!mountedRef.current) return;
      if (video.error) {
        unavailableRef.current = true;
        setPlaybackState("unavailable");
        return;
      }
      setPlaybackState("paused");
    }
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video || unavailableRef.current) return;
    if (video.paused) {
      userPausedRef.current = false;
      void play();
      return;
    }
    userPausedRef.current = true;
    video.pause();
  };

  const replay = () => {
    const video = videoRef.current;
    if (!video || unavailableRef.current) return;
    video.currentTime = 0;
    userPausedRef.current = false;
    void play();
  };

  const isPlaying = playbackState === "playing";
  const isUnavailable = playbackState === "unavailable";
  const toggleLabel = isUnavailable
    ? "Pipeline recording unavailable"
    : isPlaying
      ? "Pause pipeline recording"
      : "Play pipeline recording";

  return (
    <div className={styles.pipelineVideo}>
      <div data-testid="pipeline-video" className={styles.videoViewport}>
        <video
          ref={videoRef}
          data-testid="pipeline-video-element"
          className={styles.videoElement}
          muted
          playsInline
          preload="metadata"
          poster="/niki-tui-demo-poster.webp"
          aria-label="Niki four-agent pipeline recording"
        >
          <source src="/niki-tui-demo.webm" type="video/webm" />
          <source src="/niki-tui-demo.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={styles.videoControls}>
        <button
          data-testid="pipeline-video-toggle"
          className={styles.videoButton}
          type="button"
          aria-label={toggleLabel}
          aria-pressed={isPlaying}
          disabled={isUnavailable}
          onClick={togglePlayback}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          data-testid="pipeline-video-replay"
          className={styles.videoButton}
          type="button"
          aria-label="Replay pipeline recording"
          disabled={isUnavailable}
          onClick={replay}
        >
          Replay
        </button>
        <p
          data-testid="pipeline-video-status"
          className={styles.videoStatus}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {STATE_LABEL[playbackState]}
        </p>
      </div>
    </div>
  );
}
