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
   dropped without an error, which reads as "the effect never ran". */
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
    /* Along the bottom edge, right to left, dipping up into the bite. The two
       bite corners turn the other way from the bar's outer corners, which is
       what makes them read as a cut rather than a bump. */
    `H ${notchEnd}`,
    `V ${roof + n}`,
    `A ${n} ${n} 0 0 0 ${notchEnd - n} ${roof}`,
    `H ${notchStart + n}`,
    `A ${n} ${n} 0 0 0 ${notchStart} ${roof + n}`,
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
const NOTCH_RADIUS = 10; // --landing-notch-radius

export default function HeaderBarSurface() {
  const surfaceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    const bar = surface?.parentElement;
    if (!surface || !bar) return;

    const measure = () => {
      const notch = bar.querySelector<HTMLElement>("[data-notch]");
      if (!notch) return;

      const depth = parseFloat(getComputedStyle(bar).getPropertyValue("--landing-notch-depth"));
      const barBox = bar.getBoundingClientRect();
      const notchBox = notch.getBoundingClientRect();

      if (!barBox.width || !barBox.height) return;

      surface.style.clipPath = barOutlinePath({
        width: barBox.width,
        height: barBox.height,
        notchStart: notchBox.left - barBox.left,
        notchEnd: notchBox.right - barBox.left,
        roof: barBox.height - depth,
        outerRadius: OUTER_RADIUS,
        notchRadius: NOTCH_RADIUS,
      });
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

  return <span ref={surfaceRef} className={styles.barSurface} aria-hidden="true" />;
}
