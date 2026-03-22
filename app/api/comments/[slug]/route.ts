import { NextRequest, NextResponse } from "next/server";
import { getApprovedComments, addComment } from "@/lib/comments";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const comments = getApprovedComments(slug);
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    const body = await req.json();
    const { name, content } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Nom invalide." }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.trim().length < 10) {
      return NextResponse.json({ error: "Le commentaire doit faire au moins 10 caractères." }, { status: 400 });
    }
    if (name.trim().length > 80 || content.trim().length > 2000) {
      return NextResponse.json({ error: "Contenu trop long." }, { status: 400 });
    }

    addComment(slug, { name, content });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
