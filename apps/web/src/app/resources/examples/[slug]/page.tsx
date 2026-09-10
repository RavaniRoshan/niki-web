import Link from "next/link";
import { notFound } from "next/navigation";
import { Frame, Box } from "@/components/Frame";
import { getCollection, getDoc, renderMarkdown } from "@/lib/content";
import { WEB_ROUTES } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export function generateStaticParams() {
  return getCollection("examples").map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc("examples", slug);
  if (!doc) return {};
  return pageMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/resources/examples/${slug}`,
  });
}

export default async function ExamplePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc("examples", slug);
  if (!doc) notFound();
  const html = renderMarkdown(doc.raw);

  return (
    <Frame>
      <Box first last>
        <article className="nx-article">
          <header>
            <Link className="nx-arrow" href={WEB_ROUTES.examples}>
              All examples
            </Link>
            <div className="nx-post__meta" style={{ margin: "18px 0 0" }}>
              <time dateTime={doc.frontmatter.pubDate}>{doc.frontmatter.pubDate}</time>
              <span>·</span>
              {doc.frontmatter.difficulty && (
                <span className="nx-badge">{doc.frontmatter.difficulty}</span>
              )}
              {doc.frontmatter.stack?.map((s) => (
                <span key={s} className="nx-badge">
                  {s}
                </span>
              ))}
            </div>
            <h1 style={{ margin: "18px 0 0" }}>{doc.frontmatter.title}</h1>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: "1.125rem",
                color: "var(--nk-text-secondary)",
              }}
            >
              {doc.frontmatter.description}
            </p>
          </header>
          <div
            className="nx-prose"
            style={{ marginTop: "32px" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </Box>
    </Frame>
  );
}
