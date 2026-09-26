---
title: "Mixing providers per agent"
description: "Per-agent provider and model configuration in niki.toml."
pubDate: "2026-09-01"
updated: "2026-09-23"
difficulty: "intermediate"
---

Each stage in the full multiagent path can bind its own provider and model. Choose a provider for
the work each stage needs; auto topology may skip some stages for low-complexity tasks.

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

Set per-provider keys via environment: env vars override `niki.toml`, so secrets never
touch the repo:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...
```

## Check and tune

```bash
niki providers check
niki recommend
```

`niki recommend` uses static provider/model pairings. It does not rank models from your observed
spend.
