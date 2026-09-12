import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import CodeBlock from "@/components/CodeBlock";
import { Terminal, T } from "@/components/Terminal";
import { HeroShader } from "@/components/HeroShader";
import PipelineLive from "@/components/PipelineLive";
import TaskRunnerHero from "@/components/TaskRunnerHero";
import FeatureWalk from "@/components/FeatureWalk";
import ProviderMarquee from "@/components/ProviderMarquee";
import { SITE, WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";

const features = [
  {
    idx: "01",
    title: "Multi-agent, not monolithic",
    body: "Planning, coding, testing and review are separate agents with their own prompts, models and context. Each does one job well.",
  },
  {
    idx: "02",
    title: "Hermetic by default",
    body: "All work happens in a rootless Podman or Docker sandbox against a copy of your repo. Network egress blocked unless you allow it.",
  },
  {
    idx: "03",
    title: "Output is a git branch",
    body: "You get niki/<id> with a real commit, a diff and artifacts — reviewable like any human PR. Nothing lands on main until you say so.",
  },
  {
    idx: "04",
    title: "Reviewer-driven revisions",
    body: "The Reviewer bounces work back to the Coder until it's approved — up to max_revision_rounds. You review a finished result.",
  },
  {
    idx: "05",
    title: "Fully auditable",
    body: "report.md, changes.patch and per-agent JSON artifacts capture what every agent decided, and why.",
  },
  {
    idx: "06",
    title: "BYOK & provider-mixing",
    body: "Bring your own keys. Give each agent a different provider — a strong reasoner for Planner, a cheap model for Tester.",
  },
];

export default function HomePage() {
  return (
    <Frame>
      {/* ============== HERO ============== */}
      <Box first>
        <div className="nx-hero">
          <div className="nx-hero__shader" aria-hidden="true">
            <HeroShader className="nx-hero__shader-canvas" />
          </div>
          <div className="nx-hero__grid-lines" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <div className="nx-hero__inner" data-hero-seq>
            <Link className="nx-hero__kicker" href={WEB_ROUTES.changelog}>
              <span className="nx-dot nx-dot--pulse" aria-hidden="true" />v{SITE.release.version}{" "}
              shipped — plan mode, spend caps, headless CI contract
            </Link>
            <h1 className="nx-hero__title">
              One sentence in,
              <br />a <em>verified</em> pull request out.
            </h1>
            <p className="nx-hero__sub">
              Describe a task. Niki plans, codes, tests and reviews it across four independent
              agents — then hands you a reviewable branch with the full decision trail.
            </p>
            <div className="nx-hero-runner-wrap">
              <TaskRunnerHero />
            </div>
            <div className="nx-hero__actions">
              <Link className="nx-btn nx-btn--primary" href={docsUrl(DOCS_ROUTES.quickstart)}>
                Get Started
              </Link>
              <Link className="nx-btn nx-btn--ghost" href={docsUrl(DOCS_ROUTES.home)}>
                Read the Docs
              </Link>
            </div>
            <ul className="nx-hero__facts">
              <li>
                <em>Apache-2.0</em> open source
              </li>
              <li>
                <em>Rust</em> single binary
              </li>
              <li>
                <em>BYOK</em> no telemetry
              </li>
            </ul>
          </div>
        </div>
      </Box>

      <Strip />

      {/* ============== TERMINAL DEMO ============== */}
      <Box data-anim="draw">
        <div className="nx-demo-split" data-anim="stagger">
          <div className="nx-demo-copy">
            <h2>Watch one sentence become a reviewable branch.</h2>
            <p>
              Niki is the open-source multi-agent coding pipeline. No shared conversation, no
              confirmation bias: each stage is an independent agent that exchanges typed artifacts
              with the next.
            </p>
            <ul className="nx-checklist">
              <li>
                You write the task — <code className="nx-inline">niki run &quot;…&quot;</code>
              </li>
              <li>Planner, Coder, Tester and Reviewer each do their job</li>
              <li>
                You review the finished <code className="nx-inline">niki/&lt;id&gt;</code> branch
              </li>
            </ul>
            <p style={{ marginTop: "4px" }}>
              <Link className="nx-arrow" href={WEB_ROUTES.agents}>
                See how each agent works
              </Link>
            </p>
          </div>
          <div className="nx-demo-term">
            <Terminal title="niki run — actual output">
              <T tone="mint">$ niki run "Add a /health endpoint" --project ./my-app</T>
              <T>&nbsp;</T>
              <T>
                <span className="nx-t-mint">[Planner]&#9;&#9;</span>done — spec: 1 file to modify
              </T>
              <T>
                <span className="nx-t-mag">[Coder]&#9;&#9;</span>done — changed 1 file · index.js
                [modified]
              </T>
              <T>
                <span className="nx-t-warn">[Tester]&#9;&#9;</span>done —{" "}
                <span className="nx-t-ok">8/8 tests passed</span>
              </T>
              <T>
                <span className="nx-t-blue" style={{ color: "var(--nk-agent-reviewer)" }}>
                  [Reviewer]&#9;
                </span>
                done — approved · correctness 10/10 · quality 8/10
              </T>
              <T>&nbsp;</T>
              <T>
                <span className="nx-t-white">[NIKI]&#9;&#9;</span>task complete —{" "}
                <span className="nx-t-ok">branch: niki/6d281d6d</span> · verdict: approved
              </T>
              <T tone="dim">report: artifacts/report.md · patch: artifacts/changes.patch</T>
            </Terminal>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--nk-font-mono)",
                fontSize: "0.6875rem",
                color: "var(--nk-text-muted)",
              }}
            >
              // real output from niki 0.7.0 — smoke-test task
            </p>
          </div>
        </div>
      </Box>

      <Strip />

      {/* ============== PIPELINE ============== */}
      <Box data-anim="draw">
        <BoxHeader
          comment="the multi-agent pipeline"
          heading="The multi-agent pipeline"
          aside={
            <span className="nx-badge">
              <span className="nx-dot nx-dot--pulse" aria-hidden="true" /> live run · typed
              artifacts, not chat
            </span>
          }
        />
        <PipelineLive />
        <div style={{ padding: "0 24px 24px", display: "flex", justifyContent: "flex-end" }}>
          <Link className="nx-arrow" href={WEB_ROUTES.agents}>
            Explore the pipeline
          </Link>
        </div>
      </Box>

      <Strip />

      {/* ============== WHY NIKI (feature cells) ============== */}
      <Box data-anim="draw">
        <BoxHeader comment="why niki" heading="Why Niki" />
        <FeatureWalk features={features} />
      </Box>

      <Strip />

      {/* ============== VERIFIED OUTPUT ============== */}
      <Box data-anim="draw">
        <div className="nx-demo-split" data-anim="stagger">
          <div className="nx-demo-copy">
            <h2>Proof, not promises.</h2>
            <p>
              Every run leaves behind the entire decision trail: a reviewable branch, a unified
              diff, a human-readable report and per-agent JSON artifacts. Failing test suites block
              the branch unless you explicitly override.
            </p>
            <ul className="nx-checklist">
              <li>
                Reviewable <code className="nx-inline">niki/&lt;id&gt;</code> branch with a real
                commit
              </li>
              <li>
                <code className="nx-inline">changes.patch</code> — the unified diff, inspectable
                anywhere
              </li>
              <li>
                <code className="nx-inline">report.md</code> — human-readable run report with
                verdict
              </li>
              <li>
                <code className="nx-inline">artifacts/*.json</code> — what each agent decided, and
                why
              </li>
              <li>
                <code className="nx-inline">niki audit</code> — consolidated compliance bundle
              </li>
            </ul>
            <p style={{ marginTop: "4px" }}>
              <Link className="nx-arrow" href={docsUrl(DOCS_ROUTES.evals)}>
                Read about the audit methodology
              </Link>
            </p>
          </div>
          <figure
            className="nx-figure"
            style={{ border: "none", borderBottom: "1px solid var(--nk-surface-border)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/diff.png"
              alt="Niki dashboard showing the diff of a completed run, with changed files and the generated patch"
              width="1200"
              height="600"
              loading="lazy"
            />
            <figcaption>niki dashboard — the diff of a finished run</figcaption>
          </figure>
        </div>
      </Box>

      <Strip />

      {/* ============== SECURITY ============== */}
      <Box data-anim="draw">
        <BoxHeader
          comment="hermetic by default"
          heading="Security and sandboxing"
          aside={
            <Link className="nx-arrow" href={WEB_ROUTES.security}>
              Security model
            </Link>
          }
        />
        <div className="nx-split" data-anim="stagger">
          <div>
            <h2 style={{ marginTop: 0, fontSize: "1.375rem" }}>Sandboxed. Isolated. Auditable.</h2>
            <p>
              Agents work inside a rootless container with dropped capabilities and a read-only root
              filesystem. Egress is blocked unless you allow it. Your working tree is never touched
              mid-run.
            </p>
            <ul className="nx-checklist" style={{ marginTop: "10px" }}>
              <li>Rootless Podman or Docker, CapDrop ALL, read-only rootfs</li>
              <li>Network egress blocked by default — allowlist to open it</li>
              <li>
                Command deny-lists: <code className="nx-inline">rm -rf /</code> and{" "}
                <code className="nx-inline">curl | sh</code> blocked by policy
              </li>
              <li>Hard-enforced spend cap aborts before a branch is created</li>
              <li>Fail-closed permission modes for headless CI</li>
            </ul>
          </div>
          <div style={{ display: "grid", gap: "16px" }}>
            <Terminal title="niki doctor">
              <T tone="mint">$ niki doctor</T>
              <T>
                <span className="nx-t-mint">install&#9;&#9;</span>
                <span className="nx-t-ok">ok</span>&#9;niki 0.7.0
              </T>
              <T>
                <span className="nx-t-mint">config&#9;&#9;</span>
                <span className="nx-t-ok">ok</span>&#9;niki.toml found
              </T>
              <T>
                <span className="nx-t-mint">providers&#9;</span>
                <span className="nx-t-ok">ok</span>&#9;anthropic, ollama
              </T>
              <T>
                <span className="nx-t-mint">sandbox&#9;&#9;</span>
                <span className="nx-t-ok">ok</span>&#9;podman · niki-sandbox:24.04
              </T>
              <T>
                <span className="nx-t-mint">security&#9;&#9;</span>
                <span className="nx-t-ok">ok</span>&#9;egress blocked · capdrop all
              </T>
              <T>
                <span className="nx-t-ok">✓ ready to run</span>
              </T>
            </Terminal>
            <CodeBlock
              label="niki.toml — sandbox policy"
              lang="toml"
              code={`[sandbox]
network_disabled = true
cap_drop = "ALL"
rootfs = "read-only"
deny = ["rm -rf /", "curl | sh"]`}
            />
          </div>
        </div>
      </Box>

      <Strip />

      {/* ============== PROVIDERS TICKER ============== */}
      <Box data-anim="draw">
        <BoxHeader
          comment="byok · any provider, per agent"
          heading="Bring your own keys"
          aside={
            <Link className="nx-arrow" href={WEB_ROUTES.integrations}>
              All integrations
            </Link>
          }
        />
        <ProviderMarquee />
        <div className="nx-split" style={{ borderBottom: "1px solid var(--nk-surface-border)" }}>
          <div>
            <p style={{ margin: 0 }}>
              Niki ships no proxy and phones home to no one. Point each agent at the provider that
              fits its job — or run everything on a local Ollama for $0.00.
            </p>
          </div>
          <div>
            <CodeBlock
              label="niki.toml — per-agent models"
              lang="toml"
              code={`[agents.planner]
provider = "anthropic"
model    = "claude-sonnet-4"

[agents.coder]
provider = "anthropic"
model    = "claude-sonnet-4"

[agents.tester]
provider = "openai"
model    = "gpt-4o-mini"   # cheap, test-gen is easy

[agents.reviewer]
provider = "anthropic"
model    = "claude-sonnet-4"`}
            />
          </div>
        </div>
      </Box>

      <Strip />

      {/* ============== WORKFLOW ============== */}
      <Box>
        <BoxHeader comment="terminal-native · ide-ready" heading="Developer workflow" />
        <div className="nx-grid nx-grid--3" data-anim="stagger">
          <div className="nx-cell">
            <span className="nx-index">tui</span>
            <h3>Interactive TUI</h3>
            <p>
              <code className="nx-inline">niki chat</code> streams agent state live — a unified
              status grammar, no flicker, reduced-motion aware.
            </p>
          </div>
          <div className="nx-cell">
            <span className="nx-index">ci</span>
            <h3>Headless CI</h3>
            <p>
              <code className="nx-inline">niki run --bare --output-format json</code> gives a
              stable, pipe-pure JSON envelope. OTLP trace export included.
            </p>
          </div>
          <div className="nx-cell">
            <span className="nx-index">ide</span>
            <h3>ACP / IDE</h3>
            <p>
              <code className="nx-inline">niki acp</code> speaks the Agent Client Protocol — drive
              Niki from Zed and other ACP-compatible editors.
            </p>
          </div>
        </div>
      </Box>

      <Strip />

      {/* ============== STATS ============== */}
      <Box data-anim="draw">
        <BoxHeader comment="verified output, honest numbers" heading="Verified output" />
        <div
          className="nx-stats"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
        >
          <div className="nx-stat" data-anim="count">
            <p className="nx-stat__value">
              <em>4</em> agents
            </p>
            <p className="nx-stat__label">Independent Planner → Coder → Tester → Reviewer</p>
          </div>
          <div className="nx-stat" data-anim="count">
            <p className="nx-stat__value">
              <em>1</em> branch
            </p>
            <p className="nx-stat__label">Reviewable niki/&lt;id&gt; output per run</p>
          </div>
          <div className="nx-stat" data-anim="count">
            <p className="nx-stat__value">
              <em>0</em> telemetry
            </p>
            <p className="nx-stat__label">No hosted proxy, no phoning home, BYOK</p>
          </div>
          <div className="nx-stat">
            <p className="nx-stat__value">
              <em>$0.00</em>
            </p>
            <p className="nx-stat__label">On local Ollama; ~a cent on frontier models</p>
          </div>
        </div>
      </Box>

      <Strip />

      {/* ============== OPEN SOURCE / PRICING ============== */}
      <Box data-anim="draw">
        <div className="nx-split" data-anim="stagger">
          <div>
            <h2 style={{ marginTop: 0, fontSize: "1.375rem" }}>Free software, honest claims.</h2>
            <p>
              Apache-2.0, built in Rust, one binary. Every marketing claim is mapped to the code
              that backs it — and corrected when it doesn&apos;t. No telemetry, no hosted middleman,
              no training on your code.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
              <a
                className="nx-btn nx-btn--ghost nx-btn--sm"
                href={SITE.repo}
                rel="noopener noreferrer"
                target="_blank"
              >
                Star on GitHub
              </a>
              <Link className="nx-btn nx-btn--ghost nx-btn--sm" href={WEB_ROUTES.downloads}>
                Download
              </Link>
              <a
                className="nx-btn nx-btn--ghost nx-btn--sm"
                href={SITE.social.issues}
                rel="noopener noreferrer"
                target="_blank"
              >
                Issue Tracker
              </a>
            </div>
          </div>
          <div>
            <h2 style={{ marginTop: 0, fontSize: "1.375rem" }}>$0. Pay your provider, not us.</h2>
            <p>
              Niki is free open-source software. You bring your own keys — a real task costs about a
              cent on a frontier model, or nothing on local Ollama. Spend caps keep it bounded.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
              <Link className="nx-btn nx-btn--primary nx-btn--sm" href={WEB_ROUTES.pricing}>
                See pricing
              </Link>
              <Link className="nx-btn nx-btn--ghost nx-btn--sm" href={WEB_ROUTES.resources}>
                Resources
              </Link>
            </div>
          </div>
        </div>
      </Box>

      <Strip />

      {/* ============== FINAL CTA ============== */}
      <Box last>
        <div className="nx-cta" data-anim="rise">
          <h2>Delegate the task. Review the branch.</h2>
          <p>
            First verified branch in under five minutes — no container runtime required to start.
          </p>
          <div className="nx-cta__actions">
            <Link className="nx-btn nx-btn--primary" href={docsUrl(DOCS_ROUTES.quickstart)}>
              Get Started
            </Link>
            <Link className="nx-btn nx-btn--ghost" href={docsUrl(DOCS_ROUTES.home)}>
              Read the Docs
            </Link>
          </div>
          <CodeBlock
            label="or, zero-setup first run (worktree backend + local Ollama)"
            code={`curl -fsSL https://raw.githubusercontent.com/RavaniRoshan/niki/master/scripts/install.sh | bash
niki init --interactive
niki run "Add a /health endpoint" --backend worktree`}
          />
        </div>
      </Box>
    </Frame>
  );
}
