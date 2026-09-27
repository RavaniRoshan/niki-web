"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { NAV_LINKS, type NavEntry, type NavTarget } from "./content";
import styles from "./landing-shell.module.css";

gsap.registerPlugin(useGSAP);

const MENU_ID_PREFIX = "nav-mega";
/* A pointer that has already left the trigger should not close the panel on its
   way to it, so the close is deferred by more than one frame of travel. */
const CLOSE_DELAY = 140;

function isExternal(target: NavTarget): boolean {
  return target.external === true;
}

function PanelLink({ target, onNavigate }: { target: NavTarget; onNavigate: () => void }) {
  const className = styles.megaLink;

  if (isExternal(target)) {
    return (
      <a
        className={className}
        href={target.href}
        target="_blank"
        rel="noreferrer"
        onClick={onNavigate}
      >
        <span className={styles.megaLinkLabel}>{target.label}</span>
        <span className={styles.megaLinkDescription}>{target.description}</span>
        <span className={styles.megaExternal} aria-hidden="true">
          ↗
        </span>
      </a>
    );
  }

  return (
    <Link className={className} href={target.href} onClick={onNavigate}>
      <span className={styles.megaLinkLabel}>{target.label}</span>
      <span className={styles.megaLinkDescription}>{target.description}</span>
    </Link>
  );
}

export default function NavMenu() {
  const pathname = usePathname();
  const baseId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  /* Whether the pointer can actually hover. This decides the whole interaction:
     with a real pointer, moving onto a trigger opens its panel and a click is
     then open-only, so a click never snatches the panel away a hover just
     opened. Without one there is no hover to lean on, so a tap has to toggle. */
  const [canHover, setCanHover] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clearCloseTimer();
    setOpenIndex(null);
  }, [clearCloseTimer]);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setCanHover(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  const onTriggerClick = useCallback(
    (index: number, isOpen: boolean) => {
      if (isOpen && !canHover) {
        close();
        return;
      }
      clearCloseTimer();
      setOpenIndex(index);
    },
    [canHover, clearCloseTimer, close]
  );

  /* A route change must not leave a panel hanging over the new page. */
  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        const trigger =
          rootRef.current?.querySelectorAll<HTMLButtonElement>("[data-mega-trigger]")[openIndex];
        close();
        trigger?.focus();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openIndex, close]);

  /* Only the open panel animates. On close the inline styles are cleared rather
     than tweened back, because `autoAlpha` leaves `visibility: inherit` on the
     element, which would beat the stylesheet's hidden state and strand the
     panel's links in the tab order. */
  useGSAP(
    () => {
      const panels = panelRefs.current.filter((panel): panel is HTMLDivElement => panel !== null);
      gsap.killTweensOf(panels);

      if (openIndex === null) {
        if (panels.length > 0) {
          gsap.set(panels, { clearProps: "all" });
        }
        return;
      }

      const panel = panelRefs.current[openIndex];
      if (!panel) return;

      /* Moving straight from one open panel to another never passes through
         null, so the branch above does not run and the panel being left behind
         keeps the entrance tween's inline `visibility: inherit` and
         `opacity: 1`. Inline styles beat the stylesheet's hidden state, so it
         stays on screen and its links stay in the tab order. Clear every panel
         that is not the one opening. */
      const others = panels.filter((candidate) => candidate !== panel);
      if (others.length > 0) {
        gsap.set(others, { clearProps: "all" });
      }

      const items = panel.querySelectorAll("[data-mega-item]");
      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: -6 },
        { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out", overwrite: true }
      );
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: -4 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.16,
          ease: "power2.out",
          stagger: 0.018,
          delay: 0.02,
          overwrite: true,
        }
      );
    },
    { dependencies: [openIndex], scope: rootRef }
  );

  const openNow = (index: number) => {
    clearCloseTimer();
    setOpenIndex(index);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenIndex(null), CLOSE_DELAY);
  };

  return (
    <div ref={rootRef} className={styles.megaRoot} data-testid="nav-menu">
      <ul className={styles.navList}>
        {NAV_LINKS.map((entry: NavEntry, index) => {
          const panelId = `${baseId}-${MENU_ID_PREFIX}-${index}`;
          const isOpen = openIndex === index;

          return (
            <li
              key={entry.label}
              className={styles.navItem}
              onPointerEnter={canHover ? () => openNow(index) : undefined}
              onPointerLeave={canHover ? scheduleClose : undefined}
            >
              <button
                type="button"
                className={styles.navTrigger}
                data-mega-trigger
                data-testid={`nav-trigger-${entry.label.toLowerCase()}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onTriggerClick(index, isOpen)}
                /* Keyboard focus opens the panel; a tap's focus does not. Without
                   the `:focus-visible` test a tap would focus, open, and then be
                   closed again by its own click. */
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible")) {
                    openNow(index);
                  }
                }}
              >
                {entry.label}
                <span className={styles.navChevron} data-open={isOpen} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>

      {NAV_LINKS.map((entry: NavEntry, index) => {
        const panelId = `${baseId}-${MENU_ID_PREFIX}-${index}`;
        const isOpen = openIndex === index;

        return (
          <div
            key={entry.label}
            ref={(node) => {
              panelRefs.current[index] = node;
            }}
            id={panelId}
            className={styles.megaPanel}
            data-open={isOpen}
            data-testid={`mega-panel-${entry.label.toLowerCase()}`}
            aria-hidden={!isOpen}
            onPointerEnter={canHover ? () => openNow(index) : undefined}
            onPointerLeave={canHover ? scheduleClose : undefined}
          >
            <div className={styles.megaInner}>
              <div className={styles.megaIntro}>
                <p className={styles.megaIntroTitle}>{entry.label}</p>
                <p className={styles.megaIntroBody}>{entry.description}</p>
                <Link
                  className={styles.megaOverview}
                  href={entry.href}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={close}
                >
                  {entry.label} overview
                  <span className={styles.megaArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
              {entry.groups.map((group) => (
                <div key={group.heading} className={styles.megaGroup}>
                  <p className={styles.megaHeading}>{group.heading}</p>
                  <ul className={styles.megaList}>
                    {group.items.map((target) => (
                      <li key={target.label} data-mega-item>
                        <PanelLink target={target} onNavigate={close} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
