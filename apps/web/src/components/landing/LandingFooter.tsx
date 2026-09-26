import Link from "next/link";
import { FOOTER_GROUPS } from "./content";
import { SITE } from "@/lib/site";
import styles from "./landing-shell.module.css";

export default function LandingFooter() {
  return (
    <footer data-testid="landing-footer" className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerGroups}>
          {FOOTER_GROUPS.map((group) => (
            <nav key={group.id} className={styles.footerGroup} aria-label={group.heading}>
              <h2>{group.heading}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        data-testid={`footer-link-${group.id}`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} data-testid={`footer-link-${group.id}`}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.footerLegal}>
          <div className={styles.footerLegalGroup}>
            <span>{`© ${new Date().getFullYear()} Niki contributors`}</span>
            <span aria-hidden="true">|</span>
            <a href={SITE.repo} target="_blank" rel="noreferrer noopener">
              Apache-2.0
            </a>
            <span aria-hidden="true">|</span>
            <span>No telemetry</span>
          </div>
          <div className={styles.footerLegalGroup}>
            <span>BYOK</span>
            <span aria-hidden="true">|</span>
            <a href={SITE.social.issues} target="_blank" rel="noreferrer noopener">
              Report an issue
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
