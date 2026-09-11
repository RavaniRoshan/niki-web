"use client";

/**
 * TaskRunnerHero — the "Living Task" hero.
 *
 * A real, editable task field runs Niki's pipeline inline: press ⏎ and the
 * four agent chips activate in sequence with live states, ending in a
 * verified branch card that echoes the task. It is a *simulation* of real
 * output (labeled honestly) — the same state machine and artifact format
 * the CLI produces.
 *
 * Reduced-motion: pressing run jumps straight to the completed state.
 */

import { useEffect, useRef, useState } from "react";
import { AgentGlyph } from "./AgentIcons";

type ChipState = "idle" | "queued" | "running" | "done" | "approved";

const STAGES = [
  { id: "planner", name: "Planner" },
  { id: "coder", name: "Coder" },
  { id: "tester", name: "Tester" },
  { id: "reviewer", name: "Reviewer" },
] as const;

const EXAMPLES = [
  'Add a GET /health endpoint returning { status: "ok", uptime }',
  "Add pagination to the users list API",
  "Write a rate limiter middleware with a 100 req/min cap",
  "Fix the flaky checkout test on CI",
];

const CHIP_LABEL: Record<ChipState, string> = {
  idle: "",
  queued: "queued",
  running: "running",
  done: "done",
  approved: "approved",
};

function runId(): string {
  return Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
}

export default function TaskRunnerHero({
  onRunStateChange,
}: {
  onRunStateChange?: (running: boolean) => void;
}) {
  const [task, setTask] = useState(EXAMPLES[0]);
  const [chips, setChips] = useState<ChipState[]>(["idle", "idle", "idle", "idle"]);
  const [phase, setPhase] = useState<"idle" | "running" | "complete">("idle");
  const [branch, setBranch] = useState<string | null>(null);
  const [runs, setRuns] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const schedule = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(() => mounted.current && fn(), ms));
  };

  const run = () => {
    if (phase === "running") return;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const t = task.trim() || EXAMPLES[0];
    setRuns((r) => r + 1);
    onRunStateChange?.(true);
    setPhase("running");
    setBranch(null);

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // Jump to the completed state immediately.
      setChips(["done", "done", "done", "approved"]);
      setBranch(`niki/${runId()}`);
      setPhase("complete");
      onRunStateChange?.(false);
      return;
    }

    setChips(["queued", "queued", "queued", "queued"]);

    // Each stage: queued → running → done. Reviewer approves last.
    STAGES.forEach((_, i) => {
      const base = 300 + i * 900;
      schedule(() => {
        setChips((c) => c.map((s, j) => (j === i ? "running" : s)));
      }, base);
      schedule(() => {
        setChips((c) => c.map((s, j) => (j === i ? (i === 3 ? "approved" : "done") : s)));
      }, base + 620);
    });

    schedule(
      () => {
        setBranch(`niki/${runId()}`);
        setPhase("complete");
        onRunStateChange?.(false);
      },
      300 + 4 * 900 + 300
    );
  };

  const busy = phase === "running";

  return (
    <div className="nx-hero-runner" data-phase={phase}>
      {/* Task input */}
      <div className="nx-hero-inputwrap">
        <label className="nx-hero-inputlabel nx-mono" htmlFor="nx-hero-task">
          your task
        </label>
        <input
          id="nx-hero-task"
          className="nx-hero-input nx-mono"
          type="text"
          value={task}
          spellCheck={false}
          autoComplete="off"
          maxLength={120}
          disabled={busy}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") run();
          }}
          aria-label="Describe a coding task for Niki to run"
        />
        <button
          type="button"
          className="nx-hero-runbtn"
          onClick={run}
          disabled={busy}
          aria-label="Run the pipeline simulation"
        >
          {busy ? "running…" : "run ⏎"}
        </button>
      </div>

      {/* Inline pipeline chips */}
      <div className="nx-hero-pipe" role="status" aria-live="polite">
        {STAGES.map((s, i) => (
          <span key={s.id} className="nx-hero-pipeitem">
            <span className={`nx-hero-chip nx-mono`} data-state={chips[i]}>
              <span className="nx-hero-chipglyph" aria-hidden="true">
                <AgentGlyph role={s.id} />
              </span>
              {s.name}
              <span className="nx-hero-chipstate">{CHIP_LABEL[chips[i]]}</span>
            </span>
            {i < STAGES.length - 1 && (
              <span className="nx-hero-conn" aria-hidden="true">
                <span
                  className="nx-hero-connfill"
                  data-active={chips[i] === "done" || chips[i] === "approved"}
                />
              </span>
            )}
          </span>
        ))}
        <span className="nx-hero-pipeitem">
          <span className="nx-hero-conn" aria-hidden="true">
            <span className="nx-hero-connfill" data-active={chips[3] === "approved"} />
          </span>
          <span
            className={`nx-hero-chip nx-hero-chip--branch nx-mono`}
            data-state={branch ? "done" : "idle"}
          >
            <span className="nx-hero-chipglyph" aria-hidden="true">
              <AgentGlyph role="output" />
            </span>
            {branch ?? "branch"}
          </span>
        </span>
      </div>

      {/* Result + honest label */}
      <div className="nx-hero-simnote nx-mono" aria-hidden={phase === "idle"}>
        {phase === "complete" ? (
          <>
            simulated run —{" "}
            <code>
              niki run "{task.slice(0, 44)}
              {task.length > 44 ? "…" : ""}"
            </code>{" "}
            gives you <span className="nx-hero-branchname">{branch}</span> with report.md ·
            changes.patch · artifacts/*.json.{" "}
            <button type="button" className="nx-hero-rerun" onClick={run}>
              run again →
            </button>
          </>
        ) : phase === "running" ? (
          <>simulating the pipeline — planner → coder → tester → reviewer…</>
        ) : (
          <>
            press run to simulate a pipeline — real CLI: <code>niki run "…"</code>
          </>
        )}
      </div>
      {runs > 0 && phase === "complete" && (
        <span className="nx-sr-only">
          Pipeline simulation complete. The simulated run produced branch {branch}.
        </span>
      )}
    </div>
  );
}
