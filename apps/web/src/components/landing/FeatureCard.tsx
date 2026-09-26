import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./sections.module.css";

export type FeatureCardProps = {
  title: string;
  body: string;
  link: { label: string; href: string; external?: boolean };
  /** Flips the split so the media sits left and the copy sits right. */
  reversed?: boolean;
  children: ReactNode;
  /** Extra node under the link, such as a tab strip or a command bar. */
  controls?: ReactNode;
  testId?: string;
};

/** The page's core rhythm: one third copy, two thirds product window.
 *  Collapses to a single column below 900px, copy first. */
export default function FeatureCard({
  title,
  body,
  link,
  reversed = false,
  children,
  controls,
  testId,
}: FeatureCardProps) {
  const headingId = `${testId ?? "feature"}-title`;

  return (
    <section
      className={styles.featureCard}
      data-reveal
      data-reversed={reversed ? "true" : "false"}
      data-testid={testId}
      aria-labelledby={headingId}
    >
      <div className={styles.featureCopy}>
        <h2 className={styles.featureTitle} id={headingId}>
          {title}
        </h2>
        <p className={styles.featureBody}>{body}</p>
        {controls}
        {"external" in link && link.external ? (
          <a className={styles.textLink} href={link.href} target="_blank" rel="noreferrer noopener">
            {link.label} <span aria-hidden="true">→</span>
          </a>
        ) : (
          <Link className={styles.textLink} href={link.href}>
            {link.label} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      <div className={styles.featureMedia}>{children}</div>
    </section>
  );
}
