import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import CodeBlock from "@/components/CodeBlock";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Bring your own everything",
  description:
    "Twelve LLM providers, any OpenAI/Anthropic-compatible gateway, MCP servers, IDE clients via ACP, and OTLP observability — wired into the same pipeline without lock-in.",
  path: "/product/integrations",
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

const providers = [
  "Anthropic",
  "OpenAI",
  "Google",
  "Ollama",
  "OpenRouter",
  "OpenCode Zen",
  "Kimi Code",
  "KiloCode",
  "NVIDIA",
  "Groq",
  "Together",
  "DeepSeek",
];

const surfaces = [
  {
    title: "Terminal",
    body: "niki chat — rich TUI with live agent state, sessions, checkpoints and undo. niki run --tui for full-run streaming.",
  },
  {
    title: "IDE via ACP",
    body: "niki acp runs an Agent Client Protocol server — drive the pipeline from Zed and other ACP-compatible editors.",
  },
  {
    title: "CI / headless",
    body: "niki run --bare --output-format json — a stable envelope with pipe-pure stdout, fail-closed permissions and OTLP trace export (--otel-endpoint).",
  },
];

export default function IntegrationsPage() {
  return (
    <Frame>
      <Box first>
        <div className="nx-pagehead">
          <nav className="nx-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="sep">/</span>
            <Link href={WEB_ROUTES.product}>product</Link>
            <span className="sep">/</span>
            <span aria-current="page">integrations</span>
          </nav>
          <h1>Bring your own everything.</h1>
          <p>
            Twelve LLM providers, any OpenAI/Anthropic-compatible gateway, MCP servers, IDE clients
            via ACP, and OTLP observability — wired into the same pipeline without lock-in.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
            <a className="nx-btn nx-btn--primary" href={docsUrl(DOCS_ROUTES.providers)}>
              Providers docs
            </a>
          </div>
        </div>
        <ProductSubNav current={WEB_ROUTES.integrations} />
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          comment="providers · byok"
          heading="Per-agent provider mixing."
          aside={
            <span className="nx-badge">
              a strong reasoner for Planner and Reviewer, a cheap model for the Tester — or
              everything local on Ollama
            </span>
          }
        />
        <div className="nx-split" style={{ borderBottom: "1px solid var(--nk-surface-border)" }}>
          <div>
            <CodeBlock
              label="niki.toml — mix freely"
              lang="toml"
              code={`[agents.planner]
provider = "anthropic"
model    = "claude-sonnet-4-20250514"

[agents.coder]
provider = "anthropic"
model    = "claude-sonnet-4-20250514"

[agents.tester]
provider = "openai"
model    = "gpt-4o-mini"     # cheap model for test generation

[agents.reviewer]
provider = "anthropic"
model    = "claude-sonnet-4-20250514"`}
            />
          </div>
          <div>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem" }}>Keys &amp; overrides</h3>
            <ul className="nx-checklist" style={{ marginTop: "10px" }}>
              <li>
                Keys from <code className="nx-inline">niki.toml</code> or env —{" "}
                <code className="nx-inline">&lt;PROVIDER&gt;_API_KEY</code>, env wins
              </li>
              <li>
                <code className="nx-inline">_BASE_URL</code> /{" "}
                <code className="nx-inline">_MODEL</code> env overrides for gateway routing
              </li>
              <li>
                Any OpenAI- or Anthropic-compatible gateway via{" "}
                <code className="nx-inline">base_url</code>
              </li>
              <li>
                <code className="nx-inline">niki providers</code> checks every configured provider
              </li>
              <li>
                <code className="nx-inline">niki recommend</code> suggests per-agent models from
                your own past spend
              </li>
            </ul>
          </div>
        </div>
        <div className="nx-providers-grid" role="list" aria-label="Supported LLM providers">
          {providers.map((p) => (
            <span key={p} role="listitem">
              {p}
            </span>
          ))}
        </div>
      </Box>

      <Strip />

      <Box>
        <div className="nx-split">
          <div>
            <h2 style={{ marginTop: 0, fontSize: "1.375rem" }}>Model Context Protocol servers.</h2>
            <p>
              Wire MCP servers into agent context through <code className="nx-inline">[mcp]</code> —
              both stdio and Streamable-HTTP remote transports (JSON and SSE, with session
              affinity). Tools from your MCP servers join the same permission-gated runtime as
              Niki&apos;s baseline tools.
            </p>
            <p style={{ marginTop: "4px" }}>
              <a className="nx-arrow" href={docsUrl("/configuration/config-file-guide")}>
                MCP configuration
              </a>
            </p>
          </div>
          <div>
            <CodeBlock
              label="niki.toml — [mcp]"
              lang="toml"
              code={`[mcp.servers.search]
type    = "streamable-http"
url     = "https://mcp.example.com/mcp"
enabled = true

[mcp.servers.repo-tools]
type    = "stdio"
command = "npx"
args    = ["-y", "@example/repo-tools"]`}
            />
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          comment="editors & ci"
          heading="Wherever you work."
          aside={
            <span className="nx-badge">
              one pipeline, three surfaces — interactive, in-editor, and headless automation
            </span>
          }
        />
        <div className="nx-grid nx-grid--3">
          {surfaces.map((s) => (
            <div key={s.title} className="nx-cell">
              <span className="nx-index">surface</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </Box>

      <Strip />

      <Box last>
        <div className="nx-split">
          <div>
            <h2 style={{ marginTop: 0, fontSize: "1.375rem" }}>Traces without a vendor.</h2>
            <p>
              Every run writes <code className="nx-inline">trace.jsonl</code> — an honestly derived
              span timeline, no instrumentation theater. Export spans over OTLP to any compatible
              backend, or keep everything local.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignContent: "center" }}>
            <a className="nx-btn nx-btn--ghost" href={docsUrl("/evals-auditing/audit-artifacts")}>
              Audit artifacts
            </a>
            <a className="nx-btn nx-btn--ghost" href={docsUrl(DOCS_ROUTES.cli)}>
              CLI reference
            </a>
          </div>
        </div>
      </Box>
    </Frame>
  );
}
