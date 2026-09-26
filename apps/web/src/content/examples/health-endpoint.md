---
title: "Task: add a /health endpoint"
description: "An example task: one sentence, a multiagent run, and a local branch when one is created."
pubDate: "2026-09-08"
difficulty: "beginner"
stack: ["any"]
---

An example task for a full multiagent run:

```bash
niki run "Add a GET /health endpoint returning { status: 'ok', uptime }" --project ./my-app
```

What happens per stage:

- **Planner**: reads the repo, emits a TaskSpec: which file to touch, the approach.
- **Coder**: emits a unified diff against the active execution workspace.
- **Tester**: generates a test report and runs a test command when one is available.
- **Reviewer**: scores the evidence and can request another Coder pass within the configured revision limit.

In `pipeline.topology = "auto"`, a low-complexity task can collapse to Planner plus a solo Coder.

When branch creation succeeds, output includes a `niki/<id>` branch, `changes.patch`, `report.md`
and per-agent JSON artifacts under `.niki/tasks/<id>/`. Those artifacts are excluded from the
published diff. `safety_proof.json`, when written, covers git invariants only and is skipped on an
empty diff. The final diff is applied to your working tree for review.
