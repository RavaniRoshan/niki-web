"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PROVIDERS, PROVIDER_STRIP } from "./content";
import styles from "./sections.module.css";

/* The count is the subject.
 *
 * This was a row of twelve pills, which is a strip of logos and nothing else. The
 * claim the section is actually making is the number, so the number is now the
 * largest thing in it and the marks arrive beneath it. The figure resolves as it
 * scrolls in, and the marks follow against it, so the section reads as a count
 * being substantiated rather than a list being displayed.
 *
 * Everything is in the DOM from the first frame; only the figure animates. */
export default function ProviderStrip() {
  const rootRef = useRef<HTMLElement>(null);
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCounted(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setCounted(true);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      data-testid="provider-strip"
      className={styles.providerSection}
      data-reveal
      aria-label="Supported providers"
    >
      <p className={styles.providerLabel}>{PROVIDER_STRIP.eyebrow}</p>

      {/* The count, set at the page's display scale, with the marks below it. */}
      <p className={styles.providerCount} data-counted={counted ? "true" : "false"}>
        <span className={styles.providerCountFigure} data-testid="provider-count">
          {String(PROVIDERS.length).padStart(2, "0")}
        </span>
        <span className={styles.providerCountCaption}>
          providers
          <span className={styles.providerDot} aria-hidden="true">
            .
          </span>
        </span>
      </p>

      <ul data-testid="provider-grid" className={styles.providerGrid}>
        {PROVIDERS.map((provider, index) => (
          <li
            key={provider.name}
            className={styles.providerTile}
            data-provider={provider.name}
            style={{ "--i": index } as React.CSSProperties}
          >
            {provider.logo ? (
              <Image
                src={provider.logo}
                alt={provider.name}
                width={provider.width}
                height={provider.height}
                className={styles.providerLogo}
              />
            ) : null}
            <span className={styles.providerName}>{provider.name}</span>
          </li>
        ))}
      </ul>

      <p className={styles.providerFoot} data-testid="provider-strip-label">
        {PROVIDER_STRIP.label}
      </p>
    </section>
  );
}
