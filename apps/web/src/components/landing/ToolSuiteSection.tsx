import { TOOL_SUITE_SECTION, TOOL_SUITE } from "./content";
import styles from "./sections.module.css";

export default function ToolSuiteSection() {
  return (
    <section
      data-testid="tool-suite-section"
      className={styles.toolSuiteSection}
      data-reveal
      aria-labelledby="tool-suite-title"
    >
      <h2 id="tool-suite-title" className={styles.featureTitle}>
        {TOOL_SUITE_SECTION.title}
      </h2>
      <p className={styles.featureBody}>{TOOL_SUITE_SECTION.body}</p>
      <div className={styles.toolGrid}>
        {TOOL_SUITE.map((tool) => (
          <div key={tool.name} className={styles.toolCard}>
            <span className={styles.toolName}>{tool.name}</span>
            <span className={styles.toolPurpose}>{tool.purpose}</span>
            <span className={styles.toolSafety}>{tool.safety}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
