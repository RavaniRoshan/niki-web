# Niki Landing Design Specification

Status: source of truth for the landing rebuild
Scope: the root landing route only (`apps/web/src/app/(landing)`)

## Reference boundary

The reference study is limited to public, observable qualities: layout composition, spacing
rhythm, proportion, colour role, and motion character.

No reference-owned font, logo, wordmark, photograph, screenshot, window artwork, navigation
label, copy line, testimonial, customer name, or any other protected material may be committed,
reproduced, traced, cropped, or embedded in this repository. The implementation must not
reproduce the reference's trade dress or product-story arrangement verbatim.

Pixel-perfect means the Niki page matches **this** specification exactly at the required
viewports, not that it matches the reference pixel for pixel.

## Measured reference values

Sampled from a 1739 x 10199 full-page capture, read as twelve native-resolution slices and then
pixel-probed. These are measurements, not estimates. They are the reason the tokens below differ
from the earlier draft of this document.

| Role | Measured | Note |
| --- | --- | --- |
| Page canvas | `#14120b` | warm near-black, never `#000` |
| Card surface | `#1b1913` | |
| Card border | `#201e19` | 1px hairline, lighter than surface |
| Logo tile | `#1d1b15` | one step above canvas |
| Footer | `#1b1913` | full bleed |
| Primary ink | `#edecec` | |
| Quote ink | `#f6ece1` | warmer than body ink |
| Ember accent | `#f54e00` | text accent, never a fill |
| Secondary button fill | `#2a2a28` | |
| Button radius | full pill | 54 px tall; the corner arc solves to r = 27 |
| Card radius | ~8 px | |
| Tile radius | ~4 px | |
| Content gutter | 57 px at 1739 | container max 1626 px |
| Section card gap | 112 px | |
| Hero H1 | ~42 px, line-height ~1.05, weight 400 | cap height 30 px, 41 px line box |
| Closing display | ~80 px | |
| Feature split | 1fr / 2fr | copy ~528 px, media ~1049 px |
| Three-column grid | 530 px columns, 16 px gap | verified at 58-588, 604-1134, 1150-1680 |
| Provider strip | 12 tiles, 104 px tall | |
| Section headline | ~30 px, weight 400, left aligned | |

The pasted design system describes the **light** half of the same system. The capture is the dark
half. Both are adopted: capture values drive dark, the pasted parchment values drive light. They
agree on ember and on the warm neutral family, so the two halves reconcile without conflict.

## Colour tokens

Declared on `.shell` in `landing-shell.module.css`. Scoped to the landing; inner routes keep their
existing presentation.

| Role | Dark | Light |
| --- | --- | --- |
| `--landing-canvas` | `#14120b` | `#f7f7f4` |
| `--landing-tile` | `#1d1b15` | `#f2f1ed` |
| `--landing-surface` | `#1b1913` | `#f2f1ed` |
| `--landing-surface-strong` | `#201e19` | `#e6e5e0` |
| `--landing-elevated` | `#2a2a28` | `#e6e5e0` |
| `--landing-ink` | `#edecec` | `#26251e` |
| `--landing-quote-ink` | `#f6ece1` | `#26251e` |
| `--landing-muted` | `#9c968a` | `#6f6e68` |
| `--landing-line` | `#201e19` | `#dcdbd4` |
| `--landing-signal` | `#f54e00` | `#f54e00` |
| `--landing-link` | `#f54e00` | `#c53f04` |
| `--landing-positive` | `#4f9d6d` | `#34785c` |
| `--landing-on-signal` | `#14120b` | `#f7f7f4` |

Ember is a text accent only. It never becomes a button fill, a large surface, or an icon fill.

Light `--landing-link` is darkened to `#c53f04`; raw `#f54e00` on `#f7f7f4` measures about 3.1:1
and fails AA for body text.

## Typography

Geist and JetBrains Mono from the existing root layout. No new families.

| Role | Size | Weight | Line height | Tracking |
| --- | --- | --- | --- | --- |
| Display (closing CTA, receipts) | `clamp(2.75rem, 5.2vw, 5rem)` | 400 | 1.0 | -0.04em |
| Hero H1 | `clamp(2rem, 2.5vw, 2.625rem)` | 400 | 1.05 | -0.03em |
| Section heading | `clamp(1.5rem, 1.9vw, 1.875rem)` | 400 | 1.15 | -0.02em |
| Lead | `clamp(1.0625rem, 1.3vw, 1.375rem)` | 400 | 1.4 | normal |
| Body | `1rem` | 400 | 1.55 | normal |
| Small | `0.875rem` | 400 | 1.5 | normal |
| Meta | `0.75rem` | 400 | 1.5 | normal |
| Code and metadata | JetBrains Mono, 11-13 px | 400 | 1.5-1.67 | normal |

