"use client";

import { useEffect, useRef } from "react";
import styles from "./landing-shell.module.css";

export type BarOutline = {
  width: number;
  height: number;
  /** Left edge of the bite, measured from the bar's left edge. */
  notchStart: number;
  /** Right edge of the bite. */
  notchEnd: number;
  /** Y of the bite's ceiling, measured down from the bar's top edge. */
  roof: number;
  outerRadius: number;
  notchRadius: number;
};

/* Traces the bar's outline clockwise from the top-left, dipping down into the
   bite on the way past it. The bar's own border-radius rounds the four outer
   corners and this rounds them at the same radius, so the hairline still lands
   on the silhouette; the bite's ceiling is the only edge the path adds.

   The path is returned wrapped in `path("...")`. CSS requires that argument to
   be a quoted string: an unquoted one parses as nothing and the declaration is
   dropped without an error, which reads as "the effect never ran".
 *
   The three constants here mirror `--landing-notch-*` in the stylesheet. They are
   duplicated rather than read back from CSS because the path is generated once
   per layout, and a getComputedStyle round trip inside a path builder is a lot
   of machinery for three numbers. The test asserts they agree. */
export function barOutlinePath(box: BarOutline): string {
  const { width, height, notchStart, notchEnd, roof, outerRadius: o, notchRadius: n } = box;

  if (
    notchStart < o ||
    notchEnd > width - o ||
    notchEnd - notchStart < n * 2 ||
    roof < o ||
    height - roof < n
  ) {
    /* Not enough room for the shape to be legible. A plain rectangle is the
       honest fallback: better a square bar than a mangled one. */
    return 'path("M 0 0 H ' + width + " V " + height + ' H 0 Z")';
  }

  const d = [
    `M ${o} 0`,
    `H ${width - o}`,
    `A ${o} ${o} 0 0 1 ${width} ${o}`,
    `V ${height - o}`,
    `A ${o} ${o} 0 0 1 ${width - o} ${height}`,
    /* Along the bottom edge, right to left, dipping up into the bite. The bite
       corners use the same sweep as the bar's outer corners: that is what makes
       the bar's material carry a rounded corner at the ceiling of the cut. The
       opposite sweep produces an arch, which reads as a doorway rather than a
       bite taken out of a solid bar. */
    `H ${notchEnd}`,
    `V ${roof + n}`,
    `A ${n} ${n} 0 0 1 ${notchEnd - n} ${roof}`,
    `H ${notchStart + n}`,
    `A ${n} ${n} 0 0 1 ${notchStart} ${roof + n}`,
    `V ${height}`,
    `H ${o}`,
    `A ${o} ${o} 0 0 1 0 ${height - o}`,
    `V ${o}`,
    `A ${o} ${o} 0 0 1 ${o} 0`,
    "Z",
  ].join(" ");

  return `path("${d.replace(/["\\]/g, "\\$&")}")`;
}

const OUTER_RADIUS = 12; // --landing-bar-radius
const NOTCH_RADIUS = 14; // --landing-notch-radius

export default function HeaderBarSurface() {
  const surfaceRef = useRef<HTMLSpanElement>(null);
  const backingRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    const backing = backingRef.current;
    const bar = surface?.parentElement;
    if (!surface || !bar) return;

    const measure = () => {
      const notch = bar.querySelector<HTMLElement>("[data-notch]");
      if (!notch) return;

      const depth = parseFloat(getComputedStyle(bar).getPropertyValue("--landing-notch-depth"));
      const barBox = bar.getBoundingClientRect();
      const notchBox = notch.getBoundingClientRect();

      if (!barBox.width || !barBox.height) return;

      const start = notchBox.left - barBox.left;
      const end = notchBox.right - barBox.left;

      surface.style.clipPath = barOutlinePath({
        width: barBox.width,
        height: barBox.height,
        notchStart: start,
        notchEnd: end,
        roof: barBox.height - depth,
        outerRadius: OUTER_RADIUS,
        notchRadius: NOTCH_RADIUS,
      });

      /* The bite shows the page, not whatever happens to be scrolling past the
         header. Left transparent, the notch became a window onto the section
         underneath, so a fragment of a card would float inside the navigation.
         Painting the canvas in the bite's footprint keeps the cut clean at every
         scroll position, which is what the reference does, where the page behind
         a bar is plain. */
      if (backing) {
        backing.style.left = `${start}px`;
        backing.style.width = `${end - start}px`;
        /* Starts at the bite's ceiling rather than the bar's top, so the canvas
           does not show faintly through the translucent roof above it. */
        backing.style.top = `${barBox.height - depth}px`;
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    /* The shrink transition changes the gaps, so the notch moves while it runs. */
    bar.addEventListener("transitionend", measure);
    return () => {
      observer.disconnect();
      bar.removeEventListener("transitionend", measure);
    };
  }, []);

  return (
    <>
      <span ref={backingRef} className={styles.barBacking} aria-hidden="true" />
      <span
        ref={surfaceRef}
        className={styles.barSurface}
        data-testid="header-bar-surface"
        aria-hidden="true"
      />
    </>
  );
}
