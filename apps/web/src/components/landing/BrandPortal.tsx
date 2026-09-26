"use client";

import { useEffect, useState, type ReactNode } from "react";
import GlyphPortal from "./GlyphPortal";
import styles from "./sections.module.css";

/**
 * The portal names the family directly rather than going through
 * `--font-geist`. next/font resolves that variable to a stack that includes
 * "Geist Fallback", a metric-override face that reports status "error"; the
 * portal's availability check then fails for it, decides a face is missing, and
 * pins itself to a static poster with motion off forever. `Geist` is a globally
 * registered face, so naming it gets the same glyphs without the broken entry.
 */
const PORTAL_FONT = '"Geist", system-ui, sans-serif';

/**
 * The closing portal: the wordmark, a camera that travels into one letter, and
 * the section that opens once you are through.
 *
 * Three things were chosen here rather than taken from the reference demo:
 *
 * - The word is `Niki`, and the focus letter is the second `i`. `N` and `K` are
 *   diagonals whose interior ink is small and ragged, so the camera would
 *   stutter; a stem gives a clean rectangular window. Pinning the letter also
 *   keeps the composition stable between font metrics, which matters because the
 *   screenshot baselines compare at zero tolerance.
 * - The field is the site's own palette rather than the demo's green. Ember on
 *   the landing canvas, so the letter you fall through is the brand colour.
 * - The reveal is the closing panel, not the footer itself. The footer keeps its
 *   own place below, so it is still reachable by keyboard without a scroll
 *   dependency.
 *
 * The portal is not mounted until the document font is resolved. The component
 * measures ink through a canvas at the requested weight, and a face that is still
 * pending makes it fall back to a static poster.
 */
export default function BrandPortal({ children }: { children?: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) setReady(true);
    };
    // Never gate the section on a font that fails to arrive.
    const timer = window.setTimeout(done, 1200);
    void document.fonts.ready.then(done).catch(done);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.portalWrap} data-testid="brand-portal">
      {ready ? (
        <GlyphPortal
          word="Niki"
          focusChar="i"
          fontWeight={700}
          fontFamily={PORTAL_FONT}
          scrollLength={1.9}
          interactive
          enterLabel="Keep going"
          className={styles.portal}
          style={
            {
              // Paper is the page, not white: the component defaults to #fff,
              // which inverts the dark theme into a light page. The field behind
              // the letter is then lifted off the canvas so the glyph reads.
              "--gp-paper": "var(--landing-canvas)",
              "--gp-ink": "var(--landing-ink)",
              "--gp-field": "var(--landing-surface)",
              "--gp-foreground": "var(--landing-ink)",
              // The component's own stylesheet hardcodes Arial on the section.
              // An inline declaration outranks it, so the reveal is set in the
              // landing's face rather than a fallback that is not on the page.
              fontFamily: "var(--landing-font-sans)",
            } as React.CSSProperties
          }
          background={
            <div
              className={styles.portalField}
              style={{ transform: "scale(var(--gp-field-scale, 1))" }}
              aria-hidden="true"
            />
          }
          front={
            <div className={styles.portalFront}>
              <p className={styles.portalLine}>
                One sentence in<span className={styles.portalDot}>.</span> A reviewable branch out
                <span className={styles.portalDot}>.</span>
              </p>
            </div>
          }
        >
          <div className={styles.portalContent}>{children}</div>
        </GlyphPortal>
      ) : (
        // The same word, flat, so there is no empty band while the font settles.
        <p className={styles.portalPoster} aria-hidden="true">
          Niki
        </p>
      )}
    </div>
  );
}