Headings are weight 400. Tracking tightens as size grows. Visible landing copy contains no em dash
and no en dash.

## Geometry

```
--landing-container: 1626px;
--landing-gutter: clamp(20px, 3.3vw, 57px);
--landing-section-space: clamp(64px, 6.4vw, 112px);
--landing-card-radius: 8px;
--landing-tile-radius: 4px;
--landing-control-radius: 999px;
--landing-control-height: 44px;
--landing-header-height: 76px;
--landing-bar-radius: 12px;
```

**Radius rule, stated once and followed everywhere:** controls are full pill, cards are 8 px,
tiles and inputs are 4 px. The reference does exactly this, so the mixed system is intentional.

**Spacing scale:** 4, 8, 16, 24, 40, plus the container and section tokens above.

## Backdrops

The reference sets product windows on a muted landscape photograph. That photograph is
reference-owned and is not used. The role is reproduced with CSS-composited warm-dusk fields
(`--landing-backdrop-dusk`, `--landing-backdrop-strata`, `--landing-backdrop-haze`), each a stack
of radial and linear gradients. They cost no bytes, stay sharp at any viewport, and are
redefined for the light theme.

No people photography, no illustration, no decorative graphics, no bitmap backdrop assets.

## Window chrome

`RunWindow.tsx` is the single window primitive: a composited backdrop, optional offset second
window, a title bar with three traffic lights, an optional tab strip, and a body slot. Every
product surface on the page is this one component, which is what makes the four feature cards
read as a family rather than four unrelated panels.

## Motion

The cheapest tool that works, and the existing token values are reused rather than forked.

- **Hover, press, colour:** CSS transition only, 150 ms on `--landing-ease-ui`, gated behind
  `@media (hover: hover) and (pointer: fine)`. Press is `scale(0.98)`. This is the
  tens-of-times-a-day tier, so it stays near-imperceptible.
- **Drawers, tabs, dialogs:** CSS transition on `--landing-ease-out` / `--landing-drawer-ease`,
  150-260 ms. Transitions rather than keyframes, so rapid retriggering retargets instead of
  restarting.
- **Scroll reveal:** one island, `Reveal.tsx`, using `useGSAP` and `gsap.matchMedia`. One
  ScrollTrigger per target at `start: "top 88%"`, `once: true`, `opacity` and `translateY(24px)`
  only.
- **Not used, by decision:** no marquee, no parallax, no counters, no magnetic hover, no pinning,
  no scrub, no `scale(0)`, no `transition: all`, no `window.addEventListener("scroll")`.

`gsap.matchMedia` rather than a React preference flag: the tween's from-state is applied
synchronously, so a flag resolved in an effect briefly applies `autoAlpha: 0` to the whole page
and can leave it hidden. Scoping to the media query means the tween is never created when motion
is reduced, and GSAP reverts it if the preference changes mid-session.

## Page section order

Twelve sections. Product evidence replaces social proof throughout.

1. **Hero.** Headline, two actions, and the real Niki pipeline recording inside window chrome.
2. **Provider strip.** The twelve named integrations, each with its own name set beside its mark,
   presented as integrations, never customers.
3. **Feature A, copy left.** Four agents, with the live run explorer as the media.
4. **Feature B, media left.** The branch gate, shown as a run: four gates resolve in
   sequence and the branch line commits last, because that is the section's claim.
5. **Feature C, copy left.** Run artifacts, with tab pills and the install command bar.
6. **Feature D, media left.** Per-stage model routing. Not a window: a highlighted config where each
   `[agents.*]` block ignites in pipeline order, because a grey `<pre>` does not act on the claim.
7. **Receipt grid.** Centred display heading over the three artifacts a reviewer actually reads,
   each set as the artifact it is: a diff as a diff, a report as a ledger of verdicts, JSON as JSON.
   Stands in for the reference's quote wall; Niki has no customers to quote and inventing quotes is
   not an option.
8. **Changelog.** Four real releases from `src/data/changelog.ts`, on a spine with nodes rather
   than in a four-up grid, because releases have an order and a date.
9. **Capability row.** Agents, sandbox, guardrails, as three different instruments on one
   unbroken hairline: a stage ladder, a runtime choice, a guard ledger.
10. **Manifesto card.** License, no telemetry, BYOK, and the real backends and providers.
11. **Recent highlights.** Four real documentation sections as a quiet index: a mono category in the
   gutter, hairlines between, no containers.
