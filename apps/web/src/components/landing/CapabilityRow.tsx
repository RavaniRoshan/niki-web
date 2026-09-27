import Link from "next/link";
import { BACKENDS, CAPABILITIES, CAPABILITY_SECTION, GUARDS, STAGES } from "./content";
import styles from "./sections.module.css";

/* Three capabilities, three different instruments.
 *
 * These were three columns each wearing the same window, which is the third
 * time the page reached for that chrome and the reason it read as one template.
 * They now share a single hairline that runs unbroken across all three, and
 * below it each column is the thing it actually is: a stage ladder, a runtime
 * choice, a set of guard keys. The connection is the rule, not the window. */
function AgentsColumn() {
  return (
    <ol className={styles.ladder} data-testid="capability-agents">
      {STAGES.map((stage) => (
        <li key={stage.id} className={styles.ladderStep}>
          <span className={styles.ladderStage}>{stage.label}</span>
          <code className={styles.ladderArtifact}>{stage.output}</code>
        </li>
      ))}
    </ol>
  );
}

function SandboxColumn() {
  return (
    <ul className={styles.runtime} data-testid="capability-sandbox">
      {BACKENDS.map((backend, index) => (
        <li
          key={backend.id}
          className={styles.runtimeOption}
          data-default={index === 0 ? "true" : "false"}
        >
          <span className={styles.runtimeMark} aria-hidden="true" />
          <span className={styles.runtimeName}>{backend.name}</span>
          <span className={styles.runtimeNote}>{backend.description}</span>
        </li>
      ))}
    </ul>
  );
}

function GuardrailColumn() {
  return (
    <ul className={styles.guards} data-testid="capability-guardrails">
      {GUARDS.map((guard) => (
        <li key={guard.id} className={styles.guardRow}>
          <code className={styles.guardKey}>{guard.label}</code>
          <span className={styles.guardEffect}>{guard.result}</span>
        </li>
      ))}
    </ul>
  );
}

const COLUMNS = {
  agents: AgentsColumn,
  sandbox: SandboxColumn,
  guardrails: GuardrailColumn,
} as const;

export default function CapabilityRow() {
  return (
    <section
      data-testid="capability-row"
      className={styles.rowSection}
      data-reveal
      aria-labelledby="capability-row-title"
    >
      <h2 id="capability-row-title" className={styles.sectionTitle}>
        {CAPABILITY_SECTION.title}
      </h2>

      <ul className={styles.capabilityGrid} data-testid="capability-grid">
        {CAPABILITIES.map((capability) => {
          const Column = COLUMNS[capability.media as keyof typeof COLUMNS];
          return (
            <li key={capability.id} className={styles.capabilityCard}>
              <div className={styles.capabilityCopy}>
                <h3 className={styles.capabilityTitle}>{capability.title}</h3>
                <p className={styles.capabilityBody}>{capability.body}</p>
                <Link className={styles.textLink} href={capability.link.href}>
                  {capability.link.label} <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <Column />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
