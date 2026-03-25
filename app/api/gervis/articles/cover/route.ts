import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { checkAdminKey } from "@/lib/admin-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// PUT — mettre à jour cover_image (URL ou upload base64)
export async function PUT(req: NextRequest) {
  if (!checkAdminKey(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { slug, imageUrl, imageBase64, mimeType } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug manquant." }, { status: 400 });

  let finalUrl = imageUrl;

  // Si image uploadée en base64 → upload dans Supabase Storage
  if (imageBase64 && mimeType) {
    const buffer = Buffer.from(imageBase64, "base64");
    const ext = mimeType.includes("png") ? "png" : "jpg";
    const filename = `blog/${slug}-cover.${ext}`;
    const { error } = await supabase.storage.from("images").upload(filename, buffer, {
      contentType: mimeType,
      upsert: true,
    });
    if (error) return NextResponse.json({ error: "Erreur upload." }, { status: 500 });
    const { data } = supabase.storage.from("images").getPublicUrl(filename);
    finalUrl = data.publicUrl;
  }

  if (!finalUrl) return NextResponse.json({ error: "Image manquante." }, { status: 400 });

  // Mettre à jour le frontmatter du fichier MDX
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: "Article introuvable." }, { status: 404 });

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  data.cover_image = finalUrl;

  const newFrontmatter = Object.entries(data)
    .map(([k, v]) => `${k}: ${typeof v === "string" ? `"${v}"` : v}`)
    .join("\n");
  fs.writeFileSync(filePath, `---\n${newFrontmatter}\n---\n${content}`, "utf-8");

  return NextResponse.json({ success: true, coverImage: finalUrl });
}
