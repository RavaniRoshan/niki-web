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

const project = [
  { label: "GitHub", href: SITE.repo },
  { label: "Issue Tracker", href: SITE.social.issues },
  { label: "Releases", href: SITE.release.latest },
];

export default function Footer() {
  return (
    <footer className="nx-footer">
      {/* Top rail: giant wordmark + tagline */}
      <div className="nx-footer__mast">
        <p className="nx-footer__word nx-mono" aria-hidden="true">
          niki
        </p>
        <p className="nx-footer__word-tag">One sentence in, a verified pull request out.</p>
      </div>

      {/* Link columns on hairline grid */}
      <div className="nx-footer__grid">
        <div className="nx-footer__brand">
          <p className="nx-footer__meta nx-mono">Apache-2.0 · Rust · v{SITE.release.version}</p>
          <p className="nx-footer__meta nx-footer__meta--dim">
            No telemetry. Your keys stay yours.
          </p>
          <p className="nx-footer__meta nx-footer__meta--dim">© 2026 Niki contributors.</p>
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
          {project.map((l) => (
            <a key={l.href} href={l.href} rel="noopener noreferrer" target="_blank">
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Easter-egg terminal strip */}
      <div className="nx-footer__term" aria-hidden="true">
        <span className="nx-footer__term-line nx-mono">
          <span className="nx-t-mint">$</span> niki run "make the web presence" — pipeline:{" "}
          <span className="nx-t-ok">healthy</span>
        </span>
        <span className="nx-footer__term-cursor nx-mono" />
      </div>

      <div className="nx-footer__bottom">
        <p>
          Niki is a multi-agent coding pipeline — the agents write the code, you review the branch.
        </p>
        <p className="nx-footer__build nx-mono">// verified by niki v{SITE.release.version}</p>
      </div>
    </footer>
  );
}
