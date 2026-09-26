import Link from "next/link";
import RunWindow from "./RunWindow";
import { BACKENDS, CAPABILITIES, CAPABILITY_SECTION, GUARDS, STAGES } from "./content";
import styles from "./sections.module.css";

const MEDIA: Record<
  string,
  {
    title: string;
    tabs: string[];
    variant: "solo" | "offset";
    backdrop: "dusk" | "strata" | "haze";
  }
> = {
  agents: {
    title: "niki run",
    tabs: ["Planner", "Coder", "Tester", "Reviewer"],
    variant: "solo",
    backdrop: "dusk",
  },
  sandbox: {
    title: "backends",
    tabs: ["Podman", "Docker", "worktree"],
    variant: "solo",
    backdrop: "strata",
  },
  guardrails: { title: "niki.toml", tabs: ["guards"], variant: "solo", backdrop: "haze" },
};

function Media({ kind }: { kind: string }) {
  if (kind === "agents") {
    return (
      <ul className={styles.miniRows}>
        {STAGES.map((stage) => (
          <li key={stage.id} className={styles.miniRow}>
            <span>{stage.label}</span>
            <code>{stage.output}</code>
          </li>
        ))}
      </ul>
    );
  }
  if (kind === "sandbox") {
    return (
      <ul className={styles.miniRows}>
        {BACKENDS.map((backend) => (
          <li key={backend.id} className={styles.miniRow}>
            <span>{backend.name}</span>
            <code>{backend.id}</code>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={styles.miniRows}>
      {GUARDS.map((guard) => (
        <li key={guard.id} className={styles.miniRow}>
          <code>{guard.label}</code>
          <span>{guard.result}</span>
        </li>
      ))}
    </ul>
  );
}

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
      <ul className={styles.capabilityGrid}>
        {CAPABILITIES.map((capability) => {
          const media = MEDIA[capability.media];
          return (
            <li key={capability.id} className={styles.capabilityCard}>
              <div className={styles.capabilityCopy}>
                <h3 className={styles.capabilityTitle}>{capability.title}</h3>
                <p className={styles.capabilityBody}>{capability.body}</p>
                <Link className={styles.textLink} href={capability.link.href}>
                  {capability.link.label} <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <RunWindow
                title={media.title}
                tabs={media.tabs}
                variant={media.variant}
                backdrop={media.backdrop}
                testId={`capability-window-${capability.id}`}
              >
                <Media kind={capability.media} />
              </RunWindow>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
