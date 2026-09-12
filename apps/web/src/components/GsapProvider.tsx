"use client";

/**
 * Site-wide GSAP scroll animation system.
 *
 * One observer per page drives every scroll effect through data attributes:
 *   data-anim="rise"        — rise + fade in on enter (default for sections)
 *   data-anim="stagger"     — children rise in sequence (grids, lists)
 *   data-anim="draw"        — box-header underline draws from left
 *   data-anim="count"       — stat numbers count up (uses data-count)
 *   data-anim="lines"       — terminal/code lines reveal top-to-bottom
 *
 * The hero has its own entrance timeline via [data-hero-seq] children.
 * Everything is gated by gsap.matchMedia():
 *   - prefers-reduced-motion: no animation, content immediately visible
 *   - mobile (<768px): simpler single-element reveals, no heavy stagger
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function GsapProvider() {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* Reduced-motion: nothing is animated at all. Because the full
         experience is gated on prefers-reduced-motion: no-preference,
         content simply renders in its final state. The only cleanup needed
         is defensive: if a context revert ever leaves inline styles. */

      /* ---------- full experience — only when motion is allowed ---------- */
      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          noReducedMotion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { isDesktop, noReducedMotion } = ctx.conditions as {
            isDesktop: boolean;
            noReducedMotion: boolean;
          };
          /* matchMedia runs this handler when ANY condition matches — the
             isDesktop query matches even under reduced motion. Bail out
             entirely when the user prefers reduced motion. */
          if (!noReducedMotion) return;

          /* Hero entrance sequence. The runner console and the h1 itself are
             excluded — MotionProvider gives the h1 a char cascade and the
             runner its own spring entrance (same-target double tweens
             would fight otherwise). */
          const heroItems = gsap.utils.toArray<HTMLElement>(
            "[data-hero-seq] > *:not(.nx-hero-runner-wrap):not(.nx-hero__title)"
          );
          if (heroItems.length) {
            gsap.from(heroItems, {
              autoAlpha: 0,
              y: isDesktop ? 28 : 18,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.09,
              delay: 0.1,
              clearProps: "all",
            });
          }

          /* Section headers: comment heading rises in (MotionProvider owns
             the SplitText char reveal for these same headings, so only the
             wrapper gets a motion here) */
          gsap.utils.toArray<HTMLElement>('.nx-box[data-anim="draw"]').forEach((box) => {
            const header = box.querySelector(".nx-box-header");
            if (!header) return;
            gsap.from(header, {
              autoAlpha: 0,
              y: 12,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: { trigger: header, start: "top 85%", once: true },
              clearProps: "all",
            });
          });

          /* Generic rise-in for flagged elements */
          const risers = gsap.utils.toArray<HTMLElement>('[data-anim="rise"]');
          risers.forEach((el) => {
            gsap.from(el, {
              autoAlpha: 0,
              y: isDesktop ? 36 : 22,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
              clearProps: "all",
            });
          });

          /* Stagger children (grids of cells, pipeline stages, post lists) */
          const staggers = gsap.utils.toArray<HTMLElement>('[data-anim="stagger"]');
          staggers.forEach((wrap) => {
            const children = Array.from(wrap.children) as HTMLElement[];
            if (!children.length) return;
            gsap.from(children, {
              autoAlpha: 0,
              y: isDesktop ? 32 : 20,
              duration: 0.7,
              ease: "power3.out",
              stagger: isDesktop ? 0.08 : 0.05,
              scrollTrigger: { trigger: wrap, start: "top 85%", once: true },
              clearProps: "all",
            });
          });

          /* Stat count-up */
          gsap.utils.toArray<HTMLElement>('[data-anim="count"]').forEach((stat) => {
            const target = stat.querySelector<HTMLElement>(".nx-stat__value");
            if (!target) return;
            const final = target.textContent ?? "";
            const numMatch = final.match(/\d[\d.,]*/);
            if (!numMatch) return;
            const end = parseFloat(numMatch[0].replace(/,/g, ""));
            const prefix = final.slice(0, numMatch.index);
            const suffix = final.slice(numMatch.index! + numMatch[0].length);
            const decimals = (numMatch[0].split(".")[1] || "").length;

            const counter = { v: 0 };
            gsap.to(counter, {
              v: end,
              duration: 1.4,
              ease: "power2.out",
              scrollTrigger: { trigger: stat, start: "top 88%", once: true },
              onUpdate: () => {
                target.textContent =
                  prefix +
                  counter.v.toLocaleString("en-US", {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                  }) +
                  suffix;
              },
            });
          });

          /* Terminal/code line reveal */
          gsap.utils.toArray<HTMLElement>('[data-anim="lines"]').forEach((t) => {
            const lines = Array.from(t.querySelectorAll("pre > span, pre")) as HTMLElement[];
            if (!lines.length) return;
            gsap.from(lines, {
              autoAlpha: 0,
              duration: 0.45,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: { trigger: t, start: "top 82%", once: true },
              clearProps: "all",
            });
          });

          /* Terminal window subtle parallax drift on scroll */
          if (isDesktop) {
            gsap.utils
              .toArray<HTMLElement>(".nx-demo-term, .nx-split > div:last-child")
              .forEach((el) => {
                gsap.fromTo(
                  el,
                  { y: 24 },
                  {
                    y: -24,
                    ease: "none",
                    scrollTrigger: {
                      trigger: el,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 1.2,
                    },
                  }
                );
              });
          }
        }
      );

      /* Refresh after fonts/layout settle */
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      return () => {
        window.removeEventListener("load", onLoad);
        mm.revert();
      };
    },
    { scope: undefined }
  );

  /* Mount point — the provider is a no-render sentinel; selectors are
     scoped to the whole document root instead of a wrapper element. */
  return null;
}
