import type { ReactNode } from "react";
import ClosingPortal from "./ClosingPortal";
import LandingFooter from "./LandingFooter";
import NavShrinkSensor from "./NavShrinkSensor";
import LandingHeader from "./LandingHeader";
import Reveal from "./Reveal";
import styles from "./landing-shell.module.css";

export default function LandingShell({ children }: { children: ReactNode }) {
  return (
    <div data-testid="landing-shell" className={styles.shell}>
      <NavShrinkSensor />
      <LandingHeader />
      <main id="main" tabIndex={-1} className={styles.main}>
        <Reveal>{children}</Reveal>
      </main>
      <ClosingPortal />
      <LandingFooter />
    </div>
  );
}
