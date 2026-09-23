import Link from "next/link";
import type { ReactNode } from "react";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { Terminal, T } from "@/components/Terminal";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "The multi-agent coding pipeline",
  description:
    "Niki is open-source software that turns a described task into a verified git branch: four independent agents plan, code, test and review — in hermetic sandboxes, with a full audit trail.",
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
    <nav className="nx-subnav" aria-label="Product sections">
      {productNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`nx-badge ${item.href === current ? "nx-badge--mint" : ""}`}
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
        <code className="nx-inline">niki plan</code> researches and writes a reviewable{" "}
        <code className="nx-inline">plan.md</code> without executing. Approve with{" "}
        <code className="nx-inline">niki run --plan</code>.
      </>
    ),
  },
  {
    id: "sandbox",
    title: "Hermetic sandboxing",
    body: (
      <>
        Rootless Podman or Docker with <code className="nx-inline">CapDrop ALL</code>,
        network-disabled egress (read-only rootfs optional). Or the no-container worktree backend.
      </>
    ),
  },
  {
    id: "loop",
    title: "Reviewer revision loop",
    body: (
      <>
        The Reviewer bounces work back to the Coder for up to{" "}
        <code className="nx-inline">max_revision_rounds</code> until it approves.
      </>
    ),
  },
  {
    id: "byok",
    title: "BYOK, 12 providers",
    body: (
      <>
        Anthropic, OpenAI, Google, Ollama, OpenRouter, Zen, Kimi Code, KiloCode, NVIDIA, Groq,
        Together, DeepSeek — plus any compatible gateway via{" "}
        <code className="nx-inline">base_url</code>.
      </>
    ),
  },
  {
    id: "meter",
    title: "Honest cost metering",
    body: (
      <>
        Exact tokens and cost per run, a hard-enforced{" "}
        <code className="nx-inline">spend_cap_usd</code>, and warnings for unpriced models.
      </>
    ),
  },
  {
    id: "tui",
    title: "Interactive TUI",
    body: (
      <>
        <code className="nx-inline">niki chat</code> streams a unified status grammar — plus
        sessions, memory, goals and research commands.
      </>
    ),
  },
  {
    id: "ci",
    title: "Headless CI contract",
    body: (
      <>
        <code className="nx-inline">--bare --output-format json</code> is a stable, pipe-pure
        envelope for automation, with OTLP trace export.
      </>
    ),
  },
  {
    id: "acp",
    title: "ACP / IDE integration",
    body: (
      <>
        <code className="nx-inline">niki acp</code> drives Zed and other Agent Client Protocol
        clients.
      </>
    ),
  },
  {
    id: "evals",
    title: "Diagnostics & evals",
    body: (
      <>
        <code className="nx-inline">niki doctor</code>,{" "}
        <code className="nx-inline">niki smoke</code>, and a seeded-defect{" "}
        <code className="nx-inline">niki eval</code> harness with disclosure manifests.
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
    title: "Not one all-knowing agent",
    body: "Four narrow agents beat one giant context — and can't bias each other.",
  },
  {
    title: "Not training on your code",
    body: "BYOK, no telemetry, no hosted service. The only outbound traffic is your provider calls.",
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
        <div className="nx-pagehead">
          <nav className="nx-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="sep">/</span>
            <span aria-current="page">product</span>
          </nav>
          <h1>The multi-agent coding pipeline.</h1>
          <p>
            Niki is open-source software that turns a described task into a verified git branch:
            four independent agents plan, code, test and review — in hermetic sandboxes, with a full
            audit trail.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
            <a className="nx-btn nx-btn--primary" href={docsUrl(DOCS_ROUTES.quickstart)}>
              Get Started
            </a>
            <Link className="nx-btn nx-btn--ghost" href={WEB_ROUTES.agents}>
              See the pipeline
            </Link>
          </div>
        </div>
        <ProductSubNav current={WEB_ROUTES.product} />
      </Box>

      <Strip />

      <Box>
        <div className="nx-split">
          <div>
            <h2 style={{ marginTop: 0, fontSize: "1.375rem" }}>What it is</h2>
            <p>
              Niki is a Rust CLI with one job: take a sentence, return a reviewable branch. It runs
              a fixed pipeline of four LLM agents — Planner, Coder, Tester, Reviewer — each with its
              own prompt, its own model and its own isolated context. Agents exchange typed
              artifacts, not a shared conversation.
            </p>
            <p>
              The output is boring on purpose: a <code className="nx-inline">niki/&lt;id&gt;</code>{" "}
              branch, a <code className="nx-inline">changes.patch</code>, a human-readable{" "}
              <code className="nx-inline">report.md</code>, and per-agent JSON artifacts. You review
              it like any human PR — nothing lands on <code className="nx-inline">main</code> until
              you say so.
            </p>
          </div>
          <div style={{ display: "grid", gap: "16px", alignContent: "start" }}>
            <Terminal title="one command">
              <T tone="mint">$ niki run "Add a /health endpoint" --project ./my-app</T>
              <T tone="dim"># … four agents, one execution sandbox …</T>
              <T tone="ok">✓ Branch: niki/6d281d6d · Verdict: Approved</T>
            </Terminal>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          comment="capabilities · what ships today"
          heading="What's in the box today"
          aside={
            <span className="nx-badge">
              everything below ships in the current release — no vaporware
            </span>
          }
        />
        <div className="nx-grid nx-grid--3">
          {capabilities.map((c) => (
            <div key={c.id} className="nx-cell">
              <span className="nx-index">{c.id}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          comment="honesty · what niki is not"
          heading="What Niki is not"
          aside={
            <span className="nx-badge">boundaries are part of the product — these hold today</span>
          }
        />
        <div className="nx-grid nx-grid--2">
          {nots.map((n) => (
            <div key={n.title} className="nx-cell">
              <span className="nx-index">not</span>
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
          <a className="nx-btn nx-btn--primary" href={docsUrl(DOCS_ROUTES.overview)}>
            Read the docs
          </a>
          <Link className="nx-btn nx-btn--ghost" href={WEB_ROUTES.downloads}>
            Download Niki
          </Link>
        </div>
      </Box>
    </Frame>
  );
}
