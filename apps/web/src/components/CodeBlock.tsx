import CopyButton from "./CopyButton";

export default function CodeBlock({
  label,
  code,
  lang,
}: {
  label?: string;
  code: string;
  lang?: string;
}) {
  return (
    <div className="nx-code">
      {label && (
        <div className="nx-code__label">
          <span>{label}</span>
          <CopyButton text={code} />
        </div>
      )}
      <pre className="nx-code__body">
        <code className={lang ? `language-${lang}` : undefined}>{code}</code>
      </pre>
      {!label && (
        <div
          className="nx-code__label"
          style={{ borderTop: "1px solid var(--nk-surface-border)", borderBottom: "none" }}
        >
          <CopyButton text={code} />
        </div>
      )}
    </div>
  );
}
