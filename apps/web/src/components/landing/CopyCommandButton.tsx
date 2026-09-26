"use client";

import { useState } from "react";
import styles from "./sections.module.css";

export default function CopyCommandButton({
  command,
  commandElementId,
}: {
  command: string;
  commandElementId: string;
}) {
  const [status, setStatus] = useState("");

  const selectCommand = () => {
    const element = document.getElementById(commandElementId);
    const selection = window.getSelection();
    if (!element || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const copyCommand = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(command);
      setStatus("Copied");
    } catch {
      selectCommand();
      setStatus("Copy failed. Select the command manually.");
    }
  };

  return (
    <>
      <button
        type="button"
        data-testid="copy-command"
        className={styles.commandButton}
        aria-label="Copy install command"
        onClick={() => void copyCommand()}
      >
        Copy
      </button>
      <p
        data-testid="copy-command-status"
        className={styles.commandStatus}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {status}
      </p>
    </>
  );
}
