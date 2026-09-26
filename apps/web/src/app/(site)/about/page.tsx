import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { WEB_ROUTES, SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "A pipeline you can inspect",
  description:
    "Niki is an open-source project built around one idea: AI-generated code should arrive as reviewable evidence: a local branch and changes.patch, plus artifacts and test results when a test command runs.",
  path: "/about",
});

const facts: [string, string][] = [
  ["What", "Multi-agent coding pipeline (CLI + TUI)"],
  ["Written in", "Rust, edition 2024"],
  ["License", "Apache-2.0"],
  ["Current release", `v${SITE.release.version} (${SITE.release.date})`],
  ["Sandbox", "Podman / Docker / git-worktree"],
  ["Providers", "12, BYOK"],
  ["Telemetry", "Feature-specific network use"],
];

export default function AboutPage() {
  return (
    <Frame>
      <Box first>
        <div className="ax-pagehead">
          <nav className="ax-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="text-gray-10">/</span>
            <span aria-current="page">about</span>
          </nav>
          <h1>A pipeline you can inspect.</h1>
          <p>
            Niki is an open-source project built around one idea: AI-generated code should arrive as
            reviewable evidence: a local branch and changes.patch, plus artifacts and test results
            when a test command runs.
          </p>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader heading="The short version" />
        <div className="ax-split">
          <div>
            <p>
              Niki is the open-source multi-agent coding pipeline: describe a task, and the full
              multiagent path can run Planner, Coder, Tester and Reviewer. In auto mode, a
              low-complexity task can collapse to Planner plus a solo Coder. Container backends use
              Podman or Docker; the worktree backend runs host-local processes.
            </p>
            <p>
              It&apos;s written in Rust as a single binary, licensed Apache-2.0, and designed for
              reviewing a local diff instead of steering an assistant through every edit.
            </p>
            <p>
              The project&apos;s public documentation points back to the repository, where the
              implementation and run artifacts can be inspected.
            </p>
          </div>
          <div style={{ background: "var(--gray-2)" }}>
            <h3
              className="ax-mono"
              style={{
                margin: 0,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--green)",
              }}
            >
              facts
            </h3>
            <dl className="ax-facts">
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
        <BoxHeader heading="Where to look next" />
        <div className="ax-grid ax-grid--3" style={{ padding: "8px 24px 40px" }}>
          {[
            ["The repository", "Implementation, issues and releases.", SITE.repo],
            ["The documentation", "Pipeline, sandbox, providers, CLI and config.", "/docs"],
            ["The changelog", "What shipped in each release.", WEB_ROUTES.changelog],
          ].map(([title, body, href]) => (
            <a key={title} href={href} className="ax-cell" style={{ textDecoration: "none" }}>
              <h3>{title}</h3>
              <p>{body}</p>
            </a>
          ))}
        </div>
        <div style={{ padding: "0 24px 40px" }}>
          <p style={{ color: "rgba(250,250,250,0.63)", margin: 0 }}>
            The name Niki carries personal meaning to its founder. Everything else on this page is
            checkable against the source.
          </p>
        </div>
      </Box>
    </Frame>
  );
}
