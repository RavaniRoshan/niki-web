"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { STAGES } from "./content";
import interactiveStyles from "./interactive.module.css";
import styles from "./sections.module.css";
import { useHorizontalTabs } from "./useHorizontalTabs";

const STAGE_DURATION_MS = 1800;

export default function RunExplorer() {
  const id = useId().replace(/:/g, "");
  const horizontalTabs = useHorizontalTabs();
  const sectionRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const userSelectedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoEnabled, setAutoEnabled] = useState(false);
  const [inView, setInView] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [documentPaused, setDocumentPaused] = useState(false);
  const [complete, setComplete] = useState(false);
  const attentionPaused = hoverPaused || focusPaused || documentPaused || !inView;
  const [status, setStatus] = useState(`${STAGES[0].label} selected`);

  const selectStage = useCallback((index: number, manual: boolean) => {
    const nextIndex = (index + STAGES.length) % STAGES.length;
    setActiveIndex(nextIndex);
    setComplete(false);
    setStatus(`${STAGES[nextIndex].label} selected`);
    if (manual) {
      userSelectedRef.current = true;
      setAutoEnabled(false);
    }
  }, []);

  const replay = useCallback(() => {
    userSelectedRef.current = false;
    setActiveIndex(0);
    setComplete(false);
    setStatus(`${STAGES[0].label} selected`);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAutoEnabled(!reduceMotion);
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      if (motionQuery.matches) {
        setAutoEnabled(false);
        if (!userSelectedRef.current) setStatus(`${STAGES[activeIndex].label} selected`);
        return;
      }
      if (!userSelectedRef.current && !complete) setAutoEnabled(true);
    };

    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);
    return () => motionQuery.removeEventListener("change", syncMotionPreference);
  }, [activeIndex, complete]);

  useEffect(() => {
    if (!autoEnabled || attentionPaused || complete) return;
    if (activeIndex >= STAGES.length - 1) {
      setComplete(true);
      setAutoEnabled(false);
      setStatus("Run complete");
      return;
    }

    const timer = window.setTimeout(() => {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      setStatus(`${STAGES[nextIndex].label} selected`);
    }, STAGE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, attentionPaused, autoEnabled, complete]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => setDocumentPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % STAGES.length;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + STAGES.length) % STAGES.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = STAGES.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    selectStage(nextIndex, true);
    tabRefs.current[nextIndex]?.focus();
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
    setFocusPaused(false);
  };

  const activeStage = STAGES[activeIndex];
  /* Stage zero receives the task itself; every later stage receives the typed
     artifact the one before it produced. */
  const incoming = activeIndex === 0 ? "Task in" : STAGES[activeIndex - 1].output;
  const panelId = `${id}-run-panel`;
  const statusId = `${id}-run-status`;

  const frame = (
    <>
      <div
        className={styles.runFrame}
        onPointerEnter={(event: PointerEvent<HTMLDivElement>) => {
          if (event.pointerType === "mouse") setHoverPaused(true);
        }}
        onPointerLeave={() => setHoverPaused(false)}
      >
        <div
          role="tablist"
          aria-label="Niki pipeline stages"
          aria-orientation={horizontalTabs ? "horizontal" : "vertical"}
          data-testid="run-stage-tabs"
          className={interactiveStyles.tabRail}
          onKeyDown={(event) => handleTabKeyDown(event, activeIndex)}
        >
          {STAGES.map((stage, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={stage.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`${id}-run-tab-${stage.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                data-testid={`run-stage-tab-${stage.id}`}
                className={interactiveStyles.tabButton}
                onClick={() => selectStage(index, true)}
              >
                <span className={interactiveStyles.tabLabel}>{stage.label}</span>
                <span className={interactiveStyles.tabOutput}>{stage.output}</span>
              </button>
            );
          })}
        </div>

        <div
          key={activeStage.id}
          id={panelId}
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`${id}-run-tab-${activeStage.id}`}
          data-testid="run-stage-panel"
          className={`${interactiveStyles.tabPanel} ${styles.runPanel}`}
        >
          {/* The handoff. The copy claims each stage receives a typed artifact
              from the one before it, so the panel shows the artifact arriving
              rather than only naming it further down in the fact list. The
              connector redraws on every change, which is the whole point. */}
          <p className={styles.runHandoff} data-testid="run-handoff">
            <span className={styles.runHandoffFrom}>{incoming}</span>
            <span className={styles.runHandoffRule} aria-hidden="true" />
            <span className={styles.runHandoffTo}>{activeStage.label}</span>
          </p>
          <p className={styles.runOutput}>{activeStage.output}</p>
          <h3 className={styles.runStageTitle}>{activeStage.label}</h3>
          <p className={styles.runSummary}>{activeStage.summary}</p>
          <dl className={styles.runFacts}>
            <div>
              <dt>Context</dt>
              <dd>Fresh LLM session</dd>
            </div>
            <div>
              <dt>Handoff</dt>
              <dd>{activeStage.output}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className={styles.runControls}>
        <button
          type="button"
          data-testid="run-replay"
          className={styles.textControl}
          onClick={replay}
        >
          Replay run
        </button>
        <p
          id={statusId}
          data-testid="run-status"
          className={interactiveStyles.liveStatus}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {status}
        </p>
      </div>
    </>
  );

  return (
    <div
      ref={sectionRef}
      id="run"
      tabIndex={-1}
      data-testid="run-explorer"
      className={styles.runEmbedded}
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={handleBlur}
    >
      {frame}
    </div>
  );
}
