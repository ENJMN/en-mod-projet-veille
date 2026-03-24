import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createAdminClient } from "@/lib/supabase/admin";

const RESEND_KEY = process.env.RESEND_API_KEY ?? "";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@ways-ci.com";

// Rate limiting: 3 audits/heure par IP
const rl = new Map<string, { count: number; reset: number }>();
function isLimited(ip: string) {
  const now = Date.now();
  const e = rl.get(ip);
  if (!e || now > e.reset) { rl.set(ip, { count: 1, reset: now + 3_600_000 }); return false; }
  if (e.count >= 3) return true;
  e.count++;
  return false;
}

// ─── HTML parsing helpers ────────────────────────────────────────────────────
function getTag(html: string, tag: string): string {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].replace(/<[^>]*>/g, "").trim() : "";
}
function getMeta(html: string, name: string): string {
  const m = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']{1,300})["']`, "i"))
    || html.match(new RegExp(`<meta[^>]+content=["']([^"']{1,300})["'][^>]+(?:name|property)=["']${name}["']`, "i"));
  return m ? m[1].trim() : "";
}
function countTag(html: string, tag: string): number {
  return (html.match(new RegExp(`<${tag}[\\s>]`, "gi")) || []).length;
}
function hasAttr(html: string, pattern: string): boolean {
  return new RegExp(pattern, "i").test(html);
}

// ─── Automation tools detection ──────────────────────────────────────────────
const TOOLS: Record<string, string> = {
  "Google Analytics 4": "gtag\\(|googletagmanager\\.com",
  "Google Tag Manager": "googletagmanager\\.com/gtm",
  "Facebook Pixel": "fbevents\\.js|connect\\.facebook\\.net",
  "Hotjar": "hotjar\\.com",
  "Microsoft Clarity": "clarity\\.ms",
  "HubSpot CRM": "hubspot\\.com|hs-scripts",
  "Mailchimp": "mailchimp\\.com|chimpstatic\\.com",
  "Brevo / Sendinblue": "sendinblue\\.com|brevo\\.com",
  "Intercom": "intercom\\.io|widget\\.intercom",
  "Crisp Chat": "crisp\\.chat",
  "Tawk.to": "tawk\\.to",
  "Calendly": "calendly\\.com",
  "Stripe": "js\\.stripe\\.com",
  "PayPal": "paypal\\.com/sdk",
  "Shopify": "cdn\\.shopify\\.com",
  "WooCommerce": "woocommerce",
  "Zapier": "zapier\\.com",
  "Make / Integromat": "make\\.com|integromat\\.com",
  "ActiveCampaign": "activecampaign\\.com",
  "Zoho CRM": "zoho\\.com",
};

function detectTools(html: string): string[] {
  return Object.entries(TOOLS)
    .filter(([, pattern]) => new RegExp(pattern, "i").test(html))
    .map(([name]) => name);
}

// ─── Score calculators ───────────────────────────────────────────────────────
interface Item { label: string; ok: boolean; detail?: string }
interface Section { score: number; max: number; items: Item[] }

