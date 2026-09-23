import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { AgentGlyph } from "@/components/AgentIcons";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Planner → Coder → Tester → Reviewer",
  description:
    "Four independent agents, each with its own prompt, model and context. They exchange typed artifacts — never a shared conversation. Independence is what removes the bias a single agent can't escape.",
  path: "/product/agents",
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

const agents = [
  {
    id: "planner",
    step: "1",
    name: "Planner",
    one: "Reads the task and the current files, produces the TaskSpec.",
    artifact: "TaskSpec — which files to touch, and the approach",
    detail:
      "The Planner never writes code. It reads your task description plus existing file contents and emits a typed plan: scope, files, approach. With plan mode (`niki plan`), this is the only stage that runs — you review `plan.md` before anything executes.",
  },
  {
    id: "coder",
    step: "2",
    name: "Coder",
    one: "Emits a unified diff, applied to the sandboxed workspace.",
    artifact: "unified diff, applied inside the sandbox",
    detail:
      "The Coder works from the TaskSpec alone — it never sees the Planner's conversation. It emits a unified diff that Niki applies to the bind-mounted workspace inside the sandbox. Sequential stages intentionally share one execution sandbox so the diff persists; independence is at the LLM-session layer. Parallel coder topologies and a Synthesizer agent are available in `[pipeline]` config.",
  },
  {
    id: "tester",
    step: "3",
    name: "Tester",
    one: "Generates and runs tests against the change.",
    artifact: "test results, with oracle provenance per case",
    detail:
      "The Tester generates and executes real test suites against the change. Every test case carries an `oracle_source` — spec, derived or property — and failing red suites block the branch unless you explicitly `--force` (recorded as NOT verified).",
  },
  {
    id: "reviewer",
    step: "4",
    name: "Reviewer",
    one: "Issues the verdict; bounces work back until approved.",
    artifact: "verdict — correctness, quality, coverage scores",
    detail:
      "The Reviewer audits the prior stage's artifact, not shared state. On request-changes it loops back to the Coder for up to `max_revision_rounds`. Optional opt-in agents extend the loop: an adversarial Red agent probing the diff, and a Security Auditor pass.",
  },
];

const specialized = [
  {
    title: "Red agent",
    body: "An adversarial reviewer that probes the diff before the Reviewer. Opt-in via [red_blue] enabled = true; sees evidence-only projections.",
  },
  {
    title: "Security Auditor",
    body: "A dedicated security pass over the change via [security] — sees Planner and Coder artifacts only.",
  },
  {
    title: "Parallel Coders",
    body: "Run multiple Coder implementations in parallel with a Synthesizer agent that merges them — via [parallel].",
  },
];

export default function AgentsPage() {
  return (
    <Frame>
      <Box first>
        <div className="nx-pagehead">
          <nav className="nx-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="sep">/</span>
            <Link href={WEB_ROUTES.product}>product</Link>
            <span className="sep">/</span>
            <span aria-current="page">agents</span>
          </nav>
          <h1>Planner → Coder → Tester → Reviewer.</h1>
          <p>
            Four independent agents, each with its own prompt, model and context. They exchange
            typed artifacts — never a shared conversation. Independence is what removes the bias a
            single agent can&apos;t escape.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
            <a className="nx-btn nx-btn--primary" href={docsUrl(DOCS_ROUTES.pipeline)}>
              Pipeline docs
            </a>
          </div>
        </div>
        <ProductSubNav current={WEB_ROUTES.agents} />
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          comment="architecture · isolation"
          heading="Isolated at two layers."
          aside={
            <span className="nx-badge">
              sandboxed execution + context isolation — validated against JSON schemas
            </span>
          }
        />
        <div className="nx-agentflow">
          {agents.map((agent) => (
            <div key={agent.id} className="nx-agentflow__agent" data-agent={agent.id}>
              <div className="nx-agentflow__head">
                <span className="nx-agentflow__glyph" aria-hidden="true">
                  <AgentGlyph role={agent.id} />
                </span>
                <span className="nx-agentflow__name">{agent.name}</span>
                <span className="nx-agentflow__step">stage {agent.step}</span>
              </div>
              <p className="nx-agentflow__one">{agent.one}</p>
              <p className="nx-agentflow__detail">{agent.detail}</p>
              <span className="nx-agentflow__artifact">
                <span className="nx-mono">→ emits</span> {agent.artifact}
              </span>
            </div>
          ))}
          <div className="nx-agentflow__out">
            <span className="nx-agentflow__out-badge">✓ verified branch</span>
            <span className="nx-mono nx-agentflow__out-branch">niki/&lt;id&gt;</span>
            <span className="nx-agentflow__out-note">
              Every emitted artifact is JSON-schema validated before the next stage consumes it.
            </span>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          comment="why it matters · vs one agent"
          heading="vs. one agent in one conversation."
          aside={
            <span className="nx-badge">
              the failures of single-agent tools map exactly to what independence fixes
            </span>
          }
        />
        <div className="nx-grid nx-grid--2">
          <div className="nx-cell">
            <span className="nx-index" style={{ color: "var(--nk-agent-red)" }}>
              single-agent loop
            </span>
            <ul className="nx-checklist" style={{ marginTop: "8px" }}>
              <li>Confirmation bias — it never truly challenges its own assumptions</li>
              <li>Context drift — quality degrades as the conversation grows</li>
              <li>Babysitting tax — you steer, correct and re-verify constantly</li>
            </ul>
          </div>
          <div className="nx-cell">
            <span className="nx-index">niki&apos;s pipeline</span>
            <ul className="nx-checklist" style={{ marginTop: "8px" }}>
              <li>A Tester and Reviewer who never saw the Coder&apos;s reasoning</li>
              <li>Narrow contexts — each agent starts clean, no drift</li>
              <li>A Reviewer that bounces work back so you review a finished result</li>
            </ul>
          </div>
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader
          comment="optional stages · opt-in"
          heading="Specialized agents, opt-in."
          aside={
            <span className="nx-badge">configurable, off by default, same artifact discipline</span>
          }
        />
        <div className="nx-grid nx-grid--3">
          {specialized.map((s) => (
            <div key={s.title} className="nx-cell">
              <span className="nx-index">opt-in</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </Box>
    </Frame>
  );
}
