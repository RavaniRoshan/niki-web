import { HIGHLIGHTS, HIGHLIGHTS_SECTION } from "./content";
import styles from "./sections.module.css";

/* Real documentation sections, as an index rather than a fifth row of cards.
 *
 * This is the last block before the closing CTA, so it should read as a quiet
 * table of contents: a mono category in the gutter, the title and its summary
 * beside it, hairlines between. Nothing here is a container. */
export default function HighlightsRow() {
  return (
    <section
      data-testid="highlights-row"
      className={styles.rowSection}
      data-reveal
      aria-labelledby="highlights-row-title"
    >
      <h2 id="highlights-row-title" className={styles.sectionTitle}>
        {HIGHLIGHTS_SECTION.title}
      </h2>

      <ul className={styles.ledger} data-testid="highlights-ledger">
        {HIGHLIGHTS.map((highlight) => (
          <li key={highlight.id} className={styles.ledgerRow}>
            <a
              className={styles.ledgerLink}
              href={highlight.href}
              target="_blank"
              rel="noreferrer noopener"
              data-testid={`highlight-${highlight.id}`}
            >
              <span className={styles.ledgerCategory}>{highlight.category}</span>
              <span className={styles.ledgerTitle}>{highlight.title}</span>
              <span className={styles.ledgerBody}>{highlight.body}</span>
              <span className={styles.ledgerArrow} aria-hidden="true">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <a
        className={styles.textLink}
        href={HIGHLIGHTS_SECTION.link.href}
        target="_blank"
        rel="noreferrer noopener"
      >
        {HIGHLIGHTS_SECTION.link.label} <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
