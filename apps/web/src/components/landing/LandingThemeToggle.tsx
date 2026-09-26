"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./landing-shell.module.css";

type Theme = "dark" | "light";

export default function LandingThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const readTheme = () => {
      setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
    };

    setMounted(true);
    readTheme();

    const observer = new MutationObserver(readTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const nextTheme: Theme = theme === "light" ? "dark" : "light";

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle("light", nextTheme === "light");
    setTheme(nextTheme);

    try {
      localStorage.setItem("niki-theme", nextTheme);
    } catch {
      return;
    }
  };

  return (
    <span className={styles.themeSlot} data-testid="landing-theme-toggle">
      {mounted ? (
        <button
          type="button"
          className={styles.themeButton}
          data-testid="theme-toggle"
          aria-label={`Switch to ${nextTheme} mode`}
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Moon size={18} strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <Sun size={18} strokeWidth={1.8} aria-hidden="true" />
          )}
        </button>
      ) : (
        <span className={styles.themePlaceholder} aria-hidden="true" />
      )}
    </span>
  );
}
