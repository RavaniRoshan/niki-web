import CopyCommandButton from "./CopyCommandButton";
import EvidenceTabs from "./EvidenceTabs";
import FeatureCard from "./FeatureCard";
import RunWindow from "./RunWindow";
import { EVIDENCE_SECTION, INSTALL_COMMAND } from "./content";
import { DOCS_ROUTES, docsUrl } from "@/lib/site";
import styles from "./sections.module.css";

export default function EvidenceFeature() {
  return (
    <FeatureCard
      testId="evidence-feature"
      title={EVIDENCE_SECTION.title}
      body={EVIDENCE_SECTION.body}
      link={{ label: "Read the CLI reference", href: docsUrl(DOCS_ROUTES.cli), external: true }}
      controls={
        <div className={styles.commandBar} data-testid="install-command-bar">
          <div className={styles.commandRow}>
            <code
              className={styles.commandText}
              id="install-command-text"
              data-testid="install-command"
              // Scrolls horizontally, so it must be reachable by keyboard.
              tabIndex={0}
              role="group"
              aria-label="Install command"
            >
              {INSTALL_COMMAND}
            </code>
            <CopyCommandButton command={INSTALL_COMMAND} commandElementId="install-command-text" />
          </div>
        </div>
      }
    >
      <RunWindow title="niki run" backdrop="haze" testId="evidence-window">
        <EvidenceTabs />
      </RunWindow>
    </FeatureCard>
  );
}
