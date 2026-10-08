import Link from "next/link";
import { HERO, HERO_BADGES } from "./content";
import GradientWash from "./GradientWash";
import PipelineVideo from "./PipelineVideo";
import styles from "./sections.module.css";

/* The hero media is a full macOS desktop: wallpaper, menu bar, a Terminal
 * window running the demo, and a dock. The asset supplies all of it, so there is
 * deliberately no RunWindow wrapper here. Wrapping a window that already
 * contains a window draws a second frame around the first, which is exactly the
 * canvas boundary this section is trying not to have. The RunWindow primitive
 * still carries every other product surface on the page. */
export default function Hero() {
  return (
    <section
      data-testid="landing-hero"
      className={styles.hero}
      aria-labelledby="landing-hero-title"
    >
      {/* Background wave. Decorative, behind everything, and masked so it is
          fully gone by the vertical midpoint of the demo recording rather than
          ending on a line. That midpoint is measured, not guessed, because the
          copy block above it is content-sized. */}
      <GradientWash className={styles.heroWash} fadeAt="[data-testid='hero-window']" />

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
        <div className={styles.heroBadges}>
          {HERO_BADGES.map((badge) => (
            <span key={badge.label} className={styles.heroBadge}>
              {badge.label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.heroMedia} data-testid="hero-window">
        <PipelineVideo />
      </div>
    </section>
  );
}