12. **Closing CTA.** Centred display heading and one solid action.
13. **Closing portal.** The wordmark, a camera that travels into one letter, and the panel that
    opens once you are through. It sits above the footer, which keeps its own place below.

Four consecutive feature cards is a deliberate deviation from the usual zigzag cap, because the
brief is explicit reference fidelity. They are broken up by varying the media composition and by
giving section 5 the interactive tab and command treatment.

## The closing portal

A scroll-driven camera through live type, vendored from `GlyphPortal` (MIT, © 2026 Christian
Katzmann, attribution kept in the file). Three things were chosen rather than inherited:

- The word is `Niki` and the focus letter is the **second `i`**. `N` and `K` are diagonals whose
  interior ink is small and ragged, so the camera would stutter; a stem gives a clean rectangular
  window. Pinning the letter also keeps the composition stable between font metrics, which matters
  because the screenshot baselines compare at zero tolerance.
- The field is the **site's palette**, not the demo's green, so the letter you fall through is the
  brand colour.
- The reveal is a **closing panel, not the footer**. The footer keeps its own place below, so it is
  still reachable without a scroll dependency.

It scrolls the page rather than a bounded inner scroller: nesting scroll areas on mobile is worse,
and it destabilises full-page screenshots.

Two traps are worth recording because both fail silently:

- The portal measures ink through a canvas at the requested weight, and a **pending** face makes it
  pin itself to a static poster with motion off, permanently. `next/font` resolves
  `var(--font-geist)` to a stack containing "Geist Fallback", a metric-override face whose
  `document.fonts` status is `error`, so the availability check fails and the portal never moves
  again. The component is therefore given `"Geist", system-ui, sans-serif` by name, and
  `BrandPortal` gates mounting on `document.fonts.ready` with a 1200ms fallback.
- All four `--gp-*` tokens must be passed. `--gp-paper` defaults to `#fff`, which silently inverts
  the dark theme into a light page.

Under `prefers-reduced-motion: reduce` the runway collapses and the panel is shown statically, so
the page never ends in 1710px of dead scroll.

## Product truth contract

Every visible product claim maps to the Niki repository or the current release and site data.

- Four independent LLM sessions: Planner, Coder, Tester, Reviewer. Independence is at the session
  and context layer; sequential stages share the sandbox so the diff persists.
- Podman or Docker sandbox, or a git worktree backend.
- A qualifying run creates a fresh `niki/<id>` branch from a non-empty diff. A failed executed
  test suite blocks branch creation unless the user forces the run. Committed branches are never
  rewritten.
- Every run leaves `changes.patch`, `report.md`, and per-agent `artifacts/*.json`.
- `plan.md` is output from explicit plan mode only, and always carries a `Plan mode` qualifier.
- BYOK, with twelve named provider integrations and configurable OpenAI or Anthropic gateways.
- No telemetry. Apache-2.0 licensed. Release and install command come from the data modules.

Prohibited: customer names or logos, testimonials, adoption or performance numbers, any claim
that Niki writes to `main`, creates a hosted pull request, or guarantees an outcome, and any
invented file names, timings, or scores.

## The header

One header for the whole site, and it has two states.

At rest it is a transparent bar with no fill and no shadow, so the page reads as one surface. It
is a single left-to-right group: brand, then the links, with the action cluster holding the right.
The links are *not* centred in the viewport, because a centred nav is what forced the bar to need
1342px in the first place.

Once the page scrolls past its first screenful the bar gains a **floating surface**. It is capped at
1200px, carries a translucent fill, a backdrop blur and a hairline, with its four corners rounded to
12px. It is fixed rather than sticky so it can float clear of the content, and `main` carries the
matching top padding so nothing hides underneath it.

The surface is a **sibling** of the content, not the content's own background, because it carries
the backdrop blur and the mega-panels hang below that box: making the bar itself the filtered
element would drag them into the blur. The content is lifted above it with `z-index` alone.

The state is a single attribute, `html[data-nav-shrunk]`, set by `NavShrinkSensor`. That is an
`IntersectionObserver` on a one-pixel sentinel, not a scroll listener: the state changes once per
crossing rather than once per frame, so there is no per-frame work to throttle.

The desktop nav **already overlapped the action cluster between 1024px and 1280px** when the
collapse breakpoint was at 1023, because a centred nav made the bar need 1342px. The breakpoint is
now 1279, and the single-group layout brought the bar's own requirement down to about 1030px. The
tests assert the header never overlaps itself at 1440, 1280, 1200, 1024, 834 or 390.

## The mark

