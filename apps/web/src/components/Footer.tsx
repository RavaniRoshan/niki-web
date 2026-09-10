import Link from "next/link";
import { SITE, WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";

const product = [
  { label: "Overview", href: WEB_ROUTES.product },
  { label: "Multi-Agent Pipeline", href: WEB_ROUTES.agents },
  { label: "Security & Sandboxing", href: WEB_ROUTES.security },
  { label: "Integrations", href: WEB_ROUTES.integrations },
];

const resources = [
  { label: "Blog", href: WEB_ROUTES.blog },
  { label: "Changelog", href: WEB_ROUTES.changelog },
  { label: "Guides", href: WEB_ROUTES.guides },
  { label: "Examples", href: WEB_ROUTES.examples },
];

const siteLinks = [
  { label: "Downloads", href: WEB_ROUTES.downloads },
  { label: "Pricing", href: WEB_ROUTES.pricing },
  { label: "Community", href: WEB_ROUTES.community },
  { label: "About", href: WEB_ROUTES.about },
];

export default function Footer() {
  return (
    <footer className="nx-footer">
      <div className="nx-footer__grid">
        <div className="nx-footer__brand">
          <div className="nx-footer__brand-mark">
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <rect
                x="1.5"
                y="1.5"
                width="29"
                height="29"
                fill="var(--nk-bg-1)"
                stroke="var(--nk-surface-border)"
              />
              <path
                d="M9 22.5 L9 9.5 L23 22.5 L23 9.5"
                fill="none"
                stroke="var(--nk-mint)"
                strokeWidth="2.6"
                strokeLinecap="square"
              />
            </svg>
            <span className="nx-footer__brand-text">niki</span>
          </div>
          <p className="nx-footer__tagline">{SITE.tagline}</p>
          <p className="nx-footer__meta">Apache-2.0 · Rust · v{SITE.release.version}</p>
          <p className="nx-footer__meta nx-footer__meta--dim">
            No telemetry. Your keys stay yours.
          </p>
        </div>

        <nav className="nx-footer__col" aria-label="Product">
          <p className="nx-footer__label">Product</p>
          {product.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <nav className="nx-footer__col" aria-label="Resources">
          <p className="nx-footer__label">Resources</p>
          {resources.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <a href={docsUrl(DOCS_ROUTES.home)}>Documentation</a>
        </nav>

        <nav className="nx-footer__col" aria-label="Site">
          <p className="nx-footer__label">Site</p>
          {siteLinks.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <nav className="nx-footer__col" aria-label="Project">
          <p className="nx-footer__label">Project</p>
          <a href={SITE.repo} rel="noopener noreferrer" target="_blank">
            GitHub
          </a>
          <a href={SITE.social.issues} rel="noopener noreferrer" target="_blank">
            Issue Tracker
          </a>
          <a href={SITE.release.latest} rel="noopener noreferrer" target="_blank">
            Releases
          </a>
        </nav>
      </div>

      <div className="nx-footer__bottom">
        <p>
          © 2026 Niki contributors. Apache-2.0. Niki is a multi-agent coding pipeline — the agents
          write the code, you review the branch.
        </p>
        <p className="nx-footer__build nx-mono">// verified by niki v{SITE.release.version}</p>
      </div>
    </footer>
  );
}
