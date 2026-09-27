import Link from "next/link";
import { NAV_LINKS } from "./content";
import LandingThemeToggle from "./LandingThemeToggle";
import MobileNav from "./MobileNav";
import NavMenu from "./NavMenu";
import NikiMark from "./NikiMark";
import styles from "./landing-shell.module.css";

export default function LandingHeader() {
  return (
    <header className={styles.header} data-testid="landing-header">
      <div className={styles.headerInner}>
        {/* The bar's own surface, as a sibling of the content rather than the
            content's background: it carries a backdrop blur, and the mega-panels
            hang below this box and must not be filtered with it. */}
        <span className={styles.barSurface} data-testid="header-bar-surface" aria-hidden="true" />

        <Link className={styles.brand} href="/">
          <NikiMark size={26} />
          Niki
        </Link>

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
