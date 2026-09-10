/**
 * Niki logo mark — the squared "N" glyph in a bordered frame.
 * hover: the mint N re-draws itself (stroke-dashoffset) while the frame
 * corners pulse; pure CSS, no JS, reduced-motion safe.
 */
export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="nx-logo">
      {/* frame */}
      <rect
        className="nx-logo__frame"
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        fill="var(--nk-bg-1)"
        stroke="var(--nk-surface-border)"
      />
      {/* N stroke — drawn on hover */}
      <path
        className="nx-logo__n"
        d="M9 22.5 L9 9.5 L23 22.5 L23 9.5"
        fill="none"
        stroke="var(--nk-mint)"
        strokeWidth="2.6"
        strokeLinecap="square"
      />
      {/* corner ticks — grow on hover */}
      <g className="nx-logo__ticks" stroke="var(--nk-mint)" strokeWidth="1.5">
        <path d="M1.5 5.5 V1.5 H5.5" fill="none" />
        <path d="M26.5 1.5 H30.5 V5.5" fill="none" />
        <path d="M30.5 26.5 V30.5 H26.5" fill="none" />
        <path d="M5.5 30.5 H1.5 V26.5" fill="none" />
      </g>
    </svg>
  );
}

/**
 * Big signature logo — same glyph at display scale, with a slower, more
 * theatrical entrance: the N draws once on scroll into view, corner ticks
 * settle after it, and a hover replays the draw from the top-left corner.
 */
export function LogoSignature({ size = 200 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="nx-logo nx-logo--signature"
    >
      <rect
        className="nx-logo__frame"
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        fill="var(--nk-bg-1)"
        stroke="var(--nk-surface-border)"
      />
      <path
        className="nx-logo__n"
        d="M9 22.5 L9 9.5 L23 22.5 L23 9.5"
        fill="none"
        stroke="var(--nk-mint)"
        strokeWidth="2.2"
        strokeLinecap="square"
      />
      <g className="nx-logo__ticks" stroke="var(--nk-mint)" strokeWidth="1">
        <path d="M1.5 5.5 V1.5 H5.5" fill="none" />
        <path d="M26.5 1.5 H30.5 V5.5" fill="none" />
        <path d="M30.5 26.5 V30.5 H26.5" fill="none" />
        <path d="M5.5 30.5 H1.5 V26.5" fill="none" />
      </g>
    </svg>
  );
}
