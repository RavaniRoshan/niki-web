import Link from "next/link";
import { Frame, Box, Strip, BoxHeader } from "@/components/Frame";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Planner → Coder → Tester → Reviewer",
  description:
    'The multiagent path runs Planner, Coder, Tester and Reviewer as separate sessions that exchange typed artifacts. In auto mode, low-complexity tasks can collapse to Planner plus a solo Coder; set [pipeline].topology = "multiagent" to force the full chain.',
  path: "/product/agents",
});

const productNav = [
  { label: "Overview", href: WEB_ROUTES.product },
  { label: "Pipeline", href: WEB_ROUTES.agents },
  { label: "Security", href: WEB_ROUTES.security },
  { label: "Integrations", href: WEB_ROUTES.integrations },
];

function ProductSubNav({ current }: { current: string }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Product sections">
      {productNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`mono-md-regular rounded-full border px-2.5 py-1 ${item.href === current ? "border-gray-6 bg-gray-3 text-foreground" : "border-border text-gray-10"}`}
          aria-current={item.href === current ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

const agents = [
  {
    id: "planner",
    step: "1",
    name: "Planner",
    one: "Reads the task and the current files, produces the TaskSpec.",
    artifact: "TaskSpec, which files to touch and the approach",
    detail:
      "The Planner never writes code. It reads your task description plus existing file contents and emits a typed plan: scope, files, approach. With plan mode (`niki plan`), this is the only stage that runs; you review `plan.md` before anything executes.",
  },
  {
    id: "coder",
    step: "2",
    name: "Coder",
    one: "Emits a unified diff, applied to the active execution workspace.",
    artifact: "unified diff, applied in the active execution environment",
    detail:
      "The Coder works from the TaskSpec alone; it never sees the Planner's conversation. It emits a unified diff that Niki applies in the active execution workspace: a container bind mount for the container backend or a local worktree for the worktree backend. Sequential stages intentionally share one execution environment so the diff persists; independence is at the LLM-session layer. Parallel coder topologies and a Synthesizer agent are available via `[parallel]`.",
  },
  {
    id: "tester",
    step: "3",
    name: "Tester",
    one: "Generates a test report and runs a test command when one resolves.",
    artifact: "test report and, when available, execution results",
    detail:
      "The Tester generates a test report and runs a configured or auto-detected test command when one is available. A run can complete with `test_execution = None` when no command resolves. When tests do run, failing suites block branch creation unless you explicitly use `--force` (recorded as NOT verified).",
  },
  {
    id: "reviewer",
    step: "4",
    name: "Reviewer",
    one: "Issues the verdict; bounces work back until approved.",
    artifact: "verdict: correctness, quality, coverage scores",
    detail:
      "The Reviewer audits the prior stage's artifact. On request-changes it loops back to the Coder for up to `max_revision_rounds`. Optional agents extend the loop: an adversarial Red agent before the Reviewer, and a Security Auditor appended after the Reviewer when enabled or forced by risk.",
  },
];

const specialized = [
  {
    title: "Red agent",
    body: "An adversarial reviewer that probes the diff before the Reviewer. Opt-in via [red_blue] enabled = true; sees evidence-only projections.",
  },
  {
    title: "Security Auditor",
    body: "A dedicated security pass over the change via [security] or risk policy, appended after Reviewer; sees Planner and Coder artifacts only.",
  },
  {
    title: "Parallel Coders",
    body: "Run multiple Coder implementations in parallel with a Synthesizer agent that reconciles them, via [parallel].",
  },
];

export default function AgentsPage() {
  return (
    <Frame>
      <Box first>
        <div className="flex flex-col gap-4">
          <nav
            className="font-mono text-xs text-gray-10 flex items-center gap-2"
            aria-label="Breadcrumb"
          >
            <a href={WEB_ROUTES.home}>niki</a>
            <span>/</span>
            <Link href={WEB_ROUTES.product}>product</Link>
            <span>/</span>
            <span aria-current="page" className="text-gray-12">
              agents
            </span>
          </nav>
          <h1 className="text-[40px] leading-10 md:leading-16 md:text-[64px] font-medium tracking-[-0.015em]">
            Planner → Coder → Tester → Reviewer.
          </h1>
          <p className="text-foreground/63 text-sm-plus max-w-xl">
            The multiagent path runs Planner, Coder, Tester and Reviewer as separate sessions that
            exchange typed artifacts. In auto mode, low-complexity tasks can collapse to Planner
            plus a solo Coder; set <code>[pipeline].topology = &quot;multiagent&quot;</code> to
            force the full chain.
          </p>
          <div className="mt-2 flex gap-3">
            <a className="ax-btn-primary group/btn" href={docsUrl(DOCS_ROUTES.quickstart)}>
              Get Started
            </a>
            <a className="ax-btn-secondary group/btn" href={docsUrl(DOCS_ROUTES.pipeline)}>
              Read the Docs
            </a>
          </div>
        </div>
        <ProductSubNav current={WEB_ROUTES.agents} />
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="The full multiagent path."
          aside={
            <span className="mono-md-regular rounded-full border border-border px-2.5 py-1 text-gray-10">
              separate LLM sessions + typed artifacts, validated against JSON schemas
            </span>
          }
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-xl bg-card p-5 border border-gray-3/50 flex flex-col gap-3"
              data-agent={agent.id}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex size-8 items-center justify-center rounded-md border border-gray-6 bg-gray-2 font-mono text-xs text-orange-11"
                  aria-hidden="true"
                >
                  {agent.step}
                </span>
                <span className="text-sm font-semi-medium text-foreground">{agent.name}</span>
                <span className="mono-md-regular ml-auto text-gray-10">stage {agent.step}</span>
              </div>
              <p className="text-sm text-foreground">{agent.one}</p>
              <p className="text-xs-plus text-foreground/63 leading-6">{agent.detail}</p>
              <span className="mono-md-regular mt-4 text-gray-11">
                <span className="font-mono text-orange-11">→ emits</span> {agent.artifact}
              </span>
            </div>
          ))}
          <div className="rounded-xl border border-gray-3 bg-gray-1 p-5 flex flex-col gap-2 sm:col-span-2 lg:col-span-4">
            <span className="mono-md-regular text-orange-11">local branch when created</span>
            <span className="font-mono text-sm text-foreground">niki/&lt;id&gt;</span>
            <span className="text-xs-plus text-foreground/63">
              Agent artifacts are validated against their JSON schemas before handoff.
            </span>
          </div>
        </div>
      </Box>

      <Strip />

      <Box>
        <BoxHeader
          heading="vs. one agent in one conversation."
          aside={
            <span className="mono-md-regular rounded-full border border-border px-2.5 py-1 text-gray-10">
              separate stages make context and handoffs visible
            </span>
          }
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-card p-5 border border-gray-3/50">
            <span className="mono-md-regular tracking-widest uppercase text-rose-500">
              single-agent loop
            </span>
            <ul className="mt-3 grid gap-2 text-sm text-foreground/75">
              <li>Confirmation bias: the same agent may review its own reasoning</li>
              <li>Context drift: long conversations can make relevant context harder to manage</li>
              <li>More steering: you may still need to steer and re-check edits</li>
            </ul>
          </div>
          <div className="rounded-xl bg-card p-5 border border-gray-3/50">
            <span className="mono-md-regular tracking-widest uppercase text-gray-10">
              niki&apos;s pipeline
            </span>
            <ul className="mt-3 grid gap-2 text-sm text-foreground/75">
              <li>Separate Tester and Reviewer sessions receive the typed artifacts they need</li>
              <li>Narrow stage inputs instead of one growing conversation</li>
              <li>
                The Reviewer can request another Coder pass within the configured revision limit
              </li>
            </ul>
          </div>
        </div>
      </Box>

      <Strip />

      <Box last>
        <BoxHeader
          heading="Specialized agents."
          aside={
            <span className="mono-md-regular rounded-full border border-border px-2.5 py-1 text-gray-10">
              configurable; risk tiers can force the Security Auditor
            </span>
          }
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {specialized.map((s) => (
            <div
              key={s.title}
              className="rounded-xl bg-card p-5 border border-gray-3/50 flex flex-col gap-2"
            >
              <span className="mono-md-regular tracking-widest uppercase text-gray-10">opt-in</span>
              <h3 className="font-medium tracking-tight text-foreground">{s.title}</h3>
              <p className="text-sm text-foreground/63 leading-6">{s.body}</p>
            </div>
          ))}
        </div>
      </Box>
    </Frame>
  );
}
