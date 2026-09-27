"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { EVIDENCE_FILES } from "./content";
import interactiveStyles from "./interactive.module.css";
import styles from "./sections.module.css";

/* The artifact excerpt scrolls horizontally on a narrow screen, so it is
 * focusable: a scrollable region with no keyboard access is a real barrier, not a
 * lint nit. */
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

          {/* The file itself, not a description of the file. Each artifact gets
              its own treatment because a diff and a report are not the same kind
              of thing, and pretending otherwise was what made the old panel four
              copies of one paragraph. */}
          <div className={styles.evidenceExcerpt} data-kind={activeFile.excerpt.kind}>
            {activeFile.excerpt.kind === "report" ? (
              <ul className={styles.excerptReport}>
                {activeFile.excerpt.stages.map((entry) => (
                  <li key={entry.stage}>
                    <span className={styles.excerptReportStage}>{entry.stage}</span>
                    <span className={styles.excerptReportVerdict}>{entry.verdict}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <pre
                className={styles.excerptCode}
                tabIndex={0}
                role="group"
                aria-label={`Sample output from ${activeFile.name}`}
              >
                <code>
                  {activeFile.excerpt.lines.map((line, index) => (
                    <span
                      key={index}
                      className={styles.excerptLine}
                      data-tone={
                        activeFile.excerpt.kind === "diff"
                          ? line.startsWith("+")
                            ? "add"
                            : line.startsWith("@@")
                              ? "hunk"
                              : "plain"
                          : line.startsWith("#")
                            ? "hunk"
                            : activeFile.excerpt.kind === "json" && line.includes('"')
                              ? "key"
                              : "plain"
                      }
                    >
                      {line || " "}
                      {"\n"}
                    </span>
                  ))}
                </code>
              </pre>
            )}
          </div>

          <p className={styles.evidenceNote}>
            Sample output. The real file ships with the run and stays with the branch.
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
