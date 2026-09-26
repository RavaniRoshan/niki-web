import { INSTALLERS } from "../../data/release";
import { RELEASES } from "../../data/changelog";
import { DOCS_ROUTES, SITE, WEB_ROUTES, docsUrl } from "../../lib/site";

/* Every string on the landing lives here. Product claims are limited to what the
   Niki repository and the release data actually support. No customer names, no
   adoption numbers, no invented outcomes. */

export const NAV_LINKS = [
  { label: "Product", href: WEB_ROUTES.product },
  { label: "Agents", href: WEB_ROUTES.agents },
  { label: "Security", href: WEB_ROUTES.security },
  { label: "Integrations", href: WEB_ROUTES.integrations },
  { label: "Changelog", href: WEB_ROUTES.changelog },
] as const;

export const HERO = {
  title: "Niki is your coding agent for building software you can review.",
  primaryAction: {
    label: "Download for Linux",
    href: WEB_ROUTES.downloads,
  },
  secondaryAction: {
    label: "Read the docs",
    href: docsUrl(DOCS_ROUTES.overview),
    external: true,
  },
} as const;

export const PROVIDER_STRIP = {
  label: "Bring your own key. Twelve providers, one pipeline.",
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

export const RECEIPTS = [
  {
    id: "patch",
    file: "changes.patch",
    title: "The exact diff",
    body: "A unified diff written from the completed run and bound to the branch when branch creation succeeds.",
  },
  {
    id: "report",
    file: "report.md",
    title: "What happened, in order",
    body: "A readable account of every stage, its verdict, and the reason the run stopped or continued.",
  },
  {
    id: "artifacts",
    file: "artifacts/*.json",
    title: "Per-agent decisions",
    body: "One JSON file per agent recording what it decided and why, so a reviewer can argue with the call.",
  },
] as const;

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

export const MANIFESTO = {
  title: "Niki is free software you can read end to end.",
  body: "Apache-2.0 licensed, no telemetry, your own provider keys. Every prompt, every gate, and every artifact is in a repository you can fork tonight.",
  link: { label: "Read the source", href: SITE.repo, external: true },
} as const;

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
    body: "Anthropic, OpenAI, Google, Ollama, OpenRouter, Zen, Kimi, Kilo, NVIDIA, Groq, Together, DeepSeek.",
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
  title: "Try Niki now.",
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
      { label: "X", href: SITE.twitter, external: true },
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
      { label: "X", href: SITE.twitter, external: true },
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

export const EVIDENCE_FILES = [
  {
    id: "plan",
    name: "plan.md",
    qualifier: "Plan mode",
    description:
      "Explicit plan mode researches without executing. Approve the plan with niki run --plan <id>.",
  },
  {
    id: "changes",
    name: "changes.patch",
    qualifier: null,
    description:
      "Unified diff written from the completed run, bound to the fresh niki/<id> branch when branch creation succeeds.",
  },
  {
    id: "report",
    name: "report.md",
    qualifier: null,
    description: "Human-readable run report written after the pipeline completes.",
  },
  {
    id: "artifacts",
    name: "artifacts/*.json",
    qualifier: null,
    description: "Per-agent JSON artifacts record what each agent decided and why.",
  },
] as const;

export const BRANCH_GATES = [
  { id: "diff", label: "Non-empty diff", result: "required" },
  { id: "tests", label: "Executed test suite", result: "required" },
  { id: "branch", label: "niki/<id> created", result: "required" },
  { id: "history", label: "Committed history", result: "never rewritten" },
] as const;

export const PROVIDERS = [
  { name: "Anthropic", logo: "/logos/anthropic.svg", width: 16, height: 16 },
  { name: "OpenAI", logo: "/logos/openai.svg", width: 16, height: 16 },
  { name: "Google", logo: "/logos/google.svg", width: 32, height: 32 },
  { name: "Ollama", logo: "/logos/ollama.svg", width: 16, height: 16 },
  { name: "OpenRouter", logo: "/logos/openrouter.svg", width: 16, height: 16 },
  { name: "OpenCode Zen", logo: "/logos/opencode.svg", width: 512, height: 512 },
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

export const MODEL_ROUTING_TOML = `[general]
max_revision_rounds = 3
spend_cap_usd = 5.0

[agents.planner]
provider = "anthropic"
model = "claude-sonnet-4-20250514"

[agents.coder]
provider = "anthropic"
model = "claude-sonnet-4-20250514"

[agents.tester]
provider = "openai"
model = "gpt-4o-mini"

[agents.reviewer]
provider = "anthropic"
model = "claude-sonnet-4-20250514"`;

export const INSTALL_COMMAND = INSTALLERS.shell.command;
