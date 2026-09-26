---
title: "Your first local branch"
description: "Install Niki, use local Ollama with the worktree backend, and inspect the local branch and report."
pubDate: "2026-09-05"
updated: "2026-09-23"
difficulty: "beginner"
---

A local path to a branch needs no container runtime or hosted API key: use
[Ollama](https://ollama.com) with the worktree backend. You still need a git repository and a
local model.

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
niki init --interactive
```

## 4. Run on the worktree backend

```bash
niki run "Add a /health endpoint" --backend worktree
```

The worktree backend uses `.niki-worktrees/<id>` with host-local processes: no Podman or Docker
is needed. Niki prints a host-privilege warning, and the final diff is applied to the host working
tree.

## 5. Review the result

```bash
niki report <id>
```

You'll see the verdict, provider-reported token counts and estimated cost, plus where the
branch and artifacts live. If no test command resolves, the report records no test execution. A
For a non-dry run, a branch is created only for a non-empty diff with no blocked test failure;
`--force` can create an unverified branch. Merge the `niki/<id>` branch when you're satisfied.

## Next steps

- Full sandbox setup: [sandboxing docs](https://docs.niki.dev/sandboxing-security/security-architecture)
- Plan-first workflow: [plan mode](https://docs.niki.dev/cli-reference/cli-overview)
