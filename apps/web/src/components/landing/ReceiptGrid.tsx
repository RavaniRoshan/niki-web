import { RECEIPT_SECTION, RECEIPTS } from "./content";
import styles from "./sections.module.css";

/* Each excerpt scrolls horizontally on a narrow screen, so it is focusable: a
 * scrollable region with no keyboard access is a real barrier, not a lint nit. */

/* Stands in for the reference's quote wall. Niki has no customers to quote, so
   this carries the three artifacts a reviewer actually reads instead.
 *
   Each one is set as the artifact it is: a diff reads as a diff, a report as a
   ledger of verdicts, JSON as JSON. Three cards that each said "this file
   exists" told the reader nothing; three cards that each *are* the thing do. */
export default function ReceiptGrid() {
  return (
    <section
      data-testid="receipt-grid"
      className={styles.receiptSection}
      data-reveal
      aria-label="Run artifacts"
    >
      <div className={styles.centredIntro}>
        <h2 className={styles.centredTitle}>{RECEIPT_SECTION.title}</h2>
        <p className={styles.centredBody}>{RECEIPT_SECTION.body}</p>
      </div>

      <ul className={styles.receiptGrid}>
        {RECEIPTS.map((receipt) => (
          <li key={receipt.id} className={styles.receiptCard} data-kind={receipt.kind}>
            {/* A div, not a <header>: a header element inside a card is still
                counted as a banner landmark, and three receipt cards silently
                became three extra landmarks on the page. */}
            <div className={styles.receiptHeader}>
              <code className={styles.receiptFile}>{receipt.file}</code>
              <h3 className={styles.receiptTitle}>{receipt.title}</h3>
            </div>

            {receipt.kind === "report" ? (
              <ul className={styles.receiptVerdicts}>
                {receipt.stages.map((stage) => (
                  <li key={stage.stage}>
                    <span className={styles.receiptVerdictStage}>{stage.stage}</span>
                    <span className={styles.receiptVerdictResult}>{stage.verdict}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <pre
                className={styles.receiptExcerpt}
                tabIndex={0}
                role="group"
                aria-label={`Sample output from ${receipt.file}`}
              >
                <code>
                  {receipt.lines.map((line, index) => (
                    <span
                      key={index}
                      className={styles.receiptLine}
                      data-tone={
                        receipt.kind === "diff"
                          ? line.startsWith("+")
                            ? "add"
                            : line.startsWith("@@")
                              ? "hunk"
                              : "plain"
                          : line.includes('"') && line.trim().endsWith(":")
                            ? "key"
                            : line.trim().endsWith(",")
                              ? "value"
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

            <p className={styles.receiptBody}>{receipt.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
