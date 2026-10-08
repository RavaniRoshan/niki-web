import { INSTALLERS } from "../../data/release";
import { RELEASES } from "../../data/changelog";
import { DOCS_ROUTES, SITE, WEB_ROUTES, docsUrl } from "../../lib/site";

/* Every string on the landing lives here. Product claims are limited to what the
   Niki repository and the release data actually support. No customer names, no
   adoption numbers, no invented outcomes. */

/* The header, the mega-panels, the mobile sheet and the footer all read this one
   list, so a route is added once. Every href below is a route the site actually
   serves or a docs page the docs app actually builds. */
export type NavTarget = {
  label: string;
  href: string;
  description: string;
  external?: boolean;
};

export type NavGroup = {
  heading: string;
  items: NavTarget[];
};

export type NavEntry = NavTarget & {
  groups: NavGroup[];
};

export const NAV_LINKS: readonly NavEntry[] = [
  {
    label: "Product",
    href: WEB_ROUTES.product,
    description: "What Niki is, and how the four agents fit together.",
    groups: [
      {
        heading: "Product",
        items: [
          {
            label: "Overview",
            href: WEB_ROUTES.product,
            description: "A run from task to branch, end to end.",
          },
          {
            label: "Agents",
            href: WEB_ROUTES.agents,
            description: "Planner, Coder, Tester, and Reviewer.",
          },
          {
            label: "Security",
            href: WEB_ROUTES.security,
            description: "The sandbox and the branch rules.",
          },
        ],
      },
      {
        heading: "Get started",
        items: [
          {
            label: "Download",
            href: WEB_ROUTES.downloads,
            description: "Installers for Linux, macOS, and Windows.",
          },
          {
            label: "Pricing",
            href: WEB_ROUTES.pricing,
            description: "What the free tier covers.",
          },
          {
            label: "About",
            href: WEB_ROUTES.about,
            description: "Who builds Niki and why.",
          },
        ],
      },
    ],
  },
  {
    label: "Agents",
    href: WEB_ROUTES.agents,
    description: "Four stages, each independently checkable.",
    groups: [
      {
        heading: "The pipeline",
        items: [
          {
            label: "How the pipeline works",
            href: WEB_ROUTES.agents,
            description: "Typed artifacts instead of one long conversation.",
          },
          {
            label: "Pipeline reference",
            href: docsUrl(DOCS_ROUTES.pipeline),
            description: "Every stage, input, and output.",
            external: true,
          },
        ],
      },
      {
        heading: "Work with it",
        items: [
          {
            label: "Examples",
            href: WEB_ROUTES.examples,
            description: "Worked runs you can read end to end.",
          },
          {
            label: "Guides",
            href: WEB_ROUTES.guides,
            description: "Tasks written for the pipeline.",
          },
          {
            label: "CLI reference",
            href: docsUrl(DOCS_ROUTES.cli),
            description: "Every flag, exit code, and output path.",
            external: true,
          },
        ],
      },
    ],
  },
  {
    label: "Security",
    href: WEB_ROUTES.security,
    description: "What a run is allowed to touch, and what it leaves behind.",
    groups: [
      {
        heading: "The model",
        items: [
          {
            label: "Security architecture",
            href: WEB_ROUTES.security,
            description: "Sandbox, credentials, and network policy.",
          },
          {
            label: "Sandboxing and security",
            href: docsUrl(DOCS_ROUTES.security),
            description: "The container and the allow list.",
            external: true,
          },
        ],
      },
      {
        heading: "Proof",
        items: [
          {
            label: "Evals and auditing",
            href: docsUrl(DOCS_ROUTES.evals),
            description: "How a run is measured rather than claimed.",
            external: true,
          },
          {
            label: "Configuration",
            href: docsUrl(DOCS_ROUTES.configuration),
            description: "Every setting a run reads.",
            external: true,
          },
        ],
      },
    ],
  },
  {
    label: "Integrations",
    href: WEB_ROUTES.integrations,
    description: "Bring your own key, then route models per stage.",
    groups: [
      {
        heading: "Providers",
        items: [
          {
            label: "Integrations",
            href: WEB_ROUTES.integrations,
            description: "Every provider Niki can call.",
          },
          {
            label: "Providers overview",
            href: docsUrl(DOCS_ROUTES.providers),
            description: "Keys, endpoints, and model names.",
            external: true,
          },
          {
            label: "Mixing providers",
            href: WEB_ROUTES.guides,
            description: "A stronger reasoner on review, a faster one on tests.",
          },
        ],
      },
      {
        heading: "Runtimes",
        items: [
          {
            label: "Installation",
            href: docsUrl(DOCS_ROUTES.installation),
            description: "Podman, Docker, or a plain git worktree.",
            external: true,
          },
          {
            label: "Downloads",
            href: WEB_ROUTES.downloads,
            description: "Current releases and checksums.",
          },
        ],
      },
    ],
  },
  {
    label: "Changelog",
    href: WEB_ROUTES.changelog,
    description: "Every release, with what changed and why.",
    groups: [
      {
        heading: "Releases",
        items: [
          {
            label: "Changelog",
            href: WEB_ROUTES.changelog,
            description: "What shipped, and when.",
          },
          {
            label: "Blog",
            href: WEB_ROUTES.blog,
            description: "Longer notes on how the pipeline works.",
          },
        ],
      },
      {
        heading: "Reference",
        items: [
          {
            label: "Docs changelog",
            href: docsUrl(DOCS_ROUTES.changelog),
            description: "Documentation releases.",
            external: true,
          },
          {
            label: "Community",
            href: WEB_ROUTES.community,
            description: "Where Niki is discussed.",
          },
        ],
      },
    ],
  },
] as const;