function seoScore(d: Record<string, unknown>): Section {
  const items: Item[] = [];
  let score = 0;

  const title = d.title as string;
  if (title) {
    const l = title.length;
    const pts = l >= 40 && l <= 70 ? 5 : 3;
    score += pts;
    items.push({ label: "Balise <title>", ok: true, detail: `"${title.slice(0, 60)}${title.length > 60 ? "…" : ""}" (${l} car.)` });
  } else {
    items.push({ label: "Balise <title>", ok: false, detail: "Absente — critique pour le SEO" });
  }

  const meta = d.metaDescription as string;
  if (meta) {
    const l = meta.length;
    const pts = l >= 120 && l <= 165 ? 5 : 3;
    score += pts;
    items.push({ label: "Meta description", ok: true, detail: `${l} caractères${l < 120 ? " (trop courte)" : l > 165 ? " (trop longue)" : " ✓"}` });
  } else {
    items.push({ label: "Meta description", ok: false, detail: "Absente — opportunité SEO manquée" });
  }

  const h1 = d.h1Count as number;
  if (h1 === 1) { score += 4; items.push({ label: "Balise H1 unique", ok: true }); }
  else if (h1 === 0) { items.push({ label: "Balise H1", ok: false, detail: "Aucun H1 trouvé" }); }
  else { score += 1; items.push({ label: "Balise H1", ok: false, detail: `${h1} H1 trouvés (un seul recommandé)` }); }

  const h2 = d.h2Count as number;
  if (h2 >= 2) { score += 3; items.push({ label: "Structure H2", ok: true, detail: `${h2} sous-titres H2` }); }
  else { score += h2; items.push({ label: "Structure H2", ok: false, detail: h2 === 0 ? "Aucun H2" : "1 seul H2" }); }

  if (d.hasOg) { score += 3; items.push({ label: "Balises Open Graph", ok: true }); }
  else { items.push({ label: "Balises Open Graph", ok: false, detail: "Absentes (partage réseaux sociaux dégradé)" }); }

  if (d.hasCanonical) { score += 3; items.push({ label: "Balise canonical", ok: true }); }
  else { items.push({ label: "Balise canonical", ok: false, detail: "Absente (risque de contenu dupliqué)" }); }

  if (d.hasSchema) { score += 3; items.push({ label: "Données structurées (Schema.org)", ok: true }); }
  else { items.push({ label: "Données structurées", ok: false, detail: "Absentes (rich snippets Google impossibles)" }); }

  const imgMissing = d.imgWithoutAlt as number;
  const imgTotal = d.imgCount as number;
  if (imgTotal === 0 || imgMissing === 0) { score += 4; items.push({ label: "Attributs alt des images", ok: true }); }
  else { const pts = imgMissing / imgTotal <= 0.3 ? 2 : 0; score += pts; items.push({ label: "Attributs alt des images", ok: false, detail: `${imgMissing}/${imgTotal} images sans alt` }); }

  return { score: Math.min(score, 30), max: 30, items };
}

function securityScore(d: Record<string, unknown>): Section {
  const items: Item[] = [];
  let score = 0;

  if (d.isHttps) { score += 12; items.push({ label: "Certificat SSL (HTTPS)", ok: true }); }
  else { items.push({ label: "Certificat SSL (HTTPS)", ok: false, detail: "Site non sécurisé — bloquant pour la confiance" }); }

  if (d.hasCookieNotice) { score += 4; items.push({ label: "Notice cookies / RGPD", ok: true }); }
  else { items.push({ label: "Notice cookies / RGPD", ok: false, detail: "Absente — obligation légale" }); }

  if (d.hasPrivacyPolicy) { score += 4; items.push({ label: "Politique de confidentialité", ok: true }); }
  else { items.push({ label: "Politique de confidentialité", ok: false, detail: "Lien non détecté" }); }

  return { score: Math.min(score, 20), max: 20, items };
}

function performanceScore(d: Record<string, unknown>): Section {
  const items: Item[] = [];
  let score = 0;

  if (d.hasViewport) { score += 5; items.push({ label: "Balise viewport (mobile)", ok: true }); }
  else { items.push({ label: "Balise viewport (mobile)", ok: false, detail: "Site non optimisé mobile" }); }

  const scripts = d.scriptCount as number;
  if (scripts <= 5) { score += 5; items.push({ label: "Nombre de scripts JS", ok: true, detail: `${scripts} scripts` }); }
  else if (scripts <= 15) { score += 3; items.push({ label: "Nombre de scripts JS", ok: false, detail: `${scripts} scripts (ralentissement possible)` }); }
  else { score += 0; items.push({ label: "Nombre de scripts JS", ok: false, detail: `${scripts} scripts (trop nombreux)` }); }

  if (d.hasLazyLoad) { score += 5; items.push({ label: "Chargement différé (lazy load)", ok: true }); }
  else { items.push({ label: "Chargement différé (lazy load)", ok: false, detail: "Images non optimisées" }); }

  if (d.hasPreconnect) { score += 5; items.push({ label: "Optimisations réseau (preconnect)", ok: true }); }
  else { items.push({ label: "Optimisations réseau", ok: false, detail: "Aucun preconnect/prefetch détecté" }); }

  return { score: Math.min(score, 20), max: 20, items };
}

