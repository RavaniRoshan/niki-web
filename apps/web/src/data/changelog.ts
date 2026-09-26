/**
 * Generated from the Niki repository CHANGELOG.md.
 * Regenerate on each release.
 */

export interface ChangelogRelease {
  version: string;
  date: string;
  summary: string;
  categories: { name: string; items: string[] }[];
  tag: string;
  url: string;
}

export const RELEASES: ChangelogRelease[] = [
  {
    version: "0.8.0",
    date: "2026-09-23",
    summary:
      "Agent-harness + runtime release (36 commits since 0.7.0): repo intelligence, risk-gated Critic pipeline, provenance/KB/history/structural index, agent runtime rework with sessions/checkpoints/resume, converged store + project skills, unified run budget, TUI performance/search/input hardening, five ready gateways, reliability/honesty fixes, and CI/visual gate repairs. Entries below describe code behavior; launch material is labeled as such.",
    categories: [
      {
        name: "Added",
        items: [
          "Repository intelligence (`[repo_intel]`, `niki inspect [--json]`): deterministic `RepoManifest` (languages, entry points, tests, build files, vendor exclusion, risk cues). Fail-soft; indexing can no longer abort a run unless `on_failure = &quot;fail&quot;`.",
          "Run provenance (`[snapshot]`, `manifest.json` per task, `niki status [id] --with-provenance`): repo HEAD/branch/remote, config content hash, toolchain versions, result branch + costs.",
          "Project KB (`niki architecture build`, `.niki/kb/`): snapshot-stamped Markdown + provenance-wrapped JSON sidecars, rebuilt from scratch.",
          "History miner (`.niki/history/`, cache-as-truth with rewrite detection): keyword-classified commit learnings rebuilt from cache every run.",
          "Structural index (`niki index build|query`, `.niki/kb/structural_index/`): content-addressed per-file units, AST→regex→coverage backend ladder (tree-sitter behind the default-on `ast` Cargo feature; `--no-default-features` keeps the regex baseline). Advisory only, grep stays authoritative.",
          "Bounded Planner context (`[general] max_context_chars`, default 48000): manifest + KB + symbol excerpts + learnings, priority-ordered with an explicit truncation marker.",
          "Risk-based pipeline (`[risk]`, `[critic]`): deterministic TaskSpec classifier (low/normal/high/security) injects the Critic after the Reviewer on Normal+ and forces a SecurityAuditor on High/Security. Explicit `[pipeline].stages` topologies are never rewritten.",
          "Critic stage: narrow verdict-grounding checker (`prompts/critic.md`, `schemas/critique.schema.json`); a Reject forces exactly one Reviewer retry, then a closing judgment. Recorded, never a gate of its own.",
          "Post-run reflection (`src/orchestrator/reflect.rs`): `verification_failure`, `review_correction`, and `security_fix` learnings into `.niki/learnings.jsonl`, flowing back to the Planner via the KB.",
          "Reviewer test-evidence gate: when a Tester stage produces failures, skips, or zero executed tests, its verdict must be `revision_needed` rather than `approved`.",
          "Agent runtime rework (`src/runtime/`): `AgentSession` / `AgentTurn` / `AgentStep` execution loop, bounded priority-sorted `ContextStore` with compaction, typed `AgentEvent` stream, `ToolPolicy` + tool registry split, cancellation tokens, and session checkpoints under `.niki/sessions/`.",
          "`niki resume &lt;session-id&gt;`: resume an interrupted agent session from a checkpoint (role/turn/step, artifacts, context fragments, active branch).",
          "`niki skills` (`list|candidates|promote|retire|show|diff`): two-step distillation, an approved green run stages a candidate, a human promotes it to a versioned skill (`SKILL.md` + `metadata.json` + `skills-lock.json`). Nothing auto-activates; stale snapshots are flagged, never served as fresh.",
          "Converged store (`src/store/`, ADR-002): rebuildable hybrid index over learnings + role/user memory + run records, keyword (0.45) + trigram vector cosine (0.35) + recency (0.10) + authority (0.10). File-backed, zero new deps; deleting `<output_dir>/store/` is always safe (live-scan fallback).",
          "Unified run hysteresis budget (`[budget]` / `RunBudget`): one step/cost/wallclock ceiling across retries, repairs, revisions, tool-loop steps, and goal iterations. Exhaustion → typed `BudgetExhausted` in `task.json`. CLI overrides: `niki run --max-steps --max-usd --max-wallclock-secs`.",
          "Optional executable tool loop (`[tools] experimental_tool_loop`, default off): one bounded research step before the Planner; inherits `[permissions] mode` (Ask tools fail closed headless).",
          "MCP client path: the client module loads `[[mcp.servers]]` and can call connected tools, but the pipeline currently constructs an empty `McpManager::new()`, so configured servers are not wired into agent tool execution for a run.",
          "Failover structured-output routing: `FailoverProvider` propagates `supports_structured_output` and routes structured requests through the chain (no more silent degradation on failover).",
          "Hook timeouts: `[hooks] timeout_seconds` (default 30); overlong hooks are killed and treated as Noop with a warning (0 = wait forever).",
          "TUI hardening: central keybinding table with `[ui.keybindings]` overrides + conflict report; transcript search (Ctrl+F); fuzzy `@files` ranking with Tab apply; shared `ScrollState`; `NIKI_TUI_DEBUG` per-frame log; headless render budgets; stage-markdown + processed-diff memos; fleet refresh throttle; mouse motion/SGR with Ctrl+E toggle; width-aware tables; OSC-8 hyperlinks gated by terminal caps. Optional `[ui]`, `[ui.tips]`, `[ui.transcript]` tables.",
          "Providers / onboarding: five ready gateways, Ollama first-class keyless (wizard option 0, live `/api/tags` probe) plus Zen / Kimi / Kilo (OpenAI-compatible, `OPENCODE`/`KIMI`/`KILO_API_KEY` wiring); single-pick init wizard rewriting all four `[agents.*]` provider lines and preselecting an installed Ollama model; headless `chat --message` plain-text reply.",
          "`niki smoke --backend`: local smoke path selectable without a container runtime (Ollama + worktree, no key/container).",
          "Cinematic README demo: deterministic frame-rendered 80s TUI walkthrough; theme `sand()` fixed to warm SAND_500 (was cyan).",
          "Launch material (docs/launch material, not shipped code): PH kit checklist, maker first-comment, gallery assets, launch playbook with trust-boundary-aligned copy; TUI extraction plan status.",
          "Eval material includes four seeded defect cases; consult the disclosed methodology and judgments for results.",
          "CI gates: MSRV (1.88) + `--no-default-features` jobs; clippy `-D warnings`; artifact-contract + run-lifecycle tests required before the full suite; `STATE_LAYOUT.md` file contract; agent-harness plan docs (ADRs 001/002).",
        ],
      },
      {
        name: "Fixed",
        items: [
          "Hooks: payload write ignores EPIPE so a fast hook that exits without reading stdin can no longer mask Block as Noop/Allow (exit-code interpretation always runs); 100× stress regression test.",
          "`[general] max_diff_lines` from `niki.toml` is now honored (it was parsed but never merged into the active config).",
          "TUI: multi-byte cursor panics/caret corruption, 1-column click offset, fleet refresh `block_on`ing Tokio locks every frame, stuck auto-scroll, unpainted tool-detail modal, off-by-2 permission-modal rows, command-menu hit-test drift, byte-slice panics on tool cards/headers/echo, long-command truncation.",
          "Empty-diff runs no longer leave HEAD on an empty `niki/&lt;id&gt;` branch; worktree teardown no longer leaks `git fatal()` noise to stderr.",
          "Version/logo strings use `CARGO_PKG_VERSION` (showed stale `v0.4.0`).",
          "`providers check`: all OpenAI-compatible slugs use named constructors; Ollama health check resolves an installed model (was permanent 400 + empty model).",
          "Init wizard rewrites all four `[agents.*]` provider lines to the picked provider; Ollama pick preselects an installed coding model (was hardcoded `qwen2.5-coder`, which 404s when only tagged variants exist).",
          "Solo coder gets one bounded repair attempt on patch-apply failure (same spend-cap/hooks/metrics accounting); `code_diff` search/replace schema bans regex/anchors/paraphrase.",
          "Artifacts writer keeps every attempt (`coder.json`, `coder-2.json`, …) instead of overwriting, failed attempts stay inspectable.",
          "Failover no longer reports `supports_structured_output = false`; structured output routed through the chain with circuit breakers.",
          "VHS/visual CI: onboarding tapes force the modal via `NIKI_FORCE_ONBOARDING`; ttyd + ffmpeg installed for tape rendering; render engine tests headless (no TTY on runners).",
          "Release/CI plumbing: manifests pinned with real sha256; artifact actions aligned; `cargo dist` `allow-dirty` for hand-maintained pins; `@niki` review workflow `needs-keys` gate fixed; `audit` job restored; VHS/pillow install order fixed.",
          "Mock-pipeline e2e drops the `nodejs` binary alias from the sandbox tool check (CI has node only).",
        ],
      },
      {
        name: "Changed",
        items: [
          "README / trust copy: sequential stages intentionally share one execution sandbox so the diff persists Coder → Tester → Reviewer; independence is at the LLM-session layer. Committed branches are never repointed or rewritten; the host working tree receives the finished diff for review. `readonly_rootfs` documented as optional and off by default.",
          "`extra_packages` clarified: despite the name, nothing is installed, entries extend the startup command `-v` checklist against the pre-baked image.",
          "`network_allowlist` honesty: per-domain filtering is NOT implemented, container egress is all-or-nothing; only `&quot;*&quot;` opens egress; a non-empty domain list warns at startup and behaves as block-all.",
          "Init wizard rewritten as a single-pick menu (was 11 sequential prompts).",
          "Config examples: `[ui]` tips/transcript nested tables; `[compaction]` default threshold 80% + auto_compact; pipeline topology values lowercased.",
          "Launch copy aligned with trust boundaries (`docs/launch-audit.md`, first-comment).",
        ],
      },
      {
        name: "Security",
        items: [
          "Deny-list always wins over overlapping allow entries.",
          "Diffs scoped to agent-produced changes: pre-existing dirty/untracked host files stay out of `changes.patch` and the commit; new agent files appear via scoped intent-to-add (both backends); edit-format application is all-or-nothing per stage.",
          "Same-task worktree collision fails loudly instead of deleting a concurrent run&apos;s directory; stale prune never removes a live worktree.",
          "Failed runs create no `niki/*` branch and leave `task.json` Failed with the error; conflict markers abort branch creation instead of committing.",
          "MCP client governance: unmarked tools are denied under default read-only governance; web-fetch tools are gated by a domain allowlist; untrusted servers error instead of connecting implicitly.",
          "Hooks timeout kills overlong processes so a hung hook cannot stall or mask a Block decision forever.",
        ],
      },
    ],
    tag: "v0.8.0",
    url: "https://github.com/RavaniRoshan/niki/releases/tag/v0.8.0",
  },
  {
    version: "0.7.0",
    date: "2026-09-08",
    summary:
      "Mega-plan execution (30 commits): plan-mode approval gates, oracle metadata, honest cost metering, independence hardening, session control plane, headless CI contract, trust posture, automation, and TUI unification. The release notes and repository contain the supporting code and documentation.",
    categories: [
      {
        name: "Added",
        items: [
          "Plan mode: `niki plan` researches without executing and writes reviewable",
          "Session CLI: `niki session list/show/checkpoints/undo/rewind` with",
          "User slash commands: `.niki/commands/*.md` (filename → `/name`) with",
          'Headless contract: `niki run "<description>" --bare` (no memory/MCP/knowledge-URLs),',
          "Oracle integrity: `oracle_source` (spec/derived/property) on every test",
          "Independence hardening: Red receives evidence-only diffs, isolation records",
          "Honest meter: cached-input/reasoning token splits, unpriced-model warnings",
          "Trust posture: `[permissions] mode` + `--permission-mode`, `disable_worktree`",
          "Lifecycle hooks: `[hooks.commands]` wired to PreTaskStart/PreAgentStart/",
          "GitHub automation: keyless nightly eval gate, human-gated `@niki` review",
          "Eval credibility: per-case costs, disclosure manifest on every run,",
          "Observability: `trace.jsonl` spans per run (honestly derived timeline),",
          "MCP client Streamable-HTTP remote transport (JSON + SSE, session affinity).",
          "Onboarding: `niki init` alias, `init --scan` AGENTS.md drafter,",
          "TUI unification: one status grammar and shared theme tokens,",
          "TUI motion system: primitives + caret blink, Done slide-in, notice",
        ],
      },
      {
        name: "Fixed",
        items: [
          "`GEMINI_API_KEY` vs `GOOGLE_API_KEY` chat fallback miss.",
          "`smoke`/`doctor` pointed at nonexistent `niki init` (now a real alias).",
          "Unwired `schemas/review_feedback.schema.json` removed.",
          '`backend = "podman"` doc strings corrected (docker|worktree only).',
          "`safety_proof.json` scope documented as git-only (was overclaimed).",
          "Approval tool auto-approved everything; ask tool invented answers.",
          "`[permissions]` table silently dropped by config merge.",
          "MCP `JsonRpcResponse` never parsed (`jsonrpc` field rename bug).",
          "Dry-run empty branch refs; planner-skip metrics crash.",
          "Global key `h`/`s`/`l` dead-ends; blank session screen; `$-0.00`.",
        ],
      },
      {
        name: "Changed",
        items: [
          "`safety_proof.json`, spend-cap, and deny-list copy narrowed to match code.",
          "`niki recommend` uses static provider/model pairings; it does not rank a project's observed spend.",
        ],
      },
    ],
    tag: "v0.7.0",
    url: "https://github.com/RavaniRoshan/niki/releases/tag/v0.7.0",
  },
  {
    version: "0.6.0",
    date: "2026-08-21",
    summary: "Claude Code parity, interaction, trust, and ecosystem surface.",
    categories: [
      {
        name: "Added",
        items: [
          "Visible, draggable scrollbar in the chat viewport (ratatui `Scrollbar`, thumb + track, click/drag-to-jump)",
          "Mouse hover system: `HoverTarget` hit-tests across stage headers, messages, status bar, tab bar, modals, help, fleet; click flash + double-click word select in the input box",
          "Scroll-wheel routing on every page (chat, pages, permission/palette/menu overlays) with auto-follow pause",
          "Kill ring + yank: `Ctrl+Y` yanks the most recent kill, `Alt+Y` cycles (yank-pop); `Ctrl+W/U/K` now delete into the ring",
          "Input undo/redo: `Ctrl+Z` / `Ctrl+_` undo, `Ctrl+Y` yank; every edit is snapshot-able",
          "Multi-line composer: input area grows to ~1/3 of the screen for multi-line prompts (`render_input_box_multiline` now live)",
          "Protected paths & destructive-command enforcement: `.git`, `.ssh`, `/etc`, `rm -rf`, `sudo`, `curl`, `git push`, etc. always prompt regardless of mode",
          "Shared skills portability: reads `~/.agents/skills/` (override via `knowledge.skills_dir`), zero-migration",
          "Kitty keyboard protocol (progressive adoption, I4): enable/disable around the session + CSI-u decoding for Shift+Enter disambiguation",
          "Expanded slash-command set: `/status`, `/permissions`, `/plan`, `/version`, `/rename`, `/fork`, `/branch`, `/usage`, `/effort`, `/mcp`, `/skills`, `/copy`, `/export-md`, `/btw`, `/code-review`, `/security-review`, `/add-dir`, `/loop`, `/voice`",
        ],
      },
      {
        name: "Changed",
        items: [
          "Chat render now virtualizes to the visible window and renders a live scrollbar",
          "Permission modal detail panel (Ctrl+D) and scope selector (Tab) wired to the live permission flow",
        ],
      },
    ],
    tag: "v0.6.0",
    url: "https://github.com/RavaniRoshan/niki/releases/tag/v0.6.0",
  },
  {
    version: "0.5.0",
    date: "2026-08-19",
    summary: "Claude Code UI parity + bug fixes + demo refresh.",
    categories: [
      {
        name: "Added",
        items: [
          "Claude Code–style permission modal (4 options, blue separator, dotted separator, Ctrl+E/Ctrl+D hints)",
          "Context-window gauge in status bar (`ctx ▓▓░░░░░░░░ 12%`) with color thresholds",
          "Queued-prompt indicator in status bar",
          "Full color detection hierarchy: `ColorDepth::detect()` (NO_COLOR → ANSI-16 → 256-color → truecolor)",
          "Paste burst detector: 80ms Enter-as-newline guard for bracketed paste",
          "Model-aware context limit registry (`update_context_limit_for_model`, 8K–1M)",
        ],
      },
      {
        name: "Changed",
        items: [
          "Chat page now routes through `layout::render_chat` + dead-island `build_chat_lines`",
          "`render_input_box` takes `&AppState`; border/bg dims during active streaming",
          "Auto-scroll re-enables when scrolled to bottom (was permanent-off)",
          "Token accounting: `StageDone` accumulates `token_count`; `context_usage` = token_count / context_limit",
          "Removed dead `render_messages`, `msg_content`, `msg_role` from `layout/mod.rs`",
        ],
      },
      {
        name: "Fixed",
        items: [
          "Auto-scroll stuck-off after user scrolls up",
          "Bracketed paste Enter-from-multiline submitting prematurely",
          "Context-window gauge missing from status bar",
          "Permission modal had only 3 options (now 4: Allow once/always, Deny, Deny always)",
        ],
      },
      {
        name: "Demo",
        items: [
          "Rewrote `demo.tape` (900×560, 38s comprehensive chat flow)",
          "Rewrote `scripts/render_demo_terminal.py` (Claude Code–style capsule, spinner, gauge)",
          "GIF: 872K (`gifsicle -O3 --colors 32 --resize-width 640`)",
          "MP4: 957K (`ffmpeg -movflags +faststart -pix_fmt yuv420p -crf 23`)",
        ],
      },
    ],
    tag: "v0.5.0",
    url: "https://github.com/RavaniRoshan/niki/releases/tag/v0.5.0",
  },
  {
    version: "0.4.0",
    date: "2026-08-18",
    summary: "Launch cut.",
    categories: [
      {
        name: "Added",
        items: [
          "Distribution covered Linux x86_64, macOS Intel, and macOS Apple Silicon at this release.",
          "`docs/claims-audit.md`: maps documented product claims to supporting code where available.",
        ],
      },
      {
        name: "Changed",
        items: [
          "Homebrew formula installs release archives with SHA256 verification for supported targets.",
          "Honesty pass on sandbox claims: the deny-list blocks `git push --force`/`-f`, `rm -rf /`,",
        ],
      },
      {
        name: "Security",
        items: [
          "Repo hardening: Dependabot, CodeQL, secret scanning + push protection, branch protection",
        ],
      },
    ],
    tag: "v0.4.0",
    url: "https://github.com/RavaniRoshan/niki/releases/tag/v0.4.0",
  },
  {
    version: "0.3.3",
    date: "2026-08-15",
    summary: "Release hygiene.",
    categories: [
      {
        name: "Changed",
        items: [
          "Release assets included per-target archives plus a SHA256 checksum manifest.",
          "CI caches `cargo-audit` / `cargo-deny` binaries instead of re-installing each run.",
        ],
      },
    ],
    tag: "v0.3.3",
    url: "https://github.com/RavaniRoshan/niki/releases/tag/v0.3.3",
  },
  {
    version: "0.3.2",
    date: "2026-08-15",
    summary: "CI / supply-chain hardening.",
    categories: [
      {
        name: "Changed",
        items: [
          "Removed the OpenSSL dependency: `reqwest` uses `rustls-tls`, `git2` vendors `libgit2`",
          "`deny.toml` license allow-list extended (ISC, CDLA-Permissive-2.0) so the supply-chain",
        ],
      },
    ],
    tag: "v0.3.2",
    url: "https://github.com/RavaniRoshan/niki/releases/tag/v0.3.2",
  },
  {
    version: "0.3.1",
    date: "2026-08-14",
    summary: "Launch-hardening cut (the product IS the demo).",
    categories: [
      {
        name: "Added",
        items: [
          "Tester executes a resolved test suite inside the sandbox and records its result.",
          "Sandbox image now includes a Rust toolchain (`cargo`/`rustc`) so Rust projects",
        ],
      },
      {
        name: "Changed",
        items: [
          "`[docker] network_disabled` is the default (egress blocked by default), this",
          "`role_glyph` now renders a distinct glyph for the Planner so it no longer",
        ],
      },
      {
        name: "Security",
        items: ["`SECURITY.md` updated: default-blocked egress is shipped, not a roadmap item."],
      },
    ],
    tag: "v0.3.1",
    url: "https://github.com/RavaniRoshan/niki/releases/tag/v0.3.1",
  },
  {
    version: "0.3.0",
    date: "2026-08-13",
    summary:
      "Launch cut. Focus: distribution, onboarding, and trust, the agent engine is unchanged.",
    categories: [
      {
        name: "Added",
        items: [
          "Multi-provider support: configure different LLM providers per agent role",
          "`general.spend_cap_usd`, a per-run spend ceiling. Exceeding it prints a clear",
          "Explicit config-trust warnings: `[session]`, `[compaction]`, `[mcp]`, `[permissions]`",
          "`assets/logo.svg` recolored to the teal brand (`#0d9488`) to match the TUI.",
          "`docs/benchmarks.md` (honest eval-harness notes).",
        ],
      },
      {
        name: "Changed",
        items: [
          "Package manifests (Homebrew, Scoop, Winget) now target `v0.3.0`; Winget license",
          "`[mcp]` now defaults to `enabled = false` (the MCP client is not yet wired; the",
          'Worktree backend now prints an explicit "runs on your host with your privileges"',
        ],
      },
      {
        name: "From 0.3.0-pre",
        items: [
          "Prompts and JSON schemas are **embedded in the binary** (runs from any directory).",
          "License changed from BUSL-1.1 to Apache-2.0.",
          "Google key sent via `x-goog-api-key` header (not URL param).",
          "Command deny-list enforced for every agent role.",
          "`display::artifact_render::truncate` Unicode-safe; SIGPIPE ignored.",
        ],
      },
      {
        name: "Fixed",
        items: ["`cargo test` (lib unit tests) compiles; goal criteria no longer interpolate the"],
      },
      {
        name: "Security",
        items: ["Secret redaction covers Google API keys and `?key=` / `&key=` URL parameters."],
      },
    ],
    tag: "v0.3.0",
    url: "https://github.com/RavaniRoshan/niki/releases/tag/v0.3.0",
  },
  {
    version: "0.2.0",
    date: "2025-08",
    summary:
      "- Initial public beta: Planner → Coder → Tester → Reviewer pipeline, Podman/Docker and git-worktree backends, BYOK multi-provider support, security auditor, parallel coders, TUI, and dashboard.",
    categories: [],
    tag: "v0.2.0",
    url: "https://github.com/RavaniRoshan/niki/releases/tag/v0.2.0",
  },
];
