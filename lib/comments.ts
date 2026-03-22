import fs from "fs";
import path from "path";

export interface Comment {
  id: string;
  slug: string;
  name: string;
  content: string;
  date: string;
  approved: boolean;
}

const COMMENTS_DIR = path.join(process.cwd(), "content", "comments");

function ensureDir() {
  if (!fs.existsSync(COMMENTS_DIR)) {
    fs.mkdirSync(COMMENTS_DIR, { recursive: true });
  }
}

export function getComments(slug: string): Comment[] {
  ensureDir();
  const file = path.join(COMMENTS_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}

export function getApprovedComments(slug: string): Comment[] {
  return getComments(slug).filter((c) => c.approved);
}

export function getAllComments(): Comment[] {
  ensureDir();
  const files = fs.readdirSync(COMMENTS_DIR).filter((f) => f.endsWith(".json"));
  return files.flatMap((f) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(COMMENTS_DIR, f), "utf-8")) as Comment[];
    } catch {
      return [];
    }
  });
}

export function addComment(
  slug: string,
  data: { name: string; content: string }
): Comment {
  ensureDir();
  const comments = getComments(slug);
  const comment: Comment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    slug,
    name: data.name.trim(),
    content: data.content.trim(),
    date: new Date().toISOString(),
    approved: false,
  };
  comments.push(comment);
  fs.writeFileSync(
    path.join(COMMENTS_DIR, `${slug}.json`),
    JSON.stringify(comments, null, 2)
  );
  return comment;
}

export function updateComment(
  slug: string,
  id: string,
  approved: boolean
): boolean {
  const comments = getComments(slug);
  const idx = comments.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  comments[idx].approved = approved;
  fs.writeFileSync(
    path.join(COMMENTS_DIR, `${slug}.json`),
    JSON.stringify(comments, null, 2)
  );
  return true;
}

export function deleteComment(slug: string, id: string): boolean {
  const comments = getComments(slug);
  const filtered = comments.filter((c) => c.id !== id);
  if (filtered.length === comments.length) return false;
  fs.writeFileSync(
    path.join(COMMENTS_DIR, `${slug}.json`),
    JSON.stringify(filtered, null, 2)
  );
  return true;
}
