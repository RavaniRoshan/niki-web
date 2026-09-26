/**
 * GitHub-Pages-style static server for local preview:
 * - clean URLs resolve to <path>/index.html
 * - .html extensionless paths resolve to <path>.html
 * - 404s serve out/404.html
 * Usage: node scripts/static-server.mjs out 4321
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "out");
const port = Number(process.argv[3] || 4321);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
    const isRsc = req.headers["rsc"] !== undefined || urlPath.endsWith(".txt");
    // RSC prefetches append .txt to the route — strip it to resolve the real page
    if (urlPath.endsWith(".txt") && !fs.existsSync(path.join(root, urlPath.slice(1)))) {
      urlPath = urlPath.slice(0, -4);
    }
    if (urlPath.endsWith("/")) urlPath = urlPath.slice(0, -1);
    if (urlPath === "") urlPath = "/";

    const candidates = isRsc
      ? urlPath === "/"
        ? ["index.txt", "index.html"]
        : [
            `${urlPath}/index.txt`,
            `${urlPath}.txt`,
            urlPath.slice(1),
            `${urlPath}/index.html`,
            `${urlPath}.html`,
          ]
      : urlPath === "/"
        ? ["index.html"]
        : [
            `${urlPath}/index.html`,
            `${urlPath}.html`,
            urlPath.slice(1),
            `${urlPath}/index.txt`,
            `${urlPath}.txt`,
          ];

    for (const cand of candidates) {
      const file = path.join(root, cand);
      if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        const ext = path.extname(file);
        const body = fs.readFileSync(file);
        res.writeHead(200, {
          "Content-Type": MIME[ext] ?? "application/octet-stream",
          "Content-Length": body.length,
          "Cache-Control": "no-store",
          ...(isRsc ? { "X-Nextjs-Rsc": "1" } : {}),
        });
        res.end(body);
        return;
      }
    }

    // 404 page
    const nf = path.join(root, "404.html");
    if (fs.existsSync(nf)) {
      const body = fs.readFileSync(nf);
      res.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(body);
      return;
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404");
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`static server: http://localhost:${port} serving ${root}`);
});
