"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WEB_ROUTES, DOCS_ROUTES, docsUrl, SITE } from "@/lib/site";
import { LogoMark } from "./LogoMark";

const productItems = [
  { label: "Overview", href: WEB_ROUTES.product },
  { label: "Multi-Agent Pipeline", href: WEB_ROUTES.agents },
  { label: "Security & Sandboxing", href: WEB_ROUTES.security },
  { label: "Integrations", href: WEB_ROUTES.integrations },
];

const resourceItems = [
  { label: "Blog", href: WEB_ROUTES.blog },
  { label: "Changelog", href: WEB_ROUTES.changelog },
  { label: "Guides", href: WEB_ROUTES.guides },
  { label: "Examples", href: WEB_ROUTES.examples },
];

function BrandMark({ size = 24 }: { size?: number }) {
  return <LogoMark size={size} />;
}

function Dropdown({
  label,
  href,
  items,
  active,
}: {
  label: string;
  href: string;
  items: { label: string; href: string }[];
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      className="nx-nav-item"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={href}
        className="nx-nav-link"
        aria-current={active ? "page" : undefined}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        {label}
        <svg className="nx-nav-caret" width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </Link>
      {open && (
        <div className="nx-dropdown" role="menu">
          {items.map((item) => (
            <Link key={item.href} role="menuitem" href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header({ currentPath = "/" }: { currentPath?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="nx-header">
      <div className="nx-header__bar">
        <Link className="nx-header__brand" href={WEB_ROUTES.home} aria-label="Niki home">
          <BrandMark />
          <span className="nx-header__brand-text">niki</span>
        </Link>

        <nav className="nx-header__nav" aria-label="Primary">
          <Dropdown
            label="Product"
            href={WEB_ROUTES.product}
            items={productItems}
            active={currentPath.startsWith("/product")}
          />
          <a href={docsUrl(DOCS_ROUTES.home)} className="nx-nav-link">
            Docs
          </a>
          <Link
            href={WEB_ROUTES.downloads}
            className="nx-nav-link"
            aria-current={currentPath === "/downloads" ? "page" : undefined}
          >
            Downloads
          </Link>
          <Dropdown
            label="Resources"
            href={WEB_ROUTES.resources}
            items={resourceItems}
            active={currentPath.startsWith("/resources")}
          />
          <Link
            href={WEB_ROUTES.pricing}
            className="nx-nav-link"
            aria-current={currentPath === "/pricing" ? "page" : undefined}
          >
            Pricing
          </Link>
        </nav>

        <div className="nx-header__right">
          <a
            className="nx-nav-link nx-nav-link--gh"
            href={SITE.repo}
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <Link
            className="nx-btn nx-btn--primary nx-btn--sm nx-header__cta"
            href={WEB_ROUTES.downloads}
          >
            Get Started
          </Link>
          <button
            type="button"
            className="nx-burger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="nx-mobile-nav"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div id="nx-mobile-nav" className={`nx-mobile ${mobileOpen ? "nx-mobile--open" : ""}`}>
        <nav className="nx-mobile__inner" aria-label="Mobile">
          <p className="nx-mobile__label">Product</p>
          {productItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="nx-mobile__link"
            >
              {item.label}
            </Link>
          ))}
          <p className="nx-mobile__label">Resources</p>
          {resourceItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="nx-mobile__link"
            >
              {item.label}
            </Link>
          ))}
          <p className="nx-mobile__label">Site</p>
          <a href={docsUrl(DOCS_ROUTES.home)} className="nx-mobile__link">
            Docs
          </a>
          <Link
            href={WEB_ROUTES.downloads}
            onClick={() => setMobileOpen(false)}
            className="nx-mobile__link"
          >
            Downloads
          </Link>
          <Link
            href={WEB_ROUTES.pricing}
            onClick={() => setMobileOpen(false)}
            className="nx-mobile__link"
          >
            Pricing
          </Link>
          <Link
            href={WEB_ROUTES.community}
            onClick={() => setMobileOpen(false)}
            className="nx-mobile__link"
          >
            Community
          </Link>
          <Link
            href={WEB_ROUTES.about}
            onClick={() => setMobileOpen(false)}
            className="nx-mobile__link"
          >
            About
          </Link>
          <div className="nx-mobile__actions">
            <a
              className="nx-btn nx-btn--primary"
              href={SITE.repo}
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            <Link
              className="nx-btn nx-btn--ghost"
              href={WEB_ROUTES.downloads}
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
