import Link from "next/link";
import BrandPortal from "./BrandPortal";
import styles from "./sections.module.css";
import { WEB_ROUTES } from "@/lib/site";

/** The section the portal opens onto. Sits between the last product section and
 *  the footer, which keeps its own place below this. */
export default function ClosingPortal() {
  return (
    <BrandPortal>
      <p className={styles.portalTitle} data-testid="portal-title">
        One sentence in. A reviewable branch out.
      </p>
      <p className={styles.portalBody}>
        Four agents run the task, the suite has to pass, and the result lands on a branch you can
        read before you merge it.
      </p>
      <div className={styles.portalActions}>
        <Link className={styles.primaryAction} href={WEB_ROUTES.downloads}>
          Download Niki <span aria-hidden="true">↓</span>
        </Link>
        <a
          className={styles.secondaryAction}
          href="https://github.com/RavaniRoshan/niki"
          target="_blank"
          rel="noreferrer noopener"
        >
          Read the source <span aria-hidden="true">→</span>
        </a>
      </div>
    </BrandPortal>
  );
}
