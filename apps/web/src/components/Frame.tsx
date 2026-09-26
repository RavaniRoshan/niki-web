import type { ReactNode } from "react";

/** Axiom section shell — replaces Speakeasy Frame/Box/Strip. Same exports, dark system. */
export function Frame({ children }: { children: ReactNode }) {
  return <div className="bg-background text-foreground">{children}</div>;
}

export function Box({
  children,
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
    <section id={id} className={`ax-band ax-band--auto ${className ?? ""}`}>
      <div className="group section flex flex-col gap-6 sm:gap-10">{children}</div>
    </section>
  );
}

export function Strip({ label }: { label?: string }) {
  return <div className="ax-strip" role="separator" aria-label={label} />;
}

export function BoxHeader({
  comment,
  heading,
  aside,
  lede,
}: {
  comment?: string;
  heading: ReactNode;
  aside?: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      {comment ? (
        <p className="ax-label ax-label--row">
          <span className="ax-label__dot" aria-hidden="true" />
          {comment}
        </p>
      ) : null}
      <h2 className="ax-display--h2 flex max-w-3xl flex-col">
        <span>{heading}</span>
      </h2>
      {lede ? <div className="ax-lead mt-1 sm:mt-2">{lede}</div> : null}
      {aside ? <div className="mt-2">{aside}</div> : null}
    </div>
  );
}
