"use client";

import { useEffect } from "react";

/**
 * Marks the document once the page has scrolled past its first screenful.
 *
 * The header reads `html[data-nav-shrunk]` and transitions from the full-width
 * bar it is on load into a smaller floating pill. The flag lives on the root
 * element so the header itself can stay a Server Component and the only thing
 * this ships to the client is a one-pixel sentinel and an observer.
 *
 * An IntersectionObserver rather than a scroll listener: the state changes once
 * per crossing, not once per frame, so there is no per-frame work to throttle
 * and nothing to clean up on unmount beyond the observer itself.
 */
export default function NavShrinkSensor({ threshold = 96 }: { threshold?: number }) {
  useEffect(() => {
    const root = document.documentElement;
    const sentinel = document.createElement("div");
    sentinel.setAttribute("data-nav-shrink-sentinel", "");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;opacity:0";
    document.body.prepend(sentinel);

    const set = (shrunk: boolean) => {
      if (shrunk) root.setAttribute("data-nav-shrunk", "");
      else root.removeAttribute("data-nav-shrunk");
    };

    // No rootMargin: the sentinel has to start out intersecting and then leave,
    // because the callback only fires on a change. Shrinking the root instead
    // leaves it permanently outside the viewport, the intersection never
    // changes, and the flag is never set.
    const observer = new IntersectionObserver(([entry]) => set(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(sentinel);
    set(window.scrollY > threshold);

    return () => {
      observer.disconnect();
      sentinel.remove();
      root.removeAttribute("data-nav-shrunk");
    };
  }, [threshold]);

  return null;
}
