import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import CodeBlock from "@/components/CodeBlock";
import { Terminal, T } from "@/components/Terminal";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Hermetic by default",
  description:
    "Agents execute inside rootless containers with dropped capabilities, network-disabled egress, and an optional read-only rootfs. Committed branches are never rewritten; the finished diff is applied to your working tree for review.",
  path: "/product/security",
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

const backends = [
  {
    title: "Podman (default)",
    body: "Rootless, no daemon. Recommended — the least-privilege default path.",
  },
  {
    title: "Docker",
    body: "Same hardening when Podman isn't available. Identical image, identical policy.",
  },
  {
    title: "Git worktree",
    body: "No container runtime at all — an isolated git worktree plus local process. Prints a host-privilege warning so you know what you opted into.",
  },
];

const modes = [
  { mode: "manual", body: "Ask before anything consequential. The interactive default posture." },
  { mode: "auto", body: "Run the pipeline with in-policy actions allowed, per your config." },
  { mode: "dontask", body: "Headless: no prompts, deny on ambiguity, record everything." },
  { mode: "bypass", body: "Explicit, loud, for trusted sandboxes you control. Never silent." },
];

const audit = [
  { name: "report.md", body: "Human-readable run report — verdict, scores, revisions, costs." },
  {
    name: "changes.patch",
    body: "The unified diff — reviewable with anything that reads patches.",
  },
  {
    name: "artifacts/*.json",
    body: "Per-agent JSON artifacts, schema-validated — what each agent decided and why.",
  },
  { name: "safety_proof.json", body: "Sandbox and policy proofs for the run." },
  {
    name: "trace.jsonl",
    body: "Per-span event trace — an honestly derived timeline of the pipeline.",
  },
  {
    name: "niki audit",
    body: "Consolidated JSON compliance bundle for one task: record, proofs, costs, trace.",
  },
];

