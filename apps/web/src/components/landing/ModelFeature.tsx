import FeatureCard from "./FeatureCard";
import ModelRoutingConfig from "./ModelRoutingConfig";
import { MODEL_SECTION } from "./content";

export default function ModelFeature() {
  return (
    <FeatureCard
      testId="model-routing"
      title={MODEL_SECTION.title}
      body={MODEL_SECTION.body}
      link={MODEL_SECTION.link}
      reversed
    >
      <ModelRoutingConfig />
    </FeatureCard>
  );
}
