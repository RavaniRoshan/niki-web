import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { RELEASES } from "@/data/changelog";
import { WEB_ROUTES, SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Every release, every change",
  description:
    "Niki's changelog, generated from the repository's CHANGELOG.md and GitHub Releases. Honest by construction — shipped means shipped.",
  path: "/resources/changelog",
});

export default function ChangelogPage() {
  const isUnreleased = (version: string) => version.toLowerCase() === "unreleased";
  const latestStableIdx = RELEASES.findIndex((rel) => !isUnreleased(rel.version));
  return (
    <Frame>
      <Box first>
        <div className="nx-pagehead">
          <nav className="nx-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="sep">/</span>
            <Link href={WEB_ROUTES.resources}>resources</Link>
            <span className="sep">/</span>
            <span aria-current="page">changelog</span>
          </nav>
          <h1>Every release, every change.</h1>
          <p>
            Niki&apos;s changelog, generated from the repository&apos;s CHANGELOG.md and GitHub
            Releases. Honest by construction — shipped means shipped.
          </p>
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader
          comment="releases"
          heading="Every release, every change."
          aside={
            <a
              className="nx-arrow"
              href={`${SITE.repo}/releases`}
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub Releases
            </a>
          }
        />
        <div className="nx-changelog">
          {RELEASES.map((rel, idx) => (
            <article
              key={rel.version}
              className="nx-ch-release"
              id={isUnreleased(rel.version) ? "unreleased" : `v${rel.version}`}
            >
              <header className="nx-ch-release__head">
                <h2>
                  <a href={rel.url} rel="noopener noreferrer" target="_blank">
                    {isUnreleased(rel.version) ? rel.version : `v${rel.version}`}
                  </a>
                </h2>
                {isUnreleased(rel.version) ? (
                  <span className="nx-badge">unreleased · master HEAD</span>
                ) : (
                  idx === latestStableIdx && <span className="nx-badge nx-badge--mint">latest</span>
                )}
                <time className="nx-mono" dateTime={rel.date}>
                  {rel.date}
                </time>
              </header>
              {rel.summary && <p className="nx-ch-release__summary">{rel.summary}</p>}
              {rel.categories.length > 0 && (
                <div className="nx-ch-release__cats">
                  {rel.categories.map((cat) => (
                    <div key={cat.name} className="nx-ch-cat">
                      <h3 className="nx-mono">{cat.name}</h3>
                      <ul>
                        {cat.items.map((item, i) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
        <div style={{ padding: "24px 24px 40px" }}>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--nk-text-muted)" }}>
            Full history on{" "}
            <a
              className="nx-link"
              href={`${SITE.repo}/releases`}
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub Releases
            </a>{" "}
            and the{" "}
            <a
              className="nx-link"
              href={`${SITE.repo}/blob/master/CHANGELOG.md`}
              rel="noopener noreferrer"
              target="_blank"
            >
              CHANGELOG.md
            </a>{" "}
            in the repository.
          </p>
        </div>
      </Box>
    </Frame>
  );
}