export default function SecurityPage() {
  return (
    <Frame>
      <Box first>
        <div className="nx-pagehead">
          <nav className="nx-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="sep">/</span>
            <Link href={WEB_ROUTES.product}>product</Link>
            <span className="sep">/</span>
            <span aria-current="page">security</span>
          </nav>
          <h1>Hermetic by default.</h1>
          <p>
            Agents execute inside rootless containers with dropped capabilities, network-disabled
            egress, and an optional read-only rootfs. Committed branches are never rewritten; the
            finished diff is applied to your working tree for review. Fail-closed posture when you
            can&apos;t be there to answer.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
            <a className="nx-btn nx-btn--primary" href={docsUrl(DOCS_ROUTES.security)}>
              Security docs
            </a>
          </div>
        </div>
        <ProductSubNav current={WEB_ROUTES.security} />
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          comment="sandboxing · three backends"
          heading="One sandbox per run. Your repo, bind-mounted."
          aside={
            <span className="nx-badge">
              branches are never rewritten; the finished diff is applied for review
            </span>
          }
        />
        <div className="nx-grid nx-grid--3">
          {backends.map((b) => (
            <div key={b.title} className="nx-cell">
              <span className="nx-index">backend</span>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </div>
          ))}
        </div>
        <div className="nx-split" style={{ borderBottom: "1px solid var(--nk-surface-border)" }}>
          <div>
            <CodeBlock
              label="sandbox hardening — niki.toml"
              lang="toml"
              code={`[sandbox]
backend   = "podman"          # or "docker", "worktree"
image     = "niki-sandbox:24.04"
cap_drop  = "ALL"             # drop every Linux capability
readonly_rootfs = false       # optional; workspace bind mount stays writable

[general]
network_disabled = true       # egress blocked unless allowlisted`}
            />
          </div>
          <div>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem" }}>Layered controls</h3>
            <ul className="nx-checklist" style={{ marginTop: "10px" }}>
              <li>
                <code className="nx-inline">CapDrop ALL</code> — every Linux capability dropped
              </li>
              <li>
                Optional read-only rootfs (off by default); the bind-mounted workspace stays
                writable
              </li>
              <li>
                Command deny-lists — <code className="nx-inline">rm -rf /</code>,{" "}
                <code className="nx-inline">curl | sh</code> blocked by policy
              </li>
              <li>
                Hermeticity violations abort the run (
                <code className="nx-inline">HermeticityViolation</code>)
              </li>
              <li>
                Secrets redacted from logs and reports — including{" "}
                <code className="nx-inline">?key=</code> query params
              </li>
            </ul>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          comment="permissions · fail-closed"
          heading="Fail-closed when unattended."
          aside={
            <span className="nx-badge">
              the ask tool never invents answers; approvals deny by default
            </span>
          }
        />
        <div className="nx-grid nx-grid--4">
          {modes.map((m) => (
            <div key={m.mode} className="nx-cell">
              <span className="nx-index" style={{ color: "var(--nk-magenta)" }}>
                {m.mode}
              </span>
              <p>{m.body}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "24px 24px 32px" }}>
          <ul className="nx-checklist">
            <li>
              <code className="nx-inline">--permission-mode</code> flag and{" "}
              <code className="nx-inline">[permissions] mode</code> config
            </li>
            <li>
              <code className="nx-inline">disable_worktree</code> kill-switch for the no-container
              backend
            </li>
            <li>
              <code className="nx-inline">fail_closed_headless</code> — unanswerable approvals fail
              the run, not silently pass
            </li>
            <li>
              Lifecycle hooks (<code className="nx-inline">[hooks.commands]</code>) can block runs
              fail-closed at each stage boundary
            </li>
          </ul>
        </div>
      </Box>

      <Strip />

      <Box>
        <div className="nx-split">
          <div>
            <h2 style={{ marginTop: 0, fontSize: "1.375rem" }}>A spend cap that actually stops.</h2>
            <p>
              Niki meters every agent call — tokens split into cached-input, reasoning and output —
              and enforces <code className="nx-inline">spend_cap_usd</code> hard: the run aborts
              before a branch is created if the estimate exceeds your ceiling. Unpriced models warn
              loudly instead of silently costing <code className="nx-inline">$0.00</code>.
            </p>
            <p style={{ marginTop: "4px" }}>
              <Link className="nx-arrow" href={WEB_ROUTES.pricing}>
                What a task costs
              </Link>
            </p>
          </div>
          <div>
            <Terminal title="cost report">
              <T tone="mint">$ niki report 6d281d6d</T>
              <T tone="dim">…</T>
              <T>
                <span className="nx-t-mint">tokens&#9;&#9;</span>in 2,912 · cached 1,204 · out 251
              </T>
              <T>
                <span className="nx-t-mint">cost&#9;&#9;</span>est.{" "}
                <span className="nx-t-ok">$0.0112</span> (claude-sonnet-4 meter rates)
              </T>
              <T>
                <span className="nx-t-mint">cap&#9;&#9;&#9;</span>$5.00 ·{" "}
                <span className="nx-t-ok">not exceeded</span>
              </T>
              <T>
                <span className="nx-t-mint">trace&#9;&#9;</span>trace.jsonl · OTLP export available
              </T>
            </Terminal>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          comment="auditability · on disk"
          heading="The whole decision trail, on disk."
          aside={<span className="nx-badge">inspect, diff, replay and hand to an auditor</span>}
        />
        <div className="nx-grid nx-grid--3">
          {audit.map((a) => (
            <div key={a.name} className="nx-cell">
              <span className="nx-index">{a.name}</span>
              <p style={{ marginTop: "6px" }}>{a.body}</p>
            </div>
          ))}
        </div>
      </Box>

      <Strip />

      <Box last>
        <div className="nx-split">
          <div>
            <h2 style={{ marginTop: 0, fontSize: "1.375rem" }}>No telemetry. Ever.</h2>
            <p>
              The only outbound traffic Niki makes is your LLM provider API calls — or none at all
              with a local Ollama. No analytics, no phone-home, no hosted service. Keys are redacted
              from logs and reports by design.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignContent: "center",
            }}
          >
            <a className="nx-btn nx-btn--ghost" href={docsUrl(DOCS_ROUTES.security)}>
              Full security docs
            </a>
            <a
              className="nx-btn nx-btn--ghost"
              href={docsUrl("/sandboxing-security/enterprise-readiness")}
            >
              Enterprise readiness
            </a>
          </div>
        </div>
      </Box>
    </Frame>
  );
}
