import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { getCollection } from "@/lib/content";
import { WEB_ROUTES } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Guides",
  description:
    "Step-by-step walkthroughs for the workflows that matter: first runs, provider tuning, sandbox hardening.",
  path: "/resources/guides",
});

export default function GuidesIndexPage() {
  const guides = getCollection("guides");

  return (
    <Frame>
      <Box first>
        <div className="ax-pagehead">
          <nav className="ax-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="text-gray-10">/</span>
            <Link href={WEB_ROUTES.resources}>resources</Link>
            <span className="text-gray-10">/</span>
            <span aria-current="page">guides</span>
          </nav>
          <h1>Guides.</h1>
          <p>
            Step-by-step walkthroughs for the workflows that matter: first runs, provider tuning,
            sandbox hardening.
          </p>
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader heading="Guides" />
        <div className="ax-postlist">
          {guides.map((guide) => (
            <Link key={guide.slug} className="ax-post" href={`${WEB_ROUTES.guides}/${guide.slug}/`}>
              <div className="ax-post__meta">
                <time dateTime={guide.frontmatter.pubDate}>{guide.frontmatter.pubDate}</time>
                {guide.frontmatter.difficulty && (
                  <span className="ax-badge">{guide.frontmatter.difficulty}</span>
                )}
                {guide.frontmatter.time && (
                  <span className="ax-badge">{guide.frontmatter.time}</span>
                )}
              </div>
              <h3>{guide.frontmatter.title}</h3>
              <p>{guide.frontmatter.description}</p>
              <span className="ax-arrow" style={{ marginTop: "6px" }}>
                Read guide
              </span>
            </Link>
          ))}
        </div>
      </Box>
    </Frame>
  );
}
