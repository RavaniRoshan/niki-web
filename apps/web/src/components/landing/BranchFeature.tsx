import FeatureCard from "./FeatureCard";
import RunWindow from "./RunWindow";
import BranchGateRun from "./BranchGateRun";
import { BRANCH_SECTION } from "./content";

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
        <BranchGateRun />
      </RunWindow>
    </FeatureCard>
  );
}
