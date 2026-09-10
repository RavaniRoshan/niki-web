import Link from "next/link";
import { Frame, Box } from "@/components/Frame";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";

export default function NotFound() {
  return (
    <Frame>
      <Box first last>
        <div className="nx-pagehead">
          <nav className="nx-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="sep">/</span>
            <span aria-current="page">404</span>
          </nav>
          <h1>Branch not found.</h1>
          <p>This route doesn&apos;t exist. The pipeline, however, is very much on track.</p>
        </div>
        <div
          style={{
            padding: "0 24px 80px",
            display: "flex",
            flexFlow: "column",
            gap: "24px",
            alignItems: "flex-start",
          }}
        >
          <div className="nx-code" style={{ width: "min(100%, 480px)" }}>
            <div className="nx-code__label">
              <span>status</span>
            </div>
            <pre className="nx-code__body">
              <code>
                $ niki status{"\n"}◈ ⟠ ◉ ◆ page: not found{"\n"}✓ pipeline: healthy
              </code>
            </pre>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <Link className="nx-btn nx-btn--primary" href={WEB_ROUTES.home}>
              Back home
            </Link>
            <a className="nx-btn nx-btn--ghost" href={docsUrl(DOCS_ROUTES.home)}>
              Read the docs
            </a>
            <Link className="nx-btn nx-btn--ghost" href={WEB_ROUTES.downloads}>
              Downloads
            </Link>
          </div>
        </div>
      </Box>
    </Frame>
  );
}
