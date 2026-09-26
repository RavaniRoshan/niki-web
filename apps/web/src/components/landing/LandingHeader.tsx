import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "./content";
import HeaderBarSurface from "./HeaderBarSurface";
import LandingThemeToggle from "./LandingThemeToggle";
import MobileNav from "./MobileNav";
import NavMenu from "./NavMenu";
import styles from "./landing-shell.module.css";

export default function LandingHeader() {
  return (
    <header className={styles.header} data-testid="landing-header">
      <div className={styles.headerInner}>
        <HeaderBarSurface />
        <div className={styles.brandZone}>
          <Link className={styles.brand} href="/">
            <Image src="/logo-mark.svg" alt="" width={26} height={26} priority />
            Niki
          </Link>
          {/* A ruler, not a shape. HeaderBarSurface measures where this lands and
              cuts the bar's surface to match. */}
          <span className={styles.notch} data-notch aria-hidden="true" />
        </div>

        <nav className={styles.desktopNav} aria-label="Primary">
          <NavMenu />
        </nav>

        <div className={styles.headerActions}>
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
