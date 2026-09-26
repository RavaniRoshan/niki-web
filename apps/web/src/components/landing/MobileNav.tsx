"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import shellStyles from "./landing-shell.module.css";
import interactiveStyles from "./interactive.module.css";
import { WEB_ROUTES } from "@/lib/site";

export type LandingLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const MOBILE_NAV_DIALOG_ID = "mobile-nav-dialog";

function isExternal(link: LandingLink): link is LandingLink & { external: true } {
  return "external" in link && link.external === true;
}

export default function MobileNav({ links }: { links: readonly LandingLink[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) {
      dialog.showModal();
    }
    setIsOpen(true);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
  };

  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    const dialog = event.currentTarget;
    const bounds = dialog.getBoundingClientRect();
    const isInsideDialog =
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom;

    if (!isInsideDialog) {
      closeMenu();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={shellStyles.mobileTrigger}
        data-testid="mobile-nav-trigger"
        aria-controls={MOBILE_NAV_DIALOG_ID}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Open navigation"
        onClick={() => {
          if (!isOpen) {
            openMenu();
          }
        }}
      >
        <span className={shellStyles.menuIcon} aria-hidden="true">
          <span />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        id={MOBILE_NAV_DIALOG_ID}
        className={interactiveStyles.dialog}
        data-testid="mobile-nav-dialog"
        aria-label="Mobile navigation"
        onClick={handleDialogClick}
        onClose={handleClose}
      >
        <div className={interactiveStyles.dialogPanel} role="group" aria-label="Mobile navigation">
          <div className={interactiveStyles.dialogHeader}>
            <p className={interactiveStyles.dialogTitle}>Navigate</p>
            <button
              ref={closeButtonRef}
              type="button"
              className={interactiveStyles.dialogClose}
              data-testid="mobile-nav-close"
              aria-label="Close navigation"
              onClick={closeMenu}
            >
              <span className={interactiveStyles.closeIcon} aria-hidden="true" />
            </button>
          </div>
          <ul className={interactiveStyles.dialogLinks}>
            {links.map((link) => {
              const linkProps = {
                className: interactiveStyles.dialogLink,
                onClick: closeMenu,
              };

              return (
                <li key={link.label}>
                  {isExternal(link) ? (
                    <a {...linkProps} href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link {...linkProps} href={link.href}>
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <Link
            className={interactiveStyles.dialogCta}
            href={WEB_ROUTES.downloads}
            onClick={closeMenu}
          >
            Install Niki
          </Link>
        </div>
      </dialog>
    </>
  );
}
