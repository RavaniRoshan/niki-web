---
title: "Why separate stages can help"
description: "Separate sessions and typed artifacts can reduce context drift and make each stage's work inspectable."
pubDate: "2026-08-25"
author: "Roshan Ravani"
tags: ["architecture"]
---

A single-agent loop keeps one conversation around the task. That shape can create three
recurring costs:

**Confirmation bias.** The same agent may review its own reasoning and assumptions.

**Context drift.** As a conversation grows, relevant context can be harder to manage.

**The babysitting tax.** You may still have to steer, correct, and re-verify a stream of edits.

## The artifact boundary

In the full multiagent path, Niki splits the work into Planner, Coder, Tester and Reviewer,
separate sessions that exchange typed artifacts: a TaskSpec, a unified diff, a test report, and a
verdict. Each artifact is JSON-schema validated before handoff. In auto mode, a low-complexity
task can collapse to Planner plus a solo Coder.

The Tester receives the spec and Coder artifact rather than a shared conversation. The Reviewer
receives those artifacts plus the Tester evidence. Separate sessions narrow context contamination;
they do not make a stage blind to the evidence it needs.

## What the code records

This isn't philosophy: isolation records mirror the wiring, Red agents receive evidence-only
projections, and shared-model review raises warnings. Those mechanisms narrow the problem; they do
not prove correctness. See the [claims audit](https://github.com/RavaniRoshan/niki/blob/master/docs/claims-audit.md)
for code-level details.

A completed run may produce a local `niki/<id>` branch and `changes.patch`; it does not create a
GitHub pull request.
