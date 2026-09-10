/**
 * Generates sitemap.xml in out/ from the static export's route list.
 * Runs as `postbuild` — after `next build` writes out/.
 */
import fs from "node:fs";
import path from "node:path";

const site = (process.env.NIKI_WEB_URL || "https://niki.dev").replace(/\/$/, "");
const outDir = path.join(process.cwd(), "out");

const routes = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/product", priority: "0.9", changefreq: "weekly" },
  { loc: "/product/agents", priority: "0.9", changefreq: "weekly" },
  { loc: "/product/security", priority: "0.9", changefreq: "weekly" },
  { loc: "/product/integrations", priority: "0.9", changefreq: "weekly" },
  { loc: "/downloads", priority: "0.8", changefreq: "weekly" },
  { loc: "/resources", priority: "0.7", changefreq: "weekly" },
  { loc: "/resources/blog", priority: "0.7", changefreq: "weekly" },
  { loc: "/resources/changelog", priority: "0.7", changefreq: "weekly" },
  { loc: "/resources/guides", priority: "0.7", changefreq: "weekly" },
  { loc: "/resources/examples", priority: "0.7", changefreq: "weekly" },
  { loc: "/pricing", priority: "0.8", changefreq: "monthly" },
  { loc: "/community", priority: "0.6", changefreq: "monthly" },
  { loc: "/about", priority: "0.6", changefreq: "monthly" },
];

// Add any prerendered [slug] routes found in out/ (flat .html files or index.html dirs)
const slugRoots = ["resources/blog", "resources/guides", "resources/examples"];
for (const root of slugRoots) {
  const dir = path.join(outDir, root);
  if (!fs.existsSync(dir)) continue;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (fs.existsSync(path.join(dir, entry.name, "index.html"))) {
        routes.push({ loc: `/${root}/${entry.name}`, priority: "0.6", changefreq: "monthly" });
      }
    } else if (entry.name.endsWith(".html") && entry.name !== "index.html") {
      routes.push({
        loc: `/${root}/${entry.name.replace(/\.html$/, "")}`,
        priority: "0.6",
        changefreq: "monthly",
      });
    }
  }
}

const today = new Date().toISOString().split("T")[0];
const urls = routes
  .map(
    (r) =>
      `  <url>\n    <loc>${site}${r.loc === "/" ? "/" : r.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);
fs.writeFileSync(
  path.join(outDir, "sitemap-index.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${site}/sitemap.xml</loc>\n  </sitemap>\n</sitemapindex>\n`
);
console.log(`sitemap.xml written: ${routes.length} URLs`);
