import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { checkAdminKey } from "@/lib/admin-auth";
import { Database } from "@/lib/supabase/types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ways-ci.com";

export async function POST(req: NextRequest) {
  if (!checkAdminKey(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { slug, title, excerpt, category } = await req.json();
  if (!slug || !title) return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });

  const { data: abonnes } = await supabase
    .from("abonnes")
    .select("email, nom")
    .eq("confirmed", true)
    .is("unsubscribed_at", null);

  if (!abonnes || abonnes.length === 0) {
    return NextResponse.json({ success: true, sent: 0 });
  }

  const articleUrl = `${BASE_URL}/blog/${slug}`;
  let sent = 0;

  for (const abonne of abonnes) {
    const unsubUrl = `${BASE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(abonne.email)}`;
    await resend.emails.send({
      from: "WAYS Digital Solutions <no-reply@ways-ci.com>",
      to: abonne.email,
      subject: `[WAYS] ${title}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
          <img src="${BASE_URL}/logo-full.png" alt="WAYS" style="height:40px;margin-bottom:24px"/>
          <p style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">${category}</p>
          <h2 style="color:#0A2342;margin-bottom:12px;line-height:1.3">${title}</h2>
          ${excerpt ? `<p style="color:#4B5563;line-height:1.6;margin-bottom:24px">${excerpt}</p>` : ""}
          <a href="${articleUrl}" style="display:inline-block;padding:12px 28px;background:#E8861A;color:#fff;font-weight:700;border-radius:8px;text-decoration:none">Lire l'article</a>
          <hr style="border:none;border-top:1px solid #E5E7EB;margin:32px 0"/>
          <p style="color:#9CA3AF;font-size:11px">Vous recevez cet email car vous êtes abonné(e) à la newsletter WAYS Digital Solutions. <a href="${unsubUrl}" style="color:#9CA3AF">Se désabonner</a></p>
        </div>
      `,
    });
    sent++;
  }

  return NextResponse.json({ success: true, sent });
}
