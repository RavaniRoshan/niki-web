import Link from "next/link";
import { FINAL_CTA } from "./content";
import styles from "./sections.module.css";

export default function FinalCta() {
  return (
    <section
      data-testid="final-cta"
      className={styles.finalCta}
      data-reveal
      aria-labelledby="final-cta-title"
    >
      <h2 id="final-cta-title" className={styles.finalTitle}>
        {FINAL_CTA.title}
      </h2>
      <Link className={styles.primaryAction} href={FINAL_CTA.action.href}>
        {FINAL_CTA.action.label} <span aria-hidden="true">↓</span>
      </Link>
    </section>
  );
}
