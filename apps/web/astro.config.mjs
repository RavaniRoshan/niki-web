import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE } from "@niki/theme/site";

// https://astro.build/config
export default defineConfig({
  site: SITE.web,
  base: "/",
  trailingSlash: "never",
  integrations: [sitemap()],
  vite: {
    resolve: {
      alias: {
        "@niki/theme": new URL("../../packages/niki-theme/", import.meta.url).pathname,
      },
    },
  },
});
