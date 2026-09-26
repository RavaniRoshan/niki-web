import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "./content";
import LandingThemeToggle from "./LandingThemeToggle";
import MobileNav from "./MobileNav";
import styles from "./landing-shell.module.css";

export default function LandingHeader() {
  return (
    <header className={styles.header} data-testid="landing-header">
      <div className={styles.headerInner}>
        <Link className={styles.brand} href="/">
          <Image src="/logo-mark.svg" alt="" width={26} height={26} priority />
          Niki
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link className={styles.navLink} href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.headerActions}>
          <a className={styles.headerGhost} href="https://github.com/RavaniRoshan/niki">
            Sign in
          </a>
          <a className={styles.headerOutline} href="https://github.com/RavaniRoshan/niki/issues">
            Contact
          </a>
          <Link className={styles.headerSolid} href="/downloads">
            Download
          </Link>
          <LandingThemeToggle />
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
