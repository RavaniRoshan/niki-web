import type { ReactNode } from "react";

/** Axiom dark terminal mock. Same exports as before. */
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
    <figure
      className={`illustration-frame-lg border border-gray-2 bg-background shadow-halo-xl shadow-black/5 ${className ?? ""}`}
    >
      <div className="illustration-frame-inner overflow-hidden border border-gray-3 bg-gray-1">
        <div className="flex h-10 items-center gap-2 border-b border-gray-3 px-3 font-mono text-xs text-gray-10">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-gray-12">{title}</span>
        </div>
        <div className="overflow-x-auto px-4 py-3 font-mono text-xs-plus leading-6 text-gray-12">
          <pre className="whitespace-pre-wrap break-words">{children}</pre>
        </div>
      </div>
    </figure>
  );
}

const tones: Record<string, string> = {
  dim: "text-gray-10",
  mint: "text-green",
  mag: "text-orange-11",
  warn: "text-yellow",
  ok: "text-green",
  red: "text-rose-500",
  white: "text-foreground",
};

export function T({ children, tone }: { children: ReactNode; tone?: keyof typeof tones }) {
  return <span className={tone ? tones[tone] : undefined}>{children}</span>;
}
