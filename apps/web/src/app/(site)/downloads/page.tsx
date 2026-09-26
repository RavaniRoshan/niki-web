import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import CodeBlock from "@/components/CodeBlock";
import { RELEASE, TARGETS, INSTALLERS, CHECKSUMS } from "@/data/release";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";
import Link from "next/link";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: `Niki ${RELEASE.version} download`,
  description: `Current stable release, ${RELEASE.date}. Release archives are built by cargo-dist; verify the downloaded archive against the current release checksum information before use. One Rust binary; no hosted service.`,
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
        <div className="ax-pagehead">
          <nav className="ax-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="text-gray-10">/</span>
            <span aria-current="page">downloads</span>
          </nav>
          <h1>Niki {RELEASE.version}</h1>
          <p>
            Current stable release, {RELEASE.date}. Release archives are built by cargo-dist; verify
            the downloaded archive against the current release checksum information before use. One
            Rust binary; no hosted service.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
            <Link className="ax-btn ax-btn--primary" href={WEB_ROUTES.home}>
              Get Started
            </Link>
            <a className="ax-btn ax-btn--ghost" href={docsUrl(DOCS_ROUTES.installation)}>
              Read the Docs
            </a>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="Install and verify."
          aside={
            <span className="ax-badge">
              the repository installer resolves the latest release and checks the downloaded archive
            </span>
          }
        />
        <div className="ax-split">
          <div className="ax-grid" style={{ alignContent: "start" }}>
            <p style={{ margin: 0 }}>
              Pick your platform. The repository installer resolves the latest release and checks
              the downloaded archive before installing.
            </p>
            <CodeBlock label={INSTALLERS.shell.label} code={INSTALLERS.shell.command} />
            <CodeBlock label={INSTALLERS.powershell.label} code={INSTALLERS.powershell.command} />
          </div>
          <div className="ax-grid" style={{ alignContent: "start" }}>
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Package managers</h2>
            <CodeBlock label="Homebrew (macOS/Linux)" code={INSTALLERS.homebrew.command} />
            <CodeBlock label="Cargo (from source)" code={INSTALLERS.cargo.command} />
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--gray-10)" }}>
              {INSTALLERS.homebrew.note} {INSTALLERS.cargo.note}
            </p>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="Binaries for every target"
          aside={
            <span className="ax-badge">
              {RELEASE.version} ({RELEASE.tag}, {RELEASE.date})
            </span>
          }
        />
        <p style={{ padding: "0 24px 20px", margin: 0, color: "rgba(250,250,250,0.63)" }}>
          Release asset names and checksum manifests have varied across installers. Check the
          current release page, compare the archive&apos;s SHA-256 digest with the matching manifest
          entry, and only then run the binary.
        </p>
        <div className="ax-grid ax-grid--3" data-anim="stagger" style={{ gap: 1 }}>
          {byOs.map((os) => (
            <div className="ax-cell ax-cell--tight" key={os}>
              <span className="ax-index">{os.toLowerCase()}</span>
              <h3>{os}</h3>
              <p style={{ marginBottom: 8, color: "var(--gray-10)", fontSize: "0.8125rem" }}>
                {osDesc[os]}
              </p>
              <ul className="ax-dl-list">
                {TARGETS.filter((t) => t.os === os).map((t) => (
                  <li key={t.triple}>
                    <div className="ax-dl-row">
                      <code>{t.triple}</code>
                      <a
                        className="ax-link"
                        href={assetUrl(t)}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {t.archive}.{t.archiveExt}
                      </a>
                    </div>
                    <a
                      className="ax-link ax-dl-sha"
                      href={t.releaseFiles}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      release files
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
            className="ax-btn ax-btn--ghost ax-btn--sm"
            href={CHECKSUMS.release}
            rel="noopener noreferrer"
            target="_blank"
          >
            View release files
          </a>
          <span style={{ fontSize: "0.8125rem", color: "var(--gray-10)" }}>{CHECKSUMS.note}</span>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="Verify your download."
          aside={<span className="ax-badge">SHA-256 · compare before you run</span>}
        />
        <div className="ax-split">
          <div>
            <p>
              The repository installer verifies its downloaded archive automatically. For direct
              downloads, compare the archive&apos;s SHA-256 digest with the current release manifest
              before running the binary.
            </p>
            <p style={{ marginTop: "4px", fontSize: "0.8125rem", color: "var(--gray-10)" }}>
              {osDesc.macOS} · {osDesc.Linux} · {osDesc.Windows}
            </p>
          </div>
          <div>
            <CodeBlock
              label="checksum verification"
              code={`Download the archive and the current release checksum manifest.
Compare the archive's SHA-256 digest with the matching entry using
your platform's checksum tool before running the binary.`}
            />
          </div>
        </div>
      </Box>

      <Strip />

      <Box last>
        <div className="ax-cta">
          <h2>Installed. What&apos;s next?</h2>
          <p>A first local run with the worktree backend does not require a container runtime.</p>
          <CodeBlock
            label="first run (worktree backend, no container needed)"
            code={`niki init --interactive
niki run "Add a /health endpoint" --backend worktree
niki report <id>   # the full audit trail`}
          />
          <div className="ax-cta__actions">
            <Link className="ax-btn ax-btn--primary" href={WEB_ROUTES.home}>
              Get Started
            </Link>
            <a className="ax-btn ax-btn--ghost" href={docsUrl(DOCS_ROUTES.quickstart)}>
              Read the Docs
            </a>
          </div>
        </div>
      </Box>
    </Frame>
  );
}
