import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import CodeBlock from "@/components/CodeBlock";
import { Terminal, T } from "@/components/Terminal";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Sandbox boundaries are explicit",
  description:
    "Niki offers container execution through Podman or Docker, or a host-local git-worktree backend. Container network access is blocked or fully open, readonly_rootfs is optional, and safety_proof.json records git invariants only.",
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

const backends = [
  {
    title: "Podman",
    body: "Probed first at startup; Niki falls back to rootful sockets if rootless is unavailable.",
  },
  {
    title: "Docker",
    body: "Used when Podman is unavailable; the container backend binds the repository at /workspace.",
  },
  {
    title: "Git worktree",
    body: "No container runtime: a git worktree plus host-local processes. Niki prints a host-privilege warning and applies the final diff to the host working tree.",
  },
];

const modes = [
  {
    mode: "manual",
    body: "Ask before consequential actions; headless runs may need an explicit policy.",
  },
  { mode: "auto", body: "Allow in-policy sandbox actions; host-reaching actions can still ask." },
  { mode: "dontask", body: "Accept actions without prompting; use only with explicit trust." },
  { mode: "bypass", body: "Explicit, loud, for environments you control. It is not silent." },
];

const audit = [
  {
    name: "report.md",
    body: "Human-readable run report under `.niki/tasks/<id>/`: verdict, scores, revisions, token counts and estimated cost.",
  },
  {
    name: "changes.patch",
    body: "The unified diff is the published change; task artifacts are written beside it and excluded from the diff.",
  },
  {
    name: "artifacts/*.json",
    body: "Per-agent JSON artifacts under `.niki/tasks/<id>/artifacts/`, schema-validated: what each stage emitted. These artifacts stay outside the published diff.",
  },
  {
    name: "safety_proof.json",
    body: "Git invariants for a non-empty run: branch preservation, parentage and no history-rewrite signals. It is not a sandbox or spend proof, and is skipped on empty diffs.",
  },
  {
    name: "manifest.json",
    body: "Run provenance under `.niki/tasks/<id>/` when snapshots are enabled. Snapshot metadata is retained for 14 days by default, with configurable pruning of older task directories.",
  },
  {
    name: "trace.jsonl",
    body: "Per-span event trace written locally under the task directory; OTLP export is optional.",
  },
  {
    name: "niki audit",
    body: "May emit a partial JSON bundle for one task. `complete` reflects report.md plus safety_proof.json only, not every artifact or test result.",
  },
];

