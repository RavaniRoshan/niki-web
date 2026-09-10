"use client";

import { useEffect, useRef } from "react";
import { LogoSignature } from "./LogoMark";

/** Signature logo that draws itself when scrolled into view. */
export default function SignatureLogo({ size = 200 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("nx-in-view");
            io.disconnect();
          }
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="nx-signature">
      <LogoSignature size={size} />
      <p className="nx-signature__word">niki</p>
    </div>
  );
}
