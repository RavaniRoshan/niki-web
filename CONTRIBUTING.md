# Contributing

How to make a change to this repository and get it through the checks.

## Before you start

```bash
npm ci
npx playwright install --with-deps chromium
```

Branch from `main`. The deploy workflow publishes on `main`, so a merge to `main` is what ships.

## The loop

```bash
npm run dev:web          # http://localhost:4321
```

Make the change. Then:

```bash
npm run format
npm run verify           # format:check, lint, typecheck, build, Playwright
```

`verify` is the same sequence CI runs. If it passes locally it should pass there.

## What each check will catch

**`format:check`** fails on Prettier drift. Run `npm run format` to fix it.

**`lint`** covers `apps/web` with `eslint-config-next`. Two rules bite most often:

- `react/no-unescaped-entities` fires on a straight `"` in JSX text. Use `&quot;` inside JSX, or
  `{"..."}` if the string is dynamic.
- `@typescript-eslint/no-unused-vars` fires on anything imported or declared and not used.

**`typecheck`** is `tsc --noEmit`. The Next build also refuses to ignore type errors, so this
cannot be skipped.

**`build`** produces `apps/web/out`. A failure here is usually a server/client component mistake:
anything using state, effects, or browser APIs needs `"use client"` at the top of its file.

**`test:e2e:web`** builds and then runs Playwright against the built output.

## Changing the design system

The palette, spacing, and radius live in one file: `packages/niki-theme/tokens.css`. Both apps
read it. Change it there and every page in every theme moves together.

The rules that must hold:

- **Warm neutrals only.** The canvas is a warm near-black, never `#000`, and ink is never `#fff`.
  The ramps are warm steps; a cool grey reads as a different site.
- **Ember is a text accent.** It never becomes a button fill, a large surface, or an icon fill.
  On the light theme, text uses the darker `--orange-10`; raw ember on parchment measures about
  3.1:1 and fails AA.
- **Radius, stated once:** controls are full pill, cards are 8px, tiles and inputs are 4px.
- **Headings are weight 400**, with letter-spacing that tightens as the size grows.
- **No gradients, glows, or washes.** Depth comes from hairline borders and one level of surface
  change.

If you add a colour, check it against both themes. `landing.visual.spec.ts` runs Axe at 1440 and
390 in light and dark and will fail on a serious or critical contrast violation.

Full detail, including the measured values these came from, is in `DESIGN.md`.

## The header

The header has two states: a full-width transparent bar at rest, and a capped floating pill once
`html[data-nav-shrunk]` is set. Both are plain CSS keyed off that attribute, so do not move the
state into React state on the header, and do not replace the sensor with a scroll listener.

The pill is capped at 1200px because the bar needs about 1342px at its resting spacing; the
shrunk state tightens the nav gap and link padding to make it fit. Widening the desktop nav
cluster means either raising that cap or lowering the collapse breakpoint, which is 1279. The
tests assert the header never overlaps itself at 1440, 1280, 1200, 1024, 834 or 390.

## The hero recording

The hero media is a rendered asset, not a screen recording. Regenerate it with:

```bash
cd apps/web
python3 scripts/demo/render_demo.py --out /tmp/niki-demo
python3 scripts/demo/export_demo.py --frames /tmp/niki-demo/frames --out /tmp/niki-demo/out \
  --public public
```

**It shows no controls, on purpose.** Do not add a visible play/pause bar back. The pause
mechanism is: hover the media to pause, focus the control to reach it from the keyboard, and on a
coarse pointer the control is always visible. That satisfies WCAG 2.2.2 without putting a control
on the page. The tests assert all three paths.

The control must stay **inside** the media element, not beside it. As a sibling, moving the
pointer onto it fired `pointerleave` on the media, which resumed the recording, and the click then
paused it.

The media keeps its aspect ratio at every breakpoint. A `min-height` on the mobile viewport will
override the ratio and crop the canvas, which is what happened once already.

## Changing the landing

`apps/web/src/components/landing/` is the landing only. `page.tsx` composes it; `content.ts` holds
every visible string; the three CSS Modules hold the styles.

Two things to know:

- **The scroll reveal hides below-fold content by design.** `Reveal.tsx` uses `gsap.matchMedia`
  scoped to `(prefers-reduced-motion: no-preference)`, so the tween is never created when motion is
  reduced. Do not replace it with a React state flag: the tween's from-state is applied
  synchronously, so a flag resolved in an effect briefly sets the whole page to `opacity: 0` and
  can leave it hidden.
- **Tests that read below-fold content must scroll first.** Use `revealAllSections` from
  `tests/e2e/helpers.ts`.

## Changing the inner pages

`apps/web/src/app/(site)/` holds the 16 non-landing routes. They share the landing's header and
footer through `SiteChrome`, and style themselves with the `ax-*` classes in
`apps/web/src/styles/globals.css`.

There is one header and one footer for the whole site. If you need a new navigation entry, add it
to `NAV_LINKS` in `content.ts` so it appears everywhere at once.

Do not reintroduce a second header, a second footer, or a second palette. That split is the thing
this codebase just spent its effort removing.

## Screenshot baselines

Baselines are compared at `maxDiffPixels: 0`. That is strict on purpose.

When a change is intentional:

```bash
npm run test:e2e:update
```

Then **look at the images before committing them.** A silently-accepted baseline is how a layout
regression gets locked in. The files are in
`apps/web/tests/e2e/landing.visual.spec.ts-snapshots/`.

Baselines cover the landing at 1440, 834, and 390 in both themes, plus three inner routes at 1440
in both themes. If you change shared chrome or tokens, expect all of them to move.

## Copy rules

- No em dash or en dash in any visible string. Use a period, a comma, or a colon.
- Every product claim traces to the Niki repository or to `apps/web/src/data/`. No customer names,
  testimonials, adoption numbers, or invented scores.
- Release data comes from `apps/web/src/data/release.ts` and changelog entries from
  `apps/web/src/data/changelog.ts`. Do not hardcode versions or dates.

## Before you open a pull request

- [ ] `npm run verify` passes
- [ ] New screenshot baselines have been reviewed, not just regenerated
- [ ] Both themes checked at 1440 and 390 if you touched shared chrome or tokens
- [ ] No new dependency without a reason stated in the description
- [ ] `DESIGN.md` updated if you changed a token, a radius, or a motion rule
