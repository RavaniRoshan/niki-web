# Niki Web

Public web presence for [Niki](https://github.com/RavaniRoshan/niki) — the open-source
multi-agent coding pipeline. Marketing site + documentation under one roof, sharing a single
brand system.

```
niki.dev        → apps/web   (marketing, Astro)
docs.niki.dev   → apps/docs  (documentation, Blume)
```

## Repository layout

```
apps/
  web/           # Marketing site — Astro 5, static output
  docs/          # Documentation — Blume 1.4.3, content in content/
packages/
  niki-theme/    # Shared design tokens + centralized site URLs (site.ts)
.github/
  workflows/     # CI + per-site GitHub Pages deploys
```

- **Marketing** (`apps/web`): homepage with the pipeline visual motif, product pages,
  downloads (data-driven from `src/data/release.ts`), pricing, resources (blog / guides /
  examples as content collections), community, about. Sitemap, OG images, JSON-LD built in.
- **Docs** (`apps/docs`): all existing Niki documentation, rethemed to the brand. Local
  search (Orama), TOC, prev/next, callouts, and a changelog generated live from GitHub
  Releases at `/changelog`.
- **Shared tokens** (`packages/niki-theme`): the palette, spacing, radius, and — critically —
  `site.ts`, the single source of truth for every cross-site URL. Change `SITE.web` /
  `SITE.docs` (or the `NIKI_WEB_URL` / `NIKI_DOCS_URL` env vars) once, and both sites
  retarget.

## Commands

```bash
npm install

npm run dev:web        # marketing dev server
npm run dev:docs        # docs dev server

npm run build           # build both sites
npm run build:web       # → apps/web/dist
npm run build:docs      # → apps/docs/dist

npm run preview:web     # preview the marketing build
```

Docs also support `npm run doctor --workspace apps/docs` (Blume content diagnostics).

## Design system

Dark-first, flat surfaces, thin borders, mint-dominant (`#4ff7d1`), magenta reserved for
secondary/code states. Tokens live in `packages/niki-theme/tokens.css`; typography is Inter +
JetBrains Mono; section rhythm 80px; max width 1200px; cards 16px, code 12px, pills 9999px.

Agent role colors (planner / coder / tester / reviewer / red / security) remain semantically
distinct in both apps — they carry meaning in the pipeline documentation and are intentionally
separate from the primary brand accent.

## Keeping content truthful

- Downloads are driven by `apps/web/src/data/release.ts` — update it per release, or wire it to
  the GitHub Releases API later. The changelog page reads
  `apps/web/src/data/changelog.ts` (generated from the repo's `CHANGELOG.md`); the docs
  changelog is already live-generated from GitHub Releases.
- Marketing copy is sourced from the Niki repo's `README.md`, `docs/positioning.md`, and
  `docs/claims-audit.md`. Every claim on these pages maps to shipped functionality —
  future-planned items (cloud execution, enterprise tier) are explicitly labeled as such.

## Deployment

Two GitHub Actions workflows deploy on push to `main`:

- `.github/workflows/deploy-web.yml` → GitHub Pages (marketing)
- `.github/workflows/deploy-docs.yml` → GitHub Pages (docs)

Site URLs come from repository variables `NIKI_WEB_URL` / `NIKI_DOCS_URL` (default
`https://niki.dev` / `https://docs.niki.dev`). Point a custom domain at each Pages deployment
when ready — no code changes needed.

## License

The web content is part of the Niki project ecosystem — Apache-2.0, like Niki itself.
