import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, getIP } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL ?? "contact@ways-ci.com";

export async function POST(req: NextRequest) {
  const { allowed } = rateLimit(getIP(req), { max: 5, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez dans une minute." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { nom, email, telephone, bu, typeDemande, sujet, budget, source, message } = body;

    if (!nom || !email || !sujet || !bu || !message) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0A2342; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Nouveau message — WAYS Digital Solutions</h1>
        </div>
        <div style="background: #f8f9fa; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 160px;">Nom</td><td style="padding: 8px 0; font-weight: bold; color: #0A2342;">${nom}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #E8861A;">${email}</a></td></tr>
            ${telephone ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Téléphone</td><td style="padding: 8px 0; color: #0A2342;">${telephone}</td></tr>` : ""}
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Service</td><td style="padding: 8px 0; color: #0A2342;">${bu}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Type de demande</td><td style="padding: 8px 0; color: #0A2342;">${typeDemande}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Sujet</td><td style="padding: 8px 0; color: #0A2342;">${sujet}</td></tr>
            ${budget ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Budget estimé</td><td style="padding: 8px 0; color: #0A2342;">${budget}</td></tr>` : ""}
            ${source ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Connu via</td><td style="padding: 8px 0; color: #0A2342;">${source}</td></tr>` : ""}
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">Message</p>
          <p style="color: #1f2937; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 11px; margin-top: 16px;">WAYS Digital Solutions — ways-ci.com</p>
      </div>
    `;

    await resend.emails.send({
      from: "WAYS Site Web <onboarding@resend.dev>",
      to: [TO_EMAIL],
      replyTo: email,
      subject: `[WAYS] ${sujet} — ${bu}`,
      html,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Erreur lors de l'envoi. Réessayez." }, { status: 500 });
  }
}
