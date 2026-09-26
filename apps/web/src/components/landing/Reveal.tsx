"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* One scroll-reveal layer for the whole page.
 *
 * Purpose: storytelling. Sections arrive in reading order, so the page reads as a
 * sequence rather than a wall. Frequency tier: occasional, so this is a standard
 * transition and not a delight effect.
 *
 * One trigger per target, not one shared for the container: a shared trigger would
 * fire every tween at the same scroll position and collapse the sequence.
 *
 * Properties are opacity and transform only. No pin, no scrub, no parallax, no
 * counters. `once: true` because a section that has already been read does not
 * need to animate again.
 *
 * `gsap.matchMedia` rather than a React state flag: the tween's "from" state is
 * applied synchronously, so a preference flag that resolves in an effect would
 * briefly apply autoAlpha:0 to the whole page and can leave it hidden. Scoping
 * the tween to the media query means it is never created at all when motion is
 * reduced, and gsap reverts it if the preference changes mid-session. */
export default function Reveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        if (targets.length === 0) return;

        for (const target of targets) {
          gsap.from(target, {
            autoAlpha: 0,
            y: 24,
            duration: 0.55,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
            scrollTrigger: {
              trigger: target,
              start: "top 88%",
              once: true,
            },
          });
        }
      });
    },
    { scope: root }
  );

  return <div ref={root}>{children}</div>;
}
