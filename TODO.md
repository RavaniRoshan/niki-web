# Status

Definition of done for this pass. Nothing is checked until its verification command passes.

## Landing rebuild

The landing was rebuilt section by section against a measured reference capture. `DESIGN.md`
records the sampled values, the token table, the section order, the motion rules, and the
no-reference-assets boundary.

- [x] Tokens sampled from the reference rather than estimated
  - Canvas `#14120b`, card `#1b1913`, border `#201e19`, tile `#1d1b15`, ink `#edecec`, ember `#f54e00`.
  - Full-pill controls at 54px, 8px cards, 4px tiles, 57px gutter, 112px section gap.
  - Backdrops are CSS-composited warm-dusk fields, so no reference photograph and no bitmap asset ships.

- [x] Twelve sections, each matching a reference section's role
  - Hero, provider strip, four alternating feature cards, receipt grid, changelog, capability
    row, manifesto card, highlights row, closing display CTA, footer.
  - Where the reference shows social proof, Niki shows product evidence: the receipt grid carries
    real run artifacts, the provider strip carries the twelve real integrations, the changelog and
    highlights rows read from live data modules.

- [x] One gradient, in one place
  - The hero background is a WebGL wash, masked to fade out through the lower half of the hero.
  - 30 fps cap, an IntersectionObserver that stops the loop off-screen, a reduced-motion branch
    that paints one frame, a DPR cap of 1.5, no antialiasing, and a CSS gradient underneath as
    first paint and fallback. Its palette lives in CSS so the theme stays the source of colour.
  - Asserted by test: it paints, never animates under reduced motion, and stops when scrolled away.

- [x] One window primitive across every product surface
  - `RunWindow` supplies backdrop, optional offset window, traffic lights, title, and tab strip.

- [x] One restrained motion layer
  - CSS transitions for hover, press, tabs, and drawers; one GSAP scroll-reveal island.
  - `gsap.matchMedia` scopes the reveal to `no-preference`.
  - No marquee, parallax, counters, pinning, or scroll listener.

## Site-wide unification

The other 16 routes were on a separate, cool-grey design system with their own header, footer, and
gradient decoration. They now resolve to the same palette as the landing.

- [x] Shared tokens rebased onto the landing values
  - `packages/niki-theme/tokens.css` is the single source of colour for both apps.
  - The `--gray-*` and `--orange-*` ramps are warm steps off the new base.

- [x] One header and one footer for the whole site
  - `SiteChrome` renders `LandingHeader` and `LandingFooter`.
  - Removed: the legacy header and footer, the gradient hairline, the WebGL footer arc, the hero
    shader, and every gradient wash in `globals.css`.

- [x] Inner-page primitives aligned
  - Pill controls at a 44px touch target, ink-filled primary action, 8px cards on a 16px gap,
    weight-400 headings with tight tracking, and the landing's section rhythm.

- [x] Light-theme contrast repaired
  - Six hardcoded near-white text colours were tuned against the old near-black canvas and were
    unreadable on parchment. All now derive from `--foreground`.

- [x] Dead code removed
  - 18 components were unreachable from every route, layout, and test: the old home page, the old
    header and footer, the shader and arc, the provider wall, and two unused UI directories.
  - Four unused demo GIFs and posters, about 1 MB, removed with them.
  - Verified by import-graph reachability from the route files, then by a clean build, typecheck,
    lint, and full test run.

- [x] Visual coverage extended to the inner routes
  - `landing.visual.spec.ts` now pins `/product/`, `/pricing/`, and `/resources/changelog/` at 1440
    in both themes, and asserts the shared palette is identical on both route groups.

## Repository health

- [x] ESLint added
  - There was no lint configuration at all, and `next lint` is deprecated in Next 15, so nothing
    was checking these files. A flat config is in place, pinned to the Next version in use.
  - All 12 errors and 13 warnings it found are fixed.
  - Lint and typecheck now run in CI.

- [x] Gitignore extended
  - The reference capture, its Windows zone-identifier sibling, stale local screenshots, the
    agent tooling directories, and the root `test-results/` are all ignored.
  - The reference capture is third-party material and must never be committed.

- [x] Root scripts added
  - `lint`, `typecheck`, `test:e2e:update`, and `verify` so the whole-repo commands exist without
    reaching into a workspace.

## Documentation

- [x] `README.md` rewritten against what the repo actually contains
- [x] `CONTRIBUTING.md` written: the change loop, what each check catches, and the boundaries
- [x] `docs/ARCHITECTURE.md` written: the two-app topology, the route-group split, the data flow
- [x] `DESIGN.md` extended with the site-wide system and the chrome contract

## Verification

- [x] `npm run format:check`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build` for both apps
- [x] `npm run test:e2e:web`, 82 passing, including Axe at 1440 and 390 in both themes across the
      landing and the inner routes, and 12 screenshot baselines at `maxDiffPixels: 0`

## Still open

- [ ] Confirm the hosted GitHub Actions run after this work is pushed
- [ ] Custom domain attachment (`niki.dev` / `docs.niki.dev`) once the Pages projects are named
- [ ] Image assets beyond the real pipeline recording. The reference leans on product
      photography; Niki currently uses one real recording plus composited backdrops. Real capture
      stills for the downloads and resources pages would close that gap.

## Outside this pass

Favicon and wordmark work, a general content edit pass over the 16 inner pages, and any product
roadmap change require separate decisions.
