import FeatureCard from "./FeatureCard";
import RunExplorer from "./RunExplorer";
import RunWindow from "./RunWindow";
import { AGENT_SECTION } from "./content";

export default function AgentFeature() {
  return (
    <FeatureCard
      testId="agent-feature"
      title={AGENT_SECTION.title}
      body={AGENT_SECTION.body}
      link={AGENT_SECTION.link}
    >
      <RunWindow title="niki run" variant="offset" backdrop="strata" testId="agent-window">
        <RunExplorer />
      </RunWindow>
    </FeatureCard>
  );
}
