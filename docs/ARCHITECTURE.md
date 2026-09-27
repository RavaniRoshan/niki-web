# Architecture

How the two apps fit together, and why the code is split the way it is.

## Shape

```
niki-web/
  apps/web/            marketing site, Next.js 15, static export
  apps/docs/           documentation site, Blume
  packages/niki-theme/ the shared palette and the canonical URLs
```

Both apps are static. `apps/web` sets `output: "export"` with `trailingSlash: true` and
`images: { unoptimized: true }`, so `next build` writes plain HTML to `out/`. There is no server, no
API route, no database, and no middleware. The output is served by a small static file server
(`apps/web/scripts/static-server.mjs`), which is what CI and the Playwright suite run against.

That constraint is deliberate and load-bearing: the product is a local CLI, so the site has no
reason to hold state, and a static export means the marketing site cannot become a liability.

## Why two route groups

`apps/web/src/app/` has two parallel route groups:

```
app/
  (landing)/   /                      the landing, its own design scope
  (site)/      16 inner routes        product, resources, pricing, about, community
```

Both resolve to top-level paths. `/product` lives in `(site)`, `/` lives in `(landing)`. The groups
exist so each can have its own layout without either one leaking into the other.

- `app/(landing)/layout.tsx` renders `LandingShell`, which carries the landing's measured token
  scope, the landing header and footer, and the scroll-reveal layer.
- `app/(site)/layout.tsx` renders `SiteChrome`, which renders **the same** `LandingHeader` and
  `LandingFooter`, re-exposed through `components/site/site.module.css`.

They share their chrome deliberately. There used to be a separate legacy header, a separate
footer, and a WebGL gradient arc under every inner page. A visitor moving between `/` and
`/product/` saw the brand change under them: a different palette, different buttons, a different
footer. That is gone. One header, one footer, one palette.

`SiteChrome` re-declares the `--landing-*` custom properties by mapping them onto the shared tokens
(`--landing-canvas: var(--background)`, and so on). That is what lets one pair of components render
correctly on both route groups without the landing stylesheet leaking into the inner pages.

## Two style systems, one palette

The styling is split by mechanism, not by brand:

- **Shared tokens.** `packages/niki-theme/tokens.css` defines `--background`, `--foreground`,
  `--card`, `--border`, the `--gray-*` ramp, the `--orange-*` ramp, and the radii. Both apps
  import it. This is the single source of colour truth.
- **Landing styles.** `components/landing/*.module.css`, scoped to `.shell`. CSS Modules, hashed
  class names.
- **Inner-page styles.** The `ax-*` class rules in `src/styles/globals.css`, consumed through
  `Frame`, `CodeBlock`, and `Terminal`.

The inner pages predate the landing rebuild and use a utility-class kit rather than CSS Modules.
They were aligned to the landing's rules (pill controls, 8px cards, weight-400 headings with
tight tracking, the same 64-to-112px section rhythm) rather than rewritten, because they share
almost all their markup through three components. `landing.visual.spec.ts` pins three of them
alongside the landing so the two systems cannot drift apart again.

The header is one component for both route groups and it is not a purely static one. Four client
pieces sit behind it: `NavMenu` (the mega-panels, driven by `content.ts`), `HeaderBarSurface`
(measures the notch, writes the bar's `clip-path` and positions the canvas backing behind the bite),
`NikiMark` (the mark, so its strokes can take the theme's tokens and run their hover motion), and
`NavShrinkSensor` (the one-pixel observer that sets `html[data-nav-shrunk]`).

The landing's closing portal is a vendored third-party component, `GlyphPortal` (MIT, © 2026
Christian Katzmann, attribution preserved in the file). `BrandPortal` is the wrapper that supplies
the word, the focus letter, the font, and the four `--gp-*` tokens that keep it inside the landing
palette. It is the only scroll-driven animation besides `Reveal`.

## Data flow

Nothing on the site hardcodes a fact that already lives in a data file.

```
apps/web/src/data/release.ts     version, date, tag, download targets, install commands
apps/web/src/data/changelog.ts   release history
packages/niki-theme/site.ts      site URLs, route table, docs routes, release metadata
        |
        +-> apps/web/src/components/landing/content.ts   the landing's strings and lists
        +-> apps/web/src/app/(site)/**/page.tsx         the inner pages
        +-> apps/docs (via DOCS_ROUTES)                 the docs site's cross-links
```

`content.ts` derives the changelog cards from `RELEASES` and the install command from
`INSTALLERS.shell.command`, so a release bump updates the site without a second edit.

`site.ts` reads `NIKI_WEB_URL` and `NIKI_DOCS_URL` from the environment and falls back to the
`*.pages.dev` origins. That is the only place a site URL is allowed to appear.

## Theming

One theme is active for the whole page. There is no mid-scroll theme flip.

Dark is the default. A pre-hydration script in `app/layout.tsx` reads `localStorage["niki-theme"]`
and, failing that, `prefers-color-scheme`, and adds `.light` to `<html>` before first paint. The
landing toggle writes the choice back. Both apps key their light values off that same class.

## The scroll reveal

`components/landing/Reveal.tsx` is the only scroll-driven animation on the site. It runs one
ScrollTrigger per `[data-reveal]` element, animating `opacity` and `translateY` only, `once: true`.

It uses `gsap.matchMedia` scoped to `(prefers-reduced-motion: no-preference)` rather than a React
state flag. This is not stylistic. A `gsap.from` tween applies its from-state synchronously, so a
preference flag that resolves in an effect means the tween is created once with motion allowed,
briefly sets the whole page to `opacity: 0`, and can leave it there. Scoping to the media query
means the tween is never created when motion is reduced, and GSAP reverts it if the preference
changes mid-session.

## Testing

Playwright runs against `out/`, the real build output, on port 4322. It is not a dev-server test,
so what the suite exercises is what deploys.

The visual baselines compare at `maxDiffPixels: 0`, which is stricter than it sounds and is the
reason a layout regression cannot slip through: a single shifted pixel fails the run.

The landing's six baselines are the one exception, at 15000 of ~11.9M pixels. The hero background
is a live WebGL canvas and a driver's rounding when compositing one is not bit-stable between
runs. The inner-route baselines, whose pages carry no canvas, stay at 0.

## Deploy

`main` is the deploy branch. `ci.yml` runs format, lint, typecheck, both builds, and Playwright on
every push to `main` and every pull request. `deploy.yml` publishes `apps/web/out` and
`apps/docs/dist` to Cloudflare Pages.

The two are independent: CI does not deploy, and a failed test blocks the publish.
