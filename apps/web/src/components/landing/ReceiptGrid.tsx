import { RECEIPT_SECTION, RECEIPTS } from "./content";
import styles from "./sections.module.css";

/* Stands in for the reference's quote wall. Niki has no customers to quote, so the
   grid carries the three artifacts a reviewer actually reads instead. */
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
          <li key={receipt.id} className={styles.receiptCard}>
            <code className={styles.receiptFile}>{receipt.file}</code>
            <h3 className={styles.receiptTitle}>{receipt.title}</h3>
            <p className={styles.receiptBody}>{receipt.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
