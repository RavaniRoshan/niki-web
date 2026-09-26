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
--landing-header-height: 64px;
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
2. **Provider strip.** The twelve named integrations, presented as integrations, never customers.
3. **Feature A, copy left.** Four agents, with the live run explorer as the media.
4. **Feature B, media left.** The branch gate: `main` untouched, one reviewed commit.
5. **Feature C, copy left.** Run artifacts, with tab pills and the install command bar.
6. **Feature D, media left.** Per-stage model routing, with a real `niki.toml` example.
7. **Receipt grid.** Centred display heading over three run-receipt cards. Stands in for the
   reference's quote wall; Niki has no customers to quote and inventing quotes is not an option.
8. **Changelog.** Four real releases from `src/data/changelog.ts`.
9. **Capability row.** Agents, sandbox, guardrails, each with its own window.
10. **Manifesto card.** License, no telemetry, BYOK, and the real backends and providers.
11. **Recent highlights.** Four real documentation sections.
12. **Closing CTA.** Centred display heading and one solid action.

Four consecutive feature cards is a deliberate deviation from the usual zigzag cap, because the
brief is explicit reference fidelity. They are broken up by varying the media composition and by
giving section 5 the interactive tab and command treatment.

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

At rest it is a full-width, transparent bar: the brand on the left, five links centred, and the
action cluster on the right. It carries no fill and no shadow, so the page reads as one surface.

Once the page scrolls past its first screenful it becomes a **smaller floating pill**: capped at
1200px, full pill radius, a translucent surface with backdrop blur, and a soft shadow. It is fixed
rather than sticky so it can float clear of the content, and `main` carries the matching top
padding so nothing hides underneath it.

The state is a single attribute, `html[data-nav-shrunk]`, set by `NavShrinkSensor`. That is an
`IntersectionObserver` on a one-pixel sentinel, not a scroll listener: the state changes once per
crossing rather than once per frame, so there is no per-frame work to throttle. The header itself
stays a Server Component; the sensor is the only thing this ships to the client.

Two measurements shaped this, and both are asserted in the tests:

- The bar needs about **1342px** at its resting spacing, so the shrunk state also tightens the nav
  gap and link padding. 1200px is close to the real floor; going narrower collides.
- The desktop nav **already overlapped the action cluster between 1024px and 1280px** before this
  change, because the collapse breakpoint was at 1023. It is now 1279.

## The hero wash

One gradient, confined to the hero, masked so it fades out through the lower half before the next
section begins. It is a shader rather than a bitmap, but it is deliberately restrained: at full
strength the ember bloom dominates the hero and the page stops looking like this site. Dark runs
at `0.2`, light at `0.12`.

Its palette is declared in CSS, on `.heroWash`, as `--wash-deep`, `--wash-mid`, `--wash-glow` and
`--wash-strength`. The component reads those custom properties rather than taking colours as
props, so the theme stays the single source of colour truth and a theme flip repaints the wash
without a re-render.

**What this is allowed to cost.** A background wash is easy to make expensive by accident, so:

- One full-screen quad, two triangles. The wave is computed per fragment, so the geometry never
  changes and a resize only touches the viewport. It does not rebuild a vertex grid.
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
