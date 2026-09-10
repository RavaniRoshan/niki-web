import Link from "next/link";
import type { ReactNode } from "react";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Free software. Bring your own keys.",
  description:
    "Niki is open source under Apache-2.0. There is no paid tier today and no payment functionality exists. You pay your model provider — or nothing at all on local Ollama.",
  path: "/pricing",
});

const included = [
  "All four pipeline agents + optional Red / Security / Parallel stages",
  "Podman, Docker and worktree sandbox backends",
  "All 12 providers + gateway support, per-agent model mixing",
  "Plan mode, sessions, memory, goals, research commands",
  "Evals harness, audit bundles, OTLP trace export",
  "Apache-2.0 — use it commercially, modify it, ship it",
];

const costs = [
  { setup: "Local Ollama", task: "$0.00", mint: true },
  { setup: "Claude Sonnet 4", task: "~$0.01", mint: false },
  { setup: "Haiku / GPT-4o-mini", task: "< $0.005", mint: false },
];

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li>
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        aria-hidden="true"
        style={{ flex: "none", marginTop: "3px" }}
      >
        <path
          d="M2.5 8.5 L6 12 L13.5 4.5"
          fill="none"
          stroke="var(--nk-mint)"
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      </svg>
      <span>{children}</span>
    </li>
  );
}

export default function PricingPage() {
  return (
    <Frame>
      <Box first>
        <div className="nx-pagehead">
          <nav className="nx-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="sep">/</span>
            <span aria-current="page">pricing</span>
          </nav>
          <h1>Free software. Bring your own keys.</h1>
          <p>
            Niki is open source under Apache-2.0. There is no paid tier today and no payment
            functionality exists. You pay your model provider — or nothing at all on local Ollama.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
            <Link className="nx-btn nx-btn--primary" href={WEB_ROUTES.downloads}>
              Download Niki
            </Link>
            <a className="nx-btn nx-btn--ghost" href={docsUrl(DOCS_ROUTES.providers)}>
              Provider setup
            </a>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          comment="today · the whole pipeline"
          heading="$0 — the whole pipeline."
          aside={<span className="nx-badge nx-badge--mint">current</span>}
        />
        <div className="nx-split">
          <div>
            <p>
              Every capability on this site ships in the open-source release: all four agents,
              sandboxing, plan mode, evals, the TUI, ACP — everything. There is no feature-gated
              tier, no seat license, no hosted requirement.
            </p>
          </div>
          <div>
            <ul className="nx-pricing-list">
              {included.map((item) => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </ul>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <div className="nx-split">
          <div>
            <h2 style={{ marginTop: 0, fontSize: "1.375rem" }}>You pay tokens, not seats.</h2>
            <p>
              A real small task measured ~2.9k input / ~0.25k output tokens across the whole
              pipeline. At provider list rates that&apos;s about a cent on a frontier model — and{" "}
              <strong>$0.00 on a local Ollama</strong>. Niki meters every run honestly and enforces
              your <code className="nx-inline">spend_cap_usd</code> hard, before a branch is
              created.
            </p>
            <p style={{ marginTop: "4px" }}>
              <a className="nx-arrow" href={docsUrl("/evals-auditing/benchmarks-and-evals")}>
                See cost benchmarks
              </a>
            </p>
          </div>
          <div>
            <div className="nx-table-wrap">
              <table className="nx-table" aria-label="Typical cost per small task by provider">
                <thead>
                  <tr>
                    <th>Setup</th>
                    <th>Typical task</th>
                  </tr>
                </thead>
                <tbody>
                  {costs.map((c) => (
                    <tr key={c.setup}>
                      <td>{c.setup}</td>
                      <td>
                        <code style={c.mint ? { color: "var(--nk-mint)" } : undefined}>
                          {c.task}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ margin: "12px 0 0", fontSize: "0.8125rem", color: "var(--nk-text-muted)" }}>
              Measured on a real task at provider list rates; your tasks and models vary. Every run
              reports its exact tokens and cost.
            </p>
          </div>
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader
          comment="the future, honestly labeled"
          heading="Boundaries we may build — none exist yet."
          aside={
            <span className="nx-badge">
              no payment, account or billing functionality exists today
            </span>
          }
        />
        <div className="nx-plans">
          <div className="nx-plan">
            <p className="nx-plan__name">Open Source</p>
            <p className="nx-plan__price">
              $0<small> / forever</small>
            </p>
            <p>
              The complete pipeline, self-hosted. You run it, you own the keys, you keep the
              artifacts.
            </p>
            <ul className="nx-pricing-list">
              <li>Everything in the current release</li>
              <li>Community support via GitHub</li>
              <li>Your infrastructure, your providers</li>
            </ul>
            <div>
              <Link className="nx-btn nx-btn--primary nx-btn--sm" href={WEB_ROUTES.downloads}>
                Download
              </Link>
            </div>
          </div>
          <div className="nx-plan">
            <p className="nx-plan__name">Cloud Execution &amp; Enterprise — future</p>
            <p className="nx-plan__price">TBD</p>
            <p>
              Two boundaries on the public roadmap, neither built yet. Cloud Execution: sandboxed
              runs on managed infrastructure — the pipeline without the host setup (beta, planned).
              Enterprise: organizational controls around the same pipeline — SSO, policy, and
              deployment options.
            </p>
            <ul className="nx-pricing-list nx-pricing-list--plain">
              <li>Managed sandboxes, zero local setup (Cloud)</li>
              <li>Same artifacts, same audit trail (Cloud)</li>
              <li>Org-level permissions and policy (Enterprise)</li>
              <li>Deployment and compliance support (Enterprise)</li>
              <li>Architect agent and advanced evals (Enterprise)</li>
              <li>Pricing announced when the beta ships</li>
            </ul>
            <p style={{ fontSize: "0.8125rem", color: "var(--nk-text-muted)" }}>
              Not yet available — watch the changelog
            </p>
          </div>
        </div>
        <div style={{ padding: "24px 24px 32px" }}>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--nk-text-muted)" }}>
            Note: these future plans describe roadmap intent only — no subscriptions, checkout,
            accounts or usage metering of ours exist today. When they do, this page is where
            they&apos;ll live. Cloud execution and enterprise features are on the public roadmap.
            When paid plans ship, they will cover infrastructure we run for you — the local pipeline
            stays free forever.
          </p>
        </div>
      </Box>
    </Frame>
  );
}
