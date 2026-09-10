import type { Metadata } from "next";
import { SITE } from "@niki/theme/site";

/** Compose page metadata for a marketing route. */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const pageTitle = opts.title.includes("Niki") ? opts.title : `${opts.title} — Niki`;
  const canonical = SITE.web.replace(/\/$/, "") + opts.path;
  const ogImage = `${SITE.web.replace(/\/$/, "")}/og.png`;
  return {
    title: pageTitle,
    description: opts.description,
    alternates: { canonical },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      siteName: "Niki",
      title: pageTitle,
      description: opts.description,
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: opts.description,
      images: [ogImage],
    },
  };
}

export const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Niki",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Linux, Windows",
  description: SITE.description,
  url: SITE.web,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  license: "https://www.apache.org/licenses/LICENSE-2.0",
  sourceCode: SITE.repo,
  author: { "@type": "Person", name: "Roshan Ravani" },
  releaseNotes: SITE.release.notes,
  softwareVersion: SITE.release.version,
};
