import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import CodeBlock from "@/components/CodeBlock";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Bring your own providers",
  description:
    "Twelve named provider slugs, custom OpenAI-compatible endpoints through base_url, ACP, and optional OTLP export. The MCP client is not wired into pipeline runs.",
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

const providers = [
  "anthropic",
  "openai",
  "openrouter",
  "nvidia",
  "together",
  "groq",
  "deepseek",
  "zen",
  "kimi",
  "kilo",
  "google",
  "ollama",
];

const surfaces = [
  {
    title: "Terminal",
    body: 'niki chat: rich TUI with live agent state, sessions, checkpoints and undo. niki run "<description>" --tui for full-run streaming.',
  },
  {
    title: "IDE via ACP",
    body: "niki acp runs an Agent Client Protocol server: drive the pipeline from Zed and other ACP-compatible editors.",
  },
  {
    title: "CI / headless",
    body: 'niki run "<description>" --bare --output-format json: a stable envelope with pipe-pure stdout, configurable permissions and optional OTLP trace export (--otel-endpoint).',
  },
];

export default function IntegrationsPage() {
  return (
    <Frame>
      <Box first>
        <div className="ax-pagehead">
          <nav className="ax-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="text-gray-10">/</span>
            <Link href={WEB_ROUTES.product}>product</Link>
            <span className="text-gray-10">/</span>
            <span aria-current="page">integrations</span>
          </nav>
          <h1>Bring your own providers.</h1>
          <p>
            Twelve named provider slugs, custom OpenAI-compatible endpoints through base_url, ACP,
            and optional OTLP export. The MCP client is not wired into pipeline runs.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
            <Link className="ax-btn ax-btn--primary" href={WEB_ROUTES.downloads}>
              Get Started
            </Link>
            <a className="ax-btn ax-btn--ghost" href={docsUrl(DOCS_ROUTES.home)}>
              Read the Docs
            </a>
          </div>
        </div>
        <ProductSubNav current={WEB_ROUTES.integrations} />
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="Per-agent provider mixing."
          aside={
            <span className="ax-badge">
              choose a provider and model per stage, or use a local Ollama model
            </span>
          }
        />
        <div className="ax-split">
          <div>
            <CodeBlock
              label="niki.toml, mix freely"
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
            <ul className="ax-checklist" style={{ marginTop: "10px" }}>
              <li>
                Keys from <code className="ax-inline">niki.toml</code> or the provider environment
                variables; supported environment values take precedence
              </li>
              <li>
                Provider-specific <code className="ax-inline">*_BASE_URL</code> /{" "}
                <code className="ax-inline">*_MODEL</code> environment overrides where supported
              </li>
              <li>
                OpenAI-compatible endpoints via <code className="ax-inline">base_url</code> on a
                named provider
              </li>
              <li>
                <code className="ax-inline">niki providers check</code> checks configured providers
              </li>
              <li>
                <code className="ax-inline">niki recommend</code> uses static provider/model
                pairings, not observed spend
              </li>
            </ul>
          </div>
        </div>
        <div className="ax-providers-grid" role="list" aria-label="Supported LLM providers">
          {providers.map((p) => (
            <span key={p} role="listitem">
              {p}
            </span>
          ))}
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="MCP client configuration."
          aside={<span className="ax-badge">client implemented · not executed by a run</span>}
        />
        <div className="ax-split">
          <div>
            <p>
              Niki includes an MCP client, but the pipeline currently constructs an empty{" "}
              <code className="ax-inline">McpManager::new()</code>; configured servers are not
              connected or exposed as executable tools in a run. The config shape is an array of
              tables under <code className="ax-inline">[[mcp.servers]]</code>.
            </p>
            <p style={{ marginTop: "4px" }}>
              <a className="ax-arrow" href={docsUrl("/configuration/config-file-guide")}>
                MCP configuration
              </a>
            </p>
          </div>
          <div>
            <CodeBlock
              label="niki.toml, [[mcp.servers]]"
              lang="toml"
              code={`[mcp]
enabled = true

[[mcp.servers]]
name = "search"
url = "https://mcp.example.com/mcp"
enabled = true

[[mcp.servers]]
name = "repo-tools"
command = "npx"
args = ["-y", "@example/repo-tools"]
enabled = true`}
            />
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="Wherever you work."
          aside={
            <span className="ax-badge">
              one pipeline, three surfaces: interactive, in-editor, and headless automation
            </span>
          }
        />
        <div className="ax-grid ax-grid--3">
          {surfaces.map((s) => (
            <div key={s.title} className="ax-cell">
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader
          heading="Traces without a vendor."
          aside={<span className="ax-badge">local JSONL · OTLP export is opt-in</span>}
        />
        <div className="ax-grid ax-grid--2">
          <div className="ax-cell">
            <p>
              Runs write <code className="ax-inline">trace.jsonl</code> under the task directory,
              locally and unconditionally.
            </p>
          </div>
          <div className="ax-cell">
            <p>
              Exporting spans over OTLP is optional and makes an outbound request to the endpoint
              you configure.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", padding: "24px 24px 0" }}>
          <a className="ax-btn ax-btn--ghost" href={docsUrl("/evals-auditing/audit-artifacts")}>
            Audit artifacts
          </a>
          <a className="ax-btn ax-btn--ghost" href={docsUrl(DOCS_ROUTES.cli)}>
            CLI reference
          </a>
        </div>
      </Box>
    </Frame>
  );
}
