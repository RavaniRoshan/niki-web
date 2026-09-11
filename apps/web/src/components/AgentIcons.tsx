/**
 * Agent role icons — line-style SVG glyphs on a 24×24 grid, square caps,
 * 1.8 stroke, matching the site's technical-drawing DNA. Stroke inherits
 * currentColor so each stage's role tint colors it.
 *
 * Metaphors:
 *   Planner  — a spec document with connected plan nodes
 *   Coder    — code brackets with an insertion cursor
 *   Tester   — a lab flask with test ticks
 *   Reviewer — an eye over a diff (review = watch + inspect)
 *   Branch   — the git-branch glyph (verified output)
 */

export function PlannerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      aria-hidden="true"
    >
      {/* spec sheet */}
      <path d="M5 3h10l4 4v14H5z" />
      <path d="M15 3v4h4" />
      {/* plan nodes: dot-grid connected by a route */}
      <path d="M8.5 13h3" />
      <circle cx="8" cy="13" r="1" fill="currentColor" stroke="none" />
      <path d="M11.5 13v-2.5h3" />
      <circle cx="15.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <path d="M8.5 17h7" />
    </svg>
  );
}

export function CoderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      aria-hidden="true"
    >
      {/* code brackets */}
      <path d="M8 6 3 12l5 6" />
      <path d="M16 6l5 6-5 6" />
      {/* insertion cursor */}
      <path d="M13 4v4" />
      <path d="M13 5.5h-2M13 5.5h2" opacity="0.85" />
    </svg>
  );
}

export function TesterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      aria-hidden="true"
    >
      {/* flask */}
      <path d="M9 3h6" />
      <path d="M10 3v5L5.5 17.5a2.5 2.5 0 0 0 2.2 3.7h8.6a2.5 2.5 0 0 0 2.2-3.7L14 8V3" />
      {/* liquid line + ticks */}
      <path d="M7.5 15.5h9" />
      <path d="M10 18.2v.01M12 18.2v.01M14 18.2v.01" strokeWidth="2.4" />
    </svg>
  );
}

export function ReviewerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      aria-hidden="true"
    >
      {/* eye: review = watch */}
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3.2" />
      {/* verdict tick in the pupil */}
      <path d="M10.8 12.2l1 1 1.6-1.9" />
    </svg>
  );
}

export function BranchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      aria-hidden="true"
    >
      {/* git branch */}
      <circle cx="6" cy="4.5" r="1.8" />
      <circle cx="6" cy="19.5" r="1.8" />
      <circle cx="18" cy="8" r="1.8" />
      <path d="M6 6.3v11.4" />
      <path d="M18 9.8c0 3.5-4 4.5-8 5.5" />
    </svg>
  );
}

/** Map role → icon component. */
export function AgentGlyph({ role }: { role: string }) {
  switch (role) {
    case "planner":
      return <PlannerIcon />;
    case "coder":
      return <CoderIcon />;
    case "tester":
      return <TesterIcon />;
    case "reviewer":
      return <ReviewerIcon />;
    case "output":
      return <BranchIcon />;
    default:
      return <BranchIcon />;
  }
}