function digitalScore(d: Record<string, unknown>): Section {
  const items: Item[] = [];
  let score = 0;

  const socialLinks = d.socialLinks as string[];
  if (socialLinks.length >= 2) { score += 5; items.push({ label: "Présence réseaux sociaux", ok: true, detail: socialLinks.join(", ") }); }
  else if (socialLinks.length === 1) { score += 2; items.push({ label: "Présence réseaux sociaux", ok: false, detail: `1 réseau détecté : ${socialLinks[0]}` }); }
  else { items.push({ label: "Présence réseaux sociaux", ok: false, detail: "Aucun lien social détecté" }); }

  if (d.hasContactInfo) { score += 4; items.push({ label: "Informations de contact", ok: true }); }
  else { items.push({ label: "Informations de contact", ok: false, detail: "Email ou téléphone non détecté" }); }

  if (d.hasAnalytics) { score += 3; items.push({ label: "Outil d'analytics", ok: true }); }
  else { items.push({ label: "Outil d'analytics", ok: false, detail: "Aucun outil de mesure détecté" }); }

  if (d.hasSitemap) { score += 3; items.push({ label: "Sitemap XML", ok: true }); }
  else { items.push({ label: "Sitemap XML", ok: false, detail: "Non détecté (/sitemap.xml)" }); }

  return { score: Math.min(score, 15), max: 15, items };
}

