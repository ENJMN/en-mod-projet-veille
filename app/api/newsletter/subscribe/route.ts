import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import { Database } from "@/lib/supabase/types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ways-ci.com";

export async function POST(req: NextRequest) {
  const { email, nom } = await req.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  const token = randomBytes(32).toString("hex");

  const { error } = await supabase.from("abonnes").upsert(
    { email: email.toLowerCase(), nom: nom ?? null, confirmation_token: token, confirmed: false },
    { onConflict: "email" }
  );

  if (error) return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });

  const confirmUrl = `${BASE_URL}/api/newsletter/confirm?token=${token}`;

  await resend.emails.send({
    from: "WAYS Digital Solutions <no-reply@ways-ci.com>",
    to: email,
    subject: "Confirmez votre inscription à la newsletter WAYS",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
        <img src="${BASE_URL}/logo-full.png" alt="WAYS" style="height:40px;margin-bottom:24px"/>
        <h2 style="color:#0A2342;margin-bottom:8px">Bienvenue${nom ? ` ${nom}` : ""} !</h2>
        <p style="color:#4B5563;line-height:1.6">Merci de votre intérêt pour les contenus WAYS Digital Solutions. Cliquez sur le bouton ci-dessous pour confirmer votre inscription et recevoir nos articles.</p>
        <a href="${confirmUrl}" style="display:inline-block;margin:24px 0;padding:12px 28px;background:#E8861A;color:#fff;font-weight:700;border-radius:8px;text-decoration:none">Confirmer mon inscription</a>
        <p style="color:#9CA3AF;font-size:12px">Si vous n'avez pas demandé cette inscription, ignorez cet email.</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