Two fixed stems and a run between them. The old mark was a generic letter in a
rounded square, in a yellow that is not in this palette. The tile is the ink, so
the mark reads as one object in both themes rather than dissolving into a dark
header, and the diagonal is a **dashed line that marches on hover**. Four stages
handing off typed artifacts is the whole product, and a dashed diagonal says that
at 26 pixels.

Motion is hover-only and there is no idle loop: a mark that animates on its own is
a distraction, and the diagonal is already a static dashed line when the pointer
is elsewhere. It lives in `NikiMark.tsx` so the strokes can take the theme's
tokens; `public/logo-mark.svg` is the same geometry with hardcoded colours for
the favicon and anything that cannot run a script.

## The mega-menus

Each of the five nav entries opens a panel that spans the bar's full width and hangs below it, so
the two read as one object. A panel is three columns: the entry's own name and description with an
"overview" link, then two labelled groups of destinations.

The entry label is a `<button>`, not a link. That is what buys the width back: a link plus a chevron
per entry would have cost 60px across the bar, and the panel carries the route to the page the
entry names, so no trigger is a dead end.

Every href in a panel is a route the site serves or a docs page the docs build. Nothing is invented
to fill a panel. Panels open on hover **and** on focus, so keyboard parity is not an afterthought;
they close on Escape, on an outside pointerdown, and on a route change. `aria-expanded` and
`aria-controls` are on the trigger and the ids agree.

A closed panel is `visibility: hidden`, not `aria-hidden` alone, and its inline styles are cleared
rather than tweened back on close. The component's entrance tween leaves `visibility: inherit` on
the element, which would beat the stylesheet and strand the panel's links in the tab order.

## The provider strip

Twelve integrations, presented as integrations, never customers. Each tile carries **the brand's
name as visible text** next to its mark, because a bare row of glyphs is a claim the reader cannot
check, and an `alt` attribute is not visible to anyone.

**The count is the subject.** A row of twelve pills is a strip of logos and nothing else, so the
number is now the largest thing in the section, set at display scale, and the marks arrive beneath
it as the evidence for it. The premise and the count are stated once each and never repeated.

Each mark is that brand's own glyph, flattened to a single ink silhouette at render time
(`brightness(0) invert(1)` in dark, `brightness(0)` in light) so the strip reads as one monochrome
wordmark row. `logo: null` means we hold no official mark for that provider, and the tile shows the
name alone rather than passing off a stand-in as theirs. Eleven of the twelve are the brands' own
marks; OpenCode Zen is the one we cannot show a mark for.


## The hero wash

One gradient, confined to the hero. It is a **layered wave**: a base colour with three drifting
simplex fields blended over it, each raised to a high power so it stays inside its own band
instead of summing into grey mush. That is what produces the layered-horizon look the reference
gets from displacing a vertex grid. The fields are aspect-corrected, so the bands keep their shape
on a phone and on a wide desktop rather than stretching with the viewport.

**Where it stops.** The wave is fully faded out by the **vertical midpoint of the demo recording**,
and that midpoint is measured rather than guessed. The copy block above the recording is
content-sized, so it is a different fraction of the hero at every width; `GradientWash` takes a
`fadeAt` selector, measures the target, and writes `--wash-fade-end` for the CSS mask to read. A
`ResizeObserver` re-measures it, because the target moves when the copy above it reflows.

Its palette is declared in CSS, on `.heroWash`, as `--wash-base`, `--wash-wave-1`, `--wash-wave-2`,
`--wash-wave-3` and `--wash-strength`. The component reads those custom properties rather than
taking colours as props, so the theme stays the single source of colour truth and a theme flip
repaints the wash without a re-render.

**The stops are the site's own warm dusk ramp, not the reference's sky blue.** Canvas, then a
brown, then a lit brown, then ember. Dark runs at `0.88`, light at `0.58`: strong enough to read
as a field of light, low enough that the headline keeps its contrast and the parchment theme does
not turn into a dirty band.

**What this is allowed to cost.** A background wash is easy to make expensive by accident, so:

- One full-screen quad, two triangles. The wave is computed per fragment, so the geometry never
  changes and a resize only touches the viewport. It does not rebuild a 29x50 vertex grid, which
  is what the reference it is modelled on does on every resize.
- The frame rate is capped at 30 fps rather than pinned to the display.
- An `IntersectionObserver` stops the loop when the hero leaves the viewport, and
  `visibilitychange` stops it when the tab is hidden. It does not run on the main thread forever.
- `prefers-reduced-motion` renders exactly one frame and never starts the loop.
- `antialias: false`, `alpha: false`, `powerPreference: "low-power"`, and a device-pixel-ratio
  cap of 1.5. A smooth gradient gains nothing from multisampling.
