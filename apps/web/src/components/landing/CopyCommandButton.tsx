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
  const [attempt, setAttempt] = useState(0);

  /* Keyed separately from the text, so a second copy replays the entrance even
     though the message is identical. Keying on the string alone would leave the
     span mounted and silent the second time. */
  const announce = (message: string) => {
    setStatus(message);
    setAttempt((count) => count + 1);
  };

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
      announce("Copied");
    } catch {
      selectCommand();
      announce("Copy failed. Select the command manually.");
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
        {/* The span animates, not the live region: fading the region itself
            would start the announcement while the text was still transparent. */}
        {status ? (
          <span key={attempt} className={styles.commandStatusText}>
            {status}
          </span>
        ) : null}
      </p>
    </>
  );
}
