"use client";

import styles from "./logo.module.css";

/**
 * The Niki mark.
 *
 * One solid geometric letterform: two fixed stages with a single run drawn
 * between them, every bar the same weight and the same colour, meeting on exact
 * coordinates. The previous mark was a filled tile with a dashed diagonal that
 * marched on an endless loop, and both of those read as toy rather than tool —
 * a dash pattern looks like stitching, and a loop that never stops looks like a
 * spinner. A mark has to survive being looked at for a long time, so the
 * geometry is solid, even, and does not ask to be watched.
 *
 * There is no tile behind it. A filled rounded square is the shape of an app
 * icon, and it is what made the old mark read as a sticker; the glyph stands on
 * its own so it belongs to the bar rather than sitting on it. The stems take the
 * ink and the run takes the accent, so the mark is legible in both themes
 * without borrowing a backdrop.
 *
 * The three bars are stroked lines rather than filled rectangles so that "one
 * weight" is a single declaration instead of three that have to be kept in step.
 * The run's ends land inside the stems, so the form closes up as one object
 * rather than three strokes that happen to overlap.
 *
 * Motion is the one thing here, and it is deliberate: on hover the run draws
 * itself across, once, and holds. That is the product in one gesture — work
 * travelling between two fixed points — and because it does not loop there is
 * nothing to distract from the page. Under reduced motion the mark is simply
 * the still mark.
 *
 * Built as a component rather than an `<Image>` so the motion is real DOM the
 * browser can run, and so the strokes can take the theme's tokens. The static
 * `logo-mark.svg` next to it is the same geometry with hardcoded colours, for
 * the favicon and anything that cannot run a script.
 */
export default function NikiMark({ size = 26 }: { size?: number }) {
  return (
    <span className={styles.mark} data-size={size} data-testid="niki-mark">
      <svg
        className={styles.glyph}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
      >
        {/* The two fixed stages, and the run between them. */}
        <path className={styles.bar} d="M9 7 V25" />
        <path className={styles.bar} d="M23 7 V25" />
        <path className={styles.run} d="M9 8.5 L23 23.5" />
      </svg>
    </span>
  );
}
