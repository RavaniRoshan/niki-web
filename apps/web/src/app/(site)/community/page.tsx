import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl, SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Open source, in the open",
  description:
    "Find Niki issues, contribution guidance, security reporting, evaluation methodology, and release notes in the project repository.",
  path: "/community",
});

const channels = [
  {
    title: "Issue Tracker",
    href: SITE.social.issues,
    body: "Bugs, feature requests and questions: the main support channel.",
    cta: "Browse issues",
    internal: false,
  },
  {
    title: "Contributing",
    href: `${SITE.repo}/blob/master/CONTRIBUTING.md`,
    body: "Contribution guidance, checks, and security expectations. Start here.",
    cta: "Read the guide",
    internal: false,
  },
  {
    title: "Code of Conduct",
    href: `${SITE.repo}/blob/master/CODE_OF_CONDUCT.md`,
    body: "Participation expectations and enforcement contacts.",
    cta: "Read the code of conduct",
    internal: false,
  },
  {
    title: "Security reports",
    href: `${SITE.repo}/blob/master/SECURITY.md`,
    body: "Found something? The disclosure policy and private channel.",
    cta: "Read the policy",
    internal: false,
  },
  {
    title: "Evals & benchmarks",
    href: docsUrl(DOCS_ROUTES.evals),
    body: "How Niki measures itself: seeded-defect harness, disclosure manifests.",
    cta: "Read the methodology",
    internal: false,
  },
];

const commitments = [
  "Claims link to repository code, docs, or run artifacts where available",
  "Evals disclose methodology, costs and maintainer judgments",
  "CI gates: fmt, clippy warning-free, tests, supply-chain checks",
  "Releases use cargo-dist; verify the current release checksum information",
];

export default function CommunityPage() {
  return (
    <Frame>
      <Box first>
        <div className="ax-pagehead">
          <nav className="ax-breadcrumbs" aria-label="Breadcrumb">
            <a href={WEB_ROUTES.home}>niki</a>
            <span className="text-gray-10">/</span>
            <span aria-current="page">community</span>
          </nav>
          <h1>Open source, in the open.</h1>
          <p>
            Find issues, contribution guidance, security reporting, evaluation methodology, and
            release notes in the project repository. Here&apos;s where to plug in.
          </p>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="Where to plug in."
          aside={<span className="ax-badge">repository-first: issues are the support channel</span>}
        />
        <div className="ax-grid ax-grid--3">
          {channels.map((c) => (
            <a
              key={c.title}
              className="ax-cell"
              style={{ textDecoration: "none" }}
              href={c.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <span className="ax-arrow" style={{ marginTop: "auto", paddingTop: "8px" }}>
                {c.cta}
              </span>
            </a>
          ))}
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader heading="What we commit to." />
        <div className="ax-split">
          <div>
            <p>
              Claims map to code and documentation. Releases note what changed; the repository is
              the place to inspect implementation details and report corrections.
            </p>
          </div>
          <div>
            <ul className="ax-checklist">
              {commitments.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </Box>
    </Frame>
  );
}