export const HERO = {
  title: "A personal coding-agent harness in Go. One static binary. Instant to open.",
  primaryAction: {
    label: "Download Niki",
    href: WEB_ROUTES.downloads,
  },
  secondaryAction: {
    label: "Read the docs",
    href: docsUrl(DOCS_ROUTES.overview),
    external: true,
  },
} as const;

export const HERO_BADGES = [
  { label: "Go 1.24+" },
  { label: "MIT License" },
  { label: "Startup 5.9ms" },
  { label: "Binary 19MB" },
  { label: "CGO Disabled" },
] as const;

/* Split so the section does not say the same sentence twice. The eyebrow is
   the premise, the count is the number, and the foot is the only part that
   carries new information. */
export const PROVIDER_STRIP = {
  eyebrow: "Bring your own key",
  label: "One pipeline, one config file. Route a different model to every stage.",
} as const;

export const AGENT_SECTION = {
  title: "Four agents turn a task into a branch",
  body: "Planner, Coder, Tester, and Reviewer each start from a fresh context. They hand the next stage typed artifacts instead of one ever-growing conversation, so every step stays independently checkable.",
  link: { label: "How the pipeline works", href: WEB_ROUTES.agents },
} as const;

export const BRANCH_SECTION = {
  title: "Nothing lands until the tests pass",
  body: "A run writes a fresh niki/<id> branch only when the diff is non-empty and the executed test suite passed. A failed suite blocks the branch unless you force the run, and committed history is never rewritten.",
  link: { label: "Read the security model", href: WEB_ROUTES.security },
} as const;

export const EVIDENCE_SECTION = {
  title: "The run leaves receipts you can read",
  body: "Every run writes changes.patch, report.md, and one artifacts/*.json per agent. Inspect them before you decide what belongs in your branch.",
  tabs: [
    { id: "plan", label: "Plan mode" },
    { id: "changes", label: "changes.patch" },
    { id: "report", label: "report.md" },
    { id: "artifacts", label: "artifacts/*.json" },
  ],
} as const;

export const MODEL_SECTION = {
  title: "Route a different model to every stage",
  body: "Put a stronger reasoner on planning and review, a faster model on testing, or mix providers per stage. Niki is bring-your-own-key end to end.",
  link: { label: "See provider setup", href: WEB_ROUTES.integrations },
} as const;

export const RECEIPT_SECTION = {
  title: "Every run is auditable.",
  body: "Three files stand between a finished run and your merge decision. No dashboards to trust, nothing inferred on a server you cannot read.",
} as const;

/* Illustrative samples of the formats Niki writes, so each receipt is shown as
   the artifact rather than described. Not a captured run. */
