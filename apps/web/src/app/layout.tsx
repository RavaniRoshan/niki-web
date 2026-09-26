import type { ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Geist, JetBrains_Mono } from "next/font/google";
import { softwareAppJsonLd } from "@/lib/meta";
import "@/styles/globals.css";

const sans = Geist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Niki",
  description: "Open-source tools for reviewable coding changes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`antialiased ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          // Pre-hydration theme: stored choice, else OS preference. Dark is the default.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("niki-theme");if(t==="light"||(!t&&matchMedia("(prefers-color-scheme: light)").matches)){document.documentElement.classList.add("light")}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-gray-12 focus:text-gray-1 focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Script id="niki-software-jsonld" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(softwareAppJsonLd)}
        </Script>
        {children}
      </body>
    </html>
  );
}
