"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { EVIDENCE_FILES } from "./content";
import interactiveStyles from "./interactive.module.css";
import styles from "./sections.module.css";
import { useHorizontalTabs } from "./useHorizontalTabs";

export default function EvidenceTabs() {
  const id = useId().replace(/:/g, "");
  const horizontalTabs = useHorizontalTabs();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFile = EVIDENCE_FILES[activeIndex];
  const panelId = `${id}-evidence-panel`;

  const selectFile = (index: number) => {
    setActiveIndex((index + EVIDENCE_FILES.length) % EVIDENCE_FILES.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % EVIDENCE_FILES.length;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + EVIDENCE_FILES.length) % EVIDENCE_FILES.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = EVIDENCE_FILES.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    selectFile(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  const frame = (
    <>
      <div className={styles.evidenceFrame}>
        <div
          role="tablist"
          aria-label="Niki run artifacts"
          aria-orientation={horizontalTabs ? "horizontal" : "vertical"}
          data-testid="evidence-tabs"
          className={`${interactiveStyles.tabRail} ${styles.evidenceTabs}`}
          onKeyDown={(event) => handleKeyDown(event, activeIndex)}
        >
          {EVIDENCE_FILES.map((file, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={file.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`${id}-evidence-tab-${file.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                data-testid={`evidence-tab-${file.id}`}
                className={interactiveStyles.tabButton}
                onClick={() => selectFile(index)}
              >
                <span className={interactiveStyles.tabLabel}>{file.name}</span>
                {file.qualifier ? (
                  <span className={styles.fileQualifier}>{file.qualifier}</span>
                ) : (
                  <span className={interactiveStyles.tabOutput}>Run output</span>
                )}
              </button>
            );
          })}
        </div>

        <div
          key={activeFile.id}
          id={panelId}
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`${id}-evidence-tab-${activeFile.id}`}
          data-testid="evidence-panel"
          className={`${interactiveStyles.tabPanel} ${styles.evidencePanel}`}
        >
          <div className={styles.evidenceFileHeader}>
            <span className={styles.evidenceFileName}>{activeFile.name}</span>
            {activeFile.qualifier ? (
              <span className={styles.fileQualifier}>{activeFile.qualifier}</span>
            ) : null}
          </div>
          <p className={styles.evidenceDescription}>{activeFile.description}</p>
          <p className={styles.evidenceNote}>
            The file stays with the run so the decision trail is inspectable before review.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div data-testid="evidence-section" className={styles.evidenceEmbedded}>
      {frame}
    </div>
  );
}
