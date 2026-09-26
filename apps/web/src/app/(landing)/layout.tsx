import type { ReactNode } from "react";
import type { Metadata } from "next";
import LandingShell from "@/components/landing/LandingShell";
import { pageMetadata } from "@/lib/meta";

export const metadata: Metadata = pageMetadata({
  title: "Niki, the open-source multi-agent coding pipeline",
  description:
    "Niki runs Planner, Coder, Tester, and Reviewer as independent agents, then creates a reviewable niki/<id> branch with changes.patch and a full audit trail.",
  path: "/",
  image: "/landing/og.png",
});

export default function LandingLayout({ children }: { children: ReactNode }) {
  return <LandingShell>{children}</LandingShell>;
}