export type Receipt =
  | {
      id: string;
      file: string;
      title: string;
      body: string;
      kind: "diff";
      lines: readonly string[];
    }
  | {
      id: string;
      file: string;
      title: string;
      body: string;
      kind: "report";
      stages: readonly { stage: string; verdict: string }[];
    }
  | {
      id: string;
      file: string;
      title: string;
      body: string;
      kind: "json";
      lines: readonly string[];
    };

export const RECEIPTS: readonly Receipt[] = [
  {
    id: "patch",
    file: "changes.patch",
    title: "The exact diff",
    body: "A unified diff written from the completed run and bound to the branch when branch creation succeeds.",
    kind: "diff",
    lines: [
      "--- a/src/server.ts",
      "+++ b/src/server.ts",
      "@@ -41,6 +41,12 @@",
      "+router.get('/health', async (_req, res) => {",
      "+  const db = await ping();",
      "+  res.status(db ? 200 : 503).json({ ok: db });",
      "+});",
    ],
  },
  {
    id: "report",
    file: "report.md",
    title: "What happened, in order",
    body: "A readable account of every stage, its verdict, and the reason the run stopped or continued.",
    kind: "report",
    stages: [
      { stage: "Planner", verdict: "3 steps" },
      { stage: "Coder", verdict: "+12 -6" },
      { stage: "Tester", verdict: "4 passed" },
      { stage: "Reviewer", verdict: "approved" },
    ],
  },
  {
    id: "artifacts",
    file: "artifacts/*.json",
    title: "Per-agent decisions",
    body: "One JSON file per agent recording what it decided and why, so a reviewer can argue with the call.",
    kind: "json",
    lines: [
      "{",
      '  "agent": "reviewer",',
      '  "decision": "approve",',
      '  "revisions": 0,',
      '  "blocking": true',
      "}",
    ],
  },
];

export const CAPABILITY_SECTION = {
  title: "What you can change",
} as const;

export const CAPABILITIES = [
  {
    id: "agents",
    title: "Pick the agents",
    body: "Four named stages run by default, and specialist agents can be added behind risk gates. Explicit pipeline topologies are never rewritten.",
    link: { label: "Explore agents", href: WEB_ROUTES.agents },
    media: "agents",
  },
  {
    id: "sandbox",
    title: "Choose the sandbox",
    body: "Podman or Docker for isolation, or a git worktree backend that needs no container runtime at all.",
    link: { label: "Explore integrations", href: WEB_ROUTES.integrations },
    media: "sandbox",
  },
  {
    id: "guardrails",
    title: "Set the guardrails",
    body: "Spend caps, a single hysteresis budget across retries, and command deny lists, all in one config file.",
    link: { label: "Explore security", href: WEB_ROUTES.security },
    media: "guardrails",
  },
] as const;

export const PERFORMANCE_SECTION = {
  title: "Performance contracts. No feelings, just measurements.",
  body: "Every number is real, measured on host with the included PTY probe harness and hyperfine. NIKI boots to first frame 3.96x faster than Codex, consumes 39% less memory, and compiles to a binary 12.8x smaller.",
} as const;

export const PERFORMANCE_CONTRACTS = [
  {
    tool: "Codex CLI",
    version: "0.152.1",
    lang: "Rust",
    versionTime: "20.0 ms",
    ttfp: "23.4 ms",
    memory: "21.7 MB",
    binary: "244 MB",
  },
  {
    tool: "Google agy",
    version: "1.3.1",
    lang: "Go",
    versionTime: "19.3 ms",
    ttfp: "778.5 ms",
    memory: "225.5 MB",
    binary: "202 MB",
  },
  {
    tool: "Kimi Code",
    version: "2.1.1",
    lang: "TS/Node",
    versionTime: "188.4 ms",
    ttfp: "1253.7 ms",
    memory: "391.6 MB",
    binary: "75 MB",
  },
  {
    tool: "NIKI",
    version: "0.11.0",
    lang: "Go",
    versionTime: "6.8 ms",
    ttfp: "5.9 ms",
    memory: "13.1 MB",
    binary: "19 MB",
  },
] as const;

export const TOOL_SUITE_SECTION = {
  title: "Built-in tool suite. Zero fluff.",
  body: "Seven core coding tools, each with explicit safety guarantees. No bloat, no framework sprawl, just what a coding agent needs.",
} as const;

