import Link from "next/link";
import { Frame, Box } from "@/components/Frame";
import SiteChrome from "@/components/site/SiteChrome";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";

export default function NotFound() {
  return (
    <SiteChrome>
      <Frame>
        <Box first last>
          <div className="ax-pagehead">
            <nav className="ax-breadcrumbs" aria-label="Breadcrumb">
              <a href={WEB_ROUTES.home}>niki</a>
              <span className="text-gray-10">/</span>
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
            <div className="ax-code" style={{ width: "min(100%, 480px)" }}>
              <div className="ax-code__label">
                <span>status</span>
              </div>
              <pre className="ax-code__body">
                <code>
                  $ niki status{"\n"}◈ ⟠ ◉ ◆ page: not found{"\n"}✓ pipeline: healthy
                </code>
              </pre>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <Link className="ax-btn ax-btn--primary" href={WEB_ROUTES.downloads}>
                Get Started
              </Link>
              <a className="ax-btn ax-btn--ghost" href={docsUrl(DOCS_ROUTES.home)}>
                Read the Docs
              </a>
            </div>
          </div>
        </Box>
      </Frame>
    </SiteChrome>
  );
}
