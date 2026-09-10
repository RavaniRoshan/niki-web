---
title: "Niki 0.7.0: plan mode, honest metering, and a headless CI contract"
description: "The 0.7.0 release ships plan-first workflows, oracle-integrity testing, hard-enforced spend caps, and a stable JSON contract for automation."
pubDate: "2026-09-08"
author: "Roshan Ravani"
tags: ["release", "pipeline"]
---

30 commits, one theme: make every claim about Niki verifiable. 0.7.0 turns the pipeline from a
single-shot runner into a system you can gate, audit and wire into CI.

## Plan first, execute when approved

`niki plan` researches the task without executing and writes a reviewable `plan.md`. Approve
it with `niki run --plan <id>` — the Planner stage is skipped, so execution follows the exact
spec you reviewed. Dry runs no longer create empty branch refs.

## Oracle integrity for tests

Every test case now carries an `oracle_source` — spec, derived, or property — and the Reviewer
checks oracles before scoring. Red suites and mutation failures block the branch unless you
explicitly `--force` (recorded as NOT verified).

## Honest metering

Cost accounting now splits cached-input and reasoning tokens, warns on unpriced models
instead of silently costing $0.00, and fails closed on a hard `spend_cap_usd` before any
branch is created. `niki recommend` suggests per-agent models from your own observed spend.

## Headless contract

`niki run --bare --output-format json` emits a stable envelope with pipe-pure stdout, and
`--otel-endpoint` exports OTLP traces. Fail-closed permissions make unattended runs safe
defaults rather than a leap of faith.

Read the full [release notes](https://github.com/RavaniRoshan/niki/releases/tag/v0.7.0) or
the [changelog](/resources/changelog).