export default function SecurityPage() {
  return (
    <Frame>
      <Box first>
        <div className="ax-pagehead">
          <nav className="ax-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="text-gray-10">/</span>
            <Link href={WEB_ROUTES.product}>product</Link>
            <span className="text-gray-10">/</span>
            <span aria-current="page">security</span>
          </nav>
          <h1>Sandbox boundaries are explicit.</h1>
          <p>
            Choose Podman or Docker for container execution, or use a host-local git worktree.
            Container network access is blocked or fully open, <code>readonly_rootfs</code> is
            optional, and when a branch is created the safety proof checks existing refs and
            parentage. The final diff is written to your working tree for review.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
            <Link className="ax-btn ax-btn--primary" href={WEB_ROUTES.downloads}>
              Get Started
            </Link>
            <a className="ax-btn ax-btn--ghost" href={docsUrl(DOCS_ROUTES.security)}>
              Read the Docs
            </a>
          </div>
        </div>
        <ProductSubNav current={WEB_ROUTES.security} />
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="Container or worktree execution."
          aside={
            <span className="ax-badge">
              container backends bind-mount the repo; worktree runs on the host
            </span>
          }
        />
        <div className="ax-grid ax-grid--3">
          {backends.map((b) => (
            <div key={b.title} className="ax-cell">
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </div>
          ))}
        </div>
        <div className="ax-split">
          <div>
            <CodeBlock
              label="sandbox hardening: niki.toml"
              lang="toml"
              code={`[docker]
backend = "docker"
base_image = "niki-sandbox:24.04"
cap_drop_all = true
readonly_rootfs = false
network_disabled = true`}
            />
          </div>
          <div>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem" }}>Layered controls</h3>
            <ul className="ax-checklist" style={{ marginTop: "10px" }}>
              <li>
                <code className="ax-inline">CapDrop ALL</code>, Linux capabilities are dropped by
                default
              </li>
              <li>
                Optional read-only rootfs (off by default); the bind-mounted workspace stays
                writable
              </li>
              <li>
                Container egress is block-all unless{" "}
                <code className="ax-inline">network_allowlist = [&quot;*&quot;]</code>; a
                non-wildcard list warns and behaves as block-all because per-domain allowlists are
                not implemented
              </li>
              <li>
                A narrow default command deny-list, including{" "}
                <code className="ax-inline">rm -rf /</code> and{" "}
                <code className="ax-inline">curl | sh</code>; it is not a complete command sandbox
              </li>
              <li>
                Git safety checks cover committed state;{" "}
                <code className="ax-inline">safety_proof.json</code> is not a sandbox or spend proof
              </li>
              <li>
                Provider errors redact common secret patterns, including{" "}
                <code className="ax-inline">?key=</code> query parameters
              </li>
            </ul>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="Permission modes for unattended runs."
          aside={
            <span className="ax-badge">
              fail_closed_headless is opt-in; manual mode is the default
            </span>
          }
        />
        <div className="ax-grid ax-grid--4">
          {modes.map((m) => (
            <div key={m.mode} className="ax-cell">
              <span className="ax-index" style={{ color: "var(--orange-11)" }}>
                {m.mode}
              </span>
              <p>{m.body}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "24px 24px 32px" }}>
          <ul className="ax-checklist">
            <li>
              <code className="ax-inline">--permission-mode</code> flag and{" "}
              <code className="ax-inline">[permissions] mode</code> config
            </li>
            <li>
              <code className="ax-inline">disable_worktree</code> kill-switch for the no-container
              backend
            </li>
            <li>
              <code className="ax-inline">fail_closed_headless</code>, when enabled, unanswerable
              approvals fail the run; it is off by default
            </li>
            <li>
              Lifecycle hooks (<code className="ax-inline">[hooks.commands]</code>) can block runs
              fail-closed at each stage boundary
            </li>
          </ul>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="A spend cap that actually stops."
          aside={<span className="ax-badge">provider-reported tokens · estimated USD</span>}
        />
        <div className="ax-split">
          <div>
            <p>
              Niki records provider-reported token counts and estimates USD from a dated price
              table. A positive <code className="ax-inline">spend_cap_usd</code> is enforced before
              further stages run; <code className="ax-inline">0.0</code> means unlimited. Unknown or
              unpriced models report <code className="ax-inline">$0.00</code> for the estimate and
              emit a warning that the estimate may understate real spend.
            </p>
            <p style={{ marginTop: "4px" }}>
              <Link className="ax-arrow" href={WEB_ROUTES.pricing}>
                What a task costs
              </Link>
            </p>
          </div>
          <div>
            <Terminal title="cost report">
              <T tone="mint">$ niki report &lt;id&gt;</T>
              <T tone="dim">…</T>
              <T>
                <span className="ax-t-mint">tokens</span> provider-reported
              </T>
              <T>
                <span className="ax-t-mint">cost</span> estimated from the dated price table
              </T>
              <T>
                <span className="ax-t-mint">cap</span> enforced when greater than zero
              </T>
              <T>
                <span className="ax-t-mint">trace</span> local trace.jsonl; OTLP optional
              </T>
            </Terminal>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="The whole decision trail, on disk."
          aside={
            <span className="ax-badge">
              stored under .niki/tasks/&lt;id&gt;/; inspect, diff and hand to an auditor
            </span>
          }
        />
        <div className="ax-grid ax-grid--3">
          {audit.map((a) => (
            <div key={a.name} className="ax-cell">
              <span className="ax-index">{a.name}</span>
              <p style={{ marginTop: "6px" }}>{a.body}</p>
            </div>
          ))}
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader
          heading="Outbound traffic is feature-specific."
          aside={<span className="ax-badge">no hosted service · no Niki account</span>}
        />
        <div className="ax-grid ax-grid--2">
          <div className="ax-cell">
            <p>Provider calls for the stages you run. Nothing else unless you enable it.</p>
          </div>
          <div className="ax-cell">
            <p>
              <code className="ax-inline">niki research</code> via DuckDuckGo, knowledge-base URL
              fetching, optional OTLP export, and remote MCP servers.
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            padding: "24px 24px 0",
          }}
        >
          <Link className="ax-btn ax-btn--primary" href={WEB_ROUTES.downloads}>
            Get Started
          </Link>
          <a className="ax-btn ax-btn--ghost" href={docsUrl(DOCS_ROUTES.security)}>
            Read the Docs
          </a>
        </div>
      </Box>
    </Frame>
  );
}
