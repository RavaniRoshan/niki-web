---
title: "Niki 0.7.0: plan mode, honest metering, and a headless CI contract"
description: "The 0.7.0 release added plan-first workflows, test metadata, spend controls, and a headless JSON contract."
pubDate: "2026-09-08"
author: "Roshan Ravani"
tags: ["release", "pipeline"]
---

30 commits centered on making more of Niki's behavior inspectable. 0.7.0 added plan-first
workflows, audit outputs, and a headless contract; the current release is 0.8.0.

## Plan first, execute when approved

`niki plan` researches the task without executing and writes a reviewable `plan.md`. Approve
it with `niki run "<description>" --plan <id>`; the Planner stage is skipped, so execution follows
the exact spec you reviewed. Dry runs no longer create empty branch refs.

## Oracle integrity for tests

When a test command runs, test cases carry an `oracle_source` (spec, derived, or property), and
the Reviewer checks oracles before scoring. Failing executed suites and mutation gates block
branch creation unless you explicitly `--force` (recorded as NOT verified).

## Honest metering

Cost accounting now splits cached-input and reasoning tokens and warns on unpriced models instead
of silently costing $0.00. A positive `spend_cap_usd` is enforced before further stages run; 0.0
means unlimited. `niki recommend` uses static provider/model pairings, not observed spend.

## Headless contract

`niki run "<description>" --bare --output-format json` emits a stable envelope with pipe-pure stdout,
and `--otel-endpoint` optionally exports OTLP traces. Permission modes are available for
unattended runs; fail-closed headless behavior is opt-in.

Read the full [release notes](https://github.com/RavaniRoshan/niki/releases/tag/v0.7.0) or
the [changelog](/resources/changelog).