export const TOOL_SUITE = [
  {
    name: "read_file",
    purpose: "Read file contents with line ranges",
    safety: "Bounded size limits, path sanitization",
  },
  {
    name: "write_file",
    purpose: "Atomic write file replacement",
    safety: "Temporary file swap, prevents corruption",
  },
  {
    name: "edit_file",
    purpose: "Targeted string replacement",
    safety: "Requires exact match, rejects ambiguous edits",
  },
  {
    name: "apply_patch",
    purpose: "Unified diff patch applicator",
    safety: "Fuzzed parser (>400k iterations with 0 panics)",
  },
  {
    name: "glob",
    purpose: "Find files matching wildcard patterns",
    safety: "Bounded directory walking, ignore awareness",
  },
  {
    name: "grep",
    purpose: "Fast regex content search",
    safety: "Read-only concurrency, skip binary files",
  },
  {
    name: "shell",
    purpose: "Execute shell commands in workspace",
    safety: "Bubblewrap isolation, network denial, dropped caps",
  },
] as const;

export const MANIFESTO = {
  title: "Niki is free software you can read end to end.",
  body: "MIT licensed, no telemetry, your own provider keys. Every prompt, every gate, and every artifact is in a repository you can fork tonight.",
  link: { label: "Read the source", href: SITE.repo, external: true },
} as const;

export const PHILOSOPHY = [
  {
    title: "Rule of Proof",
    body: "Works means a real test or measurement ran and its output was verified.",
  },
  {
    title: "Zero Proprietary Code",
    body: "No leaked, decompiled, or reconstructed proprietary source was ever accessed or copied.",
  },
  {
    title: "Small and Boring",
    body: "Dependencies pass strict admission checks. Zero framework sprawl.",
  },
] as const;

export const CHANGELOG_SECTION = {
  title: "Changelog",
  link: { label: "See what's new in Niki", href: WEB_ROUTES.changelog },
} as const;

export const HIGHLIGHTS_SECTION = {
  title: "Recent highlights",
  link: { label: "Read the documentation", href: docsUrl(DOCS_ROUTES.home), external: true },
} as const;

export const HIGHLIGHTS = [
  {
    id: "pipeline",
    category: "Pipeline",
    title: "How the four agents hand off",
    body: "The contract between each stage, and where a context boundary falls.",
    href: docsUrl(DOCS_ROUTES.pipeline),
  },
  {
    id: "providers",
    category: "Providers",
    title: "Twelve integrations, one config",
    body: "Anthropic, OpenAI, Google, Ollama, OpenRouter, OpenCode Zen, Kimi Code, Kilo Code, NVIDIA, Groq, Together, DeepSeek.",
    href: docsUrl(DOCS_ROUTES.providers),
  },
  {
    id: "sandbox",
    category: "Sandbox",
    title: "Podman, Docker, or worktree",
    body: "What each backend can and cannot reach, and how to pick one.",
    href: docsUrl(DOCS_ROUTES.security),
  },
  {
    id: "config",
    category: "Configuration",
    title: "The full config file",
    body: "Every key, its default, and the value that changes behaviour.",
    href: docsUrl(DOCS_ROUTES.configuration),
  },
] as const;

export const FINAL_CTA = {
  title: "One sentence in. A reviewable branch out.",
  action: {
    label: "Download Niki",
    href: WEB_ROUTES.downloads,
  },
} as const;

export const FOOTER_GROUPS = [
  {
    id: "product",
    heading: "Product",
    links: [
      { label: "Overview", href: WEB_ROUTES.product },
      { label: "Agents", href: WEB_ROUTES.agents },
      { label: "Security", href: WEB_ROUTES.security },
      { label: "Integrations", href: WEB_ROUTES.integrations },
      { label: "Downloads", href: WEB_ROUTES.downloads },
    ],
  },
  {
    id: "resources",
    heading: "Resources",
    links: [
      { label: "Documentation", href: docsUrl(DOCS_ROUTES.home), external: true },
      { label: "Changelog", href: WEB_ROUTES.changelog },
      { label: "Guides", href: WEB_ROUTES.guides },
      { label: "Blog", href: WEB_ROUTES.blog },
    ],
  },
  {
    id: "company",
    heading: "Project",
    links: [
      { label: "Source", href: SITE.repo, external: true },
      { label: "Issues", href: SITE.social.issues, external: true },
      { label: "License", href: SITE.repo, external: true },
    ],
  },
  {
    id: "legal",
    heading: "Legal",
    links: [
      { label: "Security model", href: WEB_ROUTES.security },
      { label: "Acceptable use", href: docsUrl(DOCS_ROUTES.security), external: true },
      { label: "Data use", href: WEB_ROUTES.security },
    ],
  },
  {
    id: "connect",
    heading: "Connect",
    links: [
      { label: "GitHub", href: SITE.social.github, external: true },
      { label: "Report an issue", href: SITE.social.issues, external: true },
    ],
  },
] as const;

