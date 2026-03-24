import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

import { checkAdminKey } from "@/lib/admin-auth";

// GET — liste toutes les formations
export async function GET(request: NextRequest) {
  if (!checkAdminKey(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("formations")
    .select("id, slug, title, category, level, price_xof, is_published, is_featured, lessons_count, duration_hours, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — créer une formation
export async function POST(request: NextRequest) {
  if (!checkAdminKey(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const supabase = await createClient();

  // Générer le slug depuis le titre
  const slug = body.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const { data, error } = await supabase
    .from("formations")
    .insert({
      slug,
      title: body.title,
      description: body.description ?? null,
      category: body.category,
      level: body.level ?? "Débutant",
      price_xof: body.price_xof ?? 0,
      duration_hours: body.duration_hours ?? 0,
      lessons_count: body.lessons_count ?? 0,
      instructor_name: body.instructor_name ?? "N'Guessan Jacques EBAKA",
      objectives: body.objectives ?? [],
      requirements: body.requirements ?? [],
      is_published: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH — modifier une formation
export async function PATCH(request: NextRequest) {
  if (!checkAdminKey(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("formations")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — supprimer une formation
export async function DELETE(request: NextRequest) {
  if (!checkAdminKey(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const supabase = await createClient();
  const { error } = await supabase.from("formations").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
