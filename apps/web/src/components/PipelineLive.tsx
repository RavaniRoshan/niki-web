"use client";

/**
 * PipelineLive — Niki's signature section: a live execution view of the
 * multi-agent pipeline. The run plays itself: task chip types in, each
 * agent activates down the rail (queued → running → done), the Reviewer
 * bounces a revision before approving, and the verified branch lands last.
 *
 * Scroll-scrubbed on desktop (the run advances as you scroll), auto-plays
 * once on enter for touch devices; fully visible static layout under
 * prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useGSAP } from "@gsap/react";
import { AgentGlyph } from "./AgentIcons";

gsap.registerPlugin(ScrollTrigger, TextPlugin, useGSAP);

type StageState = "queued" | "running" | "done" | "revising" | "approved";

interface Stage {
  role: "planner" | "coder" | "tester" | "reviewer" | "output";
  glyph: string;
  name: string;
  state: StageState;
  desc: string;
  artifact: string;
  artifactValue: string;
}

const STAGES: Stage[] = [
  {
    role: "planner",
    glyph: "P",
    name: "Planner",
    state: "done",
    desc: "Reads the task and your repo, produces a written implementation spec — files, steps, acceptance criteria.",
    artifact: "artifact",
    artifactValue: "plan.json",
  },
  {
    role: "coder",
    glyph: "C",
    name: "Coder",
    state: "done",
    desc: "Implements the plan inside the run's execution sandbox. Committed branches are never rewritten; the finished diff is applied for review.",
    artifact: "artifact",
    artifactValue: "changes.patch",
  },
  {
    role: "tester",
    glyph: "T",
    name: "Tester",
    state: "done",
    desc: "Runs the project's own test suite — plus generated regression tests — in the same isolated sandbox.",
    artifact: "gate",
    artifactValue: "8/8 tests passed",
  },
  {
    role: "reviewer",
    glyph: "R",
    name: "Reviewer",
    state: "approved",
    desc: "Audits the diff for correctness and quality. Bounces work back to the Coder until it passes.",
    artifact: "verdict",
    artifactValue: "correctness 10/10",
  },
  {
    role: "output",
    glyph: "✓",
    name: "Verified branch",
    state: "done",
    desc: "A reviewable branch with a real commit, the full patch, a run report and per-agent artifacts.",
    artifact: "branch",
    artifactValue: "niki/6d281d6d",
  },
];

const STATE_LABEL: Record<StageState, string> = {
  queued: "queued",
  running: "running",
  done: "done",
  revising: "revising",
  approved: "approved",
};

const TASK = 'Add a GET /health endpoint returning { status: "ok", uptime }';

export default function PipelineLive() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          noReducedMotion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { isDesktop, noReducedMotion } = ctx.conditions as {
            isDesktop: boolean;
            noReducedMotion: boolean;
          };
          if (!noReducedMotion) return;

          const el = root.current;
          if (!el) return;

          const stages = gsap.utils.toArray<HTMLElement>(".nplv-stage", el);
          const glyphs = stages.map((s) =>
            Array.from(s.querySelectorAll<SVGElement>(".nplv-glyph svg :is(path, circle)"))
          );
          const chips = gsap.utils.toArray<HTMLElement>(".nplv-chip", el);
          const bars = gsap.utils.toArray<HTMLElement>(".nplv-bar-fill", el);
          const rails = gsap.utils.toArray<HTMLElement>(".nplv-rail-fill", el);
          const artifacts = gsap.utils.toArray<HTMLElement>(".nplv-artifact", el);
          const taskText = el.querySelector<HTMLElement>(".nplv-task-text");
          const branch = el.querySelector<HTMLElement>(".nplv-branch");

          /* Build the run timeline. Pinned + scrubbed on desktop so the run
             plays at a readable pace while scrolling; auto-plays once on
             mobile/touch. Total duration ~9s over ~1.2 viewport heights. */
          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: isDesktop
              ? {
                  trigger: el,
                  start: "top top+=72",
                  end: "+=1400",
                  scrub: 0.6,
                  pin: true,
                  pinSpacing: true,
                  anticipatePin: 1,
                }
              : {
                  trigger: el,
                  start: "top 80%",
                  once: true,
                },
          });

          // 0. Task types itself in
          if (taskText) {
            tl.fromTo(taskText, { text: "" }, { text: TASK, duration: 1.6, ease: "none" });
          }

          stages.forEach((stage, i) => {
            const isLast = i === stages.length - 1;
            const isReviewer = STAGES[i]?.role === "reviewer";
            const base = 1.6 + i * 1.7;

            // stage activates: card lifts in, chip appears, icon strokes in
            tl.to(stage, { autoAlpha: 1, y: 0, duration: 0.3 }, base).to(
              chips[i],
              { autoAlpha: 1, duration: 0.2 },
              base
            );
            if (glyphs[i]?.length) {
              tl.fromTo(
                glyphs[i],
                { strokeDasharray: 60, strokeDashoffset: 60 },
                { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut", stagger: 0.06 },
                base + 0.15
              );
            }

            // queued → running
            tl.call(() => chips[i]?.setAttribute("data-state", "running"), undefined, base + 0.25);

            // progress bar sweep (running)
            if (bars[i]) {
              tl.fromTo(
                bars[i],
                { scaleX: 0 },
                { scaleX: 1, duration: 0.9, ease: "power1.inOut" },
                base + 0.25
              );
            }

            // connector rail fills toward the next stage
            if (rails[i] && !isLast) {
              tl.fromTo(
                rails[i],
                { scaleY: 0 },
                { scaleY: 1, duration: 0.6, ease: "power2.inOut" },
                base + 1.0
              );
            }

            // Reviewer: bounce a revision before approving
            if (isReviewer) {
              tl.call(
                () => chips[i]?.setAttribute("data-state", "revising"),
                undefined,
                base + 0.7
              );
              const loop = stage.querySelector(".nplv-loop");
              if (loop) {
                tl.fromTo(
                  loop,
                  { autoAlpha: 0, x: 6 },
                  { autoAlpha: 1, x: 0, duration: 0.3 },
                  base + 0.75
                );
                tl.to(loop, { autoAlpha: 0, duration: 0.2 }, base + 1.35);
              }
              tl.call(
                () => chips[i]?.setAttribute("data-state", "approved"),
                undefined,
                base + 1.15
              );
            } else {
              // done
              tl.call(() => chips[i]?.setAttribute("data-state", "done"), undefined, base + 1.15);
            }

            // artifact tag pops
            if (artifacts[i]) {
              tl.fromTo(
                artifacts[i],
                { autoAlpha: 0, y: 4 },
                { autoAlpha: 1, y: 0, duration: 0.3 },
                base + 1.3
              );
            }
          });

          // verified branch finale
          if (branch) {
            tl.fromTo(
              branch,
              { autoAlpha: 0, scale: 0.92 },
              { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" },
              1.6 + stages.length * 1.7 - 0.3
            );
          }
        }
      );
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div className="nplv" ref={root}>
      {/* Task chip — the input that starts the run. Static text renders for
          no-JS/reduced-motion; the timeline retypes it on play. */}
      <div className="nplv-task">
        <span className="nplv-task-label nx-mono">task</span>
        <span className="nplv-task-text nx-mono" aria-label={TASK}>
          {TASK}
        </span>
        <span className="nplv-task-caret" aria-hidden="true" />
      </div>

      <div className="nplv-rail">
        {STAGES.map((stage, i) => {
          const isReviewer = stage.role === "reviewer";
          return (
            <div key={stage.role} className="nplv-stage-group">
              {/* connector spine between stages */}
              <div className="nplv-rail-line" aria-hidden="true">
                <span className="nplv-rail-fill" />
              </div>
              <article
                className="nplv-stage"
                data-role={stage.role}
                aria-label={`${stage.name}: ${stage.desc}`}
              >
                <div className="nplv-stage-top">
                  <span className="nplv-glyph" aria-hidden="true">
                    <AgentGlyph role={stage.role} />
                  </span>
                  <span className="nplv-name nx-mono">{stage.name}</span>
                  <span className="nplv-chip nx-mono" data-state="queued">
                    {STATE_LABEL[stage.state]}
                  </span>
                  {isReviewer && (
                    <span className="nplv-loop nx-mono" aria-hidden="true">
                      ⟲ rev 1/2
                    </span>
                  )}
                </div>
                <p className="nplv-desc">{stage.desc}</p>
                <div className="nplv-progress" aria-hidden="true">
                  <span className="nplv-bar-fill" />
                </div>
                <div className="nplv-artifact nx-mono">
                  <span className="nplv-artifact-key">{stage.artifact}</span>
                  <span className="nplv-artifact-val">{stage.artifactValue}</span>
                </div>
              </article>
              {i === STAGES.length - 1 && (
                <div className="nplv-branch nx-mono">
                  <span className="nplv-branch-glyph" aria-hidden="true">
                    <AgentGlyph role="output" />
                  </span>
                  <span className="nplv-branch-name">niki/6d281d6d</span>
                  <span className="nplv-branch-meta">
                    report.md · changes.patch · artifacts/*.json
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