- The resize listener is removed, the observers are disconnected, and the WebGL context is
  explicitly lost on unmount.
- A CSS gradient is painted underneath the canvas as the first paint and the permanent fallback,
  so there is no empty box if WebGL is missing, no flash before the first frame, and a visible
  surface if the context is lost.
- The host is `pointer-events: none`, so the wash never intercepts a click on the copy above it.

The loop's state is reflected as `data-animating` on the canvas, so "does it actually stop when
scrolled away" is asserted by a test rather than assumed.

## The hero recording

The hero media is a flat macOS-style canvas: a light textured card with a dark Terminal window
sitting on it, cropped by the card's bottom edge. It is deliberately **not** wrapped in a
`RunWindow`; the asset already carries its own window, and wrapping it drew a window around a
window. `RunWindow` is untouched and still carries every other product surface on the page.

**It shows no controls.** The `Pause / Replay / Playing` bar is gone. What replaced it:

- **Hover** the media and it pauses; move away and it resumes. The control appears on hover so
  the thing that pauses it is visible when you want it.
- **Focus** the control, from the keyboard or a screen reader, and it paints. It is out of the
  layout until then, so nothing is visible by default.
- **On a coarse pointer**, where hover never fires, the control is always visible. Without
  this, a phone had auto-playing motion and no reachable way to stop it.

That is the WCAG 2.2.2 pause mechanism, and it is asserted rather than assumed. The control is
positioned inside the media rather than beside it: as a sibling, moving the pointer onto it fired
`pointerleave` on the media, which resumed the recording, and the click then paused it. The two
fought and the click lost.

The media holds its own aspect ratio at every breakpoint, so the 16:9 canvas is never cropped.
An earlier `min-height` on the mobile viewport overrode the ratio and cut the terminal in half.

## Site-wide system

The landing carries the measured values on its own `.shell` scope. The other 16 routes read the
shared palette from `packages/niki-theme/tokens.css`. Both resolve to the same numbers, so a card
means one thing on every page.

| Role | Token | Dark | Light |
| --- | --- | --- | --- |
| Canvas | `--background` | `#14120b` | `#f7f7f4` |
| Ink | `--foreground` | `#edecec` | `#26251e` |
| Card | `--card` | `#1b1913` | `#f2f1ed` |
| Hairline | `--border` | `#201e19` | `#dcdbd4` |
| Muted | `--muted-foreground` | `#9c968a` | `#6f6e68` |
| Ember (fill) | `--orange-9` | `#f54e00` | `#e85a00` |
| Ember (text) | `--orange-10` | `#ff6a2a` | `#c53f04` |

`landing.visual.spec.ts` asserts these exact values on both route groups, so a change to the
palette cannot pass the landing baselines while breaking the inner pages.

### The chrome contract

One header and one footer for the whole site. `SiteChrome` renders `LandingHeader` and
`LandingFooter`, re-exposed onto the shared tokens by `components/site/site.module.css`. There is
no second navigation, and adding an entry means adding it once to `NAV_LINKS`.

Removed during the unification, and not to be reintroduced: a site-specific header and footer, the
gradient hairline under the header, the WebGL arc under the footer, the old hero shader, and every
gradient wash in `globals.css`. Depth comes from hairline borders and one level of surface change.

The one deliberate exception is the hero wash, below. It is the only gradient in the system, it is
confined to the hero, and it is masked out before the next section.

### Inner-page primitives

The `ax-*` classes in `src/styles/globals.css` follow the same rules as the landing:

- Controls are full pill at a 44px minimum touch target; the primary action is ink-filled, never
  ember-filled.
- Cards are 8px on a 16px gap. They were hairline matrices with zero radius, which read as a
  spreadsheet rather than a product page.
- Headings are weight 400 with tracking that tightens as the size grows.
- Section bands pad on the same 64-to-112px curve.
- Body text derives from `--foreground` with opacity. Never a hardcoded near-white: on the warm
  parchment canvas that is unreadable, and it silently broke contrast in the light theme until the
  Axe checks were extended to the inner routes.

## Verification

- `npm run format:check`
- `npx tsc --noEmit --project apps/web/tsconfig.json`
- `npm run build` (web and docs)
- `npm run test:e2e:web`: content, overflow, interaction, routes, axe, and six screenshot
  baselines at `maxDiffPixels: 0` across desktop 1440, tablet 834, and mobile 390 in light and dark
- `git diff --check`

The eighteen inner routes keep the legacy `SiteChrome` and must keep their existing h1, canonical
URL, and `ax-header__bar`.
