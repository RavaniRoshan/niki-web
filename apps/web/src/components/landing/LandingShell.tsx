import type { ReactNode } from "react";
import LandingFooter from "./LandingFooter";
import LandingHeader from "./LandingHeader";
import Reveal from "./Reveal";
import styles from "./landing-shell.module.css";

export default function LandingShell({ children }: { children: ReactNode }) {
  return (
    <div data-testid="landing-shell" className={styles.shell}>
      <LandingHeader />
      <main id="main" tabIndex={-1} className={styles.main}>
        <Reveal>{children}</Reveal>
      </main>
      <LandingFooter />
    </div>
  );
}
