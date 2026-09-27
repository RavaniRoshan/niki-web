"use client";

import { useEffect, useRef, useState } from "react";
import { BRANCH_GATES } from "./content";
import styles from "./sections.module.css";

/**
 * The branch gate as a thing that happens rather than a table that describes one.
 *
 * This section's whole claim is "nothing lands until the tests pass", so the
 * panel runs the check: each gate resolves in turn and the branch line only
 * commits once all four have. The same data that produced the old static list
 * drives it; only the order is new.
 *
 * Everything is in the DOM from the first frame. Only the resolution state is
 * animated, so a screen reader, a search engine and a test with motion disabled
 * all read the finished list immediately.
 */

type GateState = "pending" | "checking" | "passed";

const COMMAND = 'niki run "add a /health endpoint"';
const STEP_MS = 420;

export default function BranchGateRun() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* Motion reduced: the run is simply already finished. There is nothing to
       watch, so there is nothing to animate. */
    if (motion.matches) {
      setResolved(BRANCH_GATES.length);
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        setStarted(true);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );
    observer.observe(root);

    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || resolved >= BRANCH_GATES.length) return;
    const timer = window.setTimeout(() => setResolved((n) => n + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [started, resolved]);

  const complete = resolved >= BRANCH_GATES.length;

  return (
    <div
      ref={rootRef}
      className={styles.gateRun}
      data-testid="branch-gates"
      data-complete={complete}
    >
      <p className={styles.gateCommand}>
        <span className={styles.gatePrompt} aria-hidden="true">
          $
        </span>
        <span className={styles.gateCommandText}>{COMMAND}</span>
      </p>

      <ul className={styles.gateRows}>
        {BRANCH_GATES.map((gate, index) => {
          const state: GateState =
            index < resolved ? "passed" : index === resolved && started ? "checking" : "pending";
          return (
            <li
              key={gate.id}
              className={styles.gateRow}
              data-result={gate.result}
              data-state={state}
            >
              <span className={styles.gateStatus} data-state={state} aria-hidden="true">
                {state === "passed" ? "✓" : state === "checking" ? "·" : "·"}
              </span>
              <span className={styles.gateLabel}>{gate.label}</span>
              <span className={styles.gateResult}>{gate.result}</span>
            </li>
          );
        })}
      </ul>

      {/* The branch only exists once every gate has passed, so the line that
          commits it is the last thing to arrive. */}
      <p className={styles.gateOutcome} data-state={complete ? "committed" : "pending"}>
        <span className={styles.gateOutcomeMark} aria-hidden="true">
          {complete ? "✓" : "·"}
        </span>{" "}
        Branch <code>niki/4f2a</code> · 1 commit · <code>main</code> untouched
      </p>
    </div>
  );
}
