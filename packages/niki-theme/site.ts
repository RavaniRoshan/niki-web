/**
 * Centralized site URLs for Niki's web presence.
 *
 * Preferred production deployment:
 *   niki.dev       — marketing site (this app, apps/web)
 *   docs.niki.dev  — documentation (apps/docs, Blume)
 *
 * Until domains are configured, these constants are the single switch that
 * retargets every cross-site link in both apps. Never hardcode a site URL
 * outside this module.
 *
 * Overridable at build time via env vars (see resolved below) so preview
 * deployments and local dev can point links at their counterparts.
 */

const env = (key: string, fallback: string): string =>
  (typeof process !== "undefined" && process.env?.[key]) || fallback;

export const SITE = {
  /** Marketing site origin */
  web: env("NIKI_WEB_URL", "https://niki.dev"),
  /** Documentation site origin */
  docs: env("NIKI_DOCS_URL", "https://docs.niki.dev"),
  /** GitHub repository */
  repo: "https://github.com/RavaniRoshan/niki",
  /** GitHub Pages fallback for docs (current live deployment) */
  docsFallback: "https://ravaniroshan.github.io/niki/",
  name: "Niki",
  tagline: "One sentence in, a verified pull request out.",
  description:
    "Niki is the open-source multi-agent coding pipeline that plans, codes, tests, and reviews, then hands you a verified git branch.",
  twitter: "https://x.com/niki_dev",
  social: {
    github: "https://github.com/RavaniRoshan/niki",
    issues: "https://github.com/RavaniRoshan/niki/issues",
    // Discussions tab is disabled on the repo — issues is the support channel
    discussions: "https://github.com/RavaniRoshan/niki/issues",
  },
  /** Latest release info — data-driven; update per release or fetch dynamically later */
  release: {
    version: "0.7.0",
    tag: "v0.7.0",
    date: "2026-09-08",
    notes: "https://github.com/RavaniRoshan/niki/releases/tag/v0.7.0",
    latest: "https://github.com/RavaniRoshan/niki/releases/latest",
  },
} as const;

/** Marketing routes (relative to SITE.web) */
export const WEB_ROUTES = {
  home: "/",
  product: "/product",
  agents: "/product/agents",
  security: "/product/security",
  integrations: "/product/integrations",
  downloads: "/downloads",
  resources: "/resources",
  blog: "/resources/blog",
  changelog: "/resources/changelog",
  guides: "/resources/guides",
  examples: "/resources/examples",
  pricing: "/pricing",
  community: "/community",
  about: "/about",
} as const;

/**
 * Docs routes (relative to SITE.docs). Mirrors the Blume build output:
 * content sections keep their slugified names (numeric prefixes stripped),
 * GitHub Releases land under /changelog/, the index renders at /.
 */
export const DOCS_ROUTES = {
  home: "/",
  overview: "/overview/introduction",
  quickstart: "/overview/quickstart",
  installation: "/overview/installation",
  pipeline: "/agent-pipeline/pipeline-overview",
  security: "/sandboxing-security/security-architecture",
  providers: "/providers-byok/providers-overview",
  cli: "/cli-reference/cli-overview",
  configuration: "/configuration/config-file-guide",
  evals: "/evals-auditing/proof-not-promises",
  changelog: "/changelog",
} as const;

/** Absolute helpers used across both apps */
export const docsUrl = (path = "/"): string =>
  `${SITE.docs.replace(/\/$/, "")}${path === "/" ? "/" : path}`;
export const webUrl = (path = "/"): string =>
  `${SITE.web.replace(/\/$/, "")}${path === "/" ? "/" : path}`;
