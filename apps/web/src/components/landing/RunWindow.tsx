import type { ReactNode } from "react";
import styles from "./sections.module.css";

export type RunWindowProps = {
  title: string;
  /** Tab labels rendered in the window's tab strip. */
  tabs?: readonly string[];
  /** Which tab reads as active. Defaults to the first. */
  activeTab?: number;
  children: ReactNode;
  /** Adds a second, offset window behind this one, as the reference does. */
  variant?: "solo" | "offset";
  backdrop?: "dusk" | "strata" | "haze";
  testId?: string;
};

const BACKDROPS = {
  dusk: "var(--landing-backdrop-dusk)",
  strata: "var(--landing-backdrop-strata)",
  haze: "var(--landing-backdrop-haze)",
} as const;

/** macOS-style chrome over a composited backdrop. The window is the subject;
 *  the backdrop only has to be calm enough that the chrome reads clearly. */
export default function RunWindow({
  title,
  tabs = [],
  activeTab = 0,
  children,
  variant = "solo",
  backdrop = "dusk",
  testId,
}: RunWindowProps) {
  return (
    <div
      className={styles.windowStage}
      data-window-variant={variant}
      data-backdrop={backdrop}
      data-testid={testId}
    >
      <div className={styles.windowBackdrop} style={{ backgroundImage: BACKDROPS[backdrop] }} />
      {variant === "offset" ? (
        <div className={styles.windowBackWindow} aria-hidden="true">
          <span className={styles.windowBackBar}>
            <i />
            <i />
            <i />
          </span>
        </div>
      ) : null}
      <div className={styles.window}>
        <div className={styles.windowBar}>
          <span className={styles.windowLights} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.windowTitle}>{title}</span>
          <span className={styles.windowBarSpacer} />
        </div>
        {tabs.length > 0 ? (
          <div className={styles.windowTabs} role="presentation">
            {tabs.map((tab, index) => (
              <span
                key={tab}
                className={styles.windowTab}
                data-active={index === activeTab ? "true" : "false"}
              >
                {tab}
              </span>
            ))}
          </div>
        ) : null}
        <div className={styles.windowBody}>{children}</div>
      </div>
    </div>
  );
}