// ─── Main handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (isLimited(ip)) {
    return NextResponse.json({ error: "Limite atteinte. Réessayez dans une heure." }, { status: 429 });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) return NextResponse.json({ error: "Service indisponible." }, { status: 503 });

  let body: { url?: string; email?: string; phone?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Format invalide." }, { status: 400 }); }

  const { url, email, phone } = body;
  if (!url || !email) return NextResponse.json({ error: "URL et email requis." }, { status: 400 });

  // Normalise URL
  const targetUrl = url.startsWith("http") ? url : `https://${url}`;
  let parsedUrl: URL;
  try { parsedUrl = new URL(targetUrl); }
  catch { return NextResponse.json({ error: "URL invalide." }, { status: 400 }); }

  // Fetch page HTML
  let html = "";
  let fetchOk = false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WAYSAuditBot/1.0; +https://ways-ci.com)" },
      redirect: "follow",
    });
    clearTimeout(timeout);
    if (res.ok) { html = await res.text(); fetchOk = true; }
  } catch { /* site unreachable */ }

  // Check sitemap + robots
  let hasSitemap = false;
  try {
    const r = await fetch(`${parsedUrl.origin}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
    hasSitemap = r.ok;
  } catch { /* ignore */ }

  // Extract data
  const isHttps = targetUrl.startsWith("https://");
  const title = getTag(html, "title");
  const metaDescription = getMeta(html, "description");
  const h1Count = countTag(html, "h1");
  const h2Count = countTag(html, "h2");
  const imgCount = countTag(html, "img");
  const imgWithoutAlt = (html.match(/<img(?![^>]*\salt=)[^>]*>/gi) || []).length;
  const scriptCount = countTag(html, "script");
  const hasViewport = hasAttr(html, 'name=["\']viewport["\']');
  const hasCanonical = hasAttr(html, 'rel=["\']canonical["\']');
  const hasOg = hasAttr(html, 'property=["\']og:title["\']');
  const hasSchema = hasAttr(html, 'application/ld\\+json');
  const hasLazyLoad = hasAttr(html, 'loading=["\']lazy["\']');
  const hasPreconnect = hasAttr(html, 'rel=["\']preconnect["\']');
  const hasCookieNotice = hasAttr(html, 'cookie|rgpd|gdpr|consentement');
  const hasPrivacyPolicy = hasAttr(html, 'confidentialit|privacy.policy|mentions.l');
  const hasContactInfo = hasAttr(html, '\\+[\\d\\s]{7,}|\\b[\\w.+-]+@[\\w-]+\\.[a-z]{2,}\\b');
  const hasAnalytics = hasAttr(html, 'gtag|google-analytics|googletagmanager');

  const socialPatterns: Record<string, string> = {
    Facebook: "facebook\\.com",
    LinkedIn: "linkedin\\.com",
    Instagram: "instagram\\.com",
    Twitter: "twitter\\.com|x\\.com",
    YouTube: "youtube\\.com",
    TikTok: "tiktok\\.com",
  };
  const socialLinks = Object.entries(socialPatterns)
    .filter(([, p]) => new RegExp(p, "i").test(html))
    .map(([name]) => name);

  const detectedTools = detectTools(html);

  const d = {
    isHttps, title, metaDescription, h1Count, h2Count, imgCount, imgWithoutAlt,
    scriptCount, hasViewport, hasCanonical, hasOg, hasSchema, hasLazyLoad,
    hasPreconnect, hasCookieNotice, hasPrivacyPolicy, hasContactInfo,
    hasAnalytics, hasSitemap, socialLinks,
  };

  const seo = seoScore(d);
  const security = securityScore(d);
  const performance = performanceScore(d);
  const digital = digitalScore(d);

  // AI analysis (content + recommendations)
  let contentScore = 8;
  let contentFeedback = "Analyse du contenu non disponible.";
  let recommendations: { priority: string; section: string; action: string }[] = [];
  let summary = "";
  let automationOpportunities: string[] = [];

  try {
    const openai = new OpenAI({ apiKey: openaiKey });
    const aiPrompt = `Tu es un expert en audit digital. Analyse ce site web et retourne un JSON structuré.

URL analysée : ${targetUrl}
Données techniques extraites :
- Titre : ${title || "absent"}
- Meta description : ${metaDescription || "absente"}
- H1 : ${h1Count}, H2 : ${h2Count}
- HTTPS : ${isHttps}
- Images sans alt : ${imgWithoutAlt}/${imgCount}
- Scripts JS : ${scriptCount}
- Outils détectés : ${detectedTools.length ? detectedTools.join(", ") : "aucun"}
- Réseaux sociaux : ${socialLinks.length ? socialLinks.join(", ") : "aucun"}
- Schema.org : ${hasSchema}, Sitemap : ${hasSitemap}, Canonical : ${hasCanonical}
- Cookie/RGPD : ${hasCookieNotice}, Contact détecté : ${hasContactInfo}
- Site accessible : ${fetchOk}

Retourne UNIQUEMENT ce JSON (sans markdown) :
{
  "contentScore": <entier 0-15>,
  "contentFeedback": "<1-2 phrases sur la qualité perçue du contenu>",
  "summary": "<2 phrases résumant l'état global du site>",
  "recommendations": [
    {"priority": "haute", "section": "SEO", "action": "<action concrète>"},
    {"priority": "haute", "section": "Sécurité", "action": "<action concrète>"},
    {"priority": "moyenne", "section": "Performance", "action": "<action concrète>"},
    {"priority": "moyenne", "section": "Contenu", "action": "<action concrète>"},
    {"priority": "faible", "section": "Présence digitale", "action": "<action concrète>"}
  ],
  "automationOpportunities": [
    "<opportunité d'automatisation manquante ou à améliorer>",
    "<autre opportunité>"
  ]
}`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: aiPrompt }],
      max_tokens: 800,
      temperature: 0.3,
    });

    const raw = res.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    contentScore = Math.min(15, Math.max(0, parsed.contentScore ?? 8));
    contentFeedback = parsed.contentFeedback ?? contentFeedback;
    recommendations = parsed.recommendations ?? [];
    summary = parsed.summary ?? "";
    automationOpportunities = parsed.automationOpportunities ?? [];
  } catch { /* use defaults */ }

  const totalScore = seo.score + security.score + performance.score + digital.score + contentScore;

  const report = {
    url: targetUrl,
    score: totalScore,
    fetchOk,
    summary,
    sections: {
      seo,
      security,
      performance,
      content: { score: contentScore, max: 15, feedback: contentFeedback },
      digital,
    },
    detectedTools,
    automationOpportunities,
    recommendations,
    analyzedAt: new Date().toISOString(),
  };

  // Save lead to Supabase
  let leadId = "";
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("audit_leads")
      .insert({ email, phone: phone ?? null, url: targetUrl, score: totalScore, report })
      .select("id")
      .single();
    leadId = data?.id ?? "";
  } catch { /* ignore */ }

  // Email notification to WAYS
  if (RESEND_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Axel WAYS <contact@ways-ci.com>",
          to: [CONTACT_EMAIL],
          subject: `🔍 Nouvel audit — ${targetUrl} (Score: ${totalScore}/100)`,
          html: `<h2>Nouveau lead audit</h2>
<p><strong>Email :</strong> ${email}</p>
<p><strong>Téléphone :</strong> ${phone || "non renseigné"}</p>
<p><strong>Site analysé :</strong> <a href="${targetUrl}">${targetUrl}</a></p>
<p><strong>Score :</strong> ${totalScore}/100</p>
<p><strong>Résumé IA :</strong> ${summary}</p>
<p><em>ID lead : ${leadId}</em></p>`,
        }),
      });
    } catch { /* ignore */ }
  }

  return NextResponse.json(report);
}
