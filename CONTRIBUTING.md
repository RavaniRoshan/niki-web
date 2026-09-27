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

The header has two states: a transparent bar at rest, and a capped bar with a **filled surface**
once `html[data-nav-shrunk]` is set. Both are plain CSS keyed off that attribute, so do not move
the state into React state on the header, and do not replace the sensor with a scroll listener.

The bar is one left-to-right group — brand, links — with the action cluster holding the right. The
links are deliberately **not** centred, and they are not centred because a centred nav is what made
the bar need 1342px. The bar now needs about 1030px, which is why the 1200px cap has room.

Two structural rules, both of which broke when they were ignored:

- The bar's surface is a **sibling** of the content, not the content's background. It carries the
  backdrop blur, and the mega-panels hang below that box; making the bar itself the filtered
  element drags them into the blur.
- The content is lifted with `z-index` alone. Giving those flex items `position` out-specifies
  `.desktopNav { position: static }`, which turns the nav into the containing block for the panels
  and shrinks them to the width of the links.

The tests assert the header never overlaps itself at 1440, 1280, 1200, 1024, 834 or 390, and that
the surface is a plain rounded bar rather than a pill.

## The mark

`NikiMark.tsx` is the mark, and it is a component rather than an `<Image>` so the
strokes can take the theme's tokens and so the hover motion is real. `public/logo-mark.svg` is the
same geometry with hardcoded colours for the favicon; **change both together**, or the tab and the
header will drift apart.

The diagonal is dashed and marches on hover. Do not give it an idle loop: a mark that animates on
its own is a distraction, and the dashed line already reads as a run at rest.

## The mega-menus

Panels open on hover **and** on focus, close on Escape, on an outside pointerdown, and on a route
change. `aria-expanded` and `aria-controls` live on the trigger and the ids must agree.

A closed panel is `visibility: hidden`, not `aria-hidden` alone — `aria-hidden` does not take its
links out of the tab order. And on close, clear the panel's inline styles rather than tweening them
back: the entrance tween leaves `visibility: inherit` inline, which beats the stylesheet and
strands the links in the tab order.

Every href in a panel must be a route the site serves or a docs page the docs build. Do not invent
destinations to fill a panel.

## Section skeletons

The page is a sequence of thirteen sections and **no two of them may share a layout skeleton**. If
you reach for a window, a card or a list because three blocks already used one, that is the
repetition this pass exists to remove, and it reads as generated rather than designed.

The uniform `Reveal` is the baseline arrival for every section. Anything on top of it must be
specific to the section it lives in: if a section's motion could be lifted and dropped onto another
section unchanged, it is wrong. `PLAN.md` records the idea each section is supposed to be making.

## Base link colour

`.shell :where(a)` is a **floor at zero specificity**, written `:where(.shell) :where(a)` on
purpose. At `.shell :where(a)` it tied with single-class component rules such as
`.primaryAction` and then won on source order, which left every ink-filled button rendering its
label in the same ink as its own fill. Keep it at zero.

## Contrast on tinted code

Never dim code with `opacity`. An opacity dim took the idle config lines to 1.85:1 on parchment and
Axe refused it; the same state is expressed with colour instead.

Never put `--landing-positive` on a tinted background either. A green string on a surface a few
percent darker than `--landing-surface` is already under 4.5:1 in the light theme, which is why the
routing panel marks its active line with an inset **ring** rather than a fill. A box shadow leaves
the computed background alone; a background does not.

## The hero wash

The hero background is a WebGL layered wave. Its palette lives in CSS on `.heroWash` as
`--wash-base`, `--wash-wave-1`, `--wash-wave-2`, `--wash-wave-3` and `--wash-strength`; the
component reads those properties, so change the colours there and not in the component.

**The stops are the site's warm dusk ramp, not the reference's sky blue.** A saturated blue on
this canvas reads as a different product. If you add a stop, add it to the ramp.

**`--wash-strength` is the knob that matters.** Dark is `0.88`, light is `0.58`. Below about `0.3`
the wave stops reading; at `1` it takes over the hero and the headline loses its contrast. If the
wash looks wrong, that value is almost always why.

**Where it fades is measured, not authored.** `GradientWash` takes a `fadeAt` selector, finds that
element inside the wash's own `<section>`, and writes `--wash-fade-end` as a fraction of the
wash's **own** height. Two traps, both of which have bitten:

- `closest("section, div")` from inside the wash returns **the wash itself**, because it is a div.
  Match the tag you mean.
- The fraction is of the wash, not of the section. The wash starts above the section's top edge, so
  the two do not share an origin, and using the section's height puts the fade in the wrong place.

The wash must be fully gone by the midpoint of the demo recording, and a test asserts it at two
widths. Do not hardcode a mask stop; re-measure via the `ResizeObserver` that is already there.

Do not make it more expensive without measuring:

- Keep the 30 fps cap. Do not tie it to the display refresh rate.
- Keep the `IntersectionObserver`. Without it the loop runs on the main thread forever, and this
  page also carries a video.
- Keep the reduced-motion branch. It paints one frame and never starts.
- Keep the CSS gradient under the canvas. It is the first paint and the fallback when WebGL is
  missing or the context is lost.
- `data-animating` on the canvas reflects the loop state and is asserted by a test. Keep it.

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

The inner-route baselines are compared at `maxDiffPixels: 0`. That is strict on purpose.

The landing baselines allow **15000** pixels, and the exception is narrow rather than general. The
hero background is a live WebGL canvas, and a driver's rounding when compositing one is not
bit-stable. Measured across repeated runs of the same test: 1.3k, 5.0k, 5.4k and 10.6k differing
pixels, always at one or two units per channel and always along the gradient's band edges. 15000
is ~0.13% of the desktop image; the smallest real regression this suite exists to catch, a nav
gap closing by 4px, moves over 100k pixels. The inner routes carry no canvas and stay at 0.

If you find yourself raising that number to get a build green, the fix is in the component, not in
the tolerance.

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
