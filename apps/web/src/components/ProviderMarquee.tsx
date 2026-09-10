/**
 * ProviderMarquee — real provider logos scrolling infinitely.
 * Duplicated track for a seamless loop; hover pauses the scroll and lifts
 * the logo tile. Reduced-motion: static wrapped grid, no animation.
 */
import { SITE } from "@/lib/site";

const PROVIDERS = [
  { name: "Anthropic", logo: "/logos/anthropic.svg", url: "https://www.anthropic.com/" },
  { name: "OpenAI", logo: "/logos/openai.svg", url: "https://openai.com/" },
  { name: "Google", logo: "/logos/google.svg", url: "https://ai.google.dev/" },
  { name: "Ollama", logo: "/logos/ollama.svg", url: "https://www.ollama.com/" },
  { name: "OpenRouter", logo: "/logos/openrouter.svg", url: "https://openrouter.ai/" },
  { name: "Kimi Code", logo: "/logos/kimi.svg", url: "https://www.kimi.com/" },
  { name: "KiloCode", logo: "/logos/kilocode.svg", url: "https://kilo.ai/" },
  { name: "OpenCode Zen", logo: "/logos/opencode.svg", url: "https://opencode.ai/" },
  { name: "NVIDIA", logo: "/logos/nvidia.svg", url: "https://www.nvidia.com/" },
  { name: "Groq", logo: "/logos/groq.svg", url: "https://groq.com/" },
  { name: "Together", logo: "/logos/together.svg", url: "https://www.together.ai/" },
  { name: "DeepSeek", logo: "/logos/deepseek.svg", url: "https://deepseek.com/" },
];

function Tile({ p }: { p: (typeof PROVIDERS)[number] }) {
  return (
    <a
      className="nx-marquee-tile"
      href={p.url}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={p.name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.logo} alt={p.name} width="22" height="22" loading="lazy" />
      <span className="nx-marquee-name nx-mono">{p.name}</span>
    </a>
  );
}

export default function ProviderMarquee() {
  const track = [...PROVIDERS, ...PROVIDERS];
  return (
    <div
      className="nx-marquee"
      role="region"
      aria-label={`Supported model providers: ${PROVIDERS.map((p) => p.name).join(", ")}. Plus any OpenAI-compatible endpoint via ${SITE.name}.`}
    >
      <div className="nx-marquee__track">
        {track.map((p, i) => (
          <Tile key={`${p.name}-${i}`} p={p} />
        ))}
      </div>
      {/* edge fades */}
      <div className="nx-marquee__fade nx-marquee__fade--l" aria-hidden="true" />
      <div className="nx-marquee__fade nx-marquee__fade--r" aria-hidden="true" />
    </div>
  );
}
