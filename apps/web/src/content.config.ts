import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default("Niki contributors"),
    tags: z.array(z.string()).default([]),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updated: z.coerce.date().optional(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    time: z.string().optional(),
  }),
});

const examples = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/examples" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    stack: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, guides, examples };
