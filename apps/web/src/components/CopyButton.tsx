"use client";

import { useState, type ReactNode } from "react";

export default function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);

  const onClick = () => {
    const finish = () => {
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(finish, finish);
    } else {
      finish();
    }
  };

  return (
    <button
      type="button"
      className={`nx-copy ${done ? "nx-copy--done" : ""}`}
      onClick={onClick}
      aria-label={done ? "Copied" : label}
      title={label}
      data-copy-target
    >
      {done ? (
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M2.5 8.5 6 12 13.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M4.5 4.5V3a1 1 0 0 1 1-1H13a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1h-1.5M3 5.5h7.5a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
