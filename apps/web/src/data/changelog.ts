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
    version: "0.7.0",
    date: "2026-09-08",
    summary:
      "Mega-plan execution (30 commits): plan-mode approval gates, oracle integrity, honest cost metering, independence hardening, session control plane, headless CI contract, trust posture, automation, and TUI unification. All user-facing claims below are covered by tests, mock-LLM end-to-end runs, or the VHS visual gate (`tests/visual/`, 12 reference frames at 0.00% self-diff).",
    categories: [
      {
        name: "Added",
        items: [
          "Plan mode: `niki plan` researches without executing and writes reviewable",
          "Session CLI: `niki session list/show/checkpoints/undo/rewind` with",
          "User slash commands: `.niki/commands/*.md` (filename → `/name`) with",
          "Headless contract: `niki run --bare` (no memory/MCP/knowledge-URLs),",
          "Oracle integrity: `oracle_source` (spec/derived/property) on every test",
          "Independence hardening: Red receives evidence-only diffs, isolation records",
          "Honest meter: cached-input/reasoning token splits, unpriced-model warnings",
          "Trust posture: `[permissions] mode` + `--permission-mode`, `disable_worktree`",
          "Lifecycle hooks: `[hooks.commands]` wired to PreTaskStart/PreAgentStart/",
          "GitHub automation: keyless nightly eval gate, human-gated `@niki` review",
          "Eval credibility: per-case costs, disclosure manifest on every run,",
          "Observability: `trace.jsonl` spans per run (honestly derived timeline),",
          "MCP Streamable-HTTP remote transport (JSON + SSE, session affinity).",
          "Onboarding: `niki init` alias, `init --scan` AGENTS.md drafter,",
          "TUI unification: one status grammar, 100% theme-token production code,",
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
          "`niki recommend` static-pairings truth in docs (history-driven per-project",
        ],
      },
    ],
    tag: "v0.7.0",
    url: "https://github.com/RavaniRoshan/niki/releases/tag/v0.7.0",
  },
  {
    version: "0.6.0",
    date: "2026-08-21",
    summary: "Claude Code parity — interaction, trust, and ecosystem surface.",
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
          "**Distribution narrowed to the three platforms we build and verify:** Linux (x86_64)",
          "`docs/claims-audit.md`: every headline marketing claim traced to the code that backs it.",
        ],
      },
      {
        name: "Changed",
        items: [
          "Homebrew formula now installs the release `.tar.gz` archives (with SHA256) for the three",
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
          "Release assets are now per-target `.tar.gz` archives plus a `checksums.txt` (SHA256) —",
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
          "**Verification in the loop is now real.** The Tester actually executes your test",
          "Sandbox image now includes a Rust toolchain (`cargo`/`rustc`) so Rust projects",
        ],
      },
      {
        name: "Changed",
        items: [
          "`[docker] network_disabled` is the default (egress blocked by default) — this",
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
      "Launch cut. Focus: distribution, onboarding, and trust — the agent engine is unchanged.",
    categories: [
      {
        name: "Added",
        items: [
          "Multi-provider support: configure different LLM providers per agent role",
          "`general.spend_cap_usd` — a per-run spend ceiling. Exceeding it prints a clear",
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
