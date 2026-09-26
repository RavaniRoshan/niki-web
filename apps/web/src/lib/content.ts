import fs from "node:fs";
import path from "node:path";

/* ---------- Markdown content loading (build-time, zero client cost) ---------- */
export interface Doc {
  slug: string;
  raw: string;
  frontmatter: {
    title: string;
    description: string;
    pubDate: string;
    updated?: string;
    author?: string;
    tags?: string[];
    difficulty?: "beginner" | "intermediate" | "advanced";
    time?: string;
    stack?: string[];
  };
}

function parseFrontmatter(raw: string): Doc {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const body = match ? match[2] : raw;
  const fm: Record<string, string | string[]> = {};
  if (match) {
    for (const line of match[1].split(/\r?\n/)) {
      const kv = line.match(/^(\w[\w-]*):\s*"?(.*?)"?$/);
      if (kv) fm[kv[1]] = kv[2];
    }
    // simple arrays: tags: ["a", "b"]
    for (const line of match[1].split(/\r?\n/)) {
      const arr = line.match(/^(\w[\w-]*):\s*\[(.*)\]$/);
      if (arr) fm[arr[1]] = arr[2].split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
    }
  }
  const str = (key: string): string | undefined => {
    const v = fm[key];
    return typeof v === "string" ? v : undefined;
  };
  const arr = (key: string): string[] | undefined => {
    const v = fm[key];
    return Array.isArray(v) ? v : undefined;
  };
  const difficulty = str("difficulty");
  return {
    slug: "",
    raw: body,
    frontmatter: {
      title: str("title") ?? "Untitled",
      description: str("description") ?? "",
      pubDate: str("pubDate") ?? "",
      updated: str("updated"),
      author: str("author"),
      tags: arr("tags"),
      difficulty:
        difficulty === "beginner" || difficulty === "intermediate" || difficulty === "advanced"
          ? difficulty
          : undefined,
      time: str("time"),
      stack: arr("stack"),
    },
  };
}

const CONTENT_DIRS = {
  blog: path.join(process.cwd(), "src/content/blog"),
  guides: path.join(process.cwd(), "src/content/guides"),
  examples: path.join(process.cwd(), "src/content/examples"),
} as const;

export type Collection = keyof typeof CONTENT_DIRS;

export function getCollection(kind: Collection): Doc[] {
  const dir = CONTENT_DIRS[kind];
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const doc = parseFrontmatter(fs.readFileSync(path.join(dir, f), "utf8"));
      doc.slug = f.replace(/\.md$/, "");
      return doc;
    })
    .sort((a, b) => (a.frontmatter.pubDate < b.frontmatter.pubDate ? 1 : -1));
}

export function getDoc(kind: Collection, slug: string): Doc | undefined {
  return getCollection(kind).find((d) => d.slug === slug);
}

/** Minimal, dependency-free markdown → HTML for the content collections.
 *  Handles the subset used by Niki's blog/guides/examples: headings, lists,
 *  code fences, inline code, bold, italics, links, blockquotes, paragraphs. */
export function renderMarkdown(md: string): string {
  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const blocks: string[] = [];
  const lines = md.split(/\r?\n/);
  let i = 0;
  let listType: "ul" | "ol" | null = null;

  const closeList = () => {
    if (listType) {
      blocks.push(`</${listType}>`);
      listType = null;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // fenced code
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      closeList();
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push(
        `<pre><code class="language-${fence[1] || "text"}">${escapeHtml(code.join("\n"))}</code></pre>`
      );
      continue;
    }

    // heading
    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      closeList();
      const level = Math.min(h[1].length + 0, 4); // h2-h4, h1 is the page title
      const id = h[2]
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      blocks.push(`<h${level} id="${id}">${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // list items
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    if (ul || ol) {
      const want: "ul" | "ol" = ul ? "ul" : "ol";
      if (listType !== want) {
        closeList();
        blocks.push(`<${want}>`);
        listType = want;
      }
      blocks.push(`<li>${inline((ul ?? ol)![1])}</li>`);
      i++;
      continue;
    }

    // blockquote
    const bq = line.match(/^>\s?(.*)$/);
    if (bq) {
      closeList();
      blocks.push(`<blockquote><p>${inline(bq[1])}</p></blockquote>`);
      i++;
      continue;
    }

    // blank
    if (!line.trim()) {
      closeList();
      i++;
      continue;
    }

    // paragraph (gather until blank)
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{2,4}\s|```|>|[-*]\s|\d+\.\s)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    if (para.length) {
      closeList();
      blocks.push(`<p>${inline(para.join(" "))}</p>`);
    }
  }
  closeList();
  return blocks.join("\n");

  function inline(s: string): string {
    let out = escapeHtml(s);
    // links
    out = out.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_m, text, href) => `<a href="${href}">${text}</a>`
    );
    // bold
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // italic
    out = out.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
    // inline code
    out = out.replace(/`([^`]+)`/g, (_m, code) => `<code>${code}</code>`);
    return out;
  }
}
