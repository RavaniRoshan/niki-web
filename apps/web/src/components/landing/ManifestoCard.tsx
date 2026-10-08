import { MANIFESTO, PHILOSOPHY } from "./content";
import { BACKENDS, PROVIDERS } from "./content";
import styles from "./sections.module.css";

/* The reference pairs a manifesto line with a photograph. Niki has no studio
   photography to use, so the right-hand panel carries the project's actual
   surface area: the runtimes it supports and the providers it talks to. */
export default function ManifestoCard() {
  return (
    <section
      data-testid="open-source-proof"
      className={styles.manifestoCard}
      data-reveal
      aria-labelledby="manifesto-title"
    >
      <div className={styles.manifestoCopy}>
        <h2 id="manifesto-title" className={styles.featureTitle}>
          {MANIFESTO.title}
        </h2>
        <p className={styles.featureBody}>{MANIFESTO.body}</p>
        <a
          className={styles.textLink}
          href={MANIFESTO.link.href}
          target="_blank"
          rel="noreferrer noopener"
        >
          {MANIFESTO.link.label} <span aria-hidden="true">→</span>
        </a>
      </div>
      <div className={styles.manifestoPanel}>
        <p className={styles.manifestoPanelTitle}>Runs on your machine</p>
        <ul className={styles.manifestoList}>
          {BACKENDS.map((backend) => (
            <li key={backend.id} className={styles.manifestoItem}>
              <span className={styles.manifestoItemName}>{backend.name}</span>
              <span className={styles.manifestoItemBody}>{backend.description}</span>
            </li>
          ))}
        </ul>
        <p className={styles.manifestoPanelTitle}>Talks to {PROVIDERS.length} providers</p>
        <p className={styles.manifestoProviderLine}>
          {PROVIDERS.map((provider) => provider.name).join(", ")}.
        </p>
        <div className={styles.philosophyList}>
          {PHILOSOPHY.map((item) => (
            <div key={item.title} className={styles.philosophyItem}>
              <span className={styles.philosophyTitle}>{item.title}</span>
              <span className={styles.philosophyBody}>{item.body}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
