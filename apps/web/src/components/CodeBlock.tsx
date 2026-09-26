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
    <div className="illustration-frame-lg border border-gray-2 bg-background shadow-halo-xl shadow-black/5">
      <div className="illustration-frame-inner overflow-hidden border border-gray-3 bg-gray-1">
        {label && (
          <div className="flex h-9 items-center justify-between border-b border-gray-3 px-3 font-mono text-xs text-gray-10">
            <span>{label}</span>
            <CopyButton text={code} />
          </div>
        )}
        <pre className="overflow-x-auto px-4 py-3 font-mono text-xs-plus leading-6 text-gray-12">
          <code className={lang ? `language-${lang}` : undefined}>{code}</code>
        </pre>
        {!label && (
          <div className="flex justify-end border-t border-gray-3 px-3 py-1.5">
            <CopyButton text={code} />
          </div>
        )}
      </div>
    </div>
  );
}
