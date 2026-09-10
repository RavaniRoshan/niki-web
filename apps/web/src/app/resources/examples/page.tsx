import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { getCollection } from "@/lib/content";
import { WEB_ROUTES } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Tasks that run well",
  description:
    "Real task descriptions with what each pipeline stage produces — copy-paste starting points for your first runs.",
  path: "/resources/examples",
});

export default function ExamplesIndexPage() {
  const examples = getCollection("examples");

  return (
    <Frame>
      <Box first>
        <div className="nx-pagehead">
          <nav className="nx-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="sep">/</span>
            <Link href={WEB_ROUTES.resources}>resources</Link>
            <span className="sep">/</span>
            <span aria-current="page">examples</span>
          </nav>
          <h1>Tasks that run well.</h1>
          <p>
            Real task descriptions with what each pipeline stage produces — copy-paste starting
            points for your first runs.
          </p>
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader comment="tasks · prompts · verified output" heading="Examples" />
        <div className="nx-postlist">
          {examples.map((ex) => (
            <Link key={ex.slug} className="nx-post" href={`${WEB_ROUTES.examples}/${ex.slug}/`}>
              <div className="nx-post__meta">
                <time dateTime={ex.frontmatter.pubDate}>{ex.frontmatter.pubDate}</time>
                {ex.frontmatter.difficulty && (
                  <span className="nx-badge">{ex.frontmatter.difficulty}</span>
                )}
              </div>
              <h3>{ex.frontmatter.title}</h3>
              <p>{ex.frontmatter.description}</p>
              <span className="nx-arrow" style={{ marginTop: "6px" }}>
                Open example
              </span>
            </Link>
          ))}
        </div>
      </Box>
    </Frame>
  );
}
