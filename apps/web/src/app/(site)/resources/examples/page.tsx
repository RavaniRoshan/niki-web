import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { getCollection } from "@/lib/content";
import { WEB_ROUTES } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Tasks that run well",
  description:
    "Real task descriptions with what each pipeline stage produces: copy-paste starting points for your first runs.",
  path: "/resources/examples",
});

export default function ExamplesIndexPage() {
  const examples = getCollection("examples");

  return (
    <Frame>
      <Box first>
        <div className="ax-pagehead">
          <nav className="ax-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="text-gray-10">/</span>
            <Link href={WEB_ROUTES.resources}>resources</Link>
            <span className="text-gray-10">/</span>
            <span aria-current="page">examples</span>
          </nav>
          <h1>Tasks that run well.</h1>
          <p>
            Real task descriptions with what each pipeline stage produces: copy-paste starting
            points for your first runs.
          </p>
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader heading="Examples" />
        <div className="ax-postlist">
          {examples.map((ex) => (
            <Link key={ex.slug} className="ax-post" href={`${WEB_ROUTES.examples}/${ex.slug}/`}>
              <div className="ax-post__meta">
                <time dateTime={ex.frontmatter.pubDate}>{ex.frontmatter.pubDate}</time>
                {ex.frontmatter.difficulty && (
                  <span className="ax-badge">{ex.frontmatter.difficulty}</span>
                )}
              </div>
              <h3>{ex.frontmatter.title}</h3>
              <p>{ex.frontmatter.description}</p>
              <span className="ax-arrow" style={{ marginTop: "6px" }}>
                Open example
              </span>
            </Link>
          ))}
        </div>
      </Box>
    </Frame>
  );
}
