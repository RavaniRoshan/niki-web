import FeatureCard from "./FeatureCard";
import RunWindow from "./RunWindow";
import { MODEL_ROUTING_TOML, MODEL_SECTION } from "./content";
import styles from "./sections.module.css";

export default function ModelFeature() {
  return (
    <FeatureCard
      testId="model-routing"
      title={MODEL_SECTION.title}
      body={MODEL_SECTION.body}
      link={MODEL_SECTION.link}
      reversed
    >
      <RunWindow title="niki.toml" tabs={["niki.toml"]} backdrop="haze" testId="model-window">
        <p className={styles.gateLede}>Example configuration. Choose models per stage.</p>
        <pre
          data-testid="model-routing-code"
          className={styles.codeBlock}
          tabIndex={0}
          aria-label="Example niki.toml configuration"
        >
          <code>{MODEL_ROUTING_TOML}</code>
        </pre>
      </RunWindow>
    </FeatureCard>
  );
}
