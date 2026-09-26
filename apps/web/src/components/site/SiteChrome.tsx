import type { ReactNode } from "react";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import styles from "./site.module.css";

/** One header and one footer for the whole site.
 *
 * The inner routes deliberately reuse the landing's chrome rather than keeping
 * a second navigation. Two headers meant two type scales, two button shapes and
 * two link sets, and a visitor moving between pages could see the brand change
 * under them.
 *
 * The landing keeps its own token scope (`.shell` in the landing stylesheet) so
 * it can hold the measured reference values. This wrapper re-exposes just the
 * shared custom properties those components need, so the same components render
 * correctly on either route group. */
export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div data-testid="site-chrome" className={styles.chrome}>
      <LandingHeader />
      <main id="main" className={styles.main} tabIndex={-1}>
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
