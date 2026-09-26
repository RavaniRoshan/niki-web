import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { getCollection } from "@/lib/content";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl, SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Guides, articles and release notes",
  description:
    "Everything we've written about running, extending and understanding Niki, from your first verified branch to per-agent provider tuning.",
  path: "/resources",
});

export default function ResourcesPage() {
  const blog = getCollection("blog");
  const blogCount = blog.length;

  const cards = [
    {
      title: "Blog",
      href: WEB_ROUTES.blog,
      internal: true,
      body: "Architecture deep-dives and design reasoning: why four agents, and why independence is enforceable.",
      note: `${blogCount} article${blogCount === 1 ? "" : "s"}`,
    },
    {
      title: "Changelog",
      href: WEB_ROUTES.changelog,
      internal: true,
      body: "Every release, generated from GitHub Releases: what shipped, what changed, what got fixed.",
      note: `v${SITE.release.version} latest`,
    },
    {
      title: "Guides",
      href: WEB_ROUTES.guides,
      internal: true,
      body: "Step-by-step walkthroughs: first verified branch, provider mixing, sandbox setup.",
      note: undefined,
    },
    {
      title: "Examples",
      href: WEB_ROUTES.examples,
      internal: true,
      body: "Real task descriptions that run well through the pipeline, with what each agent produces.",
      note: undefined,
    },
    {
      title: "Evals methodology",
      href: docsUrl(DOCS_ROUTES.evals),
      internal: false,
      body: "How Niki audits its own claims: the seeded-defect harness and disclosure manifests.",
      note: undefined,
    },
    {
      title: "Documentation",
      href: docsUrl(DOCS_ROUTES.home),
      internal: false,
      body: "The full reference: pipeline, sandboxing, providers, CLI, configuration.",
      note: undefined,
    },
  ];

  return (
    <Frame>
      <Box first>
        <div className="ax-pagehead">
          <nav className="ax-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="text-gray-10">/</span>
            <span aria-current="page">resources</span>
          </nav>
          <h1>Guides, articles and release notes.</h1>
          <p>
            Everything we&apos;ve written about running, extending and understanding Niki, from your
            first verified branch to per-agent provider tuning.
          </p>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="Everything we have written."
          aside={<span className="ax-badge">blog · guides · examples · docs</span>}
        />
        <div className="ax-postlist">
          {cards.map((card) =>
            card.internal ? (
              <Link key={card.title} className="ax-post" href={card.href}>
                <div className="ax-post__meta">
                  <span className="ax-index" style={{ fontSize: "0.6875rem" }}>
                    {card.note ?? "collection"}
                  </span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <span className="ax-arrow" style={{ marginTop: "6px" }}>
                  Open
                </span>
              </Link>
            ) : (
              <a
                key={card.title}
                className="ax-post"
                href={card.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="ax-post__meta">
                  <span className="ax-index" style={{ fontSize: "0.6875rem" }}>
                    docs
                  </span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <span className="ax-arrow" style={{ marginTop: "6px" }}>
                  Open
                </span>
              </a>
            )
          )}
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader heading="Latest writing" />
        <div className="ax-postlist">
          {blog.slice(0, 3).map((post) => (
            <Link key={post.slug} className="ax-post" href={`${WEB_ROUTES.blog}/${post.slug}/`}>
              <div className="ax-post__meta">
                <time dateTime={post.frontmatter.pubDate}>{post.frontmatter.pubDate}</time>
                {post.frontmatter.tags?.map((tag) => (
                  <span key={tag} className="ax-badge">
                    {tag}
                  </span>
                ))}
              </div>
              <h3>{post.frontmatter.title}</h3>
              <p>{post.frontmatter.description}</p>
              <span className="ax-arrow" style={{ marginTop: "6px" }}>
                Read
              </span>
            </Link>
          ))}
        </div>
      </Box>
    </Frame>
  );
}
