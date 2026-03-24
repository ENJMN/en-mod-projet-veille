import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

import { checkAdminKey } from "@/lib/admin-auth";

// GET — liste tous les terrains
export async function GET(request: NextRequest) {
  if (!checkAdminKey(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("terrains")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — créer un terrain
export async function POST(request: NextRequest) {
  if (!checkAdminKey(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("terrains")
    .insert({
      titre: body.titre,
      zone: body.zone,
      commune: body.commune,
      localisation: body.localisation,
      surface: Number(body.surface),
      prix: Number(body.prix),
      prix_negociable: body.prix_negociable ?? false,
      description: body.description ?? null,
      notes_libres: body.notes_libres ?? null,
      titre_propriete: body.titre_propriete,
      type_zone: body.type_zone,
      viabilisation: body.viabilisation ?? [],
      caracteristiques: body.caracteristiques ?? [],
      images: body.images ?? [],
      gps: body.gps ?? null,
      disponible: true,
      statut: body.statut ?? "disponible",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH — modifier un terrain
export async function PATCH(request: NextRequest) {
  if (!checkAdminKey(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("terrains")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — retirer un terrain (soft delete)
export async function DELETE(request: NextRequest) {
  if (!checkAdminKey(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("terrains")
    .update({ disponible: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
