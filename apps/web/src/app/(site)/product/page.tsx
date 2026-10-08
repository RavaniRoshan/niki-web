import Link from "next/link";
import type { ReactNode } from "react";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { Terminal, T } from "@/components/Terminal";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "The multi-agent coding pipeline",
  description:
    "Niki is open-source software that turns a described task into a reviewable git branch: independent planner, coder, tester and reviewer stages, isolated execution, and a full artifact trail.",
  path: "/product",
});

const productNav = [
  { label: "Overview", href: WEB_ROUTES.product },
  { label: "Pipeline", href: WEB_ROUTES.agents },
  { label: "Security", href: WEB_ROUTES.security },
  { label: "Integrations", href: WEB_ROUTES.integrations },
];

function ProductSubNav({ current }: { current: string }) {
  return (
    <nav className="ax-subnav" aria-label="Product sections">
      {productNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`ax-badge ${item.href === current ? "ax-badge--active" : ""}`}
          aria-current={item.href === current ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

const capabilities: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "plan",
    title: "Plan mode",
    body: (
      <>
        <code className="ax-inline">niki plan</code> researches and writes a reviewable{" "}
        <code className="ax-inline">plan.md</code> without executing anything. Approve it with{" "}
        <code className="ax-inline">niki run &quot;…&quot; --plan &lt;id&gt;</code>.
      </>
    ),
  },
  {
    id: "sandbox",
    title: "Isolated execution",
    body: (
      <>
        Work runs in a Podman or Docker sandbox, with dropped capabilities and an egress policy you
        choose — fully open or fully blocked. Rootless is probed and reported, and the worktree
        backend runs host-local when you would rather skip containers.
      </>
    ),
  },
  {
    id: "loop",
    title: "Reviewer revision loop",
    body: (
      <>
        The Reviewer bounces work back to the Coder for up to{" "}
        <code className="ax-inline">max_revision_rounds</code> until it approves.
      </>
    ),
  },
  {
    id: "byok",
    title: "BYOK, 12 providers",
    body: (
      <>
        Anthropic, OpenAI, Google, Ollama, OpenRouter, Zen, Kimi Code, KiloCode, NVIDIA, Groq,
        Together, DeepSeek, plus any compatible gateway via{" "}
        <code className="ax-inline">base_url</code>.
      </>
    ),
  },
  {
    id: "meter",
    title: "Token metering, estimated cost",
    body: (
      <>
        Provider-reported token counts per run, cost estimated from a dated rate table, and an
        explicit warning when a model is unpriced. A positive{" "}
        <code className="ax-inline">spend_cap_usd</code> stops the run.
      </>
    ),
  },
  {
    id: "tui",
    title: "Interactive TUI",
    body: (
      <>
        <code className="ax-inline">niki chat</code> streams a unified status grammar, with session
        resume, memory, goals and slash commands.
      </>
    ),
  },
  {
    id: "ci",
    title: "Headless CI contract",
    body: (
      <>
        <code className="ax-inline">--bare --output-format json</code> is a stable, pipe-pure
        envelope for automation, with OTLP trace export.
      </>
    ),
  },
  {
    id: "acp",
    title: "ACP / IDE integration",
    body: (
      <>
        <code className="ax-inline">niki acp</code> drives Zed and other Agent Client Protocol
        clients.
      </>
    ),
  },
  {
    id: "evals",
    title: "Diagnostics & evals",
    body: (
      <>
        <code className="ax-inline">niki doctor</code>,{" "}
        <code className="ax-inline">niki smoke</code>, and a seeded-defect{" "}
        <code className="ax-inline">niki eval</code> harness with disclosure manifests.
      </>
    ),
  },
];

const nots = [
  {
    title: "Not a replacement for your judgment",
    body: "You review the diff and report before merging. Niki prepares; you decide.",
  },
  {
    title: "Not four agents on every task",
    body: 'Auto topology collapses low-complexity work to planner plus a solo coder to save tokens. Set pipeline.topology = "multiagent" when you want the full chain every time.',
  },
  {
    title: "Not a hosted service",
    body: "No Niki account, no Niki servers. Outbound traffic is your provider calls, plus anything you explicitly enable: web research, knowledge-base URL fetches, remote MCP servers and optional OTLP export.",
  },
  {
    title: "Not magic on huge codebases",
    body: "Works best on tasks with a clear spec and a testable outcome.",
  },
];

export default function ProductPage() {
  return (
    <Frame>
      <Box first>
        <div className="ax-pagehead">
          <nav className="ax-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="text-gray-10">/</span>
            <span aria-current="page">product</span>
          </nav>
          <h1>The multi-agent coding pipeline.</h1>
          <p>
            Niki is open-source software that turns a described task into a reviewable branch:
            independent planner, coder, tester and reviewer stages, isolated execution, and an
            artifact trail you can read afterwards.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
            <a className="ax-btn ax-btn--primary" href={docsUrl(DOCS_ROUTES.quickstart)}>
              Get Started
            </a>
            <a className="ax-btn ax-btn--ghost" href={docsUrl(DOCS_ROUTES.home)}>
              Read the Docs
            </a>
          </div>
        </div>
        <ProductSubNav current={WEB_ROUTES.product} />
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="What it is"
          aside={<span className="ax-badge">Go CLI · local branch output</span>}
        />
        <div className="ax-split">
          <div>
            <p>
              Niki is a Go CLI with one job: take a sentence, return a branch. It runs a pipeline of
              LLM stages — Planner, Coder, Tester, Reviewer — each with its own prompt, its own
              model and its own fresh session. Stages exchange typed artifacts, not a shared
              conversation.
            </p>
            <p>
              The output is boring on purpose: a <code className="ax-inline">niki/&lt;id&gt;</code>{" "}
              branch and a <code className="ax-inline">changes.patch</code>, alongside a{" "}
              <code className="ax-inline">report.md</code> and per-stage JSON kept outside the diff.
              A branch is only created after a non-empty change and a passing test run. Nothing
              lands on <code className="ax-inline">main</code> until you say so.
            </p>
          </div>
          <div style={{ display: "grid", gap: "16px", alignContent: "start" }}>
            <Terminal title="one command">
              <T tone="mint">$ niki run &quot;Add a /health endpoint&quot; --project ./my-app</T>
              <T tone="dim"># … planner, coder, tester, reviewer in one sandbox …</T>
              <T tone="ok">✓ Branch: niki/6d281d6d · Verdict: Approved</T>
            </Terminal>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="What's in the box today"
          aside={
            <span className="ax-badge">
              everything below ships in the current release, no vaporware
            </span>
          }
        />
        <div className="ax-grid ax-grid--3">
          {capabilities.map((c) => (
            <div key={c.id} className="ax-cell">
              <span className="ax-index">{c.id}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="What Niki is not"
          aside={
            <span className="ax-badge">boundaries are part of the product, these hold today</span>
          }
        />
        <div className="ax-grid ax-grid--2">
          {nots.map((n) => (
            <div key={n.title} className="ax-cell">
              <span className="ax-index">not</span>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
            </div>
          ))}
        </div>
      </Box>

      <Strip />

      <Box last>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center",
            padding: "64px 24px",
          }}
        >
          <a className="ax-btn ax-btn--primary" href={docsUrl(DOCS_ROUTES.quickstart)}>
            Get Started
          </a>
          <a className="ax-btn ax-btn--ghost" href={docsUrl(DOCS_ROUTES.home)}>
            Read the Docs
          </a>
        </div>
      </Box>
    </Frame>
  );
}