export const STAGES = [
  {
    id: "planner",
    label: "Planner",
    output: "TaskSpec",
    summary: "Reads the task and the current files, then defines the smallest safe plan.",
  },
  {
    id: "coder",
    label: "Coder",
    output: "unified diff",
    summary: "Applies a focused change and hands the exact diff to testing.",
  },
  {
    id: "tester",
    label: "Tester",
    output: "test results",
    summary: "Generates and runs tests against the applied change.",
  },
  {
    id: "reviewer",
    label: "Reviewer",
    output: "verdict",
    summary: "Approves the result or requests one bounded revision.",
  },
] as const;

/* Each artifact's excerpt is the shape of the real file, written out so the tab
   shows evidence rather than describing it. They are illustrative samples of the
   formats Niki writes, not a captured run, and the panel says so. */
export type ArtifactExcerpt =
  | { kind: "markdown"; lines: readonly string[] }
  | { kind: "diff"; lines: readonly string[] }
  | { kind: "report"; stages: readonly { stage: string; verdict: string }[] }
  | { kind: "json"; lines: readonly string[] };

export const EVIDENCE_FILES = [
  {
    id: "plan",
    name: "plan.md",
    qualifier: "Plan mode",
    description:
      "Explicit plan mode researches without executing. Approve the plan with niki run --plan <id>.",
    excerpt: {
      kind: "markdown",
      lines: [
        "# Add a /health endpoint",
        "",
        "## Smallest safe change",
        "- register GET /health in the existing router",
        "- reuse the db ping readiness already makes",
        "- one test, asserting 200 and the body shape",
      ],
    },
  },
  {
    id: "changes",
    name: "changes.patch",
    qualifier: null,
    description:
      "Unified diff written from the completed run, bound to the fresh niki/<id> branch when branch creation succeeds.",
    excerpt: {
      kind: "diff",
      lines: [
        "@@ -0,0 +1,9 @@",
        "+router.get('/health', async (_req, res) => {",
        "+  const db = await ping();",
        "+  res.status(db ? 200 : 503).json({ ok: db });",
        "+});",
        "+",
        "+test('GET /health reports 200', async () => {",
        "+  const res = await request(app).get('/health');",
        "+  expect(res.status).toBe(200);",
      ],
    },
  },
  {
    id: "report",
    name: "report.md",
    qualifier: null,
    description: "Human-readable run report written after the pipeline completes.",
    excerpt: {
      kind: "report",
      stages: [
        { stage: "Planner", verdict: "3 steps, 1 file touched" },
        { stage: "Coder", verdict: "unified diff applied, +12 -6" },
        { stage: "Tester", verdict: "4 passed, 0 failed" },
        { stage: "Reviewer", verdict: "approved, 0 revisions" },
      ],
    },
  },
  {
    id: "artifacts",
    name: "artifacts/*.json",
    qualifier: null,
    description: "Per-agent JSON artifacts record what each agent decided and why.",
    excerpt: {
      kind: "json",
      lines: [
        "{",
        '  "agent": "tester",',
        '  "decision": "pass",',
        '  "reason": "4 passed, 0 failed",',
        '  "confidence": 0.94,',
        '  "blocking": true',
        "}",
      ],
    },
  },
] as const;

export const BRANCH_GATES = [
  { id: "diff", label: "Non-empty diff", result: "required" },
  { id: "tests", label: "Executed test suite", result: "required" },
  { id: "branch", label: "niki/<id> created", result: "required" },
  { id: "history", label: "Committed history", result: "never rewritten" },
] as const;

/* Each mark is the brand's own glyph, flattened to a single ink silhouette at
   render time. `logo: null` means we hold no official mark for that provider, so
   the tile shows the name alone rather than passing off a stand-in as theirs. */
