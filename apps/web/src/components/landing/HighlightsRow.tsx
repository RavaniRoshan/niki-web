import { HIGHLIGHTS, HIGHLIGHTS_SECTION } from "./content";
import styles from "./sections.module.css";

/* Real documentation sections. Each card links into the docs site. */
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
      <ul className={styles.cardRow}>
        {HIGHLIGHTS.map((highlight) => (
          <li key={highlight.id}>
            <a
              className={styles.metaCard}
              href={highlight.href}
              target="_blank"
              rel="noreferrer noopener"
              data-testid={`highlight-${highlight.id}`}
            >
              <span className={styles.metaCategory}>{highlight.category}</span>
              <span className={styles.metaTitle}>{highlight.title}</span>
              <span className={styles.metaBody}>{highlight.body}</span>
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
