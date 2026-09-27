import Link from "next/link";
import { CHANGELOG_ENTRIES, CHANGELOG_SECTION } from "./content";
import styles from "./sections.module.css";

/* Four real releases, as a timeline rather than a fourth row of cards.
 *
 * Releases have an order and a date, which is exactly what a spine with nodes
 * says and exactly what a four-up card grid throws away. The spine is the
 * section's one gesture: the ember draws down it as the row scrolls in. */
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

      <ol className={styles.timeline} data-testid="changelog-timeline">
        {CHANGELOG_ENTRIES.map((entry, index) => (
          <li key={entry.id} className={styles.timelineRow} style={{ "--i": index } as never}>
            <span className={styles.timelineNode} aria-hidden="true" />
            <time className={styles.timelineDate} dateTime={entry.date}>
              {entry.date}
            </time>
            <span className={styles.timelineVersion}>{entry.version}</span>
            <Link
              className={styles.timelineLink}
              href={entry.href}
              data-testid={`changelog-${entry.id}`}
            >
              {entry.title}
            </Link>
          </li>
        ))}
      </ol>

      <Link className={styles.textLink} href={CHANGELOG_SECTION.link.href}>
        {CHANGELOG_SECTION.link.label} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
