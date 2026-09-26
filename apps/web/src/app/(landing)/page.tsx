import AgentFeature from "@/components/landing/AgentFeature";
import BranchFeature from "@/components/landing/BranchFeature";
import CapabilityRow from "@/components/landing/CapabilityRow";
import ChangelogRow from "@/components/landing/ChangelogRow";
import EvidenceFeature from "@/components/landing/EvidenceFeature";
import FinalCta from "@/components/landing/FinalCta";
import Hero from "@/components/landing/Hero";
import HighlightsRow from "@/components/landing/HighlightsRow";
import ManifestoCard from "@/components/landing/ManifestoCard";
import ModelFeature from "@/components/landing/ModelFeature";
import ProviderStrip from "@/components/landing/ProviderStrip";
import ReceiptGrid from "@/components/landing/ReceiptGrid";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ProviderStrip />
      <AgentFeature />
      <BranchFeature />
      <EvidenceFeature />
      <ModelFeature />
      <ReceiptGrid />
      <ChangelogRow />
      <CapabilityRow />
      <ManifestoCard />
      <HighlightsRow />
      <FinalCta />
    </>
  );
}
