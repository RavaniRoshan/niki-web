import FeatureCard from "./FeatureCard";
import RunWindow from "./RunWindow";
import { BRANCH_SECTION, BRANCH_GATES } from "./content";
import styles from "./sections.module.css";

export default function BranchFeature() {
  return (
    <FeatureCard
      testId="branch-feature"
      title={BRANCH_SECTION.title}
      body={BRANCH_SECTION.body}
      link={BRANCH_SECTION.link}
      reversed
    >
      <RunWindow
        title="niki status"
        tabs={["main", "niki/4f2a"]}
        activeTab={1}
        backdrop="strata"
        testId="branch-window"
      >
        <div className={styles.gateList}>
          <p className={styles.gateLede}>
            <code>main</code> is untouched. The run proposes one reviewed commit on a fresh branch.
          </p>
          <ul data-testid="branch-gates" className={styles.gateRows}>
            {BRANCH_GATES.map((gate) => (
              <li key={gate.id} className={styles.gateRow} data-result={gate.result}>
                <span className={styles.gateLabel}>{gate.label}</span>
                <span className={styles.gateResult}>{gate.result}</span>
              </li>
            ))}
          </ul>
        </div>
      </RunWindow>
    </FeatureCard>
  );
}
