import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ADMIN_KEY = process.env.ADMIN_KEY ?? "ways-admin-2026";
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function checkAuth(req: NextRequest): boolean {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

// GET — liste tous les brouillons
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  if (!fs.existsSync(BLOG_DIR)) {
    return NextResponse.json({ drafts: [] });
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const drafts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      if (!data.draft) return null;
      return {
        slug,
        title: data.title ?? "",
        date: data.date ?? "",
        category: data.category ?? "",
        excerpt: data.excerpt ?? "",
        wordCount: countWords(content),
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => (a!.date < b!.date ? 1 : -1));

  return NextResponse.json({ drafts });
}

// PATCH — publier un brouillon (draft: true → draft: false)
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { slug, action } = await req.json();
  if (!slug || action !== "publish") {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  // Remplacer "draft: true" par "draft: false" dans le frontmatter
  const updated = raw.replace(/^draft:\s*true\s*$/m, "draft: false");
  fs.writeFileSync(filePath, updated, "utf-8");

  return NextResponse.json({ success: true, slug });
}

// DELETE — supprimer un brouillon
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug manquant." }, { status: 400 });

  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  }

  // Vérifier que c'est bien un brouillon avant de supprimer
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  if (!data.draft) {
    return NextResponse.json({ error: "Impossible de supprimer un article publié depuis cette interface." }, { status: 403 });
  }

  fs.unlinkSync(filePath);
  return NextResponse.json({ success: true, slug });
}
