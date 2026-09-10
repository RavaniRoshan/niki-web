import type { ReactNode } from "react";

/** Boxy terminal window. Children are lines (spans/divs) styled by nx-t-* classes. */
export function Terminal({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={`nx-terminal ${className ?? ""}`}>
      <div className="nx-terminal__bar">
        <div className="nx-terminal__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span className="nx-terminal__title">{title}</span>
      </div>
      <div className="nx-terminal__body">
        <pre>{children}</pre>
      </div>
    </figure>
  );
}

/** One terminal line. */
export function T({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: "dim" | "mint" | "mag" | "warn" | "ok" | "red" | "white";
}) {
  const cls =
    tone === "dim"
      ? "nx-t-dim"
      : tone === "mint"
        ? "nx-t-mint"
        : tone === "mag"
          ? "nx-t-mag"
          : tone === "warn"
            ? "nx-t-warn"
            : tone === "ok"
              ? "nx-t-ok"
              : tone === "red"
                ? "nx-t-red"
                : tone === "white"
                  ? "nx-t-white"
                  : "";
  return (
    <span className={cls} style={{ display: "block" }}>
      {children}
    </span>
  );
}
