import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { CertificateDocument } from "@/lib/certificate";
import type { Database } from "@/lib/supabase/types";

type Certificat = Database["public"]["Tables"]["certificats"]["Row"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const formationId = searchParams.get("formation");

  if (!formationId) {
    return NextResponse.json({ error: "formation requis" }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérifier progression 100%
  const { data: progress } = await supabase
    .from("formation_progress")
    .select("progress_percent")
    .eq("user_id", user.id)
    .eq("formation_id", formationId)
    .single();

  if (!progress || (progress.progress_percent ?? 0) < 100) {
    return NextResponse.json(
      { error: "Formation non complétée" },
      { status: 403 }
    );
  }

  // Récupérer infos formation
  const { data: formation } = await supabase
    .from("formations")
    .select("title, instructor_name")
    .eq("id", formationId)
    .single();

  if (!formation) {
    return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
  }

  // Récupérer ou créer le certificat
  let { data: certificat } = await supabase
    .from("certificats")
    .select("*")
    .eq("user_id", user.id)
    .eq("formation_id", formationId)
    .single() as { data: Certificat | null; error: unknown };

  if (!certificat) {
    const certNumber = `WAYS-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const { data: newCert } = await supabase
      .from("certificats")
      .insert({
        user_id: user.id,
        formation_id: formationId,
        certificate_number: certNumber,
      })
      .select()
      .single() as { data: Certificat | null; error: unknown };
    certificat = newCert;
  }

  if (!certificat) {
    return NextResponse.json({ error: "Erreur création certificat" }, { status: 500 });
  }

  // Récupérer nom de l'étudiant
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const studentName = profile?.full_name ?? user.email ?? "Apprenant";
  const completionDate = new Date(certificat.issued_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Générer le PDF
  const element = CertificateDocument({
    studentName,
    formationTitle: formation.title,
    instructorName: formation.instructor_name,
    completionDate,
    certificateNumber: certificat.certificate_number,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBuffer: Buffer = await renderToBuffer(element as unknown as ReactElement<any>);

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificat-ways-${formationId.slice(0, 8)}.pdf"`,
    },
  });
}