export const PROVIDERS = [
  { name: "Anthropic", logo: "/logos/anthropic.svg", width: 16, height: 16 },
  { name: "OpenAI", logo: "/logos/openai.svg", width: 16, height: 16 },
  { name: "Google", logo: "/logos/google.svg", width: 32, height: 32 },
  { name: "Ollama", logo: "/logos/ollama.svg", width: 16, height: 16 },
  { name: "OpenRouter", logo: "/logos/openrouter.svg", width: 16, height: 16 },
  { name: "OpenCode Zen", logo: null, width: 0, height: 0 },
  { name: "Kimi Code", logo: "/logos/kimi.svg", width: 16, height: 16 },
  { name: "Kilo Code", logo: "/logos/kilocode.svg", width: 16, height: 16 },
  { name: "NVIDIA", logo: "/logos/nvidia.svg", width: 16, height: 16 },
  { name: "Groq", logo: "/logos/groq.svg", width: 16, height: 16 },
  { name: "Together", logo: "/logos/together.svg", width: 16, height: 16 },
  { name: "DeepSeek", logo: "/logos/deepseek.svg", width: 16, height: 16 },
] as const;

export const BACKENDS = [
  {
    id: "podman",
    name: "Podman",
    description: "Default rootless container sandbox with no daemon.",
  },
  {
    id: "docker",
    name: "Docker",
    description: "Container sandbox fallback. Docker writes through the project mount.",
  },
  {
    id: "worktree",
    name: "worktree",
    description: "Git worktree backend that needs no container runtime.",
  },
] as const;

export const GUARDS = [
  { id: "spend", label: "spend_cap_usd", result: "aborts the run" },
  { id: "steps", label: "max_steps", result: "aborts the run" },
  { id: "wallclock", label: "max_wallclock_secs", result: "aborts the run" },
  { id: "deny", label: "command deny list", result: "fails closed" },
] as const;

/* Newest four releases, straight from the changelog data. */
function shortTitle(summary: string): string {
  // Upstream summaries are long prose. Strip the parentheticals first, so a
  // version like "(36 commits since 0.7.0)" cannot be cut mid-number, then take
  // the first clause and cap it on a word boundary.
  const withoutParentheticals = summary.replace(/\s*\([^)]*\)/g, "");
  const firstClause =
    withoutParentheticals.split(/\s*[;:]\s*|\.\s+[A-Z]/)[0] ?? withoutParentheticals;
  const candidate = firstClause.replace(/[\s,;:.·-]+$/, "").trim();
  if (!candidate) return summary.trim();
  if (candidate.length <= 62) return candidate;

  const clipped = candidate.slice(0, 62);
  const lastSpace = clipped.lastIndexOf(" ");
  return clipped
    .slice(0, lastSpace > 30 ? lastSpace : 62)
    .replace(/[\s,;:.·-]+$/, "")
    .trim();
}

export const CHANGELOG_ENTRIES = RELEASES.slice(0, 4).map((release) => ({
  id: release.version,
  date: release.date,
  version: `v${release.version}`,
  title: shortTitle(release.summary),
  href: release.url,
}));

/* Model routing. The per-stage table is the structured source and the TOML is
   generated from it, so the config a reader sees and the one the routing panel
   animates cannot drift apart. */
export const MODEL_GENERAL = [
  { key: "max_revision_rounds", value: "3" },
  { key: "spend_cap_usd", value: "5.0" },
] as const;

export const MODEL_ROUTING = [
  {
    stage: "Planner",
    table: "agents.planner",
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
  },
  {
    stage: "Coder",
    table: "agents.coder",
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
  },
  { stage: "Tester", table: "agents.tester", provider: "openai", model: "gpt-4o-mini" },
  {
    stage: "Reviewer",
    table: "agents.reviewer",
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
  },
] as const;

export const MODEL_ROUTING_TOML = [
  "[general]",
  ...MODEL_GENERAL.map((setting) => `${setting.key} = ${setting.value}`),
  "",
  ...MODEL_ROUTING.flatMap((route) => [
    `[${route.table}]`,
    `provider = "${route.provider}"`,
    `model = "${route.model}"`,
    "",
  ]),
]
  .join("\n")
  .trimEnd();

export const INSTALL_COMMAND = INSTALLERS.shell.command;
