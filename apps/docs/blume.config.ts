import { defineConfig } from "blume";
import { SITE } from "@niki/theme/site";

export default defineConfig({
  title: "Niki Docs",
  description:
    "Niki documentation — the open-source multi-agent coding pipeline that plans, codes, tests, and reviews, then hands you a verified git branch.",
  logo: {
    image: {
      dark: "/logo-mark.svg",
      light: "/logo-mark.svg",
      alt: "Niki",
    },
    text: "niki",
    href: "https://niki.dev",
  },
  github: {
    owner: "RavaniRoshan",
    repo: "niki",
    branch: "master",
    dir: "docs",
  },
  banner: {
    content: "Niki v0.7.0 — plan mode, honest metering, headless CI contract.",
    link: {
      href: "https://niki.dev/resources/changelog",
      text: "Read the release notes",
    },
    dismissible: true,
  },
  theme: {
    accent: {
      dark: "#ff2e2e",
      light: "#b31414",
    },
    action: "#ff2e2e",
    background: {
      dark: "#0c0b0a",
      light: "#faf9f8",
    },
    fonts: {
      body: "inter",
      display: "inter",
      mono: "jetbrains-mono",
    },
    mode: "dark",
    radius: "md",
  },
  navigation: {
    repo: true,
    tabs: [
      {
        label: "Docs",
        path: "/",
      },
      {
        label: "Product",
        path: "/product",
        href: "https://niki.dev/product",
        items: [
          {
            label: "Overview",
            path: "/product",
            description: "What Niki is and how the system fits together",
          },
          {
            label: "Multi-Agent Pipeline",
            path: "/product/agents",
            description: "Planner → Coder → Tester → Reviewer",
          },
          {
            label: "Security & Sandboxing",
            path: "/product/security",
            description: "Hermetic execution, permissions, audit trail",
          },
          {
            label: "Integrations",
            path: "/product/integrations",
            description: "MCP, providers, ACP/IDE",
          },
        ],
      },
      {
        label: "Downloads",
        path: "/downloads",
        href: "https://niki.dev/downloads",
      },
      {
        label: "Resources",
        path: "/resources",
        href: "https://niki.dev/resources",
        items: [
          { label: "Blog", path: "/resources/blog" },
          { label: "Changelog", path: "/resources/changelog" },
          { label: "Guides", path: "/resources/guides" },
          { label: "Examples", path: "/resources/examples" },
        ],
      },
      {
        label: "Pricing",
        path: "/pricing",
        href: "https://niki.dev/pricing",
      },
    ],
  },
  content: {
    root: "content",
    sources: [
      { type: "filesystem", root: "content" },
      {
        type: "github-releases",
        owner: "RavaniRoshan",
        repo: "niki",
        prefix: "changelog",
      },
    ],
  },
  deployment: {
    site: SITE.docs,
    output: "static",
  },
  ai: {
    llmsTxt: true,
    webmcp: true,
  },
  markdown: {
    headingAnchors: true,
    imageZoom: true,
    codeBlocks: {
      theme: {
        dark: "vesper",
        light: "github-light",
      },
    },
  },
  seo: {
    og: {
      enabled: true,
      description:
        "Niki documentation — the open-source multi-agent coding pipeline.",
    },
  },
});
