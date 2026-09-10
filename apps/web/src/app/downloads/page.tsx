import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import CodeBlock from "@/components/CodeBlock";
import { RELEASE, TARGETS, INSTALLERS, CHECKSUMS } from "@/data/release";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: `Niki ${RELEASE.version} download`,
  description: `Current stable release, ${RELEASE.date}. Static binaries built by cargo-dist — checksum-verified. One Rust binary, no runtime, no daemon.`,
  path: "/downloads",
});

const osDesc: Record<string, string> = {
  macOS: "Apple Silicon & Intel · Homebrew or installer",
  Linux: "x86_64 & ARM64 · installer script or direct download",
  Windows: "x86_64 · PowerShell installer or direct download",
};

const assetUrl = (t: (typeof TARGETS)[number]): string =>
  `${RELEASE.repoBase}/releases/download/${RELEASE.tag}/${t.archive}.${t.archiveExt}`;

export default function DownloadsPage() {
  const byOs = ["macOS", "Linux", "Windows"] as const;

  return (
    <Frame>
      <Box first>
        <div className="nx-pagehead">
          <nav className="nx-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="sep">/</span>
            <span aria-current="page">downloads</span>
          </nav>
          <h1>Niki {RELEASE.version}</h1>
          <p>
            Current stable release, {RELEASE.date}. Static binaries built by cargo-dist —
            checksum-verified. One Rust binary, no runtime, no daemon.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
            <a className="nx-btn nx-btn--primary" href={docsUrl(DOCS_ROUTES.installation)}>
              Install docs
            </a>
            <a
              className="nx-btn nx-btn--ghost"
              href={RELEASE.notes}
              rel="noopener noreferrer"
              target="_blank"
            >
              Release notes
            </a>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          comment="quick install · checksum-verified"
          heading="One command, checksum-verified."
          aside={
            <span className="nx-badge">
              the installer resolves the latest release and verifies SHA256 before installing
            </span>
          }
        />
        <div className="nx-split" style={{ borderBottom: "1px solid var(--nk-surface-border)" }}>
          <div style={{ display: "grid", gap: "16px", alignContent: "start" }}>
            <p style={{ margin: 0 }}>
              Pick your platform — the installer resolves the latest release and verifies SHA256
              before installing.
            </p>
            <CodeBlock label={INSTALLERS.shell.label} code={INSTALLERS.shell.command} />
            <CodeBlock label={INSTALLERS.powershell.label} code={INSTALLERS.powershell.command} />
          </div>
          <div style={{ display: "grid", gap: "16px", alignContent: "start" }}>
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Package managers</h2>
            <CodeBlock label="Homebrew (macOS/Linux)" code={INSTALLERS.homebrew.command} />
            <CodeBlock label="Cargo (from source)" code={INSTALLERS.cargo.command} />
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--nk-text-muted)" }}>
              {INSTALLERS.homebrew.note} {INSTALLERS.cargo.note}
            </p>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          comment="direct downloads · every target"
          heading="Binaries for every target"
          aside={
            <span className="nx-badge">
              {RELEASE.version} ({RELEASE.tag}, {RELEASE.date})
            </span>
          }
        />
        <p style={{ padding: "0 24px 20px", margin: 0, color: "var(--nk-text-secondary)" }}>
          Every archive has a <code className="nx-inline">.sha256</code> sidecar; verify with{" "}
          <code className="nx-inline">sha256sum -c</code>.
        </p>
        <div className="nx-table-wrap">
          <table className="nx-table">
            <thead>
              <tr>
                <th>OS</th>
                <th>Target</th>
                <th>Download</th>
                <th>Checksum</th>
              </tr>
            </thead>
            <tbody>
              {byOs.flatMap((os) =>
                TARGETS.filter((t) => t.os === os).map((t, i) => (
                  <tr key={t.triple}>
                    <td>{i === 0 ? os : ""}</td>
                    <td>
                      <code>{t.triple}</code>
                    </td>
                    <td>
                      <a
                        className="nx-link"
                        href={assetUrl(t)}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {t.archive}.{t.archiveExt}
                      </a>
                      <span style={{ color: "var(--nk-text-muted)", fontSize: "0.8125rem" }}>
                        {" "}
                        — {t.label}
                      </span>
                    </td>
                    <td>
                      <a
                        className="nx-link"
                        href={t.sha256}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        .sha256
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "16px",
            padding: "20px 24px 28px",
          }}
        >
          <a
            className="nx-btn nx-btn--ghost nx-btn--sm"
            href={CHECKSUMS.bundle}
            rel="noopener noreferrer"
            target="_blank"
          >
            Download sha256.sum
          </a>
          <span style={{ fontSize: "0.8125rem", color: "var(--nk-text-muted)" }}>
            {CHECKSUMS.note}
          </span>
        </div>
      </Box>

      <Strip />

      <Box>
        <div className="nx-split">
          <div>
            <h2 style={{ marginTop: 0, fontSize: "1.375rem" }}>Verify your download.</h2>
            <p>
              The installer verifies checksums automatically. For direct downloads, verify against
              the release checksums before trusting the binary.
            </p>
            <p style={{ marginTop: "4px", fontSize: "0.8125rem", color: "var(--nk-text-muted)" }}>
              {osDesc.macOS} · {osDesc.Linux} · {osDesc.Windows}
            </p>
          </div>
          <div>
            <CodeBlock
              label="manual verification"
              code={`curl -fsSLO ${RELEASE.repoBase}/releases/download/${RELEASE.tag}/sha256.sum
sha256sum -c sha256.sum --ignore-missing`}
            />
          </div>
        </div>
      </Box>

      <Strip />

      <Box last>
        <div className="nx-cta">
          <h2>Installed. What&apos;s next?</h2>
          <p>
            Three commands to your first verified branch — no container runtime required to start.
          </p>
          <CodeBlock
            label="first run (worktree backend — no container needed)"
            code={`niki init --interactive
niki run "Add a /health endpoint" --backend worktree
niki report <id>   # the full audit trail`}
          />
          <div className="nx-cta__actions">
            <a className="nx-btn nx-btn--primary" href={docsUrl(DOCS_ROUTES.quickstart)}>
              Full quickstart
            </a>
            <a className="nx-btn nx-btn--ghost" href={docsUrl(DOCS_ROUTES.installation)}>
              Install docs
            </a>
          </div>
        </div>
      </Box>
    </Frame>
  );
}
