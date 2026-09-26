import Link from "next/link";
import type { ReactNode } from "react";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Free software. Bring your own keys.",
  description:
    "Niki is open source under Apache-2.0. There is no paid tier, payment processing, account, or billing system. You pay your model provider, or use a local Ollama model.",
  path: "/pricing",
});

const included = [
  "Planner, Coder, Tester and Reviewer stages; optional Red / Security / Parallel stages",
  "Podman or Docker container execution, plus a git-worktree backend",
  "12 named providers, custom base_url endpoints, and per-agent model mixing",
  "Plan mode, sessions, memory, goals, research commands",
  "Evals harness, audit bundles, optional OTLP trace export",
  "Apache-2.0: use it commercially, modify it, ship it",
];

const costs = [
  { setup: "Local Ollama", task: "No provider charge", mint: true },
  { setup: "Hosted provider", task: "Estimated from price table", mint: false },
  { setup: "Unpriced model", task: "$0.00 + warning", mint: false },
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
          stroke="var(--green)"
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
        <div className="ax-pagehead">
          <nav className="ax-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="text-gray-10">/</span>
            <span aria-current="page">pricing</span>
          </nav>
          <h1>Free software. Bring your own keys.</h1>
          <p>
            Niki is open source under Apache-2.0. There is no paid tier, payment processing,
            account, or billing system. You pay your model provider, or use a local Ollama model.
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
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="$0, the whole pipeline."
          aside={<span className="ax-badge ax-badge--active">current</span>}
        />
        <div className="ax-split">
          <div>
            <p>
              The open-source release includes the pipeline stages, sandbox backends, plan mode,
              evals, the TUI, and ACP. There is no feature-gated tier, no seat license, and no
              hosted requirement.
            </p>
          </div>
          <div>
            <ul className="ax-pricing-list">
              {included.map((item) => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </ul>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="Provider costs, not Niki seats."
          aside={<span className="ax-badge">provider-reported tokens · estimated USD</span>}
        />
        <div className="ax-split">
          <div>
            <p>
              Niki records provider-reported token counts and estimates USD from a dated price
              table. A positive <code className="ax-inline">spend_cap_usd</code> is enforced; 0.0
              means unlimited. Unknown or unpriced models report $0.00 for the estimate and emit a
              warning that the estimate may understate real spend.
            </p>
            <p style={{ marginTop: "4px" }}>
              <a className="ax-arrow" href={docsUrl("/evals-auditing/benchmarks-and-evals")}>
                See cost reporting
              </a>
            </p>
          </div>
          <div>
            <div className="ax-table-wrap">
              <table className="ax-table" aria-label="How Niki reports provider cost">
                <thead>
                  <tr>
                    <th>Setup</th>
                    <th>Reported value</th>
                  </tr>
                </thead>
                <tbody>
                  {costs.map((c) => (
                    <tr key={c.setup}>
                      <td>{c.setup}</td>
                      <td>
                        <code style={c.mint ? { color: "var(--green)" } : undefined}>{c.task}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ margin: "12px 0 0", fontSize: "0.8125rem", color: "var(--gray-10)" }}>
              Token counts come from provider reports; dollar amounts are estimates and vary by
              model, date, and provider. Unknown or unpriced models report $0.00 and warn.
            </p>
          </div>
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader
          heading="No paid plans or billing."
          aside={
            <span className="ax-badge">
              no payment, account or billing functionality exists today
            </span>
          }
        />
        <div className="ax-plans">
          <div className="ax-plan">
            <p className="ax-plan__name">Open Source</p>
            <p className="ax-plan__price">$0</p>
            <p>
              The complete local pipeline, self-hosted. You run it, you own the keys, you keep the
              artifacts.
            </p>
            <ul className="ax-pricing-list">
              <li>Everything in the current release</li>
              <li>Open-source repository and issue tracker</li>
              <li>Your infrastructure, your providers</li>
            </ul>
            <div>
              <Link className="ax-btn ax-btn--primary ax-btn--sm" href={WEB_ROUTES.downloads}>
                Get Started
              </Link>
            </div>
          </div>
          <div className="ax-plan">
            <p className="ax-plan__name">Paid plans</p>
            <p className="ax-plan__price">None</p>
            <p>There is no subscription, checkout, account, or Niki usage billing today.</p>
            <ul className="ax-pricing-list ax-pricing-list--plain">
              <li>Current software is Apache-2.0</li>
              <li>You provide infrastructure and provider credentials</li>
              <li>No Niki invoice or seat license</li>
            </ul>
            <p style={{ fontSize: "0.8125rem", color: "var(--gray-10)" }}>Not available today.</p>
          </div>
        </div>
        <div style={{ padding: "24px 24px 32px" }}>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--gray-10)" }}>
            Niki does not currently provide subscriptions, checkout, accounts or usage metering. The
            local Apache-2.0 pipeline is available without a Niki paid plan.
          </p>
        </div>
      </Box>
    </Frame>
  );
}
