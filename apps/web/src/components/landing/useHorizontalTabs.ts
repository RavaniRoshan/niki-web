"use client";

import { useEffect, useState } from "react";

export function useHorizontalTabs(query = "(max-width: 1023px)"): boolean {
  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const sync = () => setHorizontal(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, [query]);

  return horizontal;
}
