---
title: "Mixing providers per agent"
description: "Give the Planner a strong reasoner and the Tester a cheap model — per-agent provider configuration in niki.toml."
pubDate: "2026-09-01"
updated: "2026-09-06"
difficulty: "intermediate"
time: "~10 min"
---

Each pipeline stage is independently configurable. The pattern most teams converge on: strong
reasoners where judgment matters, cheap models where volume matters.

## The config

```toml
[agents.planner]
provider = "anthropic"
model    = "claude-sonnet-4-20250514"

[agents.coder]
provider = "anthropic"
model    = "claude-sonnet-4-20250514"

[agents.tester]
provider = "openai"
model    = "gpt-4o-mini"     # test generation tolerates a cheaper model

[agents.reviewer]
provider = "anthropic"
model    = "claude-sonnet-4-20250514"
```

## Keys

Set per-provider keys via environment — env vars override `niki.toml`, so secrets never
touch the repo:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...
```

## Check and tune

```bash
niki providers    # verify every configured provider responds
niki recommend    # per-agent suggestions from your own observed spend
```

`niki recommend` reads your run history — it suggests models based on what actually worked
and what it actually cost, not marketing.
