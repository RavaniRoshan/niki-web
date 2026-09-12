"use client";

/**
 * MotionProvider — Niki's full-immersive motion system (free-GSAP core).
 *
 * 1. SmoothScroll: ScrollSmoother-style inertial page scrolling. Lerps the
 *    native window scroll; CSS scroll-behavior:smooth is disabled while
 *    active so the browser never starts its own competing animation (that
 *    fight was why the first version froze at scrollY 0).
 * 2. SplitText: markup-safe headline splitting — only text nodes are
 *    wrapped in word/char spans, so <em>, <br> and nested markup survive.
 *    Chars rise with a spring stagger on scroll (immediately in the hero).
 * 3. Hero console choreography: the runner springs up, the agent chips pop
 *    in elastically after it.
 * 4. Cursor microphysics: magnetic buttons, headline char repel (culled to
 *    visible headings), hairline-cell tilt.
 *
 * Reduced-motion users get none of it. Mobile gets the reveals only — no
 * smooth scroll, no cursor physics.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EASE_SPRING = "back.out(1.4)";

/* ---------- SmoothScroll (lerp wrapper) ---------- */
function smoothScroll() {
  const doc = document as Document & { __nikiLerp?: boolean };
  // Idempotency: React strict mode + matchMedia re-runs can mount twice.
  if (doc.__nikiLerp) return () => {};
  doc.__nikiLerp = true;

  let target = window.scrollY;
  let current = target;
  let raf = 0;
  let active = true;

  const LERP = 0.09;

  const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return; // pinch-zoom is not scrolling
    if (document.body.style.overflow === "hidden") return; // drawer/modal open
    e.preventDefault();
    let dy = e.deltaY;
    if (e.deltaMode === 1)
      dy *= 16; // DOM_DELTA_LINE
    else if (e.deltaMode === 2) dy *= 100; // DOM_DELTA_PAGE
    target = Math.max(0, Math.min(target + dy, maxScroll()));
  };

  const onScroll = () => {
    /* Frame reconciliation (below) is the source of truth; this listener
       only catches external scrolls while the loop is idle (no lerp
       flight, so any scrollY drift is external by definition). */
    if (!active) return;
    if (Math.abs(target - current) < 0.4 && Math.abs(window.scrollY - current) > 1.5) {
      target = window.scrollY;
      current = window.scrollY;
    }
  };

  let lastWritten: number | null = null; // scrollY we wrote last frame

  const tick = () => {
    // External jump detection: if the browser's scrollY isn't where we
    // left it (± tolerance), someone else scrolled (keyboard, scrollbar,
    // hash link, GSAP scrollTo) — adopt their position immediately.
    const now = window.scrollY;
    if (lastWritten !== null && Math.abs(now - lastWritten) > 2) {
      target = now;
      current = now;
    }

    if (Math.abs(target - current) >= 0.4) {
      current += (target - current) * LERP;
      if (Math.abs(target - current) < 0.4) current = target;
      // scrollTop assignment is instantaneous (scrollTo can inherit the
      // CSS smooth behavior and restart a browser animation each call).
      html.scrollTop = current;
      lastWritten = current;
    } else {
      current = target; // idle: don't write, so external moves stay detectable
      lastWritten = null;
    }
    raf = requestAnimationFrame(tick);
  };

  // CSS smooth scrolling makes every scrollTo a browser animation that
  // fights the loop — pin it to auto while we drive the scroll.
  const html = document.documentElement;
  const prevBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("scroll", onScroll, { passive: true });
  raf = requestAnimationFrame(tick);

  return () => {
    active = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("scroll", onScroll);
    html.style.scrollBehavior = prevBehavior;
    doc.__nikiLerp = false;
  };
}

/* ---------- SplitText: markup-safe word/char splitting ---------- */
function splitNode(parent: Node, chunks: HTMLElement[]) {
  Array.from(parent.childNodes).forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? "";
      if (!text.trim()) return; // whitespace between elements stays as-is
      const frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach((word) => {
        if (!word.trim()) {
          frag.appendChild(document.createTextNode(word));
          return;
        }
        const w = document.createElement("span");
        w.style.display = "inline-block";
        w.dataset.chunk = "word";
        w.setAttribute("aria-hidden", "true"); // label on the heading covers SR
        for (const ch of Array.from(word)) {
          const c = document.createElement("span");
          c.style.display = "inline-block";
          c.dataset.chunk = "char";
          c.textContent = ch;
          w.appendChild(c);
          chunks.push(c);
        }
        frag.appendChild(w);
      });
      parent.replaceChild(frag, child);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const tag = (child as Element).tagName;
      if (tag === "BR" || tag === "WBR") return; // structural breaks stay
      splitNode(child, chunks); // recurse into <em>, <span>, …
    }
  });
}

function splitEl(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === "done") {
    return Array.from(el.querySelectorAll<HTMLElement>("[data-chunk='char']"));
  }
  // Keep an existing aria-label (BoxHeadings carry a nicer one already).
  if (!el.hasAttribute("aria-label")) {
    el.setAttribute("aria-label", el.innerText || el.textContent || "");
  }
  const chunks: HTMLElement[] = [];
  splitNode(el, chunks);
  el.dataset.split = "done";
  return chunks;
}

