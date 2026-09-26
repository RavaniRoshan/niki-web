import Link from "next/link";
import { notFound } from "next/navigation";
import { Frame, Box } from "@/components/Frame";
import { getCollection, getDoc, renderMarkdown } from "@/lib/content";
import { WEB_ROUTES } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export function generateStaticParams() {
  return getCollection("guides").map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc("guides", slug);
  if (!doc) return {};
  return pageMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    path: `/resources/guides/${slug}`,
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc("guides", slug);
  if (!doc) notFound();
  const html = renderMarkdown(doc.raw);

  return (
    <Frame>
      <Box first last>
        <article className="ax-article">
          <header>
            <Link className="ax-arrow" href={WEB_ROUTES.guides}>
              All guides
            </Link>
            <div className="ax-post__meta" style={{ margin: "18px 0 0" }}>
              <time dateTime={doc.frontmatter.pubDate}>{doc.frontmatter.pubDate}</time>
              <span>·</span>
              {doc.frontmatter.difficulty && (
                <span className="ax-badge">{doc.frontmatter.difficulty}</span>
              )}
              {doc.frontmatter.time && <span className="ax-badge">{doc.frontmatter.time}</span>}
            </div>
            <h1 style={{ margin: "18px 0 0" }}>{doc.frontmatter.title}</h1>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: "1.125rem",
                color: "rgba(250,250,250,0.63)",
              }}
            >
              {doc.frontmatter.description}
            </p>
          </header>
          <div
            className="ax-prose"
            style={{ marginTop: "32px" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </Box>
    </Frame>
  );
}
