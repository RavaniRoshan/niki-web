# Niki Web

The public web presence for [Niki](https://github.com/RavaniRoshan/niki), the open-source
multi-agent coding pipeline. A marketing site and a documentation site, built from one repository
and sharing one brand system.

```
niki.dev        ->  apps/web    marketing, Next.js, static export
docs.niki.dev   ->  apps/docs   documentation, Blume
```

## What lives here

| Path                 | What it is                                                              |
| -------------------- | ----------------------------------------------------------------------- |
| `apps/web`           | Marketing site. Next.js 15 App Router, `output: "export"`, 22 static pages |
| `apps/docs`          | Documentation site. Blume, content in `content/` as MDX                   |
| `packages/niki-theme`| The one place tokens and site URLs are defined                          |

`packages/niki-theme` is load-bearing:

- `tokens.css` holds the palette, spacing, and radius for **both** apps. Change a value there and
  every page in every theme moves together.
- `site.ts` holds the canonical URLs, the route table, and the release metadata. Nothing hardcodes
  a site URL; everything imports from here.

## Requirements

- Node 22 (CI uses 22)
- npm workspaces, so install from the repository root

## Getting started

```bash
npm ci
npm run dev:web      # marketing site on http://localhost:4321
npm run dev:docs     # documentation site
```

To preview the exact static output rather than the dev server:

```bash
npm run build
npm run preview:web  # serves out/ on http://localhost:4321
```

## Commands

Run from the repository root.

| Command                 | What it does                                              |
| ----------------------- | --------------------------------------------------------- |
| `npm run dev:web`       | Marketing site in dev mode on port 4321                    |
| `npm run dev:docs`      | Documentation site in dev mode                             |
| `npm run build`         | Builds both apps. Web output lands in `apps/web/out`       |
| `npm run preview:web`   | Serves the built marketing site on port 4321               |
| `npm run lint`          | ESLint over `apps/web`                                     |
| `npm run typecheck`     | `tsc --noEmit` over `apps/web`                             |
| `npm run format`        | Prettier write                                            |
| `npm run format:check`  | Prettier check, fails on drift                             |
| `npm run test:e2e:web`  | Builds, then runs the Playwright suite                     |
| `npm run test:e2e:update` | Same, but rewrites screenshot baselines                   |
| `npm run verify`        | Everything above, in the order CI runs it                 |

Playwright needs a browser once per machine:

```bash
npx playwright install --with-deps chromium
```

## Testing

The suite is Playwright against the **built** site, not the dev server, so what is tested is what
deploys. It starts its own static server on port 4322.

| File                            | Covers                                                          |
| ------------------------------- | --------------------------------------------------------------- |
| `landing.spec.ts`               | Landing content, overflow, Axe, media, navigation, theme        |
| `landing.visual.spec.ts`        | Screenshot baselines for the landing and three inner routes     |
| `nav-and-portal.spec.ts`        | Mega-menu contracts and the closing portal's motion states      |
| `interactive-sections.spec.ts`  | Run explorer and evidence tabs, keyboard contracts, autoplay     |
| `proof-sections.spec.ts`        | Branch gate, model routing, install command, clipboard, changelog |
| `routes.spec.ts`                | All 18 inner routes: status, h1, landmarks, canonical URL       |

Two things about this suite are worth knowing before you change UI code.

**Screenshots are near-exact.** The inner-route baselines are compared with `maxDiffPixels: 0`, so a
one-pixel shift fails. This is deliberate: it catches layout drift that no assertion would notice.
The landing baselines allow 15000 pixels, because the hero background is a live WebGL canvas and a
driver's rounding when compositing one is not bit-stable between runs; that is ~0.13% of the
image, against the 100k-plus a real layout regression moves. When a change is intentional, run
`npm run test:e2e:update` and review the diff in the image viewer before committing the new
baselines.

**Content below the fold is hidden until scrolled.** The landing reveals each section on scroll, so
a test that reads a section, its accessibility tree, or its box must scroll first. Use the
`revealAllSections` helper from `tests/e2e/helpers.ts` rather than sprinkling scroll calls.

## Deploys

`main` is the deploy branch. `.github/workflows/deploy.yml` publishes `apps/web/out` and
`apps/docs/dist` to Cloudflare Pages. `ci.yml` runs Prettier, ESLint, TypeScript, both builds, and
the Playwright suite on every push to `main` and on every pull request.

The Pages origins come from the `NIKI_WEB_URL` and `NIKI_DOCS_URL` repository variables. Without
them, `site.ts` falls back to the `*.pages.dev` defaults.

## Documentation

- `DESIGN.md` — the design system: measured tokens, type scale, section rhythm, motion rules
- `CONTRIBUTING.md` — how to make a change and get it through the checks
- `docs/ARCHITECTURE.md` — how the two apps fit together and why the code is split the way it is
- `TODO.md` — what is done and what is still open

## Boundaries

- The landing was designed against a third-party reference. Only its **layout language, spacing
  rhythm, and colour role** were used. No reference font, logo, photograph, screenshot, or copy is
  in this repository, and none may be added. See `DESIGN.md`.
- Product claims on the site must trace to the Niki repository or to `apps/web/src/data/`. No
  customer names, testimonials, adoption numbers, or invented scores.