/* ---------- Magnetic buttons ---------- */
function magnetize(container: HTMLElement) {
  const magnets = container.querySelectorAll<HTMLElement>(".nx-btn--primary, .nx-hero-runbtn");
  const cleanups: Array<() => void> = [];

  magnets.forEach((el) => {
    const strength = 14;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      gsap.to(el, {
        x: dx * strength,
        y: dy * strength * 0.6,
        duration: 0.3,
        ease: "power2.out",
      });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.4)" });
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    });
  });
  return () => cleanups.forEach((c) => c());
}

/* ---------- Headline char repel (cursor proximity) ---------- */
function charRepel(container: HTMLElement) {
  const headings = Array.from(container.querySelectorAll<HTMLElement>("[data-split='done']"));
  if (!headings.length) return () => {};

  const visible = new Set<HTMLElement>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const h = e.target as HTMLElement;
        if (e.isIntersecting) visible.add(h);
        else visible.delete(h);
      }
    },
    { rootMargin: "80px" }
  );
  headings.forEach((h) => io.observe(h));

  let raf = 0;
  let mx = -9999;
  let my = -9999;
  const onMove = (e: PointerEvent) => {
    mx = e.clientX;
    my = e.clientY;
  };
  const onLeave = () => {
    mx = -9999;
    my = -9999;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerleave", onLeave);

  const R = 90;
  const tick = () => {
    if (mx > -9999) {
      for (const h of visible) {
        const chars = h.querySelectorAll<HTMLElement>("[data-chunk='char']");
        for (const c of chars) {
          const r = c.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dist = Math.hypot(mx - cx, my - cy);
          if (dist < R) {
            const f = (1 - dist / R) * 10;
            const nx = ((mx - cx) / (dist || 1)) * -f;
            const ny = ((my - cy) / (dist || 1)) * -f;
            gsap.set(c, { x: nx, y: ny });
            c.dataset.repel = "1";
          } else if (c.dataset.repel) {
            gsap.set(c, { x: 0, y: 0 });
            delete c.dataset.repel;
          }
        }
      }
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerleave", onLeave);
    headings.forEach((h) =>
      gsap.set(h.querySelectorAll("[data-chunk='char']"), { clearProps: "x,y" })
    );
  };
}

/* ---------- Card tilt ---------- */
function cardTilt(container: HTMLElement) {
  const cards = container.querySelectorAll<HTMLElement>(".nx-cell");
  const cleanups: Array<() => void> = [];
  cards.forEach((el) => {
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, {
        rotateX: py * -3.5,
        rotateY: px * 3.5,
        transformPerspective: 700,
        duration: 0.4,
        ease: "power2.out",
      });
    };
    const onLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.45)",
      });
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    });
  });
  return () => cleanups.forEach((c) => c());
}

export default function MotionProvider() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    /* --- 1. SplitText reveals + hero console choreography (motion OK) --- */
    mm.add({ motionOK: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
      const { motionOK } = ctx.conditions as { motionOK: boolean };
      if (!motionOK) return;

      const heads = gsap.utils.toArray<HTMLElement>("h1, h2, .nx-comment");
      heads.forEach((h) => {
        const chars = splitEl(h);
        if (!chars.length) return;
        const isHero = !!h.closest(".nx-hero");
        gsap.from(chars, {
          autoAlpha: 0,
          yPercent: 60,
          rotateX: -35,
          transformPerspective: 600,
          duration: 0.6,
          ease: EASE_SPRING,
          stagger: { each: 0.012, from: "start" },
          delay: isHero ? 0.15 : 0,
          scrollTrigger: isHero ? undefined : { trigger: h, start: "top 88%", once: true },
          clearProps: "all",
        });
      });

      /* Hero: the runner console springs up, then the chips pop in. */
      const wrap = document.querySelector<HTMLElement>(".nx-hero-runner-wrap");
      if (wrap) {
        gsap.from(wrap, {
          autoAlpha: 0,
          y: 26,
          scale: 0.97,
          duration: 0.8,
          ease: "back.out(1.2)",
          delay: 0.32,
          clearProps: "all",
        });
      }
      const chips = gsap.utils.toArray<HTMLElement>(".nx-hero-chip");
      if (chips.length) {
        gsap.from(chips, {
          autoAlpha: 0,
          y: 14,
          scale: 0.94,
          duration: 0.55,
          ease: "back.out(2.2)",
          stagger: 0.07,
          delay: 0.6,
          clearProps: "all",
        });
      }
    });

    /* --- 2. inertial smooth scroll (desktop + motion OK) --- */
    mm.add(
      {
        desktop: "(min-width: 1024px)",
        motionOK: "(prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { desktop, motionOK } = ctx.conditions as {
          desktop: boolean;
          motionOK: boolean;
        };
        if (!desktop || !motionOK) return;
        const kill = smoothScroll();
        return kill;
      }
    );

    /* --- 3. cursor microphysics (desktop, fine pointer, hover, motion OK) --- */
    mm.add(
      {
        desktop: "(min-width: 1024px)",
        fine: "(pointer: fine)",
        hover: "(hover: hover)",
        motionOK: "(prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { desktop, fine, hover, motionOK } = ctx.conditions as {
          desktop: boolean;
          fine: boolean;
          hover: boolean;
          motionOK: boolean;
        };
        if (!desktop || !fine || !hover || !motionOK) return;
        const c1 = magnetize(document.body);
        const c2 = charRepel(document.body);
        const c3 = cardTilt(document.body);
        return () => {
          c1();
          c2();
          c3();
        };
      }
    );

    return () => mm.revert();
  });

  return null;
}
