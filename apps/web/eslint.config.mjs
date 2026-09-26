import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

/* The repo had no lint configuration at all, and `next lint` is deprecated in
 * Next 15, so nothing was checking these files. This is the flat-config
 * equivalent, pinned to the Next version the app actually uses. */
const config = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // The landing uses this on a scroll container to keep the hero on screen;
      // the intent is legible, so the suppression is deliberate.
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
