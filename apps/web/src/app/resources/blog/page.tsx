import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { getCollection } from "@/lib/content";
import { WEB_ROUTES } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Writing about Niki",
  description:
    "Architecture reasoning, release breakdowns and design decisions — the why behind the pipeline.",
  path: "/resources/blog",
});

export default function BlogIndexPage() {
  const posts = getCollection("blog");

  return (
    <Frame>
      <Box first>
        <div className="nx-pagehead">
          <nav className="nx-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="sep">/</span>
            <Link href={WEB_ROUTES.resources}>resources</Link>
            <span className="sep">/</span>
            <span aria-current="page">blog</span>
          </nav>
          <h1>Writing about Niki.</h1>
          <p>
            Architecture reasoning, release breakdowns and design decisions — the why behind the
            pipeline.
          </p>
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader comment="writing · ship notes · deep dives" heading="Writing" />
        <div className="nx-postlist">
          {posts.map((post) => (
            <Link key={post.slug} className="nx-post" href={`${WEB_ROUTES.blog}/${post.slug}/`}>
              <div className="nx-post__meta">
                <time dateTime={post.frontmatter.pubDate}>{post.frontmatter.pubDate}</time>
                {post.frontmatter.tags?.map((tag) => (
                  <span key={tag} className="nx-badge">
                    {tag}
                  </span>
                ))}
              </div>
              <h3>{post.frontmatter.title}</h3>
              <p>{post.frontmatter.description}</p>
              <span className="nx-arrow" style={{ marginTop: "6px" }}>
                Read
              </span>
            </Link>
          ))}
        </div>
      </Box>
    </Frame>
  );
}
