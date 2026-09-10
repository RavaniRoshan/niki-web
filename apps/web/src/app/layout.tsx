import type { ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignatureLogo from "@/components/SignatureLogo";
import GsapProvider from "@/components/GsapProvider";
import { pageMetadata, softwareAppJsonLd } from "@/lib/meta";
import "@niki/theme/tokens.css";
import "@/styles/niki.css";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Niki — One sentence in, a verified pull request out.",
    description:
      "Niki is the open-source multi-agent coding pipeline that plans, codes, tests, and reviews — then hands you a verified git branch. Four independent agents, hermetic sandboxes, full audit trail.",
    path: "/",
  }),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="nx-skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main" style={{ paddingTop: "64px" }}>
          {children}
        </main>
        <div className="nx-signature-band">
          <SignatureLogo size={192} />
        </div>
        <Footer />
        <Script id="niki-software-jsonld" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(softwareAppJsonLd)}
        </Script>
        <GsapProvider />
      </body>
    </html>
  );
}
