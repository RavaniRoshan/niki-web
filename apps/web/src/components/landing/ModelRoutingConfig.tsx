"use client";

import { useEffect, useRef, useState } from "react";
import { MODEL_GENERAL, MODEL_ROUTING } from "./content";
import styles from "./sections.module.css";

/**
 * The config lights up stage by stage.
 *
 * This section's claim is "route a different model to every stage", and the old
 * treatment was a grey `<pre>` that did not act on the claim at all. Here each
 * `[agents.*]` block ignites in pipeline order as the section comes into view, and
 * the binding it declares is read out beside it. The motion is the argument: a
 * model, routed, to each stage in turn.
 *
 * The whole file is in the DOM from the first frame and the test reads it as text,
 * so this adds emphasis, never content.
 */

const STEP_MS = 520;

export default function ModelRoutingConfig() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStarted(true);
      setActive(MODEL_ROUTING.length - 1);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        setStarted(true);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || active >= MODEL_ROUTING.length - 1) return;
    const timer = window.setTimeout(() => setActive((n) => n + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [started, active]);

  const current = active >= 0 ? MODEL_ROUTING[active] : null;

  return (
    <div ref={rootRef} className={styles.routing} data-active={active}>
      <div className={styles.routingHeader}>
        <span className={styles.routingFile}>niki.toml</span>
        <span className={styles.routingStage} data-live={current ? "true" : "false"}>
          {current ? (
            <>
              <span className={styles.routingStageName}>{current.stage}</span>
              <span className={styles.routingArrow} aria-hidden="true">
                →
              </span>
              <span className={styles.routingModel}>{current.model}</span>
            </>
          ) : (
            <span className={styles.routingStageIdle}>reading config</span>
          )}
        </span>
      </div>

      <pre
        data-testid="model-routing-code"
        className={styles.routingCode}
        tabIndex={0}
        aria-label="Example niki.toml configuration"
      >
        <code>
          {"\n"}
          <span className={styles.routingBlock} data-state="static">
            <span className={styles.routingTable}>[general]</span>
            {"\n"}
            {MODEL_GENERAL.map((setting) => (
              <span key={setting.key}>
                <span className={styles.routingKey}>{setting.key}</span>
                <span className={styles.routingOp}> = </span>
                <span className={styles.routingNumber}>{setting.value}</span>
                {"\n"}
              </span>
            ))}
          </span>
          {MODEL_ROUTING.map((entry, index) => (
            <span
              key={entry.stage}
              className={styles.routingBlock}
              data-state={index <= active ? (index === active ? "active" : "routed") : "idle"}
            >
              <span className={styles.routingTable}>[{entry.table}]</span>
              {"\n"}
              <span className={styles.routingKey}>provider</span>
              <span className={styles.routingOp}> = </span>
              <span className={styles.routingString}>&quot;{entry.provider}&quot;</span>
              {"\n"}
              <span className={styles.routingKey}>model</span>
              <span className={styles.routingOp}> = </span>
              <span className={styles.routingString}>&quot;{entry.model}&quot;</span>
              {"\n"}
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
