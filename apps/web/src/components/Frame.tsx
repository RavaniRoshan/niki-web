import Link from "next/link";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Frame — the signature layout primitive. Everything on every page lives in
 * one continuous framed column: boxes stack between dashed strips, sharing
 * the vertical rails, exactly like the reference.
 */
export function Frame({ children }: { children: ReactNode }) {
  return <div className="nx-frame">{children}</div>;
}

/** A bordered section box inside the frame. */
export function Box({
  children,
  first = false,
  last = false,
  className,
  id,
}: {
  children: ReactNode;
  first?: boolean;
  last?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`nx-box ${first ? "nx-box--first" : ""} ${last ? "nx-box--last" : ""} ${className ?? ""}`}
    >
      {children}
    </section>
  );
}

/** Dashed separator strip. */
export function Strip({ label }: { label?: string }) {
  return <div className="nx-strip" role="separator" aria-label={label} />;
}

/** Section header row with the mono //comment heading. */
export function BoxHeader({
  comment,
  heading,
  aside,
}: {
  comment: string;
  heading?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="nx-box-header">
      <h2 className="nx-comment" aria-label={heading ?? comment}>
        {comment}
      </h2>
      {aside}
    </div>
  );
}
