"use client";

/**
 * FeatureWalk — pinned horizontal walk-through for the "why Niki" cells.
 * Desktop: the section pins and the six feature cells travel horizontally
 * as you scroll vertically (runrobrun/NoArt award technique), with a
 * progress rail. Mobile/reduced-motion: normal vertical stacked grid.
 */

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface Feature {
  idx: string;
  title: string;
  body: string;
}

export default function FeatureWalk({ features }: { features: Feature[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          noReducedMotion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { isDesktop, noReducedMotion } = ctx.conditions as {
            isDesktop: boolean;
            noReducedMotion: boolean;
          };
          if (!noReducedMotion) return;
          const el = root.current;
          if (!el) return;
          const track = el.querySelector<HTMLElement>(".nx-walk-track");
          if (!track) return;

          if (!isDesktop) return; // mobile: stacked, handled in CSS

          const walk = gsap.to(track, {
            x: () => -(track.scrollWidth - el.clientWidth),
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top+=72",
              end: () => `+=${track.scrollWidth - el.clientWidth + 400}`,
              scrub: 0.9,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // progress rail fill
          const fill = el.querySelector<HTMLElement>(".nx-walk-railfill");
          if (fill) {
            gsap.fromTo(
              fill,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top top+=72",
                  end: () => `+=${track.scrollWidth - el.clientWidth + 400}`,
                  scrub: 0.9,
                },
              }
            );
          }

          return () => {
            walk.scrollTrigger?.kill();
            walk.kill();
          };
        }
      );
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div className="nx-walk" ref={root}>
      {/* progress rail */}
      <div className="nx-walk-rail" aria-hidden="true">
        <span className="nx-walk-railfill" />
      </div>

      <div className="nx-walk-track">
        {features.map((f) => (
          <article className="nx-walk-cell nx-cell" key={f.idx}>
            <span className="nx-index nx-mono">{f.idx}</span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </article>
        ))}
        {/* terminal end-card */}
        <article className="nx-walk-cell nx-walk-cell--end nx-mono" aria-hidden="true">
          <span className="nx-index">//</span>
          <h3>
            Every run leaves <span className="nx-walk-hl">the whole trail</span> — branch, patch,
            report, artifacts.
          </h3>
        </article>
      </div>
    </div>
  );
}
