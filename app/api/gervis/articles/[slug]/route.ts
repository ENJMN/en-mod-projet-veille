import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { checkAdminKey } from "@/lib/admin-auth";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!checkAdminKey(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { slug } = await params;
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: "Article introuvable." }, { status: 404 });

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return NextResponse.json({
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    author: data.author ?? "",
    excerpt: data.excerpt ?? "",
    category: data.category ?? "",
    draft: data.draft === true,
    cover_image: data.cover_image ?? null,
    content,
  });
}
