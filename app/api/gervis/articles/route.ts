import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { checkAdminKey } from "@/lib/admin-auth";
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function checkAuth(req: NextRequest): boolean {
  return checkAdminKey(req);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

// GET — liste brouillons et publiés
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  if (!fs.existsSync(BLOG_DIR)) {
    return NextResponse.json({ drafts: [], published: [] });
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const drafts: object[] = [];
  const published: object[] = [];

  for (const filename of files) {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    const item = {
      slug,
      title: data.title ?? "",
      date: data.date ?? "",
      category: data.category ?? "",
      excerpt: data.excerpt ?? "",
      wordCount: countWords(content),
      cover_image: data.cover_image ?? null,
    };
    if (data.draft) drafts.push(item);
    else published.push(item);
  }

  const byDate = (a: any, b: any) => (a.date < b.date ? 1 : -1);
  return NextResponse.json({ drafts: drafts.sort(byDate), published: published.sort(byDate) });
}

// PATCH — publier ou dépublier
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { slug, action } = await req.json();
  if (!slug || !["publish", "unpublish"].includes(action)) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  data.draft = action === "publish" ? false : true;
  // Réécriture propre du frontmatter via gray-matter
  const updated = matter.stringify(content, data);
  fs.writeFileSync(filePath, updated, "utf-8");

  return NextResponse.json({ success: true, slug });
}

// DELETE — supprimer brouillon ou publié
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug manquant." }, { status: 400 });

  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  }

  fs.unlinkSync(filePath);
  return NextResponse.json({ success: true, slug });
}
