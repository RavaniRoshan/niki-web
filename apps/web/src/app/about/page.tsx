import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { WEB_ROUTES, SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "A pipeline you can verify",
  description:
    "Niki is an open-source project built around one idea: AI-generated code should arrive as evidence — a branch you can review, tests that ran, and a trail of what every agent decided.",
  path: "/about",
});

const facts: [string, string][] = [
  ["What", "Multi-agent coding pipeline (CLI + TUI)"],
  ["Written in", "Rust, edition 2024"],
  ["License", "Apache-2.0"],
  ["Current release", `v${SITE.release.version} (${SITE.release.date})`],
  ["Sandbox", "Podman / Docker / git-worktree"],
  ["Providers", "12, BYOK"],
  ["Telemetry", "None"],
];

export default function AboutPage() {
  return (
    <Frame>
      <Box first>
        <div className="nx-pagehead">
          <nav className="nx-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="sep">/</span>
            <span aria-current="page">about</span>
          </nav>
          <h1>A pipeline you can verify.</h1>
          <p>
            Niki is an open-source project built around one idea: AI-generated code should arrive as
            evidence — a branch you can review, tests that ran, and a trail of what every agent
            decided.
          </p>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader comment="the short version" heading="The short version" />
        <div className="nx-split" style={{ borderBottom: "1px solid var(--nk-surface-border)" }}>
          <div>
            <p>
              Niki is the open-source multi-agent coding pipeline: describe a task, and four
              independent agents — Planner, Coder, Tester, Reviewer — plan, code, test and review it
              inside hermetic sandboxes. What comes back is a verified git branch with the entire
              decision trail.
            </p>
            <p>
              It&apos;s written in Rust as a single binary, licensed Apache-2.0, and built for solo
              developers and small teams who want to delegate multi-file tasks and review a polished
              result — instead of steering an assistant through every edit.
            </p>
            <p>
              The project holds itself to a simple bar: every public claim is reproducible from the
              repository. When reality and copy drift, copy loses.
            </p>
          </div>
          <div style={{ background: "var(--nk-bg-1)" }}>
            <h3
              className="nx-mono"
              style={{
                margin: 0,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--nk-mint)",
              }}
            >
              facts
            </h3>
            <dl className="nx-facts">
              {facts.map(([term, def]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{def}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader comment="the name" heading="The name" />
        <div style={{ padding: "24px 24px 40px", maxWidth: "560px" }}>
          <p style={{ color: "var(--nk-text-secondary)" }}>
            NIKI carries personal meaning to its founder. It&apos;s short, it types fast, and it
            doesn&apos;t pretend to be an acronym.
          </p>
        </div>
      </Box>
    </Frame>
  );
}
