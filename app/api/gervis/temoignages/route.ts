import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAdminKey } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!checkAdminKey(request)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("temoignages").select("*").order("ordre");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!checkAdminKey(request)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("temoignages").insert({
    prenom: body.prenom,
    role: body.role ?? null,
    entreprise: body.entreprise ?? null,
    citation: body.citation,
    is_published: body.is_published ?? true,
    ordre: body.ordre ?? 0,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!checkAdminKey(request)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("temoignages").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  if (!checkAdminKey(request)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  const supabase = createAdminClient();
  const { error } = await supabase.from("temoignages").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
