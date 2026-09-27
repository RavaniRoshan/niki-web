"use client";

import styles from "./logo.module.css";

/**
 * The Niki mark.
 *
 * The old one was a generic letter in a rounded square, in a yellow that is not
 * in this palette. This one is a letterform that says what the product does: the
 * two stems are fixed, and the diagonal between them is a **run in progress** —
 * dashed, and marching when you hover. Four stages handing off typed artifacts
 * is the whole product, and a dashed diagonal is that idea at 26 pixels.
 *
 * Built as a component rather than an `<Image>` so the motion is real DOM the
 * browser can run, and so the strokes can take the theme's tokens. The static
 * `logo-mark.svg` next to it is the same geometry with hardcoded colours, for
 * the favicon and anything that cannot run a script.
 *
 * Motion is transform and stroke-dashoffset only, and it is entirely on hover.
 * There is no idle loop: a mark that animates on its own is a distraction, and
 * the diagonal is already a static dashed line when the pointer is elsewhere.
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
        {/* The tile is the ink, so the mark reads as one object in both themes
            rather than dissolving into a dark header. */}
        <rect className={styles.tile} x="1" y="1" width="30" height="30" rx="7.5" />
        {/* The two fixed stages. */}
        <path className={styles.stem} d="M9.5 23 V9" />
        <path className={styles.stem} d="M22.5 23 V9" />
        {/* The run between them. */}
        <path className={styles.run} d="M9.5 9 L22.5 23" />
      </svg>
    </span>
  );
}
