import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { getCollection } from "@/lib/content";
import { WEB_ROUTES } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Writing about Niki",
  description:
    "Architecture reasoning, release breakdowns and design decisions: the why behind the pipeline.",
  path: "/resources/blog",
});

export default function BlogIndexPage() {
  const posts = getCollection("blog");

  return (
    <Frame>
      <Box first>
        <div className="ax-pagehead">
          <nav className="ax-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="text-gray-10">/</span>
            <Link href={WEB_ROUTES.resources}>resources</Link>
            <span className="text-gray-10">/</span>
            <span aria-current="page">blog</span>
          </nav>
          <h1>Writing about Niki.</h1>
          <p>
            Architecture reasoning, release breakdowns and design decisions: the why behind the
            pipeline.
          </p>
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader heading="Writing" />
        <div className="ax-postlist">
          {posts.map((post) => (
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
