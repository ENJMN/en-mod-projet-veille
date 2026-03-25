import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  category: string;
  draft: boolean;
  cover_image: string | null;
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title ?? "",
      date: data.date ?? "",
      author: data.author ?? "",
      excerpt: data.excerpt ?? "",
      category: data.category ?? "",
      draft: data.draft === true,
      cover_image: data.cover_image ?? null,
      content,
    } as BlogPost;
  });

  // Exclure les brouillons du listing public
  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    author: data.author ?? "",
    excerpt: data.excerpt ?? "",
    category: data.category ?? "",
    draft: data.draft === true,
    cover_image: data.cover_image ?? null,
    content,
  };
}

export function getAllDrafts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? "",
        date: data.date ?? "",
        author: data.author ?? "",
        excerpt: data.excerpt ?? "",
        category: data.category ?? "",
        draft: data.draft === true,
        cover_image: data.cover_image ?? null,
        content,
      } as BlogPost;
    })
    .filter((p) => p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
