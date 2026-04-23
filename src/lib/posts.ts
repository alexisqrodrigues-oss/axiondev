import matter from "gray-matter";

export interface Post {
  slug: string;          // exactly the directory name, eg "2026-04-15_exemplo-de-post-1"
  title: string;         // from frontmatter or derived from slug
  date: string;          // ISO
  dateLabel: string;     // human label
  category?: string;
  tags: string[];
  excerpt: string;
  content: string;       // raw markdown body
  lang: "pt" | "en" | "all";
  readingMinutes: number;
  assetsBase: string;    // url base for ./assets/* references
}

// Buffer polyfill for gray-matter in browser
if (typeof window !== "undefined" && !(window as unknown as { Buffer?: unknown }).Buffer) {
  (window as unknown as { Buffer: { from: (s: string) => { toString: () => string } } }).Buffer = {
    from: (s: string) => ({ toString: () => s }),
  };
}

// Eagerly load all README.md files inside src/content/posts/<dir>/
const mdModules = import.meta.glob("/src/content/posts/*/README.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

// Eagerly load assets so Vite hashes them and gives us URLs
const assetModules = import.meta.glob(
  "/src/content/posts/*/assets/**/*.{png,jpg,jpeg,gif,svg,webp,mp4,webm}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

function deriveTitle(slug: string): string {
  // strip leading date "YYYY-MM-DD[_-]"
  const stripped = slug.replace(/^\d{4}-\d{2}-\d{2}[-_]/, "");
  return stripped.replace(/[-_]/g, " ");
}

function extractDate(slug: string): string {
  const m = slug.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : new Date().toISOString().slice(0, 10);
}

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function buildExcerpt(text: string, max = 180): string {
  const stripped = text
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/[#>*_\-\[\]()!]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length > max ? stripped.slice(0, max).trimEnd() + "…" : stripped;
}

const posts: Post[] = Object.entries(mdModules)
  .map(([path, raw]) => {
    // path = /src/content/posts/<slug>/README.md
    const slug = path.split("/").slice(-2, -1)[0];
    const parsed = matter(raw);
    const data = parsed.data as Record<string, unknown>;
    const title = (data.title as string) || deriveTitle(slug);
    const date = (data.date as string) || extractDate(slug);
    const lang = (data.lang as Post["lang"]) || "all";
    const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
    const category = data.category as string | undefined;
    // strip a leading H1 from the body — the page header already renders the title,
    // and we don't want it to appear twice in the rendered post.
    const content = parsed.content.replace(/^\s*#\s+.+\n+/, "");
    const assetsBase = `/src/content/posts/${slug}/assets/`;

    return {
      slug,
      title,
      date,
      dateLabel: date,
      category,
      tags,
      excerpt: (data.excerpt as string) || buildExcerpt(content),
      content,
      lang,
      readingMinutes: readingTime(content),
      assetsBase,
    } as Post;
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function resolveAssetUrl(post: Post, src: string): string {
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
  // remove leading ./ or assets/
  const cleaned = src.replace(/^\.\//, "").replace(/^assets\//, "");
  const fullPath = `/src/content/posts/${post.slug}/assets/${cleaned}`;
  return assetModules[fullPath] || src;
}
