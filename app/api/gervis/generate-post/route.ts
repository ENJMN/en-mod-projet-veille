import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

import { checkAdminKey } from "@/lib/admin-auth";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";

interface Topic {
  id: string;
  topic: string;
  category: string;
  keywords: string[];
  status: "pending" | "generated";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function getNextPendingTopic(): Topic | null {
  const filePath = path.join(process.cwd(), "data", "topics.json");
  if (!fs.existsSync(filePath)) return null;
  const topics: Topic[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return topics.find((t) => t.status === "pending") ?? null;
}

function markTopicGenerated(id: string): void {
  const filePath = path.join(process.cwd(), "data", "topics.json");
  const topics: Topic[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const updated = topics.map((t) => (t.id === id ? { ...t, status: "generated" } : t));
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
}

const PROMPT_FILE = path.join(process.cwd(), "data", "article-prompt.txt");

const DEFAULT_PROMPT = `Tu es un expert en rédaction SEO et consultant senior chez WAYS Digital Solutions. Rédige un article de blog complet, optimisé SEO, en français, d'un minimum de 1800 mots sur le sujet : {{TOPIC}} (catégorie : {{CATEGORY}}, mots-clés : {{KEYWORDS}}). Commence directement par le frontmatter MDX avec title, date "{{DATE}}", author "ENJ", excerpt, category "{{CATEGORY}}", draft true.`;

function buildPrompt(topic: string, category: string, keywords: string[]): string {
  const kwList = keywords.length ? keywords.join(", ") : topic;
  const template = fs.existsSync(PROMPT_FILE)
    ? fs.readFileSync(PROMPT_FILE, "utf-8")
    : DEFAULT_PROMPT;
  return template
    .replace(/\{\{TOPIC\}\}/g, topic)
    .replace(/\{\{CATEGORY\}\}/g, category)
    .replace(/\{\{KEYWORDS\}\}/g, kwList)
    .replace(/\{\{DATE\}\}/g, todayISO());
}

export async function POST(req: NextRequest) {
  // Auth
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY manquant dans les variables d'environnement." },
      { status: 500 }
    );
  }

  // Lire le body (optionnel)
  let topic: string | undefined;
  let category = "IA & Digital";
  let keywords: string[] = [];
  let topicId: string | undefined;

  try {
    const body = await req.json().catch(() => ({}));
    topic = body.topic;
    if (body.category) category = body.category;
    if (body.keywords) keywords = body.keywords;
  } catch {
    // body vide : on utilisera la queue
  }

  // Si pas de sujet fourni, prendre le prochain dans la queue
  if (!topic) {
    const next = getNextPendingTopic();
    if (!next) {
      return NextResponse.json(
        { message: "Aucun sujet en attente dans content/topics.json." },
        { status: 200 }
      );
    }
    topic = next.topic;
    category = next.category;
    keywords = next.keywords ?? [];
    topicId = next.id;
  }

  // Génération via OpenAI API
  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  const message = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 16000,
    messages: [{ role: "user", content: buildPrompt(topic, category, keywords) }],
  });

  let articleText = message.choices[0]?.message?.content?.trim();
  if (!articleText) {
    return NextResponse.json({ error: "Réponse inattendue de l'API OpenAI." }, { status: 500 });
  }
  // Supprimer les balises markdown ```md / ```mdx / ```markdown si GPT les ajoute
  articleText = articleText.replace(/^```(?:mdx?|markdown)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
  // Supprimer tout ce qui précède le premier --- (au cas où il reste un préfixe parasite)
  const frontmatterStart = articleText.indexOf("---");
  if (frontmatterStart > 0) articleText = articleText.slice(frontmatterStart);

  // Générer le slug depuis le titre dans le frontmatter
  const titleMatch = articleText.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const titleRaw = titleMatch ? titleMatch[1] : topic;
  const slug = slugify(titleRaw);

  // Sauvegarder le fichier MDX
  const blogsDir = path.join(process.cwd(), "content", "blog");
  fs.mkdirSync(blogsDir, { recursive: true });
  const filename = `${slug}.mdx`;
  let finalPath = path.join(blogsDir, filename);

  if (fs.existsSync(finalPath)) {
    finalPath = path.join(blogsDir, `${slug}-${Date.now()}.mdx`);
  }

  fs.writeFileSync(finalPath, articleText, "utf-8");

  // Marquer le sujet comme généré
  if (topicId) {
    markTopicGenerated(topicId);
  }

  const wordCount = articleText.split(/\s+/).length;

  return NextResponse.json({
    success: true,
    slug: path.basename(finalPath, ".mdx"),
    title: titleRaw,
    category,
    wordCount,
    draft: true,
    message: `Article généré avec succès (~${wordCount} mots). Relisez-le avant de publier.`,
  });
}
