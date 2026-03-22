import { NextRequest, NextResponse } from "next/server";
import { getAllComments, updateComment, deleteComment } from "@/lib/comments";

function checkAuth(req: NextRequest): boolean {
  const key = req.headers.get("x-admin-key");
  const adminKey = process.env.ADMIN_KEY ?? "ways-admin-2026";
  return key === adminKey;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const comments = getAllComments().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return NextResponse.json(comments);
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const { slug, id, approved } = await req.json();
    if (!slug || !id || typeof approved !== "boolean") {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }
    const ok = updateComment(slug, id, approved);
    return ok
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: "Commentaire introuvable." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const { slug, id } = await req.json();
    if (!slug || !id) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }
    const ok = deleteComment(slug, id);
    return ok
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: "Commentaire introuvable." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
