import Image from "next/image";
import { PROVIDER_STRIP, PROVIDERS } from "./content";
import styles from "./sections.module.css";

export default function ProviderStrip() {
  return (
    <section
      data-testid="provider-strip"
      className={styles.providerSection}
      data-reveal
      aria-label="Supported providers"
    >
      <p className={styles.providerLabel}>{PROVIDER_STRIP.label}</p>
      <ul data-testid="provider-grid" className={styles.providerGrid}>
        {PROVIDERS.map((provider) => (
          <li key={provider.name} className={styles.providerTile}>
            <Image
              src={provider.logo}
              alt={provider.name}
              width={provider.width}
              height={provider.height}
              className={styles.providerLogo}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
