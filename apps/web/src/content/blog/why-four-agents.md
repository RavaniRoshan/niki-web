---
title: "Why four agents beat one"
description: "Confirmation bias, context drift and the babysitting tax are structural failures of single-agent loops. Independence is the fix."
pubDate: "2026-08-25"
author: "Roshan Ravani"
tags: ["architecture"]
---

Every single-agent coding tool — no matter how good the model — runs one long conversation.
Three failures follow from that shape alone:

**Confirmation bias.** An agent that wrote the code reviews its own reasoning. It never truly
challenges its assumptions because it is its own audience.

**Context drift.** Quality degrades as the conversation grows. Every earlier token competes
with the task at hand.

**The babysitting tax.** You become the reviewer, steerer and verifier of a stream of edits —
the opposite of delegation.

## The artifact boundary

Niki splits the work into Planner, Coder, Tester and Reviewer — agents that share no
conversation. They exchange typed artifacts: a TaskSpec, a unified diff, a test report, a
verdict. Each artifact is JSON-schema validated before the next stage consumes it.

The result: a Tester that never saw the Coder's reasoning can only judge the change. A
Reviewer that never saw the Planner's intent can only judge whether the spec was met. The
biases have no channel to travel through.

## Independence is testable

This isn't philosophy — it's enforced in code. Isolation records mirror the wiring, Red
agents receive evidence-only projections, and shared-model review raises warnings. See the
[claims audit](https://github.com/RavaniRoshan/niki/blob/master/docs/claims-audit.md) for the
code-level evidence.
