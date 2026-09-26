import Link from "next/link";
import { CHANGELOG_ENTRIES, CHANGELOG_SECTION } from "./content";
import styles from "./sections.module.css";

/* Four real releases, straight from the changelog data. */
export default function ChangelogRow() {
  return (
    <section
      data-testid="changelog-row"
      className={styles.rowSection}
      data-reveal
      aria-labelledby="changelog-row-title"
    >
      <h2 id="changelog-row-title" className={styles.sectionTitle}>
        {CHANGELOG_SECTION.title}
      </h2>
      <ul className={styles.cardRow}>
        {CHANGELOG_ENTRIES.map((entry) => (
          <li key={entry.id}>
            <Link
              className={styles.metaCard}
              href={entry.href}
              data-testid={`changelog-${entry.id}`}
            >
              <time className={styles.metaDate} dateTime={entry.date}>
                {entry.date}
              </time>
              <span className={styles.metaTitle}>{entry.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link className={styles.textLink} href={CHANGELOG_SECTION.link.href}>
        {CHANGELOG_SECTION.link.label} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
