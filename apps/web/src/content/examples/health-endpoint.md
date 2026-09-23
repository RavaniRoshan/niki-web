---
title: "Task: add a /health endpoint"
description: "The canonical first task — one sentence, four agents, a verified branch."
pubDate: "2026-09-08"
difficulty: "beginner"
stack: ["any"]
---

The one-sentence task used across Niki's demo and smoke tests:

```bash
niki run "Add a GET /health endpoint returning { status: 'ok', uptime }" --project ./my-app
```

What happens per stage:

- **Planner** — reads the repo, emits a TaskSpec: which file to touch, the approach.
- **Coder** — emits a unified diff against the sandboxed workspace.
- **Tester** — generates and runs tests for the endpoint, each with oracle provenance.
- **Reviewer** — scores correctness, quality and coverage; bounces back if below bar.

Output: a `niki/<id>` branch, `changes.patch`, `report.md` and per-agent JSON artifacts.
Committed branches are never rewritten — the finished diff is applied to your working tree for review, and nothing lands on `main` until you merge.
