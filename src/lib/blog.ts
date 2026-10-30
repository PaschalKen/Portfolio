import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";

// Posts are src/content/posts/<slug>.mdx, each starting with a front-matter block:
//
//   ---
//   title: My first post
//   date: 2026-11-02
//   summary: One line for listings (optional)
//   draft: true            (optional; drafts are never listed)
//   ---
//
// Adding a file is all it takes: the Now page's Blog tile picks up the newest one on the next deploy.
const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

export type PostMeta = { slug: string; title: string; date: string; summary?: string; readingMinutes: number };

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---/;
const WORDS_PER_MINUTE = 220;

function readingMinutes(source: string) {
  const words = source.replace(FRONT_MATTER, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function parseFrontMatter(source: string): Record<string, string> {
  const block = source.match(FRONT_MATTER)?.[1];
  if (!block) return {};
  const fields: Record<string, string> = {};
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) fields[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return fields;
}

/** Published posts, newest first. Files only change on deploy, so this is computed once per build. */
export async function getPosts(): Promise<PostMeta[]> {
  "use cache";
  cacheLife("max");

  let files: string[];
  try {
    files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith(".mdx"));
  } catch {
    return []; // No posts folder yet.
  }

  const posts: PostMeta[] = [];
  for (const file of files) {
    const source = await readFile(path.join(POSTS_DIR, file), "utf8");
    const fields = parseFrontMatter(source);
    if (!fields.title || !/^\d{4}-\d{2}-\d{2}$/.test(fields.date ?? "") || fields.draft === "true") continue;
    posts.push({
      slug: file.replace(/\.mdx$/, ""),
      title: fields.title,
      date: fields.date,
      summary: fields.summary,
      readingMinutes: readingMinutes(source),
    });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getLatestPost() {
  return (await getPosts())[0] ?? null;
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}
