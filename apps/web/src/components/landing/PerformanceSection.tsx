import { PERFORMANCE_SECTION, PERFORMANCE_CONTRACTS } from "./content";
import styles from "./sections.module.css";

export default function PerformanceSection() {
  return (
    <section
      data-testid="performance-section"
      className={styles.performanceSection}
      data-reveal
      aria-labelledby="performance-title"
    >
      <h2 id="performance-title" className={styles.featureTitle}>
        {PERFORMANCE_SECTION.title}
      </h2>
      <p className={styles.featureBody}>{PERFORMANCE_SECTION.body}</p>
      <div className={styles.performanceTable}>
        <div className={styles.performanceHeader}>
          <span>Tool</span>
          <span>Version</span>
          <span>Language</span>
          <span>--version</span>
          <span>TTFP</span>
          <span>Idle Memory</span>
          <span>Binary</span>
        </div>
        {PERFORMANCE_CONTRACTS.map((row) => (
          <div
            key={row.tool}
            className={`${styles.performanceRow} ${row.tool === "NIKI" ? styles.performanceRowHighlight : ""}`}
          >
            <span className={styles.performanceTool}>{row.tool}</span>
            <span>{row.version}</span>
            <span>{row.lang}</span>
            <span>{row.versionTime}</span>
            <span>{row.ttfp}</span>
            <span>{row.memory}</span>
            <span>{row.binary}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
