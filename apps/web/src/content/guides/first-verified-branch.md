---
title: "Your first verified branch in 5 minutes"
description: "Zero-setup path: install Niki, point it at local Ollama, run a task on the worktree backend, read the report."
pubDate: "2026-09-05"
updated: "2026-09-08"
difficulty: "beginner"
time: "~5 min"
---

The fastest path to a verified branch needs no container runtime and no API key — just
[Ollama](https://ollama.com) and the worktree backend.

## 1. Install Niki

```bash
curl -fsSL https://raw.githubusercontent.com/RavaniRoshan/niki/master/scripts/install.sh | bash
```

## 2. Pull a local coding model

```bash
ollama pull qwen2.5-coder:3b
```

## 3. Configure inside your project

```bash
cd ./my-app
niki init --interactive   # pick Ollama when offered — it's detected automatically
```

## 4. Run on the worktree backend

```bash
niki run "Add a /health endpoint" --backend worktree
```

The worktree backend uses an isolated git worktree and local processes — no Podman or Docker
needed. (Niki prints a host-privilege warning so the tradeoff is explicit.)

## 5. Review the result

```bash
niki report <id>
```

You'll see the verdict, per-agent scores, exact token counts and cost — plus where the
branch and artifacts live. Merge the `niki/<id>` branch when you're satisfied.

## Next steps

- Full sandbox setup: [sandboxing docs](https://docs.niki.dev/sandboxing-security/security-architecture)
- Plan-first workflow: [plan mode](https://docs.niki.dev/cli-reference/cli-overview)
