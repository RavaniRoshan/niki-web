import Link from "next/link";
import { HERO } from "./content";
import PipelineVideo from "./PipelineVideo";
import RunWindow from "./RunWindow";
import styles from "./sections.module.css";

export default function Hero() {
  return (
    <section
      data-testid="landing-hero"
      className={styles.hero}
      data-reveal
      aria-labelledby="landing-hero-title"
    >
      <div className={styles.heroInner}>
        <h1 id="landing-hero-title" className={styles.heroTitle}>
          {HERO.title}
        </h1>
        <div className={styles.heroActions}>
          <Link className={styles.primaryAction} href={HERO.primaryAction.href}>
            {HERO.primaryAction.label} <span aria-hidden="true">↓</span>
          </Link>
          <a
            className={styles.secondaryAction}
            href={HERO.secondaryAction.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {HERO.secondaryAction.label} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className={styles.heroMedia}>
        <RunWindow
          title="niki run"
          tabs={["run"]}
          variant="offset"
          backdrop="dusk"
          testId="hero-window"
        >
          <PipelineVideo />
        </RunWindow>
      </div>
    </section>
  );
}
